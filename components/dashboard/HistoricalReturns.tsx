"use client";

interface HistoricalReturnsProps {
  return1m: number;
  return3m: number;
  return1y: number;
}

function ReturnCard({ label, value }: { label: string; value: number }) {
  const formatted = value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  const color = value >= 0 ? "text-emerald-600" : "text-red-600";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 flex flex-col gap-1">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
        {label}
      </p>
      <p className={`text-2xl font-bold ${color}`}>{formatted}</p>
    </div>
  );
}

export function HistoricalReturns({
  return1m,
  return3m,
  return1y,
}: HistoricalReturnsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ReturnCard label="1 mes" value={return1m} />
      <ReturnCard label="3 meses" value={return3m} />
      <ReturnCard label="1 año" value={return1y} />
    </div>
  );
}
