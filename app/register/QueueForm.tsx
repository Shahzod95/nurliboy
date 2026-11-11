"use client";

import { useEffect, useState } from "react";
import Ornament from "@/app/_components/Ornament";

type QueueInfo = {
  queue_number: number | null;
  status: "kutilmoqda" | "keldi" | "kelmadi";
  ahead: number;
};

export default function QueueForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [queueNumber, setQueueNumber] = useState<number | null>(null);
  const [queueInfo, setQueueInfo] = useState<QueueInfo | null>(null);
  const [error, setError] = useState("");

  // Ro'yxatdan o'tgach navbat holatini har 10 soniyada yangilab turish
  useEffect(() => {
    if (!visitorId) return;
    async function fetchQueue() {
      const res = await fetch(`/api/queue?id=${visitorId}`);
      if (res.ok) setQueueInfo(await res.json());
    }
    fetchQueue();
    const interval = setInterval(fetchQueue, 10000);
    return () => clearInterval(interval);
  }, [visitorId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Xatolik yuz berdi");
      }
      setQueueNumber(data?.queue_number ?? null);
      setVisitorId(data?.id ?? null);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  const cardClass =
    "w-full max-w-md overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_40px_90px_-45px_rgba(14,23,38,0.45)]";
  const inputClass =
    "mt-2 w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base font-normal normal-case tracking-normal text-ink placeholder:text-stone focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/15";
  const labelClass =
    "mt-5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted";

  if (done) {
    return (
      <main className="luxury-backdrop flex min-h-screen items-center justify-center p-4">
        <div className={`${cardClass} text-center`}>
          <div className="bg-ink px-8 pb-10 pt-10 text-ivory">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light">
              Sizning navbat raqamingiz
            </p>
            <Ornament className="mt-4" />
            {queueNumber !== null && (
              <p className="mt-4 font-display text-8xl font-semibold leading-none text-gold-light lining-nums">
                {queueNumber}
              </p>
            )}
          </div>
          <div className="gold-rule" />
          <div className="px-8 py-8">
            <h1 className="font-display text-3xl font-semibold text-ink">
              Ro&apos;yxatdan o&apos;tdingiz
            </h1>

            {queueInfo?.status === "kutilmoqda" && (
              <div className="mt-5 rounded-2xl border border-gold/40 bg-gold/[0.06] px-4 py-4">
                {queueInfo.ahead === 0 ? (
                  <p className="font-semibold text-ink">
                    Navbat sizniki — tayyor turing!
                  </p>
                ) : (
                  <p className="text-ink/80">
                    Sizdan oldin{" "}
                    <span className="font-display text-3xl font-semibold text-ink lining-nums">
                      {queueInfo.ahead}
                    </span>{" "}
                    kishi kutmoqda
                  </p>
                )}
                <p className="mt-1 text-xs text-muted">
                  Har 10 soniyada avtomatik yangilanadi
                </p>
              </div>
            )}

            {queueInfo?.status === "keldi" && (
              <p className="mt-5 rounded-2xl border border-[#cfdfd2] bg-[#e7efe8] px-4 py-4 font-semibold text-[#2f5d3a]">
                Kelganingiz belgilandi. Xush kelibsiz!
              </p>
            )}

            <p className="mt-5 leading-relaxed text-ink/70">
              {firstName} {lastName}, navbatga qo&apos;shildingiz. Chaqirilishingizni
              kuting.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="luxury-backdrop flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className={cardClass}>
        <header className="bg-ink px-8 pb-8 pt-9 text-center text-ivory">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gold-light">
            Navoiy davlat universiteti
          </p>
          <Ornament className="mt-4" />
          <h1 className="mt-4 font-display text-4xl font-semibold">
            Navbatga yozilish
          </h1>
          <p className="mt-2 text-sm text-ivory/65">Ism va familiyangizni kiriting</p>
        </header>
        <div className="gold-rule" />

        <div className="px-8 pb-8 pt-3">
          <label className={labelClass}>
            Ism
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              maxLength={100}
              placeholder="Alisher"
              className={inputClass}
            />
          </label>

          <label className={labelClass}>
            Familiya
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              maxLength={100}
              placeholder="Navoiy"
              className={inputClass}
            />
          </label>

          {error && (
            <p className="mt-5 rounded-xl border border-[#ecd2ca] bg-[#f8ebe7] px-4 py-3 text-sm text-[#8a2f22]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full rounded-full bg-ink px-4 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-ivory transition hover:bg-ink-soft disabled:opacity-50"
          >
            {loading ? "Yuborilmoqda" : "Yuborish"}
          </button>
        </div>
      </form>
    </main>
  );
}
