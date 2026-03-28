import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { amount, frequency, startDate } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Monto debe ser mayor a 0" }, { status: 400 });
    }
    if (!["weekly", "biweekly", "monthly"].includes(frequency)) {
      return NextResponse.json({ error: "Frecuencia inválida" }, { status: 400 });
    }
    if (!startDate) {
      return NextResponse.json({ error: "Fecha de inicio requerida" }, { status: 400 });
    }

    const db = getSupabaseServerClient();

    const { data: portfolio } = await db
      .from("portfolios")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (!portfolio) {
      return NextResponse.json({ error: "No tenés una cartera activa" }, { status: 400 });
    }

    const { error } = await db
      .from("portfolios")
      .update({
        contribution_amount: amount,
        contribution_type: "fixed" as const,
        contribution_frequency: frequency,
        next_contribution_date: startDate,
        updated_at: new Date().toISOString(),
      })
      .eq("id", portfolio.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
