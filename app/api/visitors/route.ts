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

// Ro'yxatni olish — faqat admin uchun. ?q= bilan ism/familiya bo'yicha filter
export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const q = new URL(req.url).searchParams.get("q")?.trim();

  let query = supabaseAdmin()
    .from("visitors")
    .select()
    .order("created_at", { ascending: false });

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
