"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { CompositionChart } from "@/components/portfolio/CompositionChart";
import { FitScoreWidget } from "@/components/portfolio/FitScoreWidget";
import { HistoricalReturns } from "./HistoricalReturns";
import { InsightsPanel } from "./InsightsPanel";
import { ContributionHistory } from "./ContributionHistory";
import type {
  AllocationItem,
  FitScoreResult,
  Instrument,
  PortfolioInsight,
} from "@/lib/types";
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

export function DashboardContent({ data }: { data: DashboardData }) {
  const router = useRouter();
  const {
    portfolio,
    instruments,
    allocations,
    fitScore,
    insights,
    contributions,
    weightedReturns,
    profileSummary,
    userEmail,
    connectedBank,
    hasAutoDebit,
  } = data;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const showDebitWarning = !connectedBank || !hasAutoDebit;

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
      {/* Auto-debit warning */}
      {showDebitWarning && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl shrink-0 mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {!connectedBank
                  ? "No tenés un banco conectado"
                  : "Débito automático no configurado"}
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                {!connectedBank
                  ? "Conectá tu banco y configurá el débito automático para que tus aportes se realicen sin intervención."
                  : "Configurá monto, frecuencia y fecha para automatizar tus aportes a la cartera."}
              </p>
            </div>
          </div>
          <Link
            href="/debit/setup"
            className="shrink-0 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-amber-600 transition-colors"
          >
            {!connectedBank ? "Conectar banco" : "Configurar débito"}
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-600 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
            HackITBA 2026 · Smart Finance
          </div>
          <h1 className="text-3xl font-black text-gray-900">{portfolio.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{profileSummary} · {userEmail}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Activo
          </span>
          <Link
            href="/debit/setup"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            {hasAutoDebit ? "Débito" : "Configurar débito"}
          </Link>
          <Link
            href="/portfolio/edit"
            className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-100 transition-colors"
          >
            Editar cartera
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>

      {/* Returns */}
      <div className="mb-6">
        <HistoricalReturns
          return1m={weightedReturns.oneMonth}
          return3m={weightedReturns.threeMonths}
          return1y={weightedReturns.oneYear}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            Composición de la cartera
          </p>
          <CompositionChart allocations={allocations} instruments={instruments} />
        </div>
        <FitScoreWidget result={fitScore} />
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightsPanel insights={insights} />
        <ContributionHistory
          contributions={contributions}
          nextDate={portfolio.next_contribution_date}
        />
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500 text-center">
        Esta información es orientativa y no constituye asesoramiento financiero regulado.
      </div>
    </main>
  );
}
