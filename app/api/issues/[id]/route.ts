import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { normalizeServiceIds } from "@/lib/services";
import {
  ISSUE_STATUSES,
  NAME_MAX,
  type Issue,
  type IssueStatus,
} from "@/lib/issues";

// Murojaat statusini o'zgartirish — faqat admin uchun.
//  - "korib_chiqilmoqda": mas'ul menejer ism-familiyasi majburiy
//    (yuborilmasa — avval biriktirilgan menejer qoladi, u ham bo'lmasa xato)
//  - "hal_qilindi": faqat mas'ul menejeri bor murojaatga
//  - "yangi": menejer va vaqtlar tozalanadi
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const { id } = await params;

  let body: {
    status?: unknown;
    managerFirstName?: unknown;
    managerLastName?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  const status = body.status as IssueStatus;
  if (!ISSUE_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Noto'g'ri status" }, { status: 400 });
  }

  const firstName =
    typeof body.managerFirstName === "string" ? body.managerFirstName.trim() : "";
  const lastName =
    typeof body.managerLastName === "string" ? body.managerLastName.trim() : "";
  if ((firstName && !lastName) || (!firstName && lastName)) {
    return NextResponse.json(
      { error: "Menejerning ismi va familiyasini to'liq kiriting" },
      { status: 400 }
    );
  }
  if (firstName.length > NAME_MAX || lastName.length > NAME_MAX) {
    return NextResponse.json(
      { error: "Ism yoki familiya juda uzun" },
      { status: 400 }
    );
  }

  const db = supabaseAdmin();
  const { data: current, error: readError } = await db
    .from("service_issues")
    .select("id, manager_first_name, manager_last_name, taken_at")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    console.error("Supabase error:", readError.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
  if (!current) {
    return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
  }

  const now = new Date().toISOString();
  let update: Partial<Issue>;

  if (status === "yangi") {
    update = {
      status,
      manager_first_name: null,
      manager_last_name: null,
      taken_at: null,
      resolved_at: null,
    };
  } else {
    const hasNewManager = !!firstName;
    const hasManager = hasNewManager || !!current.manager_first_name;
    if (!hasManager) {
      return NextResponse.json(
        { error: "Mas'ul menejerning ismi va familiyasini kiriting" },
        { status: 400 }
      );
    }
    update = {
      status,
      ...(hasNewManager
        ? { manager_first_name: firstName, manager_last_name: lastName, taken_at: now }
        : { taken_at: current.taken_at ?? now }),
      resolved_at: status === "hal_qilindi" ? now : null,
    };
  }

  const { data, error } = await db
    .from("service_issues")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase error:", error.message);
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }

  const issue = data as Issue;
  return NextResponse.json({
    ...issue,
    service_ids: normalizeServiceIds(issue.service_ids),
  });
}
