"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AllocationItem, Instrument } from "@/lib/types";

interface CompositionChartProps {
  allocations: AllocationItem[];
  instruments: Instrument[];
}

interface LegendPayload {
  value: string;
  color?: string;
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm shadow-xl">
      <p className="font-semibold text-white">{name}</p>
      <p className="text-sky-400">{value}%</p>
    </div>
  );
}

function CustomLegend({ payload }: CustomLegendProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-slate-400">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ background: entry.color }}
          />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

export function CompositionChart({
  allocations,
  instruments,
}: CompositionChartProps) {
  const data = allocations
    .filter((a) => a.percentage > 0)
    .map((a) => {
      const inst = instruments.find((i) => i.id === a.instrumentId);
      return {
        name: inst?.name ?? a.instrumentId,
        value: a.percentage,
        color: inst?.color ?? "#555",
      };
    });

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
        Agregá activos para ver la distribución
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="46%"
          innerRadius={65}
          outerRadius={100}
          dataKey="value"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
