import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const db = getSupabaseServerClient();

  const today = new Date().toISOString().split("T")[0];

  const { data: portfolios, error } = await db
    .from("portfolios")
    .select("*, users(id, phone)")
    .eq("status", "active")
    .eq("next_contribution_date", today)
    .not("contribution_amount", "is", null);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch contributions" }, { status: 500 });
  }

  return NextResponse.json({ due: portfolios ?? [] });
}
