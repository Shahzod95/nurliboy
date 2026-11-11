"use client";

import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { todayTashkent } from "@/lib/issues";
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

type Visitor = {
  id: string;
  first_name: string;
  last_name: string;
  status: "kutilmoqda" | "keldi" | "kelmadi";
  queue_number: number | null;
  created_at: string;
};

const STATUS_STYLES: Record<Visitor["status"], string> = {
  kutilmoqda: TONES.amber,
  keldi: TONES.sage,
  kelmadi: TONES.rust,
};

const STATUS_LABELS: Record<Visitor["status"], string> = {
  kutilmoqda: "Kutilmoqda",
  keldi: "Keldi",
  kelmadi: "Kelmadi",
};

// Ma'lumot yuklanayotganda ko'rsatiladigan skeleton qatorlar
function ListSkeleton() {
  return (
    <div className={`mt-4 overflow-hidden ${card}`}>
      <ul className="divide-y divide-line">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex animate-pulse items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-line" />
              <div>
                <div className="h-4 w-40 rounded bg-line" />
                <div className="mt-2 h-3 w-24 rounded bg-line/60" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-24 rounded-full bg-line/60" />
              <div className="h-8 w-20 rounded-full bg-line" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Eski navbat ro'yxati (tarix uchun saqlanadi)
export default function QueueView({
  password,
  onUnauthorized,
}: {
  password: string;
  onUnauthorized: () => void;
}) {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(todayTashkent());
  const [tab, setTab] = useState<Visitor["status"]>("kutilmoqda");
  const [listLoading, setListLoading] = useState(true);

  const fetchVisitors = useCallback(
    async (pass: string, q: string, d: string) => {
      const params = new URLSearchParams({ date: d });
      if (q) params.set("q", q);
      const res = await fetch(`/api/visitors?${params}`, {
        headers: { "x-admin-password": pass },
      });
      if (res.status === 401) {
        onUnauthorized();
        return;
      }
      if (res.ok) {
        setVisitors(await res.json());
      }
    },
    [onUnauthorized]
  );

  // Ro'yxatni yuklash + har 5 soniyada yangilab turish.
  // Filter o'zgarganda skeleton ko'rsatiladi, fondagi yangilanishlarda esa yo'q.
  useEffect(() => {
    let cancelled = false;
    setListLoading(true);
    const timeout = setTimeout(
      () =>
        fetchVisitors(password, query, date).finally(() => {
          if (!cancelled) setListLoading(false);
        }),
      query ? 300 : 0
    );
    const interval = setInterval(
      () => fetchVisitors(password, query, date),
      5000
    );
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [password, query, date, fetchVisitors]);

  async function setStatus(id: string, status: Visitor["status"]) {
    // Tugma bosilganda darhol ko'rsatish (optimistik yangilash)
    setVisitors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
    await fetch(`/api/visitors/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": password,
      },
      body: JSON.stringify({ status }),
    });
  }

  // Tanlangan kun ro'yxati: aktiv tab bo'yicha, navbat raqami tartibida
  const list = visitors
    .filter((v) => v.status === tab)
    .sort((a, b) => (a.queue_number ?? 0) - (b.queue_number ?? 0));
  const stats = {
    kutilmoqda: visitors.filter((v) => v.status === "kutilmoqda").length,
    keldi: visitors.filter((v) => v.status === "keldi").length,
    kelmadi: visitors.filter((v) => v.status === "kelmadi").length,
  };
  const isToday = date === todayTashkent();

  function exportExcel() {
    const rows = list.map((v) => ({
      "Navbat №": v.queue_number ?? "",
      Ism: v.first_name,
      Familiya: v.last_name,
      Status: STATUS_LABELS[v.status],
      Vaqt: new Date(v.created_at).toLocaleString("uz-UZ", {
        timeZone: "Asia/Tashkent",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 18 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Navbat");
    XLSX.writeFile(wb, `navbat-${date}-${tab}.xlsx`);
  }

  return (
    <>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className={eyebrow}>Eski navbat tizimi</p>
          <h2 className="mt-1 font-display text-4xl font-semibold text-ink">
            Navbat arxivi
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className={field}
          />
          <button
            onClick={exportExcel}
            disabled={list.length === 0}
            className={btnOutline}
          >
            Excel ↓
          </button>
        </div>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ism yoki familiya bo'yicha qidirish…"
        className={`${field} mt-5 w-full`}
      />

      {!query && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl bg-ink p-5 text-ivory">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-light">
              {isToday ? "Bugun jami" : "Jami"}
            </p>
            <p className="mt-3 font-display text-5xl font-semibold leading-none lining-nums tabular-nums">
              {visitors.length}
            </p>
          </div>
          {(["kutilmoqda", "keldi", "kelmadi"] as const).map((s) => (
            <div key={s} className={`${card} p-5`}>
              <p className={eyebrow}>{STATUS_LABELS[s]}</p>
              <p className={statValue}>{stats[s]}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 overflow-x-auto">
        <div className={`${segmented} w-max`}>
          {(["kutilmoqda", "keldi", "kelmadi"] as const).map((s) => (
            <button key={s} onClick={() => setTab(s)} className={segment(tab === s)}>
              {STATUS_LABELS[s]}
              <span className="ml-1.5 opacity-60 tabular-nums">{stats[s]}</span>
            </button>
          ))}
        </div>
      </div>

      {listLoading ? (
        <ListSkeleton />
      ) : list.length === 0 ? (
        <div className={`mt-4 ${card} px-6 py-14 text-center`}>
          <p className="font-display text-2xl text-ink">Hech kim yo&apos;q</p>
          <p className="mt-1 text-sm text-muted">Bu bo&apos;limda yozuv topilmadi</p>
        </div>
      ) : (
        <div className={`mt-4 overflow-hidden ${card}`}>
          <ul className="divide-y divide-line">
            {list.map((v) => (
              <li
                key={v.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-xl font-semibold text-gold-dark lining-nums">
                    {v.queue_number ?? "—"}
                  </span>
                  <div>
                    <p className="font-display text-xl font-semibold text-ink">
                      {v.first_name} {v.last_name}
                    </p>
                    <p className="text-sm tabular-nums text-muted">
                      {new Date(v.created_at).toLocaleString("uz-UZ", {
                        timeZone: "Asia/Tashkent",
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`${pill} ${STATUS_STYLES[v.status]}`}>
                    {STATUS_LABELS[v.status]}
                  </span>
                  <button
                    onClick={() => setStatus(v.id, "keldi")}
                    disabled={v.status !== "kutilmoqda"}
                    className={btnPrimary}
                  >
                    Keldi
                  </button>
                  <button
                    onClick={() => setStatus(v.id, "kelmadi")}
                    disabled={v.status !== "kutilmoqda"}
                    className={btnOutline}
                  >
                    Kelmadi
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
