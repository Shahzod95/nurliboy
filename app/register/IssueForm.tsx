"use client";

import { useMemo, useState } from "react";
import { SERVICE_CATEGORIES, SERVICES_BY_ID } from "@/lib/services";
import {
  DESCRIPTION_MAX,
  NAME_MAX,
  formatLocalPhone,
  normalizePhone,
} from "@/lib/issues";
import Ornament from "@/app/_components/Ornament";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted";

const inputClass =
  "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-ink placeholder:text-stone transition focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15";

const ROMAN = ["I", "II", "III"];

// Apostrof turlarini bir xil qilish: o‘ / o' / oʻ — qidiruvda farq qilmasin
function normalizeText(s: string) {
  return s.toLowerCase().replace(/[‘’ʻʼ`']/g, "'");
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function StepTitle({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="w-8 shrink-0 font-display text-3xl font-semibold leading-none text-gold">
        {ROMAN[n - 1]}
      </span>
      <div className="flex-1 border-b border-line pb-3">
        <h2 className="font-display text-2xl font-semibold leading-none text-ink">
          {title}
        </h2>
        {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      </div>
    </div>
  );
}

// Bitta xizmat — belgilanadigan qator
function ServiceOption({
  name,
  checked,
  onToggle,
  caption,
}: {
  name: string;
  checked: boolean;
  onToggle: () => void;
  caption?: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3.5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold ${
        checked
          ? "border-gold/50 bg-gold/[0.07] text-ink"
          : "border-transparent text-ink/80 hover:bg-ivory"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition ${
          checked ? "border-ink bg-ink text-gold-light" : "border-stone/70 bg-white"
        }`}
        aria-hidden
      >
        {checked && <CheckIcon className="h-3.5 w-3.5" />}
      </span>
      <span>
        {name}
        {caption && (
          <span className="mt-0.5 block text-[11px] uppercase tracking-[0.12em] text-stone">
            {caption}
          </span>
        )}
      </span>
    </label>
  );
}

// Talaba qaysi xizmat(lar)da muammoga duch kelganini belgilaydigan forma
export default function IssueForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState(""); // "90 123 45 67" ko'rinishida
  const [selected, setSelected] = useState<string[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  // Qidiruv natijalari: barcha yo'nalishlar bo'yicha
  const searchResults = useMemo(() => {
    const q = normalizeText(search.trim());
    if (!q) return null;
    return SERVICE_CATEGORIES.flatMap((c) =>
      c.services
        .filter((s) => normalizeText(s.name).includes(q))
        .map((s) => ({ ...s, categoryTitle: c.title }))
    );
  }, [search]);

  function toggleService(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function reset() {
    setSelected([]);
    setOpenCategory(null);
    setSearch("");
    setDescription("");
    setDone(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!normalizePhone(phone)) {
      setError("Telefon raqamni to'liq kiriting: +998 XX XXX XX XX");
      return;
    }
    if (selected.length === 0) {
      setError("Kamida bitta xizmatni tanlang");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          serviceIds: selected,
          description,
          website,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Xatolik yuz berdi");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="luxury-backdrop flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-line bg-paper text-center shadow-[0_40px_90px_-45px_rgba(14,23,38,0.45)]">
          <div className="bg-ink px-8 pb-10 pt-12 text-ivory">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 text-gold-light">
              <CheckIcon className="h-9 w-9" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight">
              Murojaatingiz qabul qilindi
            </h1>
            <Ornament className="mt-5" />
          </div>
          <div className="gold-rule" />
          <div className="px-8 py-8">
            <p className="leading-relaxed text-ink/75">
              Hurmatli <span className="font-semibold text-ink">{firstName}</span>,
              belgilagan{" "}
              <span className="font-semibold text-ink">{selected.length} ta xizmat</span>{" "}
              bo&apos;yicha murojaatingiz Registrator ofisiga yetkazildi. Zarur
              bo&apos;lsa, siz bilan{" "}
              <span className="whitespace-nowrap font-semibold text-ink">
                +998 {phone}
              </span>{" "}
              raqami orqali bog&apos;lanamiz.
            </p>
            <button
              onClick={reset}
              className={`mt-8 w-full rounded-full border border-ink/80 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink transition hover:bg-ink hover:text-ivory ${focusRing}`}
            >
              Yana murojaat yuborish
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="luxury-backdrop flex min-h-screen justify-center sm:px-6 sm:py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl overflow-hidden border-line bg-paper shadow-[0_40px_90px_-45px_rgba(14,23,38,0.45)] sm:rounded-[28px] sm:border"
      >
        {/* Sarlavha */}
        <header className="relative overflow-hidden bg-ink px-6 pb-10 pt-10 text-center text-ivory sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_220px_at_50%_0%,rgba(176,141,87,0.28),transparent_70%)]"
            aria-hidden
          />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light">
              Navoiy davlat universiteti
            </p>
            <Ornament className="mt-4" />
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl">
              Qaysi xizmatda muammoga duch keldingiz?
            </h1>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ivory/65">
              Registrator ofisi har bir murojaatni e&apos;tibor bilan ko&apos;rib
              chiqadi. Bu bir necha daqiqa vaqtingizni oladi.
            </p>
          </div>
        </header>
        <div className="gold-rule" />

        <div className="space-y-12 px-6 py-10 sm:px-12">
          {/* I. Shaxsiy ma'lumotlar */}
          <section className="space-y-6">
            <StepTitle n={1} title="Ma'lumotlaringiz" />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                Ism
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  maxLength={NAME_MAX}
                  autoComplete="given-name"
                  placeholder="Alisher"
                  className={`${inputClass} text-base font-normal normal-case tracking-normal`}
                />
              </label>
              <label className={labelClass}>
                Familiya
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  maxLength={NAME_MAX}
                  autoComplete="family-name"
                  placeholder="Navoiy"
                  className={`${inputClass} text-base font-normal normal-case tracking-normal`}
                />
              </label>
            </div>
            <label className={labelClass}>
              Telefon raqam
              <div className="mt-2 flex items-center rounded-xl border border-line bg-white transition focus-within:border-gold focus-within:ring-4 focus-within:ring-gold/15">
                <span className="select-none border-r border-line py-3.5 pl-4 pr-3.5 text-base font-medium normal-case tracking-normal text-muted">
                  +998
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    // "+998" bilan joylashtirilsa, uni olib tashlaymiz
                    let digits = e.target.value.replace(/\D/g, "");
                    if (digits.length > 9 && digits.startsWith("998")) {
                      digits = digits.slice(3);
                    }
                    setPhone(formatLocalPhone(digits));
                  }}
                  required
                  autoComplete="tel-national"
                  placeholder="90 123 45 67"
                  className="w-full rounded-r-xl bg-transparent px-3.5 py-3.5 text-base font-normal normal-case tracking-wide text-ink placeholder:text-stone focus:outline-none"
                />
              </div>
            </label>
          </section>

          {/* II. Xizmatlar */}
          <section className="space-y-6">
            <StepTitle
              n={2}
              title="Muammo bo'lgan xizmatlar"
              hint="Bir nechta xizmatni belgilashingiz mumkin"
            />

            <div className="relative">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gold"
                aria-hidden
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Xizmatni qidirish"
                placeholder="Xizmatni qidiring…"
                className="w-full rounded-full border border-line bg-white py-3.5 pl-12 pr-5 text-ink placeholder:text-stone transition focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
              />
            </div>

            {searchResults ? (
              <div className="rounded-2xl border border-line bg-white p-2">
                {searchResults.length === 0 ? (
                  <p className="px-3 py-8 text-center text-sm text-muted">
                    Hech narsa topilmadi. Boshqa so&apos;z bilan qidirib ko&apos;ring.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((s) => (
                      <ServiceOption
                        key={s.id}
                        name={s.name}
                        caption={s.categoryTitle}
                        checked={selectedSet.has(s.id)}
                        onToggle={() => toggleService(s.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <ul className="space-y-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isOpen = openCategory === cat.id;
                  const count = cat.services.filter((s) =>
                    selectedSet.has(s.id)
                  ).length;
                  return (
                    <li
                      key={cat.id}
                      className={`overflow-hidden rounded-2xl border bg-white transition duration-300 ${
                        isOpen
                          ? "border-gold/60 shadow-[0_18px_40px_-28px_rgba(14,23,38,0.5)]"
                          : count > 0
                            ? "border-gold/40"
                            : "border-line hover:border-gold/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center gap-4 px-4 py-4 text-left focus-visible:bg-ivory focus-visible:outline-none sm:px-5"
                      >
                        <span className="w-9 shrink-0 font-display text-[28px] font-semibold leading-none text-gold lining-nums">
                          {cat.id.padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span className="block text-[15px] font-semibold leading-snug text-ink">
                            {cat.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-stone">
                            {cat.services.length} ta xizmat
                          </span>
                        </span>
                        {count > 0 && (
                          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-ink px-2 text-xs font-bold text-gold-light">
                            {count}
                          </span>
                        )}
                        <Chevron open={isOpen} />
                      </button>
                      {isOpen && (
                        <div className="space-y-1 border-t border-line bg-paper p-2 sm:p-3">
                          {cat.services.map((s) => (
                            <ServiceOption
                              key={s.id}
                              name={s.name}
                              checked={selectedSet.has(s.id)}
                              onToggle={() => toggleService(s.id)}
                            />
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {selected.length > 0 && (
              <div className="rounded-2xl border border-dashed border-gold/50 bg-gold/[0.04] p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-dark">
                  Tanlanganlar · {selected.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleService(id)}
                      aria-label={`Olib tashlash: ${SERVICES_BY_ID[id]?.name}`}
                      className={`group flex max-w-full items-center gap-2 rounded-full border border-line bg-white py-1.5 pl-3.5 pr-2.5 text-left text-xs font-medium text-ink transition hover:border-ink ${focusRing}`}
                    >
                      <span className="truncate">{SERVICES_BY_ID[id]?.name}</span>
                      <span className="text-stone group-hover:text-ink" aria-hidden>
                        ✕
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* III. Izoh */}
          <section className="space-y-6">
            <StepTitle
              n={3}
              title="Muammoni qisqacha yozing"
              hint="Ixtiyoriy — vaziyatni tushunishimizga yordam beradi"
            />
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={DESCRIPTION_MAX}
                rows={4}
                aria-label="Muammo tavsifi"
                placeholder="Masalan: transkript 2 haftadan beri tayyor emas"
                className={`${inputClass} mt-0 resize-none leading-relaxed`}
              />
              <p className="mt-1.5 text-right text-xs tabular-nums text-stone">
                {description.length} / {DESCRIPTION_MAX}
              </p>
            </div>
          </section>

          {/* Honeypot — odamlarga ko'rinmaydi, botlar to'ldiradi */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />
        </div>

        {/* Yuborish paneli — pastda doim ko'rinib turadi */}
        <div className="sticky bottom-0 border-t border-line bg-paper/95 px-6 py-5 backdrop-blur sm:px-12">
          {error && (
            <p className="mb-4 rounded-xl border border-[#e7c9c1] bg-[#fbf1ee] px-4 py-3 text-sm text-[#8a2f22]">
              {error}
            </p>
          )}
          <div className="flex items-center gap-4">
            <p className="flex-1 text-sm text-muted">
              {selected.length > 0 ? (
                <>
                  <span className="font-display text-2xl font-semibold text-ink lining-nums">
                    {selected.length}
                  </span>{" "}
                  ta xizmat tanlandi
                </>
              ) : (
                "Hali xizmat tanlanmadi"
              )}
            </p>
            <button
              type="submit"
              disabled={loading}
              className={`group flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-ivory shadow-[0_14px_30px_-14px_rgba(14,23,38,0.8)] transition hover:bg-ink-soft disabled:opacity-50 ${focusRing}`}
            >
              {loading ? "Yuborilmoqda" : "Yuborish"}
              <span
                className="text-gold-light transition-transform group-hover:translate-x-1"
                aria-hidden
              >
                →
              </span>
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
