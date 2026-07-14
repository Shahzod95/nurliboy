import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

const ALLOWED_STATUSES = ["kutilmoqda", "keldi", "kelmadi"];

// Statusni o'zgartirish (keldi / kelmadi) — faqat admin uchun
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  if (!body.status || !ALLOWED_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("visitors")
    .update({ status: body.status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }

  return NextResponse.json(data);
}
