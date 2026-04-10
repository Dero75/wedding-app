-- Seed operativo RSVP (20 record misti)
-- Uso: SQL Editor Supabase (ambiente test o riallineamento controllato)

begin;

delete from public.rsvps;

with seed(id, first_name, last_name, attending, guest_count, children_count, veg, cel) as (
  values
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1001','Luca','Martelli',true, 2,1,1,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1002','Giulia','Conti',true, 1,0,0,1),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1003','Matteo','Rinaldi',true, 3,2,2,1),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1004','Elena','Ferri',true, 2,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1005','Davide','Leoni',false,1,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1006','Francesca','Biagi',true, 1,1,1,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1007','Alessandro','Guidi',true, 4,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1008','Chiara','Neri',true, 2,2,1,2),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1009','Marco','Bellucci',false,1,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1010','Sara','Marini',true, 1,0,1,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1011','Federico','Orlandi',true, 2,1,0,1),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1012','Marta','Silvestri',false,1,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1013','Riccardo','Pagani',true, 5,1,2,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1014','Valentina','Serra',true, 2,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1015','Tommaso','Greco',true, 1,2,1,1),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1016','Noemi','Caruso',false,1,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1017','Stefano','Mancini',true, 3,0,0,2),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1018','Beatrice','Longhi',true, 2,1,1,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1019','Gabriele','Fontana',false,1,0,0,0),
    ('7b9d9a5d-7d0f-4e2d-8e7a-9e7d6a3a1020','Ilaria','Pellegrini',true, 4,3,2,1)
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
  s.id,
  s.first_name,
  s.last_name,
  s.attending,
  s.guest_count,
  s.children_count,
  jsonb_build_object('celiac', s.cel, 'vegetarian', s.veg),
  now(),
  now(),
  now()
from seed s
on conflict (id) do update
set
  first_name = excluded.first_name,
  last_name = excluded.last_name,
  attending = excluded.attending,
  guest_count = excluded.guest_count,
  children_count = excluded.children_count,
  dietary_counts = excluded.dietary_counts,
  submitted_at = excluded.submitted_at,
  updated_at = excluded.updated_at;

commit;

-- Verifica rapida
select
  count(*) as total_records,
  sum((attending)::int) as confirmed_records,
  sum((not attending)::int) as absent_records,
  sum(case when attending then guest_count else 0 end) as adults_confirmed,
  sum(case when attending then children_count else 0 end) as under_confirmed,
  sum(case when attending then coalesce((dietary_counts->>'vegetarian')::int,0) else 0 end) as veg_confirmed,
  sum(case when attending then coalesce((dietary_counts->>'celiac')::int,0) else 0 end) as celiac_confirmed
from public.rsvps;
