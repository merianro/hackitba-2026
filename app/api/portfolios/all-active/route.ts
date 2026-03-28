import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const db = getSupabaseServerClient();

  const { data: portfolios, error } = await db
    .from("portfolios")
    .select("*, users(id, phone), portfolio_instruments(*, instruments(*))")
    .eq("status", "active");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
  }

  return NextResponse.json({ portfolios: portfolios ?? [] });
}
