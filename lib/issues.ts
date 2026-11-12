// Xizmatlardagi muammolar bo'yicha murojaatlar — umumiy turlar va yordamchilar
// (API va sahifalarda birga ishlatiladi)

export const ISSUE_STATUSES = [
  "yangi",
  "korib_chiqilmoqda",
  "hal_qilindi",
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];

export const ISSUE_STATUS_LABELS: Record<IssueStatus, string> = {
  yangi: "Yangi",
  korib_chiqilmoqda: "Ko'rib chiqilmoqda",
  hal_qilindi: "Hal qilindi",
};

export type Issue = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  service_ids: string[];
  description: string | null;
  status: IssueStatus;
  manager_first_name: string | null;
  manager_last_name: string | null;
  taken_at: string | null;
  resolved_at: string | null;
  created_at: string;
};

// Mas'ul menejerning to'liq ismi (bo'lmasa null)
export function managerName(issue: Issue): string | null {
  const name = [issue.manager_first_name, issue.manager_last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return name || null;
}

export const DESCRIPTION_MAX = 1000;
export const NAME_MAX = 100;

// O'zbekiston raqami: "90 123 45 67", "+998901234567" va h.k. → "+998901234567".
// Noto'g'ri bo'lsa null.
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local =
    digits.length === 12 && digits.startsWith("998") ? digits.slice(3) : digits;
  return /^\d{9}$/.test(local) ? `+998${local}` : null;
}

// 9 ta mahalliy raqamni "90 123 45 67" ko'rinishiga keltirish (yozish paytida)
export function formatLocalPhone(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 9);
  return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)]
    .filter(Boolean)
    .join(" ");
}

// "+998901234567" → "+998 90 123 45 67"
export function formatPhone(phone: string): string {
  const m = phone.match(/^\+998(\d{9})$/);
  return m ? `+998 ${formatLocalPhone(m[1])}` : phone;
}

// Bugungi sana Toshkent vaqti bilan, YYYY-MM-DD ko'rinishida
export function todayTashkent(): string {
  return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// YYYY-MM-DD sanaga n kun qo'shish (manfiy bo'lishi mumkin)
export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function isDateString(value: string | null | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
