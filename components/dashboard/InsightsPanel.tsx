"use client";

import type { PortfolioInsight } from "@/lib/types";

interface InsightsPanelProps {
  insights: PortfolioInsight[];
}

const TYPE_STYLES: Record<string, { icon: string; border: string; bg: string; text: string }> = {
  warning: { icon: "⚠️", border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
  info: { icon: "💡", border: "border-sky-200", bg: "bg-sky-50", text: "text-sky-700" },
  positive: { icon: "✅", border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-500 text-center">
        No hay insights disponibles todavía.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
        Portfolio Doctor
      </p>
      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => {
          const style = TYPE_STYLES[insight.type] ?? TYPE_STYLES.info;
          return (
            <div
              key={i}
              className={`rounded-xl border ${style.border} ${style.bg} px-4 py-3 flex items-start gap-3`}
            >
              <span className="text-lg shrink-0">{style.icon}</span>
              <p className={`text-sm ${style.text}`}>{insight.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
