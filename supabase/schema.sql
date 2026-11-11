-- Supabase SQL Editor'da shu faylni ishga tushiring

create table visitors (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  status text not null default 'kutilmoqda'
    check (status in ('kutilmoqda', 'keldi', 'kelmadi')),
  queue_number int,
  created_at timestamptz not null default now()
);

-- Navbat raqami: har kuni (Toshkent vaqti bilan) 1 dan qayta boshlanadi
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

-- Barcha so'rovlar backend (service role) orqali o'tadi,
-- shuning uchun to'g'ridan-to'g'ri kirish yopiladi.
alter table visitors enable row level security;


create table service_issues (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text, -- +998XXXXXXXXX
  -- lib/services.ts dagi xizmat ID'lari, masalan {'1.4','2.3'}
  service_ids text[] not null check (cardinality(service_ids) > 0),
  description text,
  status text not null default 'yangi'
    check (status in ('yangi', 'korib_chiqilmoqda', 'hal_qilindi')),
  created_at timestamptz not null default now()
);

create index service_issues_created_at_idx on service_issues (created_at desc);

-- Barcha so'rovlar backend (service role) orqali o'tadi
alter table service_issues enable row level security;
