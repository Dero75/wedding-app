-- RSVP -> Google Sheet backup sync (Supabase SQL)
-- Eseguire nel SQL Editor di Supabase.
-- Obiettivo: source of truth resta public.rsvps, Google Sheet riceve upsert reale.

create extension if not exists pg_net;

create schema if not exists private;

create table if not exists private.runtime_config (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create or replace function private.get_runtime_config(config_key text)
returns text
language sql
stable
as $$
  select value
  from private.runtime_config
  where key = config_key
  limit 1;
$$;

-- Impostare i 2 valori reali prima di attivare trigger:
-- 1) URL Web App Apps Script (deploy /exec)
-- 2) token condiviso (stesso valore in Script Properties -> RSVP_WEBHOOK_TOKEN)
insert into private.runtime_config (key, value)
values
  ('GOOGLE_SHEET_WEBHOOK_URL', 'https://script.google.com/macros/s/REPLACE_WITH_DEPLOYMENT_ID/exec'),
  ('GOOGLE_SHEET_WEBHOOK_TOKEN', 'REPLACE_WITH_STRONG_SHARED_TOKEN')
on conflict (key) do update
set value = excluded.value,
    updated_at = now();

create or replace function public.sync_rsvp_to_google_sheet()
returns trigger
language plpgsql
security definer
set search_path = public, private, net
as $$
declare
  webhook_url text;
  webhook_token text;
  req_body jsonb;
begin
  webhook_url := private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_URL');
  webhook_token := private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_TOKEN');

  if webhook_url is null or webhook_url = '' then
    raise warning '[sync_rsvp_to_google_sheet] webhook url mancante in private.runtime_config';
    return new;
  end if;

  if webhook_token is null or webhook_token = '' then
    raise warning '[sync_rsvp_to_google_sheet] webhook token mancante in private.runtime_config';
    return new;
  end if;

  req_body := jsonb_build_object(
    'token', webhook_token,
    'source', 'supabase:rsvps',
    'event', tg_op,
    'record', jsonb_build_object(
      'id', new.id,
      'first_name', new.first_name,
      'last_name', new.last_name,
      'attending', new.attending,
      'guest_count', new.guest_count,
      'children_count', new.children_count,
      'dietary_counts', new.dietary_counts,
      'submitted_at', new.submitted_at,
      'created_at', new.created_at,
      'updated_at', new.updated_at
    )
  );

  perform net.http_post(
    url := webhook_url,
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := req_body
  );

  return new;
exception
  when others then
    raise warning '[sync_rsvp_to_google_sheet] errore invio webhook: %', sqlerrm;
    return new;
end;
$$;

drop trigger if exists trg_rsvps_google_sheet_sync on public.rsvps;
create trigger trg_rsvps_google_sheet_sync
after insert or update on public.rsvps
for each row
execute function public.sync_rsvp_to_google_sheet();

-- Backfill iniziale dei record esistenti (una tantum)
create or replace function public.backfill_rsvps_google_sheet_sync()
returns void
language plpgsql
as $$
declare
  rec record;
begin
  for rec in
    select *
    from public.rsvps
    order by submitted_at asc
  loop
    perform net.http_post(
      url := private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_URL'),
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := jsonb_build_object(
        'token', private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_TOKEN'),
        'source', 'supabase:backfill',
        'event', 'BACKFILL',
        'record', row_to_json(rec)::jsonb
      )
    );
  end loop;
end;
$$;

-- Eseguire dopo deploy script:
-- select public.backfill_rsvps_google_sheet_sync();
