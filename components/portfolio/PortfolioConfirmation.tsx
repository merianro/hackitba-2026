"use client";

import type { AllocationItem, FitScoreResult, Instrument, InvestorProfile } from "@/lib/types";
import { CATEGORY_LABELS, GOAL_LABELS, HORIZON_LABELS, RISK_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { FitScoreWidget } from "./FitScoreWidget";
import { CompositionChart } from "./CompositionChart";
import { clsx } from "clsx";

interface PortfolioConfirmationProps {
  profile: InvestorProfile;
  allocations: AllocationItem[];
  fitScore: FitScoreResult;
  instruments: Instrument[];
  onReset: () => void;
}

const FIT_LABEL_BADGE: Record<string, "green" | "blue" | "amber" | "red"> = {
  "Muy alineado": "green",
  Alineado: "blue",
  "Moderadamente fuera de perfil": "amber",
  "Fuera de perfil": "red",
};

export function PortfolioConfirmation({
  profile,
  allocations,
  fitScore,
  instruments,
  onReset,
}: PortfolioConfirmationProps) {
  const weightedOneYear = allocations.reduce((sum, alloc) => {
    const inst = instruments.find((i) => i.id === alloc.instrumentId);
    if (!inst) return sum;
    return sum + inst.returns.oneYear * (alloc.percentage / 100);
  }, 0);

  const weightedVol = allocations.reduce((sum, alloc) => {
    const inst = instruments.find((i) => i.id === alloc.instrumentId);
    if (!inst) return sum;
    return sum + inst.volatility * (alloc.percentage / 100);
  }, 0);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-white">¡Cartera confirmada!</h1>
        <p className="text-slate-400 mt-2">
          Tu estrategia de inversión está lista. Aquí está el resumen completo.
        </p>
      </div>

      {/* Profile summary */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
          Tu perfil inversor
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500 mb-1">Objetivo</p>
            <p className="text-sm font-semibold text-white">
              {GOAL_LABELS[profile.goal]}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Horizonte</p>
            <p className="text-sm font-semibold text-white">
              {HORIZON_LABELS[profile.horizon]}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Riesgo</p>
            <p className="text-sm font-semibold text-white">
              {RISK_LABELS[profile.riskTolerance].split("—")[0].trim()}
            </p>
          </div>
        </div>
      </div>

      {/* Main metrics */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-xs text-slate-500 mb-2">Fit Score</p>
          <p className="text-3xl font-black text-white">{fitScore.score}</p>
          <p className="text-sm mt-1">
            <Badge
              label={fitScore.label}
              variant={FIT_LABEL_BADGE[fitScore.label] ?? "blue"}
              size="sm"
            />
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-xs text-slate-500 mb-2">Rentab. estimada (1 año)</p>
          <p className="text-3xl font-black text-emerald-400">
            +{weightedOneYear.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-600 mt-1">histórica ponderada</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-xs text-slate-500 mb-2">Volatilidad estimada</p>
          <p
            className={clsx(
              "text-3xl font-black",
              weightedVol < 6
                ? "text-emerald-400"
                : weightedVol < 12
                ? "text-amber-400"
                : "text-red-400"
            )}
          >
            {weightedVol.toFixed(1)}%
          </p>
          <p className="text-xs text-slate-600 mt-1">desvío estándar mensual</p>
        </div>
      </div>

      {/* Composition + Score */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
            Composición final
          </p>
          <CompositionChart allocations={allocations} instruments={instruments} />
        </div>
        <FitScoreWidget result={fitScore} />
      </div>

      {/* Allocation detail */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-4">
          Detalle de activos
        </p>
        <div className="flex flex-col gap-3">
          {allocations.map((alloc) => {
            const inst = instruments.find((i) => i.id === alloc.instrumentId);
            if (!inst) return null;
            return (
              <div
                key={alloc.instrumentId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: inst.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {inst.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {CATEGORY_LABELS[inst.category]}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm font-bold text-white">
                    {alloc.percentage}%
                  </p>
                  <p className="text-xs text-emerald-400">
                    +{inst.returns.oneYear}%/año
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-slate-500 leading-relaxed">
        ⚠️ <strong className="text-slate-400">Aviso importante:</strong> Esta
        información es orientativa y no constituye asesoramiento financiero
        regulado. Los rendimientos históricos no garantizan rendimientos futuros.
        Esta plataforma es una demostración y no ejecuta inversiones reales ni
        gestiona fondos. Consultá con un asesor financiero registrado antes de
        tomar decisiones de inversión.
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 pb-8">
        <Button variant="secondary" onClick={onReset}>
          Empezar de nuevo
        </Button>
      </div>
    </div>
  );
}
