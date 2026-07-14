"use client";

import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx";

type Visitor = {
  id: string;
  first_name: string;
  last_name: string;
  status: "kutilmoqda" | "keldi" | "kelmadi";
  queue_number: number | null;
  created_at: string;
};

const STATUS_STYLES: Record<Visitor["status"], string> = {
  kutilmoqda: "bg-yellow-100 text-yellow-800",
  keldi: "bg-green-100 text-green-800",
  kelmadi: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<Visitor["status"], string> = {
  kutilmoqda: "Kutilmoqda",
  keldi: "Keldi",
  kelmadi: "Kelmadi",
};

// Bugungi sana Toshkent vaqti bilan, YYYY-MM-DD ko'rinishida
function todayTashkent(): string {
  return new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

// Ma'lumot yuklanayotganda ko'rsatiladigan skeleton qatorlar
function ListSkeleton() {
  return (
    <div className="mt-4 overflow-hidden rounded-xl bg-white shadow">
      <ul className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <li
            key={i}
            className="flex animate-pulse items-center justify-between p-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div>
                <div className="h-4 w-36 rounded bg-gray-200" />
                <div className="mt-2 h-3 w-24 rounded bg-gray-100" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 rounded-full bg-gray-100" />
              <div className="h-9 w-16 rounded-lg bg-gray-200" />
              <div className="h-9 w-20 rounded-lg bg-gray-200" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(todayTashkent());
  const [tab, setTab] = useState<Visitor["status"]>("kutilmoqda");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);

  // Sahifa yangilanganda sessiondan parolni tiklash
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) setPassword(saved);
  }, []);

  const fetchVisitors = useCallback(
    async (pass: string, q: string, d: string) => {
      const params = new URLSearchParams({ date: d });
      if (q) params.set("q", q);
      const res = await fetch(`/api/visitors?${params}`, {
        headers: { "x-admin-password": pass },
      });
      if (res.status === 401) {
        sessionStorage.removeItem("admin_password");
        setPassword(null);
        setLoginError("Parol noto'g'ri");
        return;
      }
      if (res.ok) {
        setVisitors(await res.json());
      }
    },
    []
  );

  // Ro'yxatni yuklash + har 5 soniyada yangilab turish.
  // Filter o'zgarganda skeleton ko'rsatiladi, fondagi yangilanishlarda esa yo'q.
  useEffect(() => {
    if (!password) return;
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

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    const res = await fetch(`/api/visitors?date=${date}`, {
      headers: { "x-admin-password": passwordInput },
    });
    setLoading(false);
    if (res.ok) {
      sessionStorage.setItem("admin_password", passwordInput);
      setPassword(passwordInput);
      setVisitors(await res.json());
    } else if (res.status === 401) {
      setLoginError("Parol noto'g'ri");
    } else {
      setLoginError(
        "Server xatosi — Supabase sozlamalarini tekshiring (.env fayl)"
      );
    }
  }

  async function setStatus(id: string, status: Visitor["status"]) {
    if (!password) return;
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

  if (!password) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="text-2xl font-bold text-gray-900">Admin panel</h1>
          <p className="mt-1 text-sm text-gray-500">Parolni kiriting</p>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
            placeholder="Parol"
            className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          {loginError && (
            <p className="mt-3 text-sm text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Tekshirilmoqda..." : "Kirish"}
          </button>
        </form>
      </main>
    );
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
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Navbat ro&apos;yxati
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_password");
              setPassword(null);
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Chiqish
          </button>
        </div>

        {!query && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-gray-500">
                {isToday ? "Bugun jami" : "Jami"}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {visitors.length}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-yellow-600">Kutilmoqda</p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.kutilmoqda}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-green-600">Keldi</p>
              <p className="text-3xl font-bold text-green-600">{stats.keldi}</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-red-600">Kelmadi</p>
              <p className="text-3xl font-bold text-red-600">{stats.kelmadi}</p>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ism yoki familiya bo'yicha qidirish..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={exportExcel}
            disabled={list.length === 0}
            className="shrink-0 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ⬇ Excel
          </button>
        </div>

        <div className="mt-4 flex rounded-xl bg-white p-1 shadow">
          {(["kutilmoqda", "keldi", "kelmadi"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setTab(s)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                tab === s
                  ? STATUS_STYLES[s]
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {STATUS_LABELS[s]} ({stats[s]})
            </button>
          ))}
        </div>

        {listLoading ? (
          <ListSkeleton />
        ) : list.length === 0 ? (
          <div className="mt-4 rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            Bu bo&apos;limda hech kim yo&apos;q
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow">
            <ul className="divide-y divide-gray-100">
              {list.map((v) => (
                <li
                  key={v.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {v.queue_number ?? "—"}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {v.first_name} {v.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[v.status]}`}
                    >
                      {STATUS_LABELS[v.status]}
                    </span>
                    <button
                      onClick={() => setStatus(v.id, "keldi")}
                      disabled={v.status !== "kutilmoqda"}
                      className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Keldi
                    </button>
                    <button
                      onClick={() => setStatus(v.id, "kelmadi")}
                      disabled={v.status !== "kutilmoqda"}
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Kelmadi
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
