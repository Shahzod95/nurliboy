// "Elektron navbat uchun 12.11.26.docx" faylidagi xizmatlar ro'yxati.
// ID'lar bazada saqlanadi — mavjud xizmat ID'sini o'zgartirmang,
// yangi xizmatni yo'nalish oxiriga keyingi raqam bilan qo'shing.
// ID formati "<yo'nalish>-<raqam>" (masalan "2-3"). Nuqtali ID'lar ("2.3") —
// birinchi ro'yxatdan qolgan, ular LEGACY_SERVICE_IDS orqali yangilariga o'tkaziladi.

export type Service = { id: string; name: string };
export type ServiceCategory = { id: string; title: string; services: Service[] };

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "1",
    title: "O‘quv jarayonini boshqarish va akademik xizmatlar",
    services: [
      { id: "1-1", name: "Dars jadvallari haqida ma’lumot taqdim olish" },
      { id: "1-2", name: "Joriy, oraliq va yakuniy nazoratlar haqida ma’lumot olish" },
      { id: "1-3", name: "Imtihonlar ro‘yxati bo‘yicha ma’lumot olish" },
      { id: "1-4", name: "Akademik qarzdor fanlar haqida ma’lumot olish" },
      { id: "1-5", name: "Qayta topshirish tartiblari haqida tushuntirish berish" },
      { id: "1-6", name: "Fanlarni qayta o‘qish uchun guruhlarga ariza yuborishga yordam berish" },
      { id: "1-7", name: "O‘zlashtirish ko‘rsatkichlari haqida ma’lumot olish" },
      { id: "1-8", name: "GPA ko‘rsatkichi bo‘yicha ma’lumot taqdim etish" },
      { id: "1-9", name: "Davomat bo‘yicha uzrli sabablarni tasdiqlovchi hujjatlarni tizimga kiritish" },
      { id: "1-10", name: "Qayta o‘zlashtirishi kerak bo’lgan fanlar uchun to‘lov miqdorini aniqlash" },
      { id: "1-11", name: "Qayta o‘qish shartnomasini olish uchun ariza berishga ko‘maklashish" },
      { id: "1-12", name: "HEMIS axborot tizimidagi parolni tiklashga yordam olish" },
      { id: "1-13", name: "Talabalarni universitetning elektron axborot tizimlaridan foydalanishga ko‘maklashish" },
      { id: "1-14", name: "Universitetdagi mavjud xizmatlar va elektron resurslar haqida ma’lumot olish" },
      { id: "1-15", name: "Elektron murojaat va arizalarni yuborishga ko‘maklashish (familiya o’zgartirish, talabalar safidan chetlashtirish, akademik ta’til)" },
      { id: "1-16", name: "Talabalar uchun raqamli xizmatlardan foydalanish bo‘yicha konsultatsiya berish (my.gov.uz, transfer.edu.uz, kontrakt.edu.uz, uzbmb.uz)" },
      { id: "1-17", name: "O‘qishga qabul bo‘yicha konsultatsiya olish" },
      { id: "1-18", name: "O‘qishni ko‘chirish tartibi haqida ma’lumot olish" },
      { id: "1-19", name: "O‘qishni ko‘chirish uchun ariza yuborishga yordam olish" },
      { id: "1-20", name: "O‘qishni qayta tiklash uchun ariza yuborishga ko‘maklashish" },
      { id: "1-21", name: "Ikkinchi oliy ta’limga onlayn ariza topshirishga yordam berish" },
      { id: "1-22", name: "Magistratura va klinik ordinaturaga kirish uchun onlayn ariza topshirishga yordam berish" },
      { id: "1-23", name: "Qabul jarayonida talab etiladigan hujjatlar haqida ma’lumot berish" },
    ],
  },
  {
    id: "2",
    title: "Talabalarga hujjatlar va moliyaviy xizmatlar ko‘rsatish",
    services: [
      { id: "2-1", name: "Diplom olish" },
      { id: "2-2", name: "Akademik ma’lumotnoma yoki Transkript shakllantirish va taqdim etish" },
      { id: "2-3", name: "Talaba guvohnomasini olish" },
      { id: "2-4", name: "Talabaning turar joylari to‘g‘risida ma’lumot olish" },
      { id: "2-5", name: "O‘qish joyidan ingliz tilida ma’lumotnoma olish" },
      { id: "2-6", name: "Sirtqi va masofaviy ta’lim talabalari uchun chaqiruv qog‘ozi shakllantirish va olish" },
      { id: "2-7", name: "To‘lov-shartnoma summasini aniqlash, hisoblash va taqdim etish" },
      { id: "2-8", name: "To‘lov-shartnomasini olish uchun ariza yuborishga yordam berish" },
      { id: "2-9", name: "Stipendiya tayinlash bo‘yicha HEMIS natijalari asosida buyruqlari haqida ma’lumot olish" },
      { id: "2-10", name: "Talabalarga tibbiy sug‘urta olishda yordam berish" },
    ],
  },
  {
    id: "3",
    title: "Ilmiy faoliyat, innovatsiya va iqtidorli talabalar bilan ishlash",
    services: [
      { id: "3-1", name: "Grantlar va tanlovlar haqida ma’lumot olish" },
      { id: "3-2", name: "Ilmiy konferensiyalar haqida ma’lumot taqdim etish" },
      { id: "3-3", name: "Innovatsion g‘oya va startaplarni ro‘yxatdan o‘tkazishga yordam berish" },
      { id: "3-4", name: "Nomdor stipendiyalar haqida ma’lumot berish va ariza topshirishda ko‘maklashish" },
      { id: "3-5", name: "Ilmiy loyihalar bo‘yicha konsultatsiya olish" },
      { id: "3-6", name: "“Ustoz-shogird maktabi”ga a’zo bo‘lishga yordam berish" },
      { id: "3-7", name: "Ilmiy konferensiya, seminar va ilmiy-innovatsion tadbirlarga qatnashishga ko‘maklashish" },
      { id: "3-8", name: "Ilmiy to‘garaklar haqida ma’lumot berish va ularga a’zo bo‘lishda amaliy yordam ko‘rsatish" },
    ],
  },
  {
    id: "4",
    title: "Xalqaro hamkorlik va akademik mobillik xizmatlari",
    services: [
      { id: "4-1", name: "Xalqaro grantlar haqida ma’lumot olish" },
      { id: "4-2", name: "Mahalliy va xorijiy oliy ta’lim tashkilotlari bilan akademik mobillik dasturlari haqida ma’lumot taqdim etish" },
      { id: "4-3", name: "Xorijiy oliygohlarda tahsil olish bo‘yicha konsultatsiya olish" },
      { id: "4-4", name: "Qo‘shma ta’lim dasturlari haqida ma’lumot olish" },
      { id: "4-5", name: "“El-yurt umidi” jamg‘armasi stipendiya tanlovi haqida ma’lumot berish" },
      { id: "4-6", name: "Xorijiy ta’lim dasturlari va e’lonlari haqida ma’lumot olish" },
      { id: "4-7", name: "QS, THE va GreenMetric xalqaro reytinglarida yuqori o‘rinlarni egallagan oliy ta’lim muassasalari haqida ma’lumot berish" },
      { id: "4-8", name: "Xalqaro forumlarda imzolangan bitim va bayonlar haqida ma’lumot olish" },
      { id: "4-9", name: "Xorijiy tillarni o‘rganish kurslari haqida ma’lumot olish" },
      { id: "4-10", name: "Xorijiy talabalarni o‘qishga qabul qilish bo‘yicha konsultatsiya berish" },
      { id: "4-11", name: "Xorijiy talabalar arizalari va hujjatlarini qabul qilish hamda ko‘rib chiqishga yo‘naltirish" },
      { id: "4-12", name: "O‘qishga qabul qilingan xorijiy talabalarni elektron tizimda ro‘yxatga olish" },
      { id: "4-13", name: "Xorijiy talabalarni fanlarga biriktirish" },
      { id: "4-14", name: "Xorijiy talabalar uchun viza xizmatlarini amalga oshirishga ko‘maklashish" },
      { id: "4-15", name: "Xorijiy talabalarga to‘lov-shartnomalarini taqdim etish" },
      { id: "4-16", name: "Xorijiy talabalarni O‘zbekiston Respublikasida vaqtinchalik ro‘yxatga qo‘yish" },
      { id: "4-17", name: "Xorijiy talabalarga o‘quv jarayonlari haqida ma’lumot berish" },
    ],
  },
  {
    id: "5",
    title: "Talabalar turar joyi va ijtimoiy qo‘llab-quvvatlash xizmatlari",
    services: [
      { id: "5-1", name: "Talabalar turar joyiga joylashish haqida ma’lumot berish" },
      { id: "5-2", name: "Talabalar turar joyiga joylashish uchun ariza yuborishga yordam berish" },
      { id: "5-3", name: "Yotoqxonaga ko‘chib o‘tgan talabalarni vaqtinchalik ro‘yxatga qo‘yish uchun hujjatlarni tayyorlashga ko‘maklashish" },
      { id: "5-4", name: "Ijara subsidiyasi olish uchun ariza yozishga ko‘maklashish" },
      { id: "5-5", name: "Talabalarga ijtimoiy qo‘llab-quvvatlash imkoniyatlari haqida ma’lumot berish" },
    ],
  },
  {
    id: "6",
    title: "Karyera va bitiruvchilar bilan ishlash xizmatlari",
    services: [
      { id: "6-1", name: "Talabalarga ishga joylashish bo‘yicha tavsiyalar berish" },
      { id: "6-2", name: "Potensial ish beruvchilar ro‘yxati bo‘yicha ma’lumotga ega bo‘lish" },
      { id: "6-3", name: "Ish beruvchilar va bo‘sh ish o‘rinlari haqida ma’lumot berish" },
      { id: "6-4", name: "Ishga joylashgan bitiruvchilar haqidagi ma’lumotlarni olish va tizimga kirishga ko‘maklashish" },
      { id: "6-5", name: "Ishga yuborilganlik to‘g‘risidagi yo‘llanmalar taqdim etish" },
    ],
  },
  {
    id: "7",
    title: "Talabalarga kommunikatsiya va maslahat xizmatlari",
    services: [
      { id: "7-1", name: "Universitetdagi yangiliklar va e’lonlar bo‘yicha ma’lumotlar berish" },
      { id: "7-2", name: "O‘quv, ilmiy va ijtimoiy tadbirlar haqida ma’lumotlar berish" },
      { id: "7-3", name: "Murojaatlarni tegishli fakultet va bo‘limlarga yo‘naltirish" },
      { id: "7-4", name: "Xizmatlardan foydalanish tartibi bo‘yicha bosqichma-bosqich ma’lumotlar taqdim etish" },
    ],
  },
];

// Faqat amaldagi xizmatlar (forma va validatsiya uchun)
export const SERVICES_BY_ID: Record<string, Service & { categoryId: string }> =
  Object.fromEntries(
    SERVICE_CATEGORIES.flatMap((c) =>
      c.services.map((s) => [s.id, { ...s, categoryId: c.id }])
    )
  );

export const CATEGORIES_BY_ID: Record<string, ServiceCategory> =
  Object.fromEntries(SERVICE_CATEGORIES.map((c) => [c.id, c]));

// Birinchi ro'yxat (10 yo'nalish, 79 xizmat) ID'lari → yangi ID'lar.
// Bazadagi eski murojaatlar shu orqali yangi xizmatlar ostida ko'rinadi.
export const LEGACY_SERVICE_IDS: Record<string, string> = {
  "1.1": "1-1", "1.2": "1-2", "1.3": "1-3", "1.4": "1-4", "1.5": "1-4", "1.6": "1-5",
  "1.7": "1-6", "1.8": "1-7", "1.9": "1-8", "1.10": "1-9", "1.11": "1-10", "1.12": "1-11",
  "2.1": "2-2", "2.2": "2-2", "2.3": "2-3", "2.4": "2-4", "2.5": "2-5", "2.6": "2-6",
  "2.7": "2-7", "2.8": "2-8", "2.9": "2-9", "2.10": "2-10", "3.1": "1-17", "3.2": "1-18",
  "3.3": "1-19", "3.4": "1-20", "3.5": "1-21", "3.6": "1-22", "3.7": "1-23", "4.1": "3-1",
  "4.2": "3-2", "4.3": "3-3", "4.4": "3-4", "4.5": "3-5", "4.6": "3-6", "4.7": "3-7",
  "4.8": "3-8", "5.1": "4-1", "5.2": "4-2", "5.3": "4-3", "5.4": "4-4", "5.5": "4-5",
  "5.6": "4-6", "5.7": "4-7", "5.8": "4-8", "5.9": "4-9", "6.1": "4-10", "6.2": "4-11",
  "6.3": "4-12", "6.4": "4-13", "6.5": "4-14", "6.6": "4-15", "6.7": "4-16", "6.8": "4-17",
  "7.1": "5-1", "7.2": "5-2", "7.3": "5-3", "7.4": "5-4", "7.5": "5-5", "8.1": "6-1",
  "8.2": "6-2", "8.3": "6-3", "8.4": "6-4", "8.6": "6-5", "9.1": "1-12", "9.2": "1-13",
  "9.3": "1-14", "9.4": "1-15", "9.5": "1-16", "10.1": "7-1", "10.2": "7-2", "10.4": "7-3",
  "10.6": "7-4",
};

// Yangi ro'yxatda yo'q xizmatlar — eski murojaatlarda nomi ko'rinib turishi uchun
export const REMOVED_SERVICES: Record<string, string> = {
  "8.5": "Bitiruvchilarni ishga taqsimlash jarayonini tashkil etish",
  "8.7": "Taqsimot komissiyasi qarorini rasmiylashtirish",
  "8.8": "Shaxsiy taqsimot qaydnomasini tayyorlash",
  "8.9": "Bitiruvchilarga ishga taqsimlashga oid hujjatlarni yetkazish",
  "10.3": "Talabalarning savollariga sun’iy intellekt yordamida javob berish",
  "10.5": "Talabalar uchun tez-tez beriladigan savollar bazasini shakllantirish",
};

// Eski ID'larni yangilariga o'tkazish (takrorlanganlar bitta qoladi)
export function normalizeServiceIds(ids: string[]): string[] {
  return [
    ...new Set(
      ids.map((id) =>
        Object.hasOwn(LEGACY_SERVICE_IDS, id) ? LEGACY_SERVICE_IDS[id] : id
      )
    ),
  ];
}

// Xizmat nomi: amaldagi, o'chirilgan ("(eski)" belgisi bilan) yoki noma'lum
export function serviceLabel(id: string): string {
  if (Object.hasOwn(SERVICES_BY_ID, id)) return SERVICES_BY_ID[id].name;
  if (Object.hasOwn(REMOVED_SERVICES, id)) return `${REMOVED_SERVICES[id]} (eski)`;
  return `Noma'lum xizmat (${id})`;
}
