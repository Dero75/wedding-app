-- RSVP -> Google Sheet backup sync (Supabase SQL)
-- Execute in Supabase SQL Editor.
-- Source of truth remains public.rsvps.

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

-- Set real values before enabling trigger:
-- 1) GOOGLE_SHEET_WEBHOOK_URL: Apps Script Web App /exec URL
-- 2) GOOGLE_SHEET_WEBHOOK_TOKEN: same token used in Script Properties (RSVP_WEBHOOK_TOKEN)
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
  payload_record jsonb;
begin
  webhook_url := private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_URL');
  webhook_token := private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_TOKEN');

  if webhook_url is null or webhook_url = '' then
    raise warning '[sync_rsvp_to_google_sheet] missing webhook url in private.runtime_config';
    return coalesce(new, old);
  end if;

  if webhook_token is null or webhook_token = '' then
    raise warning '[sync_rsvp_to_google_sheet] missing webhook token in private.runtime_config';
    return coalesce(new, old);
  end if;

  payload_record := case
    when tg_op = 'DELETE' then to_jsonb(old)
    else to_jsonb(new)
  end;

  perform net.http_post(
    url := webhook_url,
    headers := '{"Content-Type":"application/json"}'::jsonb,
    body := jsonb_build_object(
      'token', webhook_token,
      'source', 'supabase:rsvps',
      'event', tg_op,
      'record', payload_record
    ),
    timeout_milliseconds := 20000
  );

  return coalesce(new, old);
exception
  when others then
    raise warning '[sync_rsvp_to_google_sheet] webhook error: %', sqlerrm;
    return coalesce(new, old);
end;
$$;

drop trigger if exists trg_rsvps_google_sheet_sync on public.rsvps;
create trigger trg_rsvps_google_sheet_sync
after insert or update or delete on public.rsvps
for each row
execute function public.sync_rsvp_to_google_sheet();

-- One-shot backfill for existing records.
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
    order by coalesce(updated_at, submitted_at, created_at) asc
  loop
    perform net.http_post(
      url := private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_URL'),
      headers := '{"Content-Type":"application/json"}'::jsonb,
      body := jsonb_build_object(
        'token', private.get_runtime_config('GOOGLE_SHEET_WEBHOOK_TOKEN'),
        'source', 'supabase:backfill',
        'event', 'BACKFILL',
        'record', row_to_json(rec)::jsonb
      ),
      timeout_milliseconds := 60000
    );

    perform pg_sleep(1.5);
  end loop;
end;
$$;

-- IMPORTANT:
-- - Use DELETE (not TRUNCATE) if you want Google Sheet rows to be removed automatically.
-- - TRUNCATE does not fire row-level DELETE trigger events.

-- Run after deployment:
-- select public.backfill_rsvps_google_sheet_sync();
