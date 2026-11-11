import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { ISSUE_STATUSES, type IssueStatus } from "@/lib/issues";

// Murojaat statusini o'zgartirish — faqat admin uchun
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

  if (!body.status || !ISSUE_STATUSES.includes(body.status as IssueStatus)) {
    return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from("service_issues")
    .update({ status: body.status })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }

  return NextResponse.json(data);
}
