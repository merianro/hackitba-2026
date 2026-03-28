"use client";

interface Contribution {
  id: string;
  amount: number;
  executed_at: string;
  status: string;
}

interface ContributionHistoryProps {
  contributions: Contribution[];
  nextDate: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export function ContributionHistory({
  contributions,
  nextDate,
}: ContributionHistoryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
        Historial de aportes
      </p>

      {nextDate && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 mb-4 text-sm text-sky-700">
          Próximo aporte programado: <span className="font-semibold">{formatDate(nextDate)}</span>
        </div>
      )}

      {contributions.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No hay aportes registrados todavía.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs uppercase tracking-widest">
                <th className="text-left py-2 font-semibold">Fecha</th>
                <th className="text-right py-2 font-semibold">Monto</th>
                <th className="text-right py-2 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((c) => (
                <tr key={c.id} className="border-b border-gray-50">
                  <td className="py-3 text-gray-600">{formatDate(c.executed_at)}</td>
                  <td className="py-3 text-right text-gray-900 font-medium">
                    {formatAmount(c.amount)}
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700">
                      Simulado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
