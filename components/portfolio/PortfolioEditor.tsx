"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CompositionChart } from "./CompositionChart";
import { FitScoreWidget } from "./FitScoreWidget";
import { calculateFitScore } from "@/lib/fit-score";
import { registerInstruments } from "@/lib/market-data";
import type { Instrument, AllocationItem, InvestorProfile, FitScoreResult } from "@/lib/types";
import type { DinariStock } from "@/lib/dinari/client";

interface PortfolioEditorProps {
  profile: InvestorProfile;
  localInstruments: Instrument[];
  dinariStocks: DinariStock[];
  currentAllocations: AllocationItem[];
  currentName: string;
}

interface EditableAllocation {
  instrumentId: string;
  percentage: number;
  label: string;
  source: "local" | "dinari";
  logo?: string | null;
  ticker?: string | null;
}

export function PortfolioEditor({
  profile,
  localInstruments,
  dinariStocks,
  currentAllocations,
  currentName,
}: PortfolioEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"local" | "dinari">("local");
  const [searchQuery, setSearchQuery] = useState("");

  const [allocations, setAllocations] = useState<EditableAllocation[]>(() =>
    currentAllocations.map((a) => {
      const inst = localInstruments.find((i) => i.id === a.instrumentId);
      return {
        instrumentId: a.instrumentId,
        percentage: a.percentage,
        label: inst?.name ?? a.instrumentId,
        source: "local" as const,
        ticker: inst?.ticker,
      };
    })
  );

  useEffect(() => {
    registerInstruments(localInstruments);
  }, [localInstruments]);

  useEffect(() => {
    const dinariAllocs = allocations.filter((a) => a.source === "dinari");
    if (dinariAllocs.length === 0) return;

    const virtual: Instrument[] = dinariAllocs.map((a) => ({
      id: a.instrumentId,
      name: a.label,
      ticker: a.ticker ?? null,
      category: "renta_variable" as const,
      riskLevel: "high" as const,
      returns: { oneMonth: 2, threeMonths: 6, oneYear: 25 },
      volatility: 15,
      isActive: true,
    }));
    registerInstruments(virtual);
  }, [allocations]);

  const total = allocations.reduce((s, a) => s + a.percentage, 0);
  const isTotalValid = total === 100;

  const chartInstruments: Instrument[] = useMemo(() => {
    const dinariColors = ["#f472b6", "#818cf8", "#fb923c", "#a3e635", "#22d3ee", "#e879f9", "#facc15"];
    const virtualDinari: Instrument[] = allocations
      .filter((a) => a.source === "dinari")
      .map((a, i) => ({
        id: a.instrumentId,
        name: a.label,
        ticker: a.ticker ?? null,
        category: "renta_variable" as const,
        riskLevel: "high" as const,
        returns: { oneMonth: 2, threeMonths: 6, oneYear: 25 },
        volatility: 15,
        isActive: true,
        color: dinariColors[i % dinariColors.length],
      }));
    return [...localInstruments, ...virtualDinari];
  }, [allocations, localInstruments]);

  const chartAllocations: AllocationItem[] = useMemo(
    () => allocations.filter((a) => a.percentage > 0).map((a) => ({ instrumentId: a.instrumentId, percentage: a.percentage })),
    [allocations]
  );

  const fitScore: FitScoreResult | null = useMemo(() => {
    if (allocations.length === 0) return null;
    const items: AllocationItem[] = allocations
      .filter((a) => a.percentage > 0)
      .map((a) => ({ instrumentId: a.instrumentId, percentage: a.percentage }));
    if (items.length === 0) return null;
    try {
      return calculateFitScore(profile, items);
    } catch {
      return null;
    }
  }, [allocations, profile]);

  function updatePercentage(instrumentId: string, value: number) {
    setAllocations((prev) =>
      prev.map((a) =>
        a.instrumentId === instrumentId ? { ...a, percentage: Math.max(0, Math.min(100, value)) } : a
      )
    );
  }

  function removeAllocation(instrumentId: string) {
    setAllocations((prev) => prev.filter((a) => a.instrumentId !== instrumentId));
  }

  function addLocalInstrument(inst: Instrument) {
    if (allocations.some((a) => a.instrumentId === inst.id)) return;
    setAllocations((prev) => [
      ...prev,
      {
        instrumentId: inst.id,
        percentage: 0,
        label: inst.name,
        source: "local",
        ticker: inst.ticker,
      },
    ]);
  }

  function addDinariStock(stock: DinariStock) {
    const tempId = `dinari_${stock.symbol}`;
    if (allocations.some((a) => a.instrumentId === tempId || a.ticker === stock.symbol)) return;
    setAllocations((prev) => [
      ...prev,
      {
        instrumentId: tempId,
        percentage: 0,
        label: stock.display_name ?? stock.name,
        source: "dinari",
        logo: stock.logo_url,
        ticker: stock.symbol,
      },
    ]);
  }

  const unusedLocal = localInstruments.filter(
    (inst) => !allocations.some((a) => a.instrumentId === inst.id)
  );

  const filteredDinari = dinariStocks.filter((s) => {
    if (!s.is_tradable) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      (s.display_name?.toLowerCase().includes(q) ?? false)
    );
  });

  async function handleSave() {
    if (total !== 100) {
      setError(`Los porcentajes suman ${total}%. Deben sumar exactamente 100%.`);
      return;
    }

    const activeAllocations = allocations.filter((a) => a.percentage > 0);
    if (activeAllocations.length === 0) {
      setError("Necesitás al menos un activo con porcentaje mayor a 0.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/portfolio/save-from-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          allocations: allocations
            .filter((a) => a.percentage > 0)
            .map((a) => ({
              instrumentId: a.instrumentId,
              percentage: a.percentage,
              source: a.source,
              ticker: a.ticker,
              label: a.label,
            })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al guardar");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Editar cartera</h1>
          <p className="text-gray-500 text-sm mt-1">Ajustá la composición y guardá los cambios</p>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
      </div>

      {/* Top row: Chart left + Composition right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* LEFT: Distribution chart + Fit Score + Save */}
        <div className="flex flex-col gap-6">
          {/* Pie chart */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">
              Distribución
            </p>
            <CompositionChart allocations={chartAllocations} instruments={chartInstruments} />
          </div>

          {/* Fit Score */}
          <FitScoreWidget result={fitScore} />

          {/* Total indicator */}
          <div className={`rounded-xl border px-4 py-3 text-center text-sm font-bold ${
            isTotalValid
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}>
            Total: {total}% {isTotalValid ? "— Listo para guardar" : `— Faltan ${100 - total}%`}
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving || !isTotalValid || allocations.length === 0}
            className="w-full rounded-xl bg-sky-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Guardando..." : "Guardar cartera"}
          </button>
        </div>

        {/* RIGHT: Portfolio name + Allocations */}
        <div className="flex flex-col gap-6">
          {/* Portfolio name */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <label className="block text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
              Nombre de la cartera
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none focus:border-sky-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Current allocations */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                Composición
              </p>
              <p className={`text-sm font-bold ${isTotalValid ? "text-emerald-600" : "text-amber-600"}`}>
                {total}%
              </p>
            </div>

            {allocations.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                Agregá activos desde las opciones de abajo.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {allocations.map((a) => (
                  <div key={a.instrumentId} className="flex items-center gap-3">
                    {a.logo && (
                      <img src={a.logo} alt="" className="w-6 h-6 rounded-full bg-gray-100" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium truncate">{a.label}</p>
                      {a.ticker && <p className="text-xs text-gray-500">{a.ticker}</p>}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={a.percentage}
                      onChange={(e) => updatePercentage(a.instrumentId, Number(e.target.value))}
                      className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-right text-gray-900 text-sm outline-none focus:border-sky-400 focus:bg-white"
                    />
                    <span className="text-xs text-gray-500">%</span>
                    <button
                      onClick={() => removeAllocation(a.instrumentId)}
                      className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none"
                      title="Quitar"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Add instruments (full width) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
          Agregar activos
        </p>

        {/* Tabs */}
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-4">
          <button
            onClick={() => setTab("local")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "local" ? "bg-white text-sky-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Locales ({unusedLocal.length})
          </button>
          <button
            onClick={() => setTab("dinari")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === "dinari" ? "bg-white text-sky-600 shadow-sm" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Stocks ({dinariStocks.filter((s) => s.is_tradable).length})
          </button>
        </div>

        {tab === "dinari" && (
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o símbolo..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 placeholder-gray-400 outline-none focus:border-sky-400 focus:bg-white transition-colors mb-4 text-sm"
          />
        )}

        <div className="max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tab === "local" &&
            unusedLocal.map((inst) => (
              <button
                key={inst.id}
                onClick={() => addLocalInstrument(inst)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-gray-50 transition-colors w-full border border-transparent hover:border-gray-200"
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: inst.color ?? "#94a3b8" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 truncate">{inst.name}</p>
                  <p className="text-xs text-gray-500">{inst.ticker}</p>
                </div>
                <span className="text-xs text-sky-500 font-medium">+ Agregar</span>
              </button>
            ))}

          {tab === "local" && unusedLocal.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 col-span-full">Todos los instrumentos locales ya están en la cartera.</p>
          )}

          {tab === "dinari" &&
            filteredDinari.slice(0, 50).map((stock) => {
              const alreadyAdded = allocations.some(
                (a) => a.instrumentId === `dinari_${stock.symbol}` || a.ticker === stock.symbol
              );
              return (
                <button
                  key={stock.id}
                  onClick={() => !alreadyAdded && addDinariStock(stock)}
                  disabled={alreadyAdded}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left w-full transition-colors border border-transparent ${
                    alreadyAdded ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  {stock.logo_url ? (
                    <img src={stock.logo_url} alt="" className="w-6 h-6 rounded-full bg-gray-100 shrink-0" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-sky-50 shrink-0 flex items-center justify-center text-xs text-sky-600 font-bold">
                      {stock.symbol.charAt(0)}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{stock.display_name ?? stock.name}</p>
                    <p className="text-xs text-gray-500">{stock.symbol}</p>
                  </div>
                  <span className="text-xs text-sky-500 font-medium">
                    {alreadyAdded ? "Agregado" : "+ Agregar"}
                  </span>
                </button>
              );
            })}

          {tab === "dinari" && filteredDinari.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4 col-span-full">
              {searchQuery ? "Sin resultados para la búsqueda." : "No hay stocks disponibles."}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
