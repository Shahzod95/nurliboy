"use client";

import { useEffect, useState } from "react";

type QueueInfo = {
  queue_number: number | null;
  status: "kutilmoqda" | "keldi" | "kelmadi";
  ahead: number;
};

export default function RegisterPage() {
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

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ro&apos;yxatdan o&apos;tdingiz!
          </h1>
          {queueNumber !== null && (
            <div className="mt-6 rounded-xl bg-blue-50 py-6">
              <p className="text-sm font-medium text-blue-700">
                Sizning navbat raqamingiz
              </p>
              <p className="mt-1 text-6xl font-extrabold text-blue-600">
                {queueNumber}
              </p>
            </div>
          )}

          {queueInfo?.status === "kutilmoqda" && (
            <div className="mt-4 rounded-xl bg-yellow-50 px-4 py-4">
              {queueInfo.ahead === 0 ? (
                <p className="font-semibold text-yellow-800">
                  Navbat sizniki — tayyor turing!
                </p>
              ) : (
                <p className="text-yellow-800">
                  Sizdan oldin{" "}
                  <span className="text-2xl font-bold">{queueInfo.ahead}</span>{" "}
                  kishi kutmoqda
                </p>
              )}
              <p className="mt-1 text-xs text-yellow-600">
                Har 10 soniyada avtomatik yangilanadi
              </p>
            </div>
          )}

          {queueInfo?.status === "keldi" && (
            <p className="mt-4 rounded-xl bg-green-50 px-4 py-4 font-semibold text-green-800">
              Kelganingiz belgilandi. Xush kelibsiz!
            </p>
          )}

          <p className="mt-4 text-gray-600">
            {firstName} {lastName}, navbatga qo&apos;shildingiz. Chaqirilishingizni
            kuting.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Navbatga yozilish
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Ism va familiyangizni kiriting
        </p>

        <label className="mt-6 block text-sm font-medium text-gray-700">
          Ism
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            maxLength={100}
            placeholder="Alisher"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-gray-700">
          Familiya
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            maxLength={100}
            placeholder="Navoiy"
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Yuborilmoqda..." : "Yuborish"}
        </button>
      </form>
    </main>
  );
}
