-- Navbat raqami: har kuni (Toshkent vaqti bilan) 1 dan qayta boshlanadi.
-- Supabase SQL Editor'da bir marta ishga tushiring.

alter table visitors add column queue_number int;

create or replace function set_queue_number()
returns trigger language plpgsql as $$
begin
  select coalesce(max(queue_number), 0) + 1 into new.queue_number
  from visitors
  where (created_at at time zone 'Asia/Tashkent')::date
      = (now() at time zone 'Asia/Tashkent')::date;
  return new;
end $$;

create trigger visitors_queue_number
before insert on visitors
for each row execute function set_queue_number();

-- Eski yozuvlarga (agar bo'lsa) raqam berish
with numbered as (
  select id, row_number() over (
    partition by (created_at at time zone 'Asia/Tashkent')::date
    order by created_at
  ) as n
  from visitors
  where queue_number is null
)
update visitors v
set queue_number = numbered.n
from numbered
where v.id = numbered.id;
