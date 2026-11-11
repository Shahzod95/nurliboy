"use client";

import { useCallback, useEffect, useState } from "react";
import { todayTashkent } from "@/lib/issues";
import IssuesView from "./IssuesView";
import QueueView from "./QueueView";
import Ornament from "@/app/_components/Ornament";
import { eyebrow } from "./ui";

type Section = "issues" | "queue";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "issues", label: "Muammolar" },
  { key: "queue", label: "Navbat arxivi" },
];

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<Section>("issues");

  // Sahifa yangilanganda sessiondan parolni tiklash
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_password");
    if (saved) setPassword(saved);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem("admin_password");
    setPassword(null);
  }, []);

  const onUnauthorized = useCallback(() => {
    logout();
    setLoginError("Parol noto'g'ri");
  }, [logout]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    // Parolni tekshirish uchun yengil so'rov (bugungi navbat ro'yxati)
    const res = await fetch(`/api/visitors?date=${todayTashkent()}`, {
      headers: { "x-admin-password": passwordInput },
    });
    setLoading(false);
    if (res.ok) {
      sessionStorage.setItem("admin_password", passwordInput);
      setPassword(passwordInput);
    } else if (res.status === 401) {
      setLoginError("Parol noto'g'ri");
    } else {
      setLoginError(
        "Server xatosi — Supabase sozlamalarini tekshiring (.env fayl)"
      );
    }
  }

  if (!password) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink p-4">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_380px_at_50%_0%,rgba(176,141,87,0.25),transparent_70%)]"
          aria-hidden
        />
        <div className="relative w-full max-w-sm">
          <div className="text-center text-ivory">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light">
              Registrator ofisi
            </p>
            <Ornament className="mt-4" />
            <h1 className="mt-4 font-display text-4xl font-semibold">
              Boshqaruv paneli
            </h1>
          </div>
          <form
            onSubmit={handleLogin}
            className="mt-8 rounded-[24px] border border-gold/25 bg-paper p-8 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]"
          >
            <label className={eyebrow}>
              Parol
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                autoFocus
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base font-normal normal-case tracking-normal text-ink placeholder:text-stone focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15"
              />
            </label>
            {loginError && (
              <p className="mt-3 text-sm text-[#8a2f22]">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-full bg-ink px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-ink-soft disabled:opacity-50"
            >
              {loading ? "Tekshirilmoqda" : "Kirish"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="luxury-backdrop min-h-screen">
      <header className="bg-ink text-ivory">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light">
              NavDU · Registrator ofisi
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold leading-none">
              Boshqaruv paneli
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex rounded-full border border-white/10 p-1">
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSection(s.key)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                    section === s.key
                      ? "bg-gold text-ink"
                      : "text-ivory/60 hover:text-ivory"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <button
              onClick={logout}
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ivory/50 transition hover:text-gold-light"
            >
              Chiqish
            </button>
          </div>
        </div>
      </header>
      <div className="gold-rule" />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        {section === "issues" ? (
          <IssuesView password={password} onUnauthorized={onUnauthorized} />
        ) : (
          <QueueView password={password} onUnauthorized={onUnauthorized} />
        )}
      </div>
    </main>
  );
}
