-- Restore RSVP from Google Sheet RSVP_BACKUP CSV (Supabase SQL)
--
-- Source backup columns expected:
-- id,nome,cognome,stato,adulti,under,vegetariani,celiaci,totale_persone,updated_at
--
-- How to use:
-- 1. Run PHASE 1 to create/clear the staging table.
-- 2. Import the Google Sheet CSV into private.rsvp_google_sheet_restore_staging.
-- 3. Run PHASE 2 and verify invalid_rows = 0 and totals match the sheet.
-- 4. Run PHASE 3 only when the preview is correct.
--
-- IMPORTANT:
-- - This script uses UPSERT and does not delete existing public.rsvps rows.
-- - For a destructive full replacement, review manually first and use DELETE, not TRUNCATE,
--   if Google Sheet sync must receive row-level delete events.

create schema if not exists private;

-- PHASE 1 - Create/clear staging before CSV import.
create table if not exists private.rsvp_google_sheet_restore_staging (
  id text,
  nome text,
  cognome text,
  stato text,
  adulti text,
  under text,
  vegetariani text,
  celiaci text,
  totale_persone text,
  updated_at text
);

truncate table private.rsvp_google_sheet_restore_staging;

-- PHASE 2 - Validation preview after CSV import.
with normalized as (
  select
    trim(coalesce(id, '')) as id,
    trim(coalesce(nome, '')) as first_name,
    trim(coalesce(cognome, '')) as last_name,
    lower(trim(coalesce(stato, ''))) as status_norm,
    trim(coalesce(adulti, '')) as adults_raw,
    trim(coalesce(under, '')) as under_raw,
    trim(coalesce(vegetariani, '')) as vegetarian_raw,
    trim(coalesce(celiaci, '')) as celiac_raw,
    trim(coalesce(updated_at, '')) as updated_at_raw
  from private.rsvp_google_sheet_restore_staging
),
typed as (
  select
    *,
    case
      when status_norm in ('confermato', 'confirmed', 'true', 'si', 's') then true
      when status_norm in ('non partecipa', 'assente', 'declined', 'false', 'no', 'n') then false
      else null
    end as attending,
    case when adults_raw ~ '^[0-9]+$' then adults_raw::int end as adults,
    case when under_raw ~ '^[0-9]+$' then under_raw::int end as under_count,
    case when vegetarian_raw ~ '^[0-9]+$' then vegetarian_raw::int end as vegetarian_count,
    case when celiac_raw ~ '^[0-9]+$' then celiac_raw::int end as celiac_count,
    case
      when updated_at_raw ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}$'
        then to_timestamp(updated_at_raw, 'DD/MM/YYYY HH24:MI')::timestamptz
      when updated_at_raw ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        then updated_at_raw::timestamptz
      else null
    end as restored_at
  from normalized
),
validation as (
  select
    *,
    array_remove(array[
      case when id = '' then 'missing_id' end,
      case when char_length(first_name) < 2 then 'invalid_nome' end,
      case when char_length(last_name) < 2 then 'invalid_cognome' end,
      case when attending is null then 'invalid_stato' end,
      case when adults is null or adults not between 0 and 10 then 'invalid_adulti' end,
      case when under_count is null or under_count not between 0 and 10 then 'invalid_under' end,
      case when vegetarian_count is null or vegetarian_count not between 0 and 10 then 'invalid_vegetariani' end,
      case when celiac_count is null or celiac_count not between 0 and 10 then 'invalid_celiaci' end,
      case
        when attending = true and adults < 1 then 'confirmed_requires_adult'
      end,
      case
        when attending = true and vegetarian_count > adults + under_count then 'vegetariani_exceed_total'
      end,
      case
        when attending = true and celiac_count > adults + under_count then 'celiaci_exceed_total'
      end,
      case when restored_at is null then 'invalid_updated_at' end
    ], null) as errors
  from typed
)
select
  count(*) as total_rows,
  count(*) filter (where cardinality(errors) = 0) as valid_rows,
  count(*) filter (where cardinality(errors) > 0) as invalid_rows,
  sum(case when attending then 1 else 0 end) as confirmed_rows,
  sum(case when attending = false then 1 else 0 end) as absent_rows,
  sum(case when attending then adults else 0 end) as confirmed_adults,
  sum(case when attending then under_count else 0 end) as confirmed_under,
  sum(case when attending then vegetarian_count else 0 end) as confirmed_vegetariani,
  sum(case when attending then celiac_count else 0 end) as confirmed_celiaci
from validation;

-- Detail invalid rows. This must return zero rows before PHASE 3.
with normalized as (
  select
    trim(coalesce(id, '')) as id,
    trim(coalesce(nome, '')) as first_name,
    trim(coalesce(cognome, '')) as last_name,
    lower(trim(coalesce(stato, ''))) as status_norm,
    trim(coalesce(adulti, '')) as adults_raw,
    trim(coalesce(under, '')) as under_raw,
    trim(coalesce(vegetariani, '')) as vegetarian_raw,
    trim(coalesce(celiaci, '')) as celiac_raw,
    trim(coalesce(updated_at, '')) as updated_at_raw
  from private.rsvp_google_sheet_restore_staging
),
typed as (
  select
    *,
    case
      when status_norm in ('confermato', 'confirmed', 'true', 'si', 's') then true
      when status_norm in ('non partecipa', 'assente', 'declined', 'false', 'no', 'n') then false
      else null
    end as attending,
    case when adults_raw ~ '^[0-9]+$' then adults_raw::int end as adults,
    case when under_raw ~ '^[0-9]+$' then under_raw::int end as under_count,
    case when vegetarian_raw ~ '^[0-9]+$' then vegetarian_raw::int end as vegetarian_count,
    case when celiac_raw ~ '^[0-9]+$' then celiac_raw::int end as celiac_count,
    case
      when updated_at_raw ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}$'
        then to_timestamp(updated_at_raw, 'DD/MM/YYYY HH24:MI')::timestamptz
      when updated_at_raw ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        then updated_at_raw::timestamptz
      else null
    end as restored_at
  from normalized
),
validation as (
  select
    *,
    array_remove(array[
      case when id = '' then 'missing_id' end,
      case when char_length(first_name) < 2 then 'invalid_nome' end,
      case when char_length(last_name) < 2 then 'invalid_cognome' end,
      case when attending is null then 'invalid_stato' end,
      case when adults is null or adults not between 0 and 10 then 'invalid_adulti' end,
      case when under_count is null or under_count not between 0 and 10 then 'invalid_under' end,
      case when vegetarian_count is null or vegetarian_count not between 0 and 10 then 'invalid_vegetariani' end,
      case when celiac_count is null or celiac_count not between 0 and 10 then 'invalid_celiaci' end,
      case when attending = true and adults < 1 then 'confirmed_requires_adult' end,
      case when attending = true and vegetarian_count > adults + under_count then 'vegetariani_exceed_total' end,
      case when attending = true and celiac_count > adults + under_count then 'celiaci_exceed_total' end,
      case when restored_at is null then 'invalid_updated_at' end
    ], null) as errors
  from typed
)
select
  id,
  first_name,
  last_name,
  status_norm,
  adults_raw,
  under_raw,
  vegetarian_raw,
  celiac_raw,
  updated_at_raw,
  errors
from validation
where cardinality(errors) > 0
order by id;

-- PHASE 3 - Restore UPSERT.
-- Run only after PHASE 2 returns invalid_rows = 0.
/*
begin;

with normalized as (
  select
    trim(coalesce(id, '')) as id,
    trim(coalesce(nome, '')) as first_name,
    trim(coalesce(cognome, '')) as last_name,
    lower(trim(coalesce(stato, ''))) as status_norm,
    trim(coalesce(adulti, '')) as adults_raw,
    trim(coalesce(under, '')) as under_raw,
    trim(coalesce(vegetariani, '')) as vegetarian_raw,
    trim(coalesce(celiaci, '')) as celiac_raw,
    trim(coalesce(updated_at, '')) as updated_at_raw
  from private.rsvp_google_sheet_restore_staging
),
typed as (
  select
    id,
    first_name,
    last_name,
    case
      when status_norm in ('confermato', 'confirmed', 'true', 'si', 's') then true
      else false
    end as attending,
    adults_raw::int as adults,
    under_raw::int as under_count,
    vegetarian_raw::int as vegetarian_count,
    celiac_raw::int as celiac_count,
    case
      when updated_at_raw ~ '^[0-9]{2}/[0-9]{2}/[0-9]{4} [0-9]{2}:[0-9]{2}$'
        then to_timestamp(updated_at_raw, 'DD/MM/YYYY HH24:MI')::timestamptz
      when updated_at_raw ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
        then updated_at_raw::timestamptz
      else now()
    end as restored_at
  from normalized
)
insert into public.rsvps (
  id,
  first_name,
  last_name,
  attending,
  guest_count,
  children_count,
  dietary_counts,
  submitted_at,
  created_at,
  updated_at
)
select
  id,
  first_name,
  last_name,
  attending,
  case when attending then adults else 1 end as guest_count,
  case when attending then under_count else 0 end as children_count,
  jsonb_build_object(
    'vegetarian', case when attending then vegetarian_count else 0 end,
    'celiac', case when attending then celiac_count else 0 end
  ) as dietary_counts,
  restored_at,
  now(),
  now()
from typed
on conflict (id) do update
set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  attending = excluded.attending,
  guest_count = excluded.guest_count,
  children_count = excluded.children_count,
  dietary_counts = excluded.dietary_counts,
  updated_at = now();

commit;
*/
