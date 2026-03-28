"use client";

import { useState } from "react";
import type { AllocationItem, FitScoreResult, InvestorProfile, WhatIfScenario } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

interface WhatIfSimulatorProps {
  profile: InvestorProfile;
  allocations: AllocationItem[];
  fitScore: FitScoreResult;
}

type ScenarioId = "more_equity" | "more_usd" | "monthly_contribution";

const SCENARIOS: Array<{
  id: ScenarioId;
  emoji: string;
  label: string;
  hint: string;
}> = [
  {
    id: "more_equity",
    emoji: "📈",
    label: "¿Qué pasa si aumento renta variable?",
    hint: "Ver impacto de más acciones en tu cartera",
  },
  {
    id: "more_usd",
    emoji: "💵",
    label: "¿Qué pasa si dolarizo más?",
    hint: "Ver impacto de mayor exposición al dólar",
  },
  {
    id: "monthly_contribution",
    emoji: "📅",
    label: "¿Qué pasa si aporto mensualmente?",
    hint: "Ver el poder de los aportes regulares",
  },
];

interface SimResult {
  scenario: WhatIfScenario;
  newFitScore: FitScoreResult;
  originalFitScore: FitScoreResult;
}

function DeltaBadge({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const isPos = value >= 0;
  return (
    <span
      className={clsx(
        "text-sm font-bold",
        isPos ? "text-emerald-400" : "text-red-400"
      )}
    >
      {isPos ? "+" : ""}
      {value.toFixed(1)}{suffix}
    </span>
  );
}

export function WhatIfSimulator({
  profile,
  allocations,
  fitScore,
}: WhatIfSimulatorProps) {
  const [selected, setSelected] = useState<ScenarioId | null>(null);
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (scenarioId: ScenarioId) => {
    setSelected(scenarioId);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/portfolio/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, allocations, scenarioId }),
      });

      if (!res.ok) throw new Error("Error al simular el escenario");
      const data = await res.json();
      setResult(data as SimResult);
    } catch {
      setError("No se pudo simular el escenario. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
        AI What-if Simulator
      </p>
      <h3 className="text-lg font-bold text-white mb-5">
        Explorá escenarios alternativos
      </h3>

      {/* Scenario buttons */}
      <div className="flex flex-col gap-2 mb-5">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSimulate(s.id)}
            disabled={loading}
            className={clsx(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              selected === s.id && result
                ? "border-sky-500/60 bg-sky-500/15"
                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
              loading && selected === s.id && "opacity-60"
            )}
          >
            <span className="text-xl">{s.emoji}</span>
            <div>
              <p className="text-sm font-semibold text-white">{s.label}</p>
              <p className="text-xs text-slate-500">{s.hint}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-4">
          <div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Simulando escenario...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wide">
            Resultado del escenario
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Retorno anual</p>
              <DeltaBadge value={result.scenario.impact.returnOneYear} />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Volatilidad</p>
              <DeltaBadge value={result.scenario.impact.volatility} suffix=" pp" />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Fit Score</p>
              <DeltaBadge value={result.scenario.impact.fitScoreDelta} suffix=" pts" />
            </div>
          </div>

          {/* Score comparison */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Actual:</span>
              <span className="font-bold text-white">
                {result.originalFitScore.score}
              </span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Simulado:</span>
              <span
                className={clsx(
                  "font-bold",
                  result.newFitScore.score > result.originalFitScore.score
                    ? "text-emerald-400"
                    : result.newFitScore.score < result.originalFitScore.score
                    ? "text-red-400"
                    : "text-white"
                )}
              >
                {result.newFitScore.score}
              </span>
            </div>
          </div>

          {/* Narrative */}
          <p className="text-sm text-slate-300 leading-relaxed border-t border-white/10 pt-3">
            {result.scenario.narrative}
          </p>

          <p className="text-xs text-slate-600">
            Esta información es orientativa y no constituye asesoramiento financiero regulado.
          </p>
        </div>
      )}
    </div>
  );
}
