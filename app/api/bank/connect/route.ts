import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { bank } = await req.json();
    if (!bank || typeof bank !== "string") {
      return NextResponse.json({ error: "Banco requerido" }, { status: 400 });
    }

    const db = getSupabaseServerClient();
    const { error } = await db
      .from("users")
      .update({ connected_bank: bank })
      .eq("id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, bank });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
