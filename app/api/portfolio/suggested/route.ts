import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { suggestPortfolio } from "@/lib/portfolio-engine";
import { calculateFitScore } from "@/lib/fit-score";
import type { InvestorProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const phone = body.phone;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "phone is required" }, { status: 400 });
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

    const { data: profileRow } = await db
      .from("investor_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profileRow) {
      return NextResponse.json({ error: "Profile not found — complete onboarding first" }, { status: 404 });
    }

    const profile: InvestorProfile = {
      experience: profileRow.experience,
      goal: profileRow.goal,
      horizon: profileRow.horizon,
      riskTolerance: profileRow.risk_tolerance,
    };

    const portfolio = suggestPortfolio(profile);
    const fitScore = calculateFitScore(profile, portfolio.allocations);

    return NextResponse.json({
      allocations: portfolio.allocations,
      source: portfolio.source,
      fitScore,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
