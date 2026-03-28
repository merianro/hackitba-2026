"use client";

import { useEffect, useState, useCallback } from "react";
import type { AllocationItem, FitScoreResult, Instrument, InvestorProfile } from "@/lib/types";
import { CompositionChart } from "./CompositionChart";
import { FitScoreWidget } from "./FitScoreWidget";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_LABELS, RISK_LEVEL_LABELS } from "@/lib/constants";
import { clsx } from "clsx";

interface PortfolioBuilderProps {
  initialAllocations: AllocationItem[];
  instruments: Instrument[];
  profile: InvestorProfile;
  onConfirm: (allocations: AllocationItem[], fitScore: FitScoreResult) => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

type RiskBadgeVariant = "green" | "amber" | "red";
const RISK_BADGE: Record<string, RiskBadgeVariant> = {
  low: "green",
  medium: "amber",
  high: "red",
};

export function PortfolioBuilder({
  initialAllocations,
  instruments,
  profile,
  onConfirm,
}: PortfolioBuilderProps) {
  const [allocations, setAllocations] =
    useState<AllocationItem[]>(initialAllocations);
  const [fitScore, setFitScore] = useState<FitScoreResult | null>(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [view, setView] = useState<"suggested" | "custom">("suggested");

  const debouncedAllocations = useDebounce(allocations, 400);
  const total = allocations.reduce((s, a) => s + a.percentage, 0);
  const remaining = 100 - total;

  // Fetch fit score from API when allocations change
  useEffect(() => {
    if (debouncedAllocations.length === 0) return;
    const validSum = debouncedAllocations.reduce((s, a) => s + a.percentage, 0);
    if (Math.abs(validSum - 100) > 1) return;

    setScoreLoading(true);
    fetch("/api/portfolio/fit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, allocations: debouncedAllocations }),
    })
      .then((r) => r.json())
      .then((data) => setFitScore(data as FitScoreResult))
      .catch(console.error)
      .finally(() => setScoreLoading(false));
  }, [debouncedAllocations, profile]);

  const handleSlider = useCallback(
    (id: string, value: number) => {
      setAllocations((prev) => {
        const others = prev.filter((a) => a.instrumentId !== id);
        const othersTotal = others.reduce((s, a) => s + a.percentage, 0);
        const newValue = Math.min(value, 100);
        const overflow = newValue + othersTotal - 100;

        if (overflow <= 0) {
          return prev.map((a) =>
            a.instrumentId === id ? { ...a, percentage: newValue } : a
          );
        }

        // Proportionally reduce others
        const factor = (othersTotal - overflow) / othersTotal;
        return prev.map((a) =>
          a.instrumentId === id
            ? { ...a, percentage: newValue }
            : { ...a, percentage: Math.max(0, Math.round(a.percentage * factor)) }
        );
      });
    },
    []
  );

  const handleAddInstrument = (id: string) => {
    if (allocations.find((a) => a.instrumentId === id)) return;
    const available = remaining > 0 ? Math.min(remaining, 10) : 0;
    if (available === 0) return;
    setAllocations((prev) => [
      ...prev,
      { instrumentId: id, percentage: available },
    ]);
  };

  const handleRemove = (id: string) => {
    setAllocations((prev) => prev.filter((a) => a.instrumentId !== id));
  };

  const handleConfirm = () => {
    if (!fitScore) return;
    onConfirm(allocations, fitScore);
  };

  const unusedInstruments = instruments.filter(
    (i) => !allocations.find((a) => a.instrumentId === i.id)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setAllocations(initialAllocations);
            setView("suggested");
          }}
          className={clsx(
            "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
            view === "suggested"
              ? "bg-sky-500 text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
          Cartera sugerida
        </button>
        <button
          onClick={() => setView("custom")}
          className={clsx(
            "flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all",
            view === "custom"
              ? "bg-sky-500 text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10"
          )}
        >
          Personalizar
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left: sliders */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Composición de la cartera</h3>
              <span
                className={clsx(
                  "text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg",
                  Math.abs(total - 100) < 1
                    ? "text-emerald-400 bg-emerald-500/10"
                    : "text-amber-400 bg-amber-500/10"
                )}
              >
                {total}% / 100%
              </span>
            </div>

            <div className="flex flex-col gap-5">
              {allocations.map((alloc) => {
                const inst = instruments.find(
                  (i) => i.id === alloc.instrumentId
                );
                if (!inst) return null;

                return (
                  <div key={alloc.instrumentId} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ background: inst.color }}
                        />
                        <span className="text-sm font-medium text-white truncate">
                          {inst.name}
                        </span>
                        <Badge
                          label={RISK_LEVEL_LABELS[inst.riskLevel]}
                          variant={RISK_BADGE[inst.riskLevel]}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-bold text-sky-400 w-10 text-right">
                          {Math.round(alloc.percentage)}%
                        </span>
                        {view === "custom" && (
                          <button
                            onClick={() => handleRemove(alloc.instrumentId)}
                            className="text-slate-600 hover:text-red-400 transition-colors text-xs px-1"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={alloc.percentage}
                      disabled={view === "suggested"}
                      onChange={(e) =>
                        handleSlider(
                          alloc.instrumentId,
                          Number(e.target.value)
                        )
                      }
                      className={clsx(
                        "w-full accent-sky-500 cursor-pointer h-1.5",
                        view === "suggested" && "opacity-50 cursor-default"
                      )}
                      style={
                        {
                          accentColor: inst.color,
                        } as React.CSSProperties
                      }
                    />

                    <div className="flex justify-between text-xs text-slate-600">
                      <span>{CATEGORY_LABELS[inst.category]}</span>
                      <span>
                        Rentab. 1 año:{" "}
                        <span className="text-emerald-400 font-semibold">
                          +{inst.returns.oneYear}%
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {view === "custom" && unusedInstruments.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wide">
                  Agregar activo
                </p>
                <div className="flex flex-col gap-2">
                  {unusedInstruments.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => handleAddInstrument(inst.id)}
                      disabled={remaining <= 0}
                      className={clsx(
                        "flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all text-left",
                        remaining > 0
                          ? "hover:border-sky-500/50 hover:bg-sky-500/10 cursor-pointer"
                          : "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: inst.color }}
                        />
                        <span className="font-medium text-white">
                          {inst.name}
                        </span>
                        <Badge
                          label={CATEGORY_LABELS[inst.category]}
                          variant="neutral"
                          size="sm"
                        />
                      </div>
                      <span className="text-emerald-400 font-semibold">
                        +{inst.returns.oneYear}%/año
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">
              Distribución
            </p>
            <CompositionChart allocations={allocations} instruments={instruments} />
          </div>
        </div>

        {/* Right: Fit Score */}
        <div className="flex flex-col gap-4">
          <FitScoreWidget result={fitScore} loading={scoreLoading} />

          {/* Returns snapshot */}
          {fitScore && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                Rentabilidad histórica estimada
              </p>
              {[
                {
                  label: "1 mes",
                  key: "oneMonth" as const,
                },
                {
                  label: "3 meses",
                  key: "threeMonths" as const,
                },
                {
                  label: "1 año",
                  key: "oneYear" as const,
                },
              ].map(({ label, key }) => {
                const realVal = allocations.reduce((sum, alloc) => {
                  const inst = instruments.find(
                    (i) => i.id === alloc.instrumentId
                  );
                  if (!inst) return sum;
                  return sum + inst.returns[key] * (alloc.percentage / 100);
                }, 0);

                return (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">{label}</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      +{realVal.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <Button
            onClick={handleConfirm}
            size="lg"
            className="w-full"
            disabled={Math.abs(total - 100) > 1 || !fitScore}
          >
            Confirmar cartera →
          </Button>
        </div>
      </div>
    </div>
  );
}
