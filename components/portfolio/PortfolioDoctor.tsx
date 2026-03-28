"use client";

import { useState } from "react";
import type { AllocationItem, FitScoreResult, InvestorProfile, PortfolioInsight } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

interface PortfolioDoctorProps {
  profile: InvestorProfile;
  allocations: AllocationItem[];
  fitScore: FitScoreResult;
}

const INSIGHT_STYLES: Record<
  PortfolioInsight["type"],
  { bg: string; border: string; icon: string; text: string }
> = {
  warning: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: "⚠️",
    text: "text-amber-200",
  },
  info: {
    bg: "bg-sky-500/10",
    border: "border-sky-500/30",
    icon: "💡",
    text: "text-sky-200",
  },
  positive: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: "✅",
    text: "text-emerald-200",
  },
};

export function PortfolioDoctor({
  profile,
  allocations,
  fitScore,
}: PortfolioDoctorProps) {
  const [insights, setInsights] = useState<PortfolioInsight[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiGenerated, setAiGenerated] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setInsights(null);

    try {
      const res = await fetch("/api/portfolio/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, allocations }),
      });

      if (!res.ok) throw new Error("Error al analizar la cartera");

      const data = await res.json();
      setInsights(data.insights as PortfolioInsight[]);
      setAiGenerated(data.aiGenerated as boolean);
    } catch {
      setError("No se pudieron obtener los insights. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
            Portfolio Doctor
          </p>
          <h3 className="text-lg font-bold text-white mt-0.5">
            Análisis de tu cartera
          </h3>
        </div>
        {aiGenerated && (
          <span className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 rounded-full px-2.5 py-0.5">
            ✨ AI
          </span>
        )}
      </div>

      {!insights && !loading && (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="text-4xl">🔬</div>
          <p className="text-slate-400 text-sm max-w-xs">
            Analizamos tu cartera con inteligencia artificial para darte
            recomendaciones concretas y accionables.
          </p>
          <Button onClick={handleAnalyze} variant="secondary">
            Analizar mi cartera
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Analizando tu cartera...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 mb-4">
          {error}
          <button
            onClick={handleAnalyze}
            className="block mt-2 text-sky-400 hover:underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {insights && (
        <div className="flex flex-col gap-3">
          {insights.map((insight, i) => {
            const style = INSIGHT_STYLES[insight.type];
            return (
              <div
                key={i}
                className={clsx(
                  "rounded-xl border p-4 flex gap-3",
                  style.bg,
                  style.border
                )}
              >
                <span className="text-lg flex-shrink-0">{style.icon}</span>
                <p className={clsx("text-sm leading-relaxed", style.text)}>
                  {insight.message}
                </p>
              </div>
            );
          })}

          <p className="text-xs text-slate-600 mt-2 border-t border-white/10 pt-3">
            Esta información es orientativa y no constituye asesoramiento
            financiero regulado.
          </p>

          <button
            onClick={handleAnalyze}
            className="text-xs text-sky-500 hover:text-sky-400 mt-1"
          >
            Actualizar análisis
          </button>
        </div>
      )}

      {/* Score context */}
      <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-slate-500">Fit Score actual</span>
        <span
          className={clsx(
            "text-sm font-bold",
            fitScore.score >= 80
              ? "text-emerald-400"
              : fitScore.score >= 60
              ? "text-sky-400"
              : fitScore.score >= 45
              ? "text-amber-400"
              : "text-red-400"
          )}
        >
          {fitScore.score} / 100
        </span>
      </div>
    </div>
  );
}
