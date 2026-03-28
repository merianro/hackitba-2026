import rawInstruments from "@/data/instruments.json";
import type { Instrument, AssetCategory } from "./types";

const instruments: Instrument[] = rawInstruments as Instrument[];

export function getAllInstruments(): Instrument[] {
  return instruments;
}

export function getInstrumentById(id: string): Instrument | undefined {
  return instruments.find((i) => i.id === id);
}

export function getInstrumentsByCategory(category: AssetCategory): Instrument[] {
  return instruments.filter((i) => i.category === category);
}

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
