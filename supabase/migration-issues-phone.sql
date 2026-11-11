-- service_issues jadvaliga telefon raqam ustuni.
-- migration-service-issues.sql ni avvalroq ishga tushirgan bo'lsangiz, shuni ham ishga tushiring.
alter table service_issues add column if not exists phone text; -- +998XXXXXXXXX
