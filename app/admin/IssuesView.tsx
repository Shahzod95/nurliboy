"use client";

import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  CATEGORIES_BY_ID,
  SERVICE_CATEGORIES,
  SERVICES_BY_ID,
} from "@/lib/services";
import {
  ISSUE_STATUSES,
  ISSUE_STATUS_LABELS,
  addDays,
  todayTashkent,
  type Issue,
  type IssueStatus,
  formatPhone,
} from "@/lib/issues";
import {
  TONES,
  btnOutline,
  btnPrimary,
  card,
  eyebrow,
  field,
  pill,
  segment,
  segmented,
  statValue,
} from "./ui";

const STATUS_STYLES: Record<IssueStatus, string> = {
  yangi: TONES.rust,
  korib_chiqilmoqda: TONES.amber,
  hal_qilindi: TONES.sage,
};

const STATUS_ICONS: Record<IssueStatus, string> = {
  yangi: "●",
  korib_chiqilmoqda: "◐",
  hal_qilindi: "✓",
};

type Preset = "today" | "7" | "30" | "custom";
type StatusTab = IssueStatus | "all";

const PRESETS: { key: Preset; label: string }[] = [
  { key: "today", label: "Bugun" },
  { key: "7", label: "7 kun" },
  { key: "30", label: "30 kun" },
  { key: "custom", label: "Oraliq" },
];

function formatTime(iso: string, withYear = false) {
  return new Date(iso).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    ...(withYear ? { year: "numeric" } : {}),
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Bir xil rangli tartiblangan barlar: nom, bar va son har bir qatorda.
// Qatorni bosish — shu element bo'yicha filtr.
function RankedBars({
  rows,
  total,
  activeId,
  onSelect,
  emptyText,
}: {
  rows: { id: string; label: string; count: number }[];
  total: number;
  activeId: string;
  onSelect: (id: string) => void;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">{emptyText}</p>;
  }
  const max = Math.max(...rows.map((r) => r.count));
  return (
    <ul className="space-y-1">
      {rows.map((r) => {
        const share = total > 0 ? Math.round((r.count / total) * 100) : 0;
        const active = activeId === r.id;
        return (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => onSelect(active ? "" : r.id)}
              title={`${r.label}: ${r.count} ta murojaat (${share}%)`}
              aria-pressed={active}
              className={`w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-ivory ${
                active ? "bg-gold/[0.08] ring-1 ring-gold/50" : ""
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-sm leading-snug text-ink/85">{r.label}</span>
                <span className="shrink-0 tabular-nums">
                  <span className="font-display text-xl font-semibold text-ink lining-nums">
                    {r.count}
                  </span>
                  <span className="ml-1.5 text-xs text-stone">{share}%</span>
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded bg-line/70">
                <div
                  className={`h-1.5 rounded ${active ? "bg-gold" : "bg-ink"}`}
                  style={{ width: `${Math.max((r.count / max) * 100, 2)}%` }}
                />
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function IssuesSkeleton() {
  return (
    <div className={`mt-4 overflow-hidden ${card}`}>
      <ul className="divide-y divide-line">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="animate-pulse p-6">
            <div className="h-5 w-44 rounded bg-line" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-52 rounded-full bg-line/60" />
              <div className="h-6 w-36 rounded-full bg-line/60" />
            </div>
            <div className="mt-4 h-3 w-3/4 rounded bg-line/60" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Talabalar xizmatlarda duch kelgan muammolar: statistika + murojaatlar ro'yxati
export default function IssuesView({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const today = todayTashkent();
  // Yuklangan ma'lumot qaysi sana oralig'iga tegishli ekani bilan birga saqlanadi
  const [data, setData] = useState<{ key: string; issues: Issue[] } | null>(
    null
  );
  const [loadError, setLoadError] = useState("");
  const [preset, setPreset] = useState<Preset>("today");
  const [customFrom, setCustomFrom] = useState(addDays(today, -6));
  const [customTo, setCustomTo] = useState(today);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<StatusTab>("yangi");
  const [categoryId, setCategoryId] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [from, to] =
    preset === "today"
      ? [today, today]
      : preset === "custom"
        ? [customFrom, customTo]
        : [addDays(today, -(Number(preset) - 1)), today];
  const rangeKey = `${from}_${to}`;
  const rangeInvalid = from > to;
  const issues = useMemo(() => data?.issues ?? [], [data]);
  // Yangi oraliq hali yuklanmagan bo'lsa — skeleton
  const loading = !rangeInvalid && data?.key !== rangeKey;

  // Sana o'zgarganda yuklash, keyin har 15 soniyada fonda yangilash
  useEffect(() => {
    if (from > to) return;
    let cancelled = false;
    const key = `${from}_${to}`;
    const keepOrEmpty = (prev: typeof data) => ({
      key,
      issues: prev?.key === key ? prev.issues : [],
    });

    async function load() {
      const res = await fetch(`/api/issues?from=${from}&to=${to}`, {
        headers: { "x-admin-password": password },
      });
      if (cancelled) return;
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      const body = await res.json().catch(() => null);
      if (cancelled) return;
      if (res.ok) {
        setData({ key, issues: body as Issue[] });
        setLoadError("");
      } else {
        setData(keepOrEmpty);
        setLoadError(body?.error || "Server xatosi");
      }
    }
    const run = () =>
      load().catch(() => {
        if (cancelled) return;
        setData(keepOrEmpty);
        setLoadError("Tarmoq xatosi");
      });

    run();
    const interval = setInterval(run, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [from, to, password, onUnauthorized]);

  // Ism yoki telefon bo'yicha qidiruv (sana oralig'i ichida)
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return issues;
    const qDigits = q.replace(/\D/g, "");
    return issues.filter(
      (i) =>
        `${i.first_name} ${i.last_name}`.toLowerCase().includes(q) ||
        (qDigits.length >= 3 && !!i.phone?.includes(qDigits))
    );
  }, [issues, query]);

  // Statistika: bitta murojaat bir nechta xizmatni belgilashi mumkin —
  // har bir xizmat alohida sanaladi, yo'nalish esa murojaat boshiga bir marta.
  const stats = useMemo(() => {
    const byService: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byStatus: Record<IssueStatus, number> = {
      yangi: 0,
      korib_chiqilmoqda: 0,
      hal_qilindi: 0,
    };
    for (const issue of searched) {
      byStatus[issue.status]++;
      const cats = new Set<string>();
      for (const id of issue.service_ids) {
        byService[id] = (byService[id] ?? 0) + 1;
        const cat = SERVICES_BY_ID[id]?.categoryId;
        if (cat) cats.add(cat);
      }
      for (const c of cats) byCategory[c] = (byCategory[c] ?? 0) + 1;
    }
    return { byService, byCategory, byStatus };
  }, [searched]);

  const categoryRows = SERVICE_CATEGORIES.map((c) => ({
    id: c.id,
    label: `${c.id}. ${c.title}`,
    count: stats.byCategory[c.id] ?? 0,
  }))
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const serviceRows = Object.entries(stats.byService)
    .filter(([id]) => !categoryId || SERVICES_BY_ID[id]?.categoryId === categoryId)
    .map(([id, count]) => ({
      id,
      label: SERVICES_BY_ID[id]?.name ?? `Noma'lum xizmat (${id})`,
      count,
    }))
    .sort((a, b) => b.count - a.count);
  const topServiceRows = categoryId ? serviceRows : serviceRows.slice(0, 10);

  // Ro'yxat: status tabi + tanlangan yo'nalish/xizmat bo'yicha
  const filtered = searched.filter(
    (i) =>
      (!categoryId ||
        i.service_ids.some((id) => SERVICES_BY_ID[id]?.categoryId === categoryId)) &&
      (!serviceId || i.service_ids.includes(serviceId))
  );
  const tabCounts: Record<StatusTab, number> = {
    all: filtered.length,
    yangi: 0,
    korib_chiqilmoqda: 0,
    hal_qilindi: 0,
  };
  for (const i of filtered) tabCounts[i.status]++;
  const list = tab === "all" ? filtered : filtered.filter((i) => i.status === tab);

  function selectCategory(id: string) {
    setCategoryId(id);
    setServiceId("");
  }

  function selectService(id: string) {
    setServiceId(id);
    if (id) setCategoryId(SERVICES_BY_ID[id]?.categoryId ?? "");
  }

  async function setStatus(id: string, status: IssueStatus) {
    const previous = issues.find((i) => i.id === id)?.status;
    const apply = (s: IssueStatus) =>
      setData(
        (prev) =>
          prev && {
            ...prev,
            issues: prev.issues.map((i) => (i.id === id ? { ...i, status: s } : i)),
          }
      );

    apply(status); // optimistik yangilash
    const res = await fetch(`/api/issues/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    if (res?.status === 401) onUnauthorized();
    else if (!res?.ok && previous) {
      apply(previous); // saqlanmadi — eski holatga qaytarish
      setLoadError("Statusni saqlab bo'lmadi");
    }
  }

  function exportExcel() {
    const rows = list.map((i) => ({
      Ism: i.first_name,
      Familiya: i.last_name,
      Telefon: i.phone ? formatPhone(i.phone) : "",
      Xizmatlar: i.service_ids
        .map((id) => SERVICES_BY_ID[id]?.name ?? id)
        .join("; "),
      "Yo'nalishlar": [
        ...new Set(
          i.service_ids.map(
            (id) => CATEGORIES_BY_ID[SERVICES_BY_ID[id]?.categoryId]?.title ?? ""
          )
        ),
      ]
        .filter(Boolean)
        .join("; "),
      Muammo: i.description ?? "",
      Status: ISSUE_STATUS_LABELS[i.status],
      Vaqt: formatTime(i.created_at, true),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
      { wch: 60 },
      { wch: 40 },
      { wch: 50 },
      { wch: 18 },
      { wch: 18 },
    ];

    const statRows = serviceRows.map((r) => ({
      "Xizmat ID": r.id,
      Xizmat: r.label,
      "Yo'nalish":
        CATEGORIES_BY_ID[SERVICES_BY_ID[r.id]?.categoryId]?.title ?? "",
      "Murojaatlar soni": r.count,
    }));
    const statWs = XLSX.utils.json_to_sheet(statRows);
    statWs["!cols"] = [{ wch: 10 }, { wch: 60 }, { wch: 50 }, { wch: 16 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Murojaatlar");
    XLSX.utils.book_append_sheet(wb, statWs, "Xizmatlar statistikasi");
    XLSX.writeFile(wb, `muammolar-${from}_${to}.xlsx`);
  }

  return (
    <>
      {/* Sarlavha va filtrlar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={eyebrow}>Murojaatlar tahlili</p>
          <h2 className="mt-1 font-display text-4xl font-semibold text-ink">
            Xizmatlardagi muammolar
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className={segmented}>
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPreset(p.key)}
                className={segment(preset === p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={exportExcel}
            disabled={list.length === 0}
            className={btnOutline}
          >
            Excel ↓
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        {preset === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              max={today}
              onChange={(e) => e.target.value && setCustomFrom(e.target.value)}
              className={field}
            />
            <span className="text-gold">—</span>
            <input
              type="date"
              value={customTo}
              max={today}
              onChange={(e) => e.target.value && setCustomTo(e.target.value)}
              className={field}
            />
          </div>
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ism, familiya yoki telefon bo'yicha qidirish…"
          className={`${field} flex-1`}
        />
      </div>

      {rangeInvalid && (
        <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${TONES.rust}`}>
          Boshlanish sanasi tugash sanasidan keyin bo&apos;lmasligi kerak
        </p>
      )}
      {loadError && (
        <p className={`mt-4 rounded-xl border px-4 py-3 text-sm ${TONES.rust}`}>
          Xatolik: {loadError}. Takrorlansa, Supabase&apos;da{" "}
          <code>service_issues</code> jadvali yaratilganini tekshiring.
        </p>
      )}

      {/* Asosiy sonlar */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl bg-ink p-5 text-ivory">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">
            Jami murojaat
          </p>
          <p className="mt-3 font-display text-5xl font-semibold leading-none lining-nums tabular-nums">
            {searched.length}
          </p>
        </div>
        {ISSUE_STATUSES.map((s) => (
          <div key={s} className={`${card} p-5`}>
            <p className={eyebrow}>
              <span aria-hidden className="mr-1.5 text-gold">
                {STATUS_ICONS[s]}
              </span>
              {ISSUE_STATUS_LABELS[s]}
            </p>
            <p className={statValue}>{stats.byStatus[s]}</p>
          </div>
        ))}
      </div>

      {/* Statistika */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className={`${card} p-5 sm:p-6`}>
          <p className={eyebrow}>Bosib filtrlang</p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
            Yo&apos;nalishlar bo&apos;yicha
          </h3>
          <div className="mb-3 mt-4 h-px bg-line" />
          <RankedBars
            rows={categoryRows}
            total={searched.length}
            activeId={categoryId}
            onSelect={selectCategory}
            emptyText="Bu davrda murojaat yo'q"
          />
        </section>
        <section className={`${card} p-5 sm:p-6`}>
          <p className={eyebrow}>
            Bitta murojaatda bir nechta xizmat bo&apos;lishi mumkin
          </p>
          <h3 className="mt-1 font-display text-2xl font-semibold text-ink">
            {categoryId
              ? CATEGORIES_BY_ID[categoryId]?.title
              : "Eng ko'p muammo bo'lgan xizmatlar"}
          </h3>
          <div className="mb-3 mt-4 h-px bg-line" />
          <RankedBars
            rows={topServiceRows}
            total={searched.length}
            activeId={serviceId}
            onSelect={selectService}
            emptyText="Bu davrda murojaat yo'q"
          />
        </section>
      </div>

      {(categoryId || serviceId) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          <span className={eyebrow}>Filtr</span>
          {categoryId && (
            <span className="rounded-full border border-gold/40 bg-gold/[0.06] px-3 py-1 text-ink">
              {CATEGORIES_BY_ID[categoryId]?.title}
            </span>
          )}
          {serviceId && (
            <span className="rounded-full border border-gold/40 bg-gold/[0.06] px-3 py-1 text-ink">
              {SERVICES_BY_ID[serviceId]?.name}
            </span>
          )}
          <button
            onClick={() => selectCategory("")}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-muted underline-offset-4 hover:text-ink hover:underline"
          >
            Tozalash
          </button>
        </div>
      )}

      {/* Status tablari */}
      <div className="mt-8 overflow-x-auto">
        <div className={`${segmented} w-max`}>
          {([...ISSUE_STATUSES, "all"] as const).map((s) => (
            <button key={s} onClick={() => setTab(s)} className={segment(tab === s)}>
              {s === "all" ? "Hammasi" : ISSUE_STATUS_LABELS[s]}
              <span className="ml-1.5 opacity-60 tabular-nums">{tabCounts[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Murojaatlar ro'yxati */}
      {loading ? (
        <IssuesSkeleton />
      ) : list.length === 0 ? (
        <div className={`mt-4 ${card} px-6 py-14 text-center`}>
          <p className="font-display text-2xl text-ink">Murojaat yo&apos;q</p>
          <p className="mt-1 text-sm text-muted">
            Tanlangan davr va bo&apos;limda hech narsa topilmadi
          </p>
        </div>
      ) : (
        <div className={`mt-4 overflow-hidden ${card}`}>
          <ul className="divide-y divide-line">
            {list.map((i) => (
              <li key={i.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-display text-2xl font-semibold leading-tight text-ink">
                      {i.first_name} {i.last_name}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                      {i.phone && (
                        <a
                          href={`tel:${i.phone}`}
                          className="font-medium text-ink/80 tabular-nums underline-offset-4 hover:text-gold-dark hover:underline"
                        >
                          {formatPhone(i.phone)}
                        </a>
                      )}
                      {i.phone && <span className="text-line">|</span>}
                      <span className="tabular-nums">
                        {formatTime(i.created_at, preset !== "today")}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`${pill} ${STATUS_STYLES[i.status]}`}>
                      <span aria-hidden>{STATUS_ICONS[i.status]}</span>
                      {ISSUE_STATUS_LABELS[i.status]}
                    </span>
                    {i.status === "yangi" && (
                      <button
                        onClick={() => setStatus(i.id, "korib_chiqilmoqda")}
                        className={btnOutline}
                      >
                        Ko&apos;rib chiqish
                      </button>
                    )}
                    {i.status !== "hal_qilindi" ? (
                      <button
                        onClick={() => setStatus(i.id, "hal_qilindi")}
                        className={btnPrimary}
                      >
                        Hal qilindi
                      </button>
                    ) : (
                      <button
                        onClick={() => setStatus(i.id, "yangi")}
                        className={btnOutline}
                      >
                        Qayta ochish
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {i.service_ids.map((id) => (
                    <button
                      key={id}
                      onClick={() => selectService(id)}
                      title={CATEGORIES_BY_ID[SERVICES_BY_ID[id]?.categoryId]?.title}
                      className={`rounded-full border px-3 py-1 text-left text-xs font-medium transition ${
                        serviceId === id
                          ? "border-ink bg-ink text-gold-light"
                          : "border-line bg-white text-ink/80 hover:border-gold"
                      }`}
                    >
                      {SERVICES_BY_ID[id]?.name ?? id}
                    </button>
                  ))}
                </div>
                {i.description && (
                  <p className="mt-4 whitespace-pre-wrap border-l-2 border-gold/60 pl-4 text-sm italic leading-relaxed text-ink/75">
                    {i.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
