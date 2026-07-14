-- Supabase SQL Editor'da shu faylni ishga tushiring

create table visitors (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  status text not null default 'kutilmoqda'
    check (status in ('kutilmoqda', 'keldi', 'kelmadi')),
  created_at timestamptz not null default now()
);

-- Barcha so'rovlar backend (service role) orqali o'tadi,
-- shuning uchun to'g'ridan-to'g'ri kirish yopiladi.
alter table visitors enable row level security;
