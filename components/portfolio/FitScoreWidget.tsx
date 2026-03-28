"use client";

import { clsx } from "clsx";
import type { FitScoreResult } from "@/lib/types";

interface FitScoreWidgetProps {
  result: FitScoreResult | null;
  loading?: boolean;
  compact?: boolean;
}

const LABEL_COLORS: Record<string, string> = {
  "Muy alineado": "text-emerald-400",
  Alineado: "text-sky-400",
  "Moderadamente fuera de perfil": "text-amber-400",
  "Fuera de perfil": "text-red-400",
};

const RING_COLORS: Record<string, string> = {
  "Muy alineado": "#34d399",
  Alineado: "#38bdf8",
  "Moderadamente fuera de perfil": "#fbbf24",
  "Fuera de perfil": "#f87171",
};

function ScoreRing({
  score,
  label,
  size = 120,
}: {
  score: number;
  label: string;
  size?: number;
}) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = RING_COLORS[label] ?? "#38bdf8";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="rotate-[-90deg]">
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="9"
      />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={circ - filled}
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s" }}
      />
      <text
        x="50"
        y="54"
        textAnchor="middle"
        className="fill-white"
        style={{
          fontSize: 22,
          fontWeight: 700,
          transform: "rotate(90deg)",
          transformOrigin: "50px 50px",
          fill: "#fff",
        }}
      >
        {score}
      </text>
    </svg>
  );
}

function BreakdownBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span className="text-white font-medium">{value}</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-sky-500 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export function FitScoreWidget({
  result,
  loading,
  compact,
}: FitScoreWidgetProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 animate-pulse flex flex-col items-center gap-4">
        <div className="w-28 h-28 rounded-full bg-white/10" />
        <div className="h-4 w-32 rounded bg-white/10" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col items-center gap-3 text-center">
        <div className="text-3xl">📊</div>
        <p className="text-sm text-slate-400">
          Tu Portfolio Fit Score aparecerá aquí mientras armás tu cartera.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-semibold">
        Portfolio Fit Score
      </p>

      <div className="flex flex-col items-center gap-2 mb-5">
        <ScoreRing score={result.score} label={result.label} />
        <p
          className={clsx(
            "text-sm font-bold",
            LABEL_COLORS[result.label] ?? "text-sky-400"
          )}
        >
          {result.label}
        </p>
      </div>

      {!compact && (
        <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
          <BreakdownBar
            label="Alineación de riesgo"
            value={result.breakdown.riskAlignment}
          />
          <BreakdownBar
            label="Coherencia con objetivo"
            value={result.breakdown.goalCoherence}
          />
          <BreakdownBar
            label="Diversificación"
            value={result.breakdown.diversification}
          />
          <BreakdownBar
            label="Consistencia histórica"
            value={result.breakdown.historicalConsistency}
          />
          <BreakdownBar
            label="Coherencia temporal"
            value={result.breakdown.temporalCoherence}
          />
        </div>
      )}
    </div>
  );
}
