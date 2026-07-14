import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Bugungi kun boshlanishi (Toshkent vaqti, UTC+5) — UTC'da
function todayStartUtc(): string {
  const OFFSET_MS = 5 * 60 * 60 * 1000;
  const t = new Date(Date.now() + OFFSET_MS);
  return new Date(
    Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate()) - OFFSET_MS
  ).toISOString();
}

// Navbat holati — ochiq endpoint, faqat sonlarni qaytaradi (ismlar yo'q).
// ?id= bilan o'z o'rnini so'ragan odamga oldida nechta kishi borligi aytiladi.
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id kerak" }, { status: 400 });
  }

  const db = supabaseAdmin();

  const { data: visitor, error: visitorError } = await db
    .from("visitors")
    .select("id, status, queue_number, created_at")
    .eq("id", id)
    .single();

  if (visitorError || !visitor) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }

  const { count, error: countError } = await db
    .from("visitors")
    .select("id", { count: "exact", head: true })
    .eq("status", "kutilmoqda")
    .gte("created_at", todayStartUtc())
    .lt("created_at", visitor.created_at);

  if (countError) {
    console.error("Supabase error:", countError.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }

  return NextResponse.json({
    queue_number: visitor.queue_number,
    status: visitor.status,
    ahead: count ?? 0,
  });
}
