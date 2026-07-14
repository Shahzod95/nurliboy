import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

// Ro'yxatdan o'tish — ochiq endpoint (QR orqali kelganlar uchun)
export async function POST(req: Request) {
  let body: { firstName?: string; lastName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const firstName = body.firstName?.trim();
  const lastName = body.lastName?.trim();

  if (!firstName || !lastName) {
    return NextResponse.json(
      { error: "Ism va familiya kiritilishi shart" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin()
    .from("visitors")
    .insert({ first_name: firstName, last_name: lastName })
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// Ro'yxatni olish — faqat admin uchun.
// ?q= ism/familiya bo'yicha, ?date=YYYY-MM-DD kun bo'yicha (Toshkent vaqti) filter
export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const params = new URL(req.url).searchParams;
  const q = params.get("q")?.trim();
  const date = params.get("date")?.trim();

  let query = supabaseAdmin()
    .from("visitors")
    .select()
    .order("created_at", { ascending: false });

  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const dayStart = new Date(`${date}T00:00:00+05:00`);
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    query = query
      .gte("created_at", dayStart.toISOString())
      .lt("created_at", dayEnd.toISOString());
  }

  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }

  return NextResponse.json(data);
}
