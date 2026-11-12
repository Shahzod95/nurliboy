-- Murojaatni kim ko'rib chiqqani / hal qilganini saqlash.
-- Supabase SQL Editor'da bir marta ishga tushiring (qayta ishga tushirish xavfsiz).
alter table service_issues
  add column if not exists manager_first_name text,
  add column if not exists manager_last_name text,
  add column if not exists taken_at timestamptz,    -- "Ko'rib chiqilmoqda"ga o'tkazilgan vaqt
  add column if not exists resolved_at timestamptz; -- "Hal qilindi" vaqti
