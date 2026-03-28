import rawInstruments from "@/data/instruments.json";
import type { Instrument, AssetCategory } from "./types";
import type { InstrumentRow } from "./supabase/types";

interface RawInstrument {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: string;
  returns: { oneMonth: number; threeMonths: number; oneYear: number };
  volatility: number;
  color: string;
}

const instruments: Instrument[] = (rawInstruments as RawInstrument[]).map((raw) => ({
  id: raw.id,
  name: raw.name,
  ticker: null,
  category: raw.category as Instrument["category"],
  riskLevel: raw.riskLevel as Instrument["riskLevel"],
  returns: raw.returns,
  volatility: raw.volatility,
  isActive: true,
  color: raw.color,
}));

const runtimeRegistry: Map<string, Instrument> = new Map();

/**
 * Register extra instruments so `getInstrumentById` can resolve them
 * (used by the portfolio editor to feed DB / Dinari instruments into
 * the client-side fit-score engine).
 */
export function registerInstruments(extra: Instrument[]) {
  for (const inst of extra) {
    runtimeRegistry.set(inst.id, inst);
  }
}

// ─── Static JSON accessors (fallback / fit-score engine) ─────────────────

export function getAllInstruments(): Instrument[] {
  return instruments;
}

export function getInstrumentById(id: string): Instrument | undefined {
  return instruments.find((i) => i.id === id) ?? runtimeRegistry.get(id);
}

export function getInstrumentsByCategory(category: AssetCategory): Instrument[] {
  return instruments.filter((i) => i.category === category);
}

// ─── Weighted metrics ────────────────────────────────────────────────────

export function computeWeightedReturn(
  allocations: { instrumentId: string; percentage: number }[],
  period: "oneMonth" | "threeMonths" | "oneYear"
): number {
  return allocations.reduce((total, alloc) => {
    const instrument = getInstrumentById(alloc.instrumentId);
    if (!instrument) return total;
    return total + instrument.returns[period] * (alloc.percentage / 100);
  }, 0);
}

export function computeWeightedVolatility(
  allocations: { instrumentId: string; percentage: number }[]
): number {
  return allocations.reduce((total, alloc) => {
    const instrument = getInstrumentById(alloc.instrumentId);
    if (!instrument) return total;
    return total + instrument.volatility * (alloc.percentage / 100);
  }, 0);
}

// ─── Supabase row → domain Instrument ────────────────────────────────────

const CATEGORY_COLORS: Record<AssetCategory, string> = {
  renta_fija: "#55c5ff",
  renta_variable: "#f6c453",
  dolar: "#5fe3a1",
  mixto: "#a78bfa",
  commodities: "#f87171",
};

export function instrumentRowToDomain(row: InstrumentRow): Instrument {
  return {
    id: row.id,
    name: row.name,
    ticker: row.ticker,
    category: row.category,
    riskLevel: row.risk_level,
    returns: {
      oneMonth: Number(row.return_1m),
      threeMonths: Number(row.return_3m),
      oneYear: Number(row.return_1y),
    },
    volatility: Number(row.volatility),
    isActive: row.is_active,
    color: CATEGORY_COLORS[row.category],
  };
}
