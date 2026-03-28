import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { calculateFitScore } from "@/lib/fit-score";
import { instrumentRowToDomain } from "@/lib/market-data";
import { registerInstruments } from "@/lib/market-data";
import type { InvestorProfile, AllocationItem } from "@/lib/types";

interface AllocationInput {
  instrumentId: string;
  percentage: number;
  source: "local" | "dinari";
  ticker?: string | null;
  label?: string;
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get("user_id")?.value;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, allocations } = body as {
      name: string;
      allocations: AllocationInput[];
    };

    if (!name || !allocations?.length) {
      return NextResponse.json({ error: "name y allocations requeridos" }, { status: 400 });
    }

    const totalPct = allocations.reduce((s: number, a: AllocationInput) => s + a.percentage, 0);
    if (totalPct !== 100) {
      return NextResponse.json(
        { error: `Los porcentajes suman ${totalPct}%. Deben sumar exactamente 100%.` },
        { status: 400 }
      );
    }

    const db = getSupabaseServerClient();

    // Resolve Dinari instruments: upsert into instruments table
    const resolvedAllocations: AllocationItem[] = [];

    for (const alloc of allocations) {
      let instrumentId = alloc.instrumentId;

      if (alloc.source === "dinari" && alloc.ticker) {
        // Check if an instrument with this ticker already exists
        const { data: existing } = await db
          .from("instruments")
          .select("id")
          .eq("ticker", alloc.ticker)
          .single();

        if (existing) {
          instrumentId = existing.id;
        } else {
          const { data: inserted, error: insertErr } = await db
            .from("instruments")
            .insert({
              name: alloc.label ?? alloc.ticker,
              ticker: alloc.ticker,
              category: "renta_variable" as const,
              risk_level: "high" as const,
              return_1m: 2.0,
              return_3m: 6.0,
              return_1y: 25.0,
              volatility: 15.0,
              is_active: true,
            })
            .select("id")
            .single();

          if (insertErr || !inserted) {
            return NextResponse.json(
              { error: `Error creando instrumento ${alloc.ticker}: ${insertErr?.message}` },
              { status: 500 }
            );
          }
          instrumentId = inserted.id;
        }
      }

      resolvedAllocations.push({ instrumentId, percentage: alloc.percentage });
    }

    // Archive current active portfolio
    await db
      .from("portfolios")
      .update({ status: "archived" as const, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("status", "active");

    // Load all instruments involved so fit-score can resolve them
    const allInstrumentIds = resolvedAllocations.map((a) => a.instrumentId);
    const { data: instrumentRows } = await db
      .from("instruments")
      .select("*")
      .in("id", allInstrumentIds);

    if (instrumentRows) {
      const domainInstruments = instrumentRows.map((r: Record<string, unknown>) =>
        instrumentRowToDomain(r as import("@/lib/supabase/types").InstrumentRow)
      );
      registerInstruments(domainInstruments);
    }

    // Calculate fit score
    const { data: profileRow } = await db
      .from("investor_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    let fitScore: number | null = null;
    if (profileRow) {
      const profile: InvestorProfile = {
        experience: profileRow.experience,
        goal: profileRow.goal,
        horizon: profileRow.horizon,
        riskTolerance: profileRow.risk_tolerance,
      };
      const result = calculateFitScore(profile, resolvedAllocations);
      fitScore = result.score;
    }

    // Create new portfolio
    const { data: newPortfolio, error: portfolioErr } = await db
      .from("portfolios")
      .insert({
        user_id: userId,
        name,
        status: "active" as const,
        fit_score: fitScore,
        is_suggested: false,
      })
      .select("*")
      .single();

    if (portfolioErr || !newPortfolio) {
      return NextResponse.json(
        { error: `Error creando portfolio: ${portfolioErr?.message}` },
        { status: 500 }
      );
    }

    // Insert portfolio_instruments
    const piRows = resolvedAllocations.map((a) => ({
      portfolio_id: newPortfolio.id,
      instrument_id: a.instrumentId,
      percentage: a.percentage,
    }));

    const { error: piErr } = await db.from("portfolio_instruments").insert(piRows);
    if (piErr) {
      return NextResponse.json(
        { error: `Error guardando instrumentos: ${piErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(newPortfolio);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
