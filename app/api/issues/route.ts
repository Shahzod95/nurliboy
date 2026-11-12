import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { SERVICES_BY_ID, normalizeServiceIds } from "@/lib/services";
import {
  DESCRIPTION_MAX,
  NAME_MAX,
  addDays,
  isDateString,
  normalizePhone,
  todayTashkent,
  type Issue,
} from "@/lib/issues";

// Murojaat yuborish — ochiq endpoint (QR orqali kelgan talabalar uchun)
export async function POST(req: Request) {
  let body: {
    firstName?: unknown;
    lastName?: unknown;
    phone?: unknown;
    serviceIds?: unknown;
    description?: unknown;
    website?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  // Honeypot: odam ko'rmaydigan maydon to'ldirilgan bo'lsa — bot.
  // Xato bermaymiz, shunchaki saqlamaymiz.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName =
    typeof body.lastName === "string" ? body.lastName.trim() : "";

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Ism va familiya kiritilishi shart" },
      { status: 400 }
    );
  }
  if (firstName.length > NAME_MAX || lastName.length > NAME_MAX) {
    return NextResponse.json(
      { error: "Ism yoki familiya juda uzun" },
      { status: 400 }
    );
  }

  const phone =
    typeof body.phone === "string" ? normalizePhone(body.phone) : null;
  if (!phone) {
    return NextResponse.json(
      { error: "Telefon raqamni to'liq kiriting: +998 XX XXX XX XX" },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.serviceIds)) {
    return NextResponse.json(
      { error: "Kamida bitta xizmatni tanlang" },
      { status: 400 }
    );
  }
  const rawIds: unknown[] = body.serviceIds;
  if (!rawIds.every((id): id is string => typeof id === "string")) {
    return NextResponse.json(
      { error: "Noto'g'ri xizmat tanlangan" },
      { status: 400 }
    );
  }
  // Eski ID'lar (sahifa yangilanmagan bo'lsa) yangilariga o'tkaziladi, takrorlar olib tashlanadi
  const serviceIds = normalizeServiceIds(rawIds);
  if (serviceIds.length === 0) {
    return NextResponse.json(
      { error: "Kamida bitta xizmatni tanlang" },
      { status: 400 }
    );
  }
  if (!serviceIds.every((id) => Object.hasOwn(SERVICES_BY_ID, id))) {
    return NextResponse.json(
      { error: "Noto'g'ri xizmat tanlangan" },
      { status: 400 }
    );
  }

  let description: string | null = null;
  if (typeof body.description === "string" && body.description.trim()) {
    description = body.description.trim();
    if (description.length > DESCRIPTION_MAX) {
      return NextResponse.json(
        { error: `Muammo matni ${DESCRIPTION_MAX} belgidan oshmasin` },
        { status: 400 }
      );
    }
  }

  const { data, error } = await supabaseAdmin()
    .from("service_issues")
    .insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      service_ids: serviceIds,
      description,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }

  return NextResponse.json({ id: data.id }, { status: 201 });
}

const PAGE_SIZE = 1000;

// Murojaatlar ro'yxati — faqat admin uchun.
// ?from=YYYY-MM-DD&to=YYYY-MM-DD (ikkalasi ham kiradi, Toshkent vaqti). Default — bugun.
export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const today = todayTashkent();
  const from = isDateString(params.get("from")) ? params.get("from")! : today;
  const to = isDateString(params.get("to")) ? params.get("to")! : today;

  if (from > to) {
    return NextResponse.json(
      { error: "Boshlanish sanasi tugash sanasidan keyin" },
      { status: 400 }
    );
  }

  const start = new Date(`${from}T00:00:00+05:00`).toISOString();
  const end = new Date(`${addDays(to, 1)}T00:00:00+05:00`).toISOString();

  // Supabase bir so'rovda ko'pi bilan 1000 qator qaytaradi — sahifalab olamiz
  const issues: Issue[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabaseAdmin()
      .from("service_issues")
      .select()
      .gte("created_at", start)
      .lt("created_at", end)
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
    }
    issues.push(
      ...(data as Issue[]).map((i) => ({
        ...i,
        service_ids: normalizeServiceIds(i.service_ids),
      }))
    );
    if (data.length < PAGE_SIZE) break;
  }

  return NextResponse.json(issues);
}
