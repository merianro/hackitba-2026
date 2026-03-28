import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getSupabaseServerClient } from "@/lib/supabase/client";
import { instrumentRowToDomain } from "@/lib/market-data";
import { isDinariConfigured, getStocks } from "@/lib/dinari/client";
import { PortfolioEditor } from "@/components/portfolio/PortfolioEditor";
import type { Instrument, AllocationItem, InvestorProfile } from "@/lib/types";
import type { InstrumentRow } from "@/lib/supabase/types";
import type { DinariStock } from "@/lib/dinari/client";

export default async function PortfolioEditPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const db = getSupabaseServerClient();

  const { data: profileRow } = await db
    .from("investor_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profileRow) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <p className="text-slate-400">No tenés perfil de inversor configurado.</p>
      </main>
    );
  }

  const profile: InvestorProfile = {
    experience: profileRow.experience,
    goal: profileRow.goal,
    horizon: profileRow.horizon,
    riskTolerance: profileRow.risk_tolerance,
  };

  // Current portfolio
  const { data: portfolio } = await db
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  let currentAllocations: AllocationItem[] = [];
  let currentName = "Mi Cartera";

  if (portfolio) {
    currentName = portfolio.name;
    const { data: piRows } = await db
      .from("portfolio_instruments")
      .select("*, instruments(*)")
      .eq("portfolio_id", portfolio.id);

    if (piRows) {
      for (const row of piRows) {
        currentAllocations.push({
          instrumentId: row.instrument_id,
          percentage: Number(row.percentage),
        });
      }
    }
  }

  // All local instruments
  const { data: instrumentRows } = await db
    .from("instruments")
    .select("*")
    .eq("is_active", true)
    .order("category");

  const localInstruments: Instrument[] = (instrumentRows ?? []).map((r: InstrumentRow) =>
    instrumentRowToDomain(r)
  );

  // Dinari stocks
  let dinariStocks: DinariStock[] = [];
  if (isDinariConfigured()) {
    try {
      dinariStocks = await getStocks();
    } catch {
      // Dinari unavailable
    }
  }

  return (
    <PortfolioEditor
      profile={profile}
      localInstruments={localInstruments}
      dinariStocks={dinariStocks}
      currentAllocations={currentAllocations}
      currentName={currentName}
    />
  );
}
