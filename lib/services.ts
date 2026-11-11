// "Elektron navbat uchun.docx" faylidagi xizmatlar ro'yxati.
// ID'lar bazada saqlanadi — mavjud xizmat ID'sini o'zgartirmang,
// yangi xizmatni ro'yxat oxiriga qo'shing.

export type Service = { id: string; name: string };
export type ServiceCategory = { id: string; title: string; services: Service[] };

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "1",
    title: "O‘quv jarayonini boshqarish va akademik xizmatlar",
    services: [
      { id: "1.1", name: "Dars jadvallari haqida ma’lumot taqdim etish" },
      { id: "1.2", name: "Joriy, oraliq va yakuniy nazoratlar haqida ma’lumot berish" },
      { id: "1.3", name: "Imtihonlar ro‘yxatini taqdim etish" },
      { id: "1.4", name: "Akademik qarzdor talabalarni aniqlash" },
      { id: "1.5", name: "Akademik qarzdor talabalar bilan ishlash" },
      { id: "1.6", name: "Qayta topshirish tartiblari haqida tushuntirish berish" },
      { id: "1.7", name: "Fanlarni qayta o‘qish uchun guruhlarga ariza yuborishga yordam berish" },
      { id: "1.8", name: "Talabalarning o‘zlashtirish ko‘rsatkichlari haqida ma’lumot berish" },
      { id: "1.9", name: "GPA ko‘rsatkichi bo‘yicha ma’lumotnoma taqdim etish" },
      { id: "1.10", name: "Davomat bo‘yicha uzrli sabablarni tasdiqlovchi hujjatlarni tizimga kiritish" },
      { id: "1.11", name: "Qayta o‘zlashtirish uchun to‘lov miqdorini aniqlash" },
      { id: "1.12", name: "Qayta o‘qish shartnomasini olish uchun ariza berishga ko‘maklashish" },
    ],
  },
  {
    id: "2",
    title: "Talabalarga hujjatlar va moliyaviy xizmatlar ko‘rsatish",
    services: [
      { id: "2.1", name: "Akademik ma’lumotnoma berish" },
      { id: "2.2", name: "Transkript shakllantirish va taqdim etish" },
      { id: "2.3", name: "Talaba guvohnomasini yaratish" },
      { id: "2.4", name: "Talabaning turar joyi to‘g‘risidagi guvohnomani shakllantirish" },
      { id: "2.5", name: "O‘qish joyidan ingliz tilida ma’lumotnoma berish" },
      { id: "2.6", name: "Sirtqi va masofaviy ta’lim talabalari uchun chaqiruv qog‘ozi shakllantirish" },
      { id: "2.7", name: "To‘lov-shartnoma summasini aniqlash, hisoblash va taqdim etish" },
      { id: "2.8", name: "To‘lov-shartnomasini olish uchun ariza yuborishga yordam berish" },
      { id: "2.9", name: "Stipendiya tayinlash bo‘yicha HEMIS natijalari asosida buyruq loyihasini tayyorlash" },
      { id: "2.10", name: "Talabalarga tibbiy sug‘urta olishda yordam berish" },
    ],
  },
  {
    id: "3",
    title: "Qabul, o‘qishni ko‘chirish va qayta tiklash xizmatlari",
    services: [
      { id: "3.1", name: "O‘qishga qabul bo‘yicha konsultatsiya berish" },
      { id: "3.2", name: "O‘qishni ko‘chirish tartibi haqida ma’lumot berish" },
      { id: "3.3", name: "O‘qishni ko‘chirish uchun ariza yuborishga yordam berish" },
      { id: "3.4", name: "O‘qishni qayta tiklash uchun ariza yuborishga ko‘maklashish" },
      { id: "3.5", name: "Ikkinchi oliy ta’limga onlayn ariza topshirishga yordam berish" },
      { id: "3.6", name: "Magistratura va klinik ordinaturaga kirish uchun onlayn ariza topshirishga yordam berish" },
      { id: "3.7", name: "Qabul jarayonida talab etiladigan hujjatlar haqida ma’lumot berish" },
    ],
  },
  {
    id: "4",
    title: "Ilmiy faoliyat, innovatsiya va iqtidorli talabalar bilan ishlash",
    services: [
      { id: "4.1", name: "Grantlar va tanlovlar haqida ma’lumot berish" },
      { id: "4.2", name: "Ilmiy konferensiyalar haqida ma’lumot taqdim etish" },
      { id: "4.3", name: "Innovatsion g‘oya va startaplarni ro‘yxatdan o‘tkazishga yordam berish" },
      { id: "4.4", name: "Nomdor stipendiyalar haqida ma’lumot berish va ariza topshirishda ko‘maklashish" },
      { id: "4.5", name: "Ilmiy loyihalar bo‘yicha konsultatsiya berish" },
      { id: "4.6", name: "“Ustoz-shogird maktabi”ga a’zo bo‘lishga yordam berish" },
      { id: "4.7", name: "Ilmiy konferensiya, seminar va ilmiy-innovatsion tadbirlarni talabalar orasida ommalashtirish" },
      { id: "4.8", name: "Ilmiy to‘garaklar haqida ma’lumot berish va ularga a’zo bo‘lishda amaliy yordam ko‘rsatish" },
    ],
  },
  {
    id: "5",
    title: "Xalqaro hamkorlik va akademik mobillik xizmatlari",
    services: [
      { id: "5.1", name: "Xalqaro grantlar haqida ma’lumot berish" },
      { id: "5.2", name: "Mahalliy va xorijiy oliy ta’lim tashkilotlari bilan akademik mobillik dasturlari haqida ma’lumot taqdim etish" },
      { id: "5.3", name: "Xorijiy oliygohlarda tahsil olish bo‘yicha konsultatsiya berish" },
      { id: "5.4", name: "Qo‘shma ta’lim dasturlari haqida ma’lumot berish va ularni targ‘ib qilish" },
      { id: "5.5", name: "“El-yurt umidi” jamg‘armasi stipendiya tanlovi haqida ma’lumot berish" },
      { id: "5.6", name: "Xorijiy ta’lim dasturlari va e’lonlari haqida ma’lumot yetkazish" },
      { id: "5.7", name: "QS, THE va GreenMetric xalqaro reytinglarida yuqori o‘rinlarni egallagan oliy ta’lim muassasalari haqida ma’lumot berish" },
      { id: "5.8", name: "Xalqaro forumlarda imzolangan bitim va bayonlar haqida talabalarni xabardor qilish" },
      { id: "5.9", name: "Xorijiy tillarni o‘rganish kurslari haqida ma’lumot berish" },
    ],
  },
  {
    id: "6",
    title: "Xorijiy talabalar bilan ishlash xizmatlari",
    services: [
      { id: "6.1", name: "Xorijiy talabalarni o‘qishga qabul qilish bo‘yicha konsultatsiya berish" },
      { id: "6.2", name: "Xorijiy talabalar arizalari va hujjatlarini qabul qilish hamda ko‘rib chiqishga yo‘naltirish" },
      { id: "6.3", name: "O‘qishga qabul qilingan xorijiy talabalarni elektron tizimda ro‘yxatga olish" },
      { id: "6.4", name: "Xorijiy talabalarni fanlarga biriktirish" },
      { id: "6.5", name: "Xorijiy talabalar uchun viza xizmatlarini amalga oshirishga ko‘maklashish" },
      { id: "6.6", name: "Xorijiy talabalarga to‘lov-shartnomalarini taqdim etish" },
      { id: "6.7", name: "Xorijiy talabalarni O‘zbekiston Respublikasida vaqtinchalik ro‘yxatga qo‘yish" },
      { id: "6.8", name: "Xorijiy talabalarga o‘quv jarayonlari haqida ma’lumot berish" },
    ],
  },
  {
    id: "7",
    title: "Talabalar turar joyi va ijtimoiy qo‘llab-quvvatlash xizmatlari",
    services: [
      { id: "7.1", name: "Talabalar turar joyiga joylashish haqida ma’lumot berish" },
      { id: "7.2", name: "Talabalar turar joyiga joylashish uchun ariza yuborishga yordam berish" },
      { id: "7.3", name: "Yotoqxonaga ko‘chib o‘tgan talabalarni vaqtinchalik ro‘yxatga qo‘yish uchun hujjatlarni tayyorlash" },
      { id: "7.4", name: "Ijara subsidiyasi olish uchun ariza yozishga ko‘maklashish" },
      { id: "7.5", name: "Talabalarga ijtimoiy qo‘llab-quvvatlash imkoniyatlari haqida ma’lumot berish" },
    ],
  },
  {
    id: "8",
    title: "Karyera va bitiruvchilar bilan ishlash xizmatlari",
    services: [
      { id: "8.1", name: "Talabalarga ishga joylashish bo‘yicha tavsiyalar berish" },
      { id: "8.2", name: "Potensial ish beruvchilar ro‘yxatini shakllantirish" },
      { id: "8.3", name: "Ish beruvchilar va bo‘sh ish o‘rinlari haqida talabalarga ma’lumot yetkazish" },
      { id: "8.4", name: "Ishga joylashgan bitiruvchilar haqidagi ma’lumotlarni olish va tizimga kiritish" },
      { id: "8.5", name: "Bitiruvchilarni ishga taqsimlash jarayonini tashkil etish" },
      { id: "8.6", name: "Ishga yuborilganlik to‘g‘risidagi yo‘llanmani tayyorlash" },
      { id: "8.7", name: "Taqsimot komissiyasi qarorini rasmiylashtirish" },
      { id: "8.8", name: "Shaxsiy taqsimot qaydnomasini tayyorlash" },
      { id: "8.9", name: "Bitiruvchilarga ishga taqsimlashga oid hujjatlarni yetkazish" },
    ],
  },
  {
    id: "9",
    title: "Raqamli texnologiyalar va axborot xizmatlari",
    services: [
      { id: "9.1", name: "HEMIS axborot tizimidagi parolni tiklashga yordam berish" },
      { id: "9.2", name: "Talabalarni universitetning elektron axborot tizimlaridan foydalanishga yo‘naltirish" },
      { id: "9.3", name: "Universitetdagi mavjud xizmatlar va elektron resurslar haqida ma’lumot berish" },
      { id: "9.4", name: "Elektron murojaat va arizalarni yuborishga ko‘maklashish" },
      { id: "9.5", name: "Talabalar uchun raqamli xizmatlardan foydalanish bo‘yicha konsultatsiya berish" },
    ],
  },
  {
    id: "10",
    title: "Talabalar bilan kommunikatsiya va maslahat xizmatlari",
    services: [
      { id: "10.1", name: "Universitetdagi yangiliklar va e’lonlarni yetkazish" },
      { id: "10.2", name: "O‘quv, ilmiy va ijtimoiy tadbirlar haqida xabardor qilish" },
      { id: "10.3", name: "Talabalarning savollariga sun’iy intellekt yordamida javob berish" },
      { id: "10.4", name: "Murojaatlarni tegishli fakultet va bo‘limlarga yo‘naltirish" },
      { id: "10.5", name: "Talabalar uchun tez-tez beriladigan savollar bazasini shakllantirish" },
      { id: "10.6", name: "Xizmatlardan foydalanish tartibi bo‘yicha bosqichma-bosqich yo‘riqnoma berish" },
    ],
  },
];

export const SERVICES_BY_ID: Record<string, Service & { categoryId: string }> =
  Object.fromEntries(
    SERVICE_CATEGORIES.flatMap((c) =>
      c.services.map((s) => [s.id, { ...s, categoryId: c.id }])
    )
  );

export const CATEGORIES_BY_ID: Record<string, ServiceCategory> =
  Object.fromEntries(SERVICE_CATEGORIES.map((c) => [c.id, c]));
