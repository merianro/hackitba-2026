import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { getSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { instrumentRowToDomain } from "@/lib/market-data";
import { calculateFitScore } from "@/lib/fit-score";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import type { InvestorProfile, AllocationItem, FitScoreResult, PortfolioInsight, Instrument } from "@/lib/types";
import type { ContributionHistoryRow, PortfolioRow } from "@/lib/supabase/types";

interface DashboardData {
  portfolio: PortfolioRow;
  instruments: Instrument[];
  allocations: AllocationItem[];
  fitScore: FitScoreResult;
  insights: PortfolioInsight[];
  contributions: ContributionHistoryRow[];
  weightedReturns: { oneMonth: number; threeMonths: number; oneYear: number };
  profileSummary: string;
  userEmail: string;
  connectedBank: string | null;
  hasAutoDebit: boolean;
}

async function loadDashboardData(userId: string, userEmail: string, connectedBank: string | null): Promise<DashboardData | null> {
  const db = getSupabaseServerClient();

  const { data: profileRow } = await db
    .from("investor_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!profileRow) return null;

  const { data: portfolio } = await db
    .from("portfolios")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (!portfolio) return null;

  const { data: piRows } = await db
    .from("portfolio_instruments")
    .select("*, instruments(*)")
    .eq("portfolio_id", portfolio.id);

  if (!piRows?.length) return null;

  const instruments: Instrument[] = [];
  const allocations: AllocationItem[] = [];

  for (const row of piRows) {
    const instRow = (row as Record<string, unknown>).instruments as Record<string, unknown> | null;
    if (!instRow) continue;

    const instrument = instrumentRowToDomain(instRow as import("@/lib/supabase/types").InstrumentRow);
    instruments.push(instrument);
    allocations.push({
      instrumentId: instrument.id,
      percentage: Number(row.percentage),
    });
  }

  const profile: InvestorProfile = {
    experience: profileRow.experience,
    goal: profileRow.goal,
    horizon: profileRow.horizon,
    riskTolerance: profileRow.risk_tolerance,
  };

  const fitScore = calculateFitScore(profile, allocations);
  const insights = generateSimpleInsights(profile, allocations, fitScore);

  const { data: contributions } = await db
    .from("contribution_history")
    .select("*")
    .eq("portfolio_id", portfolio.id)
    .order("executed_at", { ascending: false });

  const weightedReturns = { oneMonth: 0, threeMonths: 0, oneYear: 0 };
  for (const alloc of allocations) {
    const inst = instruments.find((i) => i.id === alloc.instrumentId);
    if (!inst) continue;
    const w = alloc.percentage / 100;
    weightedReturns.oneMonth += inst.returns.oneMonth * w;
    weightedReturns.threeMonths += inst.returns.threeMonths * w;
    weightedReturns.oneYear += inst.returns.oneYear * w;
  }

  const riskMap: Record<string, string> = {
    conservative: "conservador",
    moderate: "moderado",
    aggressive: "agresivo",
  };

  return {
    portfolio,
    instruments,
    allocations,
    fitScore,
    insights,
    contributions: contributions ?? [],
    weightedReturns,
    profileSummary: `Perfil ${riskMap[profileRow.risk_tolerance]}`,
    userEmail,
    connectedBank,
    hasAutoDebit: Boolean(portfolio.contribution_amount && portfolio.contribution_frequency),
  };
}

function generateSimpleInsights(
  profile: InvestorProfile,
  allocations: AllocationItem[],
  fitScore: FitScoreResult
): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];

  if (fitScore.score >= 80) {
    insights.push({ type: "positive", message: "Tu cartera está bien alineada con tu perfil de inversor." });
  }
  if (fitScore.breakdown.diversification < 60) {
    insights.push({ type: "info", message: "Agregar más categorías de activos puede mejorar la diversificación." });
  }
  if (fitScore.score < 50) {
    insights.push({ type: "warning", message: "Tu cartera está bastante desalineada con tu perfil. Considerá ajustarla." });
  }
  if (insights.length === 0) {
    insights.push({ type: "info", message: "Tu cartera tiene un nivel de alineación aceptable con tu perfil." });
  }

  return insights.slice(0, 3);
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-500 max-w-md">
          Configurá <code className="text-sky-600">NEXT_PUBLIC_SUPABASE_URL</code> y{" "}
          <code className="text-sky-600">SUPABASE_SERVICE_ROLE_KEY</code> en <code className="text-sky-600">.env.local</code>.
        </p>
      </main>
    );
  }

  const user = await getSessionUser();
  if (!user) redirect("/login");

  const data = await loadDashboardData(user.id, user.email ?? "", user.connected_bank);

  if (!data) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-4xl font-black text-gray-900 mb-4">Sin cartera activa</h1>
        <p className="text-gray-500">Tu usuario no tiene un portfolio activo todavía.</p>
      </main>
    );
  }

  return <DashboardContent data={data} />;
}
