# Navbat tizimi

Online navbatga yozilish tizimi: tashrif buyuruvchi QR kod orqali formani ochadi,
ism-familiyasini yuboradi, admin panelda ro'yxat real vaqtda ko'rinadi va
"keldi / kelmadi" belgilanadi.

**Stack:** Next.js (App Router) + Supabase (PostgreSQL) + Vercel

## Sahifalar

| Yo'l | Vazifasi |
|------|----------|
| `/register` | Navbatga yozilish formasi (QR kod shu manzilga olib boradi) |
| `/admin` | Admin panel — parol bilan himoyalangan, qidiruv va status belgilash |

## Ishga tushirish

### 1. Supabase sozlash

1. [supabase.com](https://supabase.com) da tekin akkaunt oching va yangi loyiha yarating.
2. **SQL Editor** bo'limiga o'ting va `supabase/schema.sql` faylidagi SQL'ni ishga tushiring.
3. **Project Settings → API** dan `URL` va `service_role` kalitni ko'chirib oling.

### 2. Muhit o'zgaruvchilari

```bash
cp .env.example .env.local
```

`.env.local` faylini to'ldiring:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=maxfiy-parol
```

### 3. Lokal ishga tushirish

```bash
npm install
npm run dev
```

http://localhost:3000/register — forma, http://localhost:3000/admin — admin panel.

### 4. Vercel'ga deploy qilish

1. Loyihani GitHub'ga push qiling.
2. [vercel.com](https://vercel.com) da GitHub repo'ni import qiling.
3. **Environment Variables** bo'limiga `.env.local` dagi 3 ta o'zgaruvchini qo'shing.
4. Deploy tugagach, `https://loyihangiz.vercel.app/register` manzili uchun QR kod
   yarating (masalan, [qr-code-generator.com](https://www.qr-code-generator.com)) va chop eting.

## Xavfsizlik haqida

- `service_role` kalit faqat serverda (API route'larda) ishlatiladi, brauzerga chiqmaydi.
- `visitors` jadvalida RLS yoqilgan — Supabase'ga to'g'ridan-to'g'ri kirish yopiq,
  barcha so'rovlar backend orqali o'tadi.
- Admin so'rovlari `x-admin-password` header orqali tekshiriladi.
