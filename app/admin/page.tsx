"use client";

import { useCallback, useEffect, useState } from "react";

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

// Yozuvning sanasi (Toshkent vaqti bilan) — kunlik guruhlash uchun
function dayKey(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    timeZone: "Asia/Tashkent",
  });
}

// Kunlar bo'yicha guruhlash (yangi kun tepada),
// har kun ichida navbat raqami bo'yicha o'sish tartibida
function groupByDay(visitors: Visitor[]): [string, Visitor[]][] {
  const groups = new Map<string, Visitor[]>();
  for (const v of visitors) {
    const key = dayKey(v.created_at);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(v);
  }
  for (const list of groups.values()) {
    list.sort((a, b) => (a.queue_number ?? 0) - (b.queue_number ?? 0));
  }
  return [...groups.entries()];
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Sahifa yangilanganda sessiondan parolni tiklash
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) setPassword(saved);
  }, []);

  const fetchVisitors = useCallback(
    async (pass: string, q: string) => {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      const res = await fetch(`/api/visitors${params}`, {
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

  // Ro'yxatni yuklash + har 5 soniyada yangilab turish
  useEffect(() => {
    if (!password) return;
    fetchVisitors(password, query);
    const interval = setInterval(() => fetchVisitors(password, query), 5000);
    return () => clearInterval(interval);
  }, [password, query, fetchVisitors]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    const res = await fetch("/api/visitors", {
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

  const days = groupByDay(visitors);
  const todayKey = dayKey(new Date().toISOString());
  const todayList = days.find(([day]) => day === todayKey)?.[1] ?? [];
  const todayStats = {
    kutilmoqda: todayList.filter((v) => v.status === "kutilmoqda").length,
    keldi: todayList.filter((v) => v.status === "keldi").length,
    kelmadi: todayList.filter((v) => v.status === "kelmadi").length,
  };

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
              <p className="text-sm text-gray-500">Bugun jami</p>
              <p className="text-3xl font-bold text-gray-900">
                {todayList.length}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-yellow-600">Kutilmoqda</p>
              <p className="text-3xl font-bold text-yellow-600">
                {todayStats.kutilmoqda}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-green-600">Keldi</p>
              <p className="text-3xl font-bold text-green-600">
                {todayStats.keldi}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow">
              <p className="text-sm text-red-600">Kelmadi</p>
              <p className="text-3xl font-bold text-red-600">
                {todayStats.kelmadi}
              </p>
            </div>
          </div>
        )}

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ism yoki familiya bo'yicha qidirish..."
          className="mt-4 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        {days.length === 0 && (
          <div className="mt-4 rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            Hozircha hech kim yo&apos;q
          </div>
        )}

        {days.map(([day, list]) => (
          <section key={day} className="mt-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
              {day === todayKey ? "Bugun" : day} — {list.length} kishi
            </h2>
            <div className="overflow-hidden rounded-xl bg-white shadow">
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
          </section>
        ))}
      </div>
    </main>
  );
}
