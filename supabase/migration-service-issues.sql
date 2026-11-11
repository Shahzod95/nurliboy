-- Xizmatlardagi muammolar bo'yicha murojaatlar jadvali.
-- Supabase SQL Editor'da bir marta ishga tushiring.

create table if not exists service_issues (
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

create index if not exists service_issues_created_at_idx on service_issues (created_at desc);

-- Barcha so'rovlar backend (service role) orqali o'tadi
alter table service_issues enable row level security;
