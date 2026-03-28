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

const UNIQUE_PALETTE = [
  "#0ea5e9", // sky-500
  "#f59e0b", // amber-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
  "#ef4444", // red-500
  "#ec4899", // pink-500
  "#f97316", // orange-500
  "#06b6d4", // cyan-500
  "#84cc16", // lime-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
  "#d946ef", // fuchsia-500
  "#eab308", // yellow-500
  "#3b82f6", // blue-500
  "#22c55e", // green-500
  "#a855f7", // purple-500
  "#e11d48", // rose-600
  "#0891b2", // cyan-600
  "#65a30d", // lime-600
  "#7c3aed", // violet-600
];

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
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="text-sky-600 font-bold">{value}%</p>
    </div>
  );
}

function CustomLegend({ payload }: CustomLegendProps) {
  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-600">
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
    .map((a, index) => {
      const inst = instruments.find((i) => i.id === a.instrumentId);
      return {
        name: inst?.name ?? a.instrumentId,
        value: a.percentage,
        color: UNIQUE_PALETTE[index % UNIQUE_PALETTE.length],
      };
    });

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
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
          stroke="#ffffff"
          strokeWidth={2}
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
