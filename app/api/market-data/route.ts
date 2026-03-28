import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { isDinariConfigured, getStocks } from "@/lib/dinari/client";
import { instrumentRowToDomain } from "@/lib/market-data";

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const db = getSupabaseServerClient();

  const { data: rows, error } = await db
    .from("instruments")
    .select("*")
    .eq("is_active", true)
    .order("category");

  if (error) {
    return NextResponse.json({ error: "Failed to fetch instruments" }, { status: 500 });
  }

  const instruments = (rows ?? []).map(instrumentRowToDomain);

  let stocks = null;
  if (isDinariConfigured()) {
    try {
      stocks = await getStocks();
    } catch {
      // Dinari unavailable — degrade gracefully
    }
  }

  return NextResponse.json({ instruments, stocks });
}
