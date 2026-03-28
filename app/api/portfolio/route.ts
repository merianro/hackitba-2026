import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { calculateFitScore } from "@/lib/fit-score";
import type { InvestorProfile, AllocationItem } from "@/lib/types";

const saveSchema = z.object({
  phone: z.string().min(1),
  name: z.string().min(1),
  allocations: z.array(
    z.object({ instrumentId: z.string(), percentage: z.number().min(0).max(100) })
  ).min(1),
  is_suggested: z.boolean().optional(),
  contribution_amount: z.number().optional(),
  contribution_type: z.enum(["percentage", "fixed"]).optional(),
  contribution_frequency: z.enum(["weekly", "biweekly", "monthly"]).optional(),
  next_contribution_date: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  const phone = req.nextUrl.searchParams.get("phone");
  if (!phone) {
    return NextResponse.json({ error: "phone query param required" }, { status: 400 });
  }

  const db = getSupabaseServerClient();

  const { data: user } = await db
    .from("users")
    .select("id")
    .eq("phone", phone)
    .single();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { data: portfolio } = await db
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!portfolio) {
    return NextResponse.json({ error: "No active portfolio" }, { status: 404 });
  }

  const { data: items } = await db
    .from("portfolio_instruments")
    .select("*, instruments(*)")
    .eq("portfolio_id", portfolio.id);

  return NextResponse.json({ portfolio, instruments: items ?? [] });
}

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const parsed = saveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { phone, name, allocations, is_suggested, contribution_amount, contribution_type, contribution_frequency, next_contribution_date } = parsed.data;

    const total = allocations.reduce((s, a) => s + a.percentage, 0);
    if (Math.abs(total - 100) > 1) {
      return NextResponse.json({ error: "Allocations must sum to 100" }, { status: 400 });
    }

    const db = getSupabaseServerClient();

    const { data: user } = await db
      .from("users")
      .select("id")
      .eq("phone", phone)
      .single();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch profile for fit score calculation
    const { data: profileRow } = await db
      .from("investor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let fitScore: number | null = null;
    if (profileRow) {
      const profile: InvestorProfile = {
        experience: profileRow.experience,
        goal: profileRow.goal,
        horizon: profileRow.horizon,
        riskTolerance: profileRow.risk_tolerance,
      };
      const allocationItems: AllocationItem[] = allocations.map((a) => ({
        instrumentId: a.instrumentId,
        percentage: a.percentage,
      }));
      const result = calculateFitScore(profile, allocationItems);
      fitScore = result.score;
    }

    // Archive any existing active portfolio
    await db
      .from("portfolios")
      .update({ status: "archived", updated_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("status", "active");

    // Create new portfolio
    const { data: newPortfolio, error: portfolioError } = await db
      .from("portfolios")
      .insert({
        user_id: user.id,
        name,
        fit_score: fitScore,
        status: "active",
        is_suggested: is_suggested ?? false,
        contribution_amount: contribution_amount ?? null,
        contribution_type: contribution_type ?? null,
        contribution_frequency: contribution_frequency ?? null,
        next_contribution_date: next_contribution_date ?? null,
      })
      .select("*")
      .single();

    if (portfolioError || !newPortfolio) {
      return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
    }

    // Map instrument IDs from JSON names to Supabase UUIDs
    const { data: dbInstruments } = await db
      .from("instruments")
      .select("id, ticker")
      .eq("is_active", true);

    const instrumentRows = allocations.map((a) => ({
      portfolio_id: newPortfolio.id,
      instrument_id: a.instrumentId,
      percentage: a.percentage,
    }));

    await db.from("portfolio_instruments").insert(instrumentRows);

    return NextResponse.json({ portfolio: newPortfolio, fit_score: fitScore });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
