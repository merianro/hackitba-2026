// ─── Investor Profile ──────────────────────────────────────────────────────

export type Experience = "none" | "basic" | "intermediate" | "advanced";

export type InvestmentGoal =
  | "short_term"
  | "inflation"
  | "growth"
  | "retirement"
  | "other";

export type TimeHorizon = "less_1y" | "1_to_3y" | "more_3y";

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export type ContributionRule = "percentage" | "fixed";

export type ContributionFrequency = "weekly" | "biweekly" | "monthly";

export interface InvestorProfile {
  experience: Experience;
  goal: InvestmentGoal;
  horizon: TimeHorizon;
  riskTolerance: RiskTolerance;
}

// ─── Instruments ───────────────────────────────────────────────────────────

export type AssetCategory =
  | "renta_fija"
  | "renta_variable"
  | "dolar"
  | "mixto"
  | "commodities";

export type RiskLevel = "low" | "medium" | "high";

export interface Instrument {
  id: string;
  name: string;
  ticker: string | null;
  category: AssetCategory;
  riskLevel: RiskLevel;
  returns: {
    oneMonth: number;
    threeMonths: number;
    oneYear: number;
  };
  volatility: number;
  isActive: boolean;
  color?: string;
}

// ─── Portfolio ──────────────────────────────────────────────────────────────

export interface AllocationItem {
  instrumentId: string;
  percentage: number;
}

export interface Portfolio {
  allocations: AllocationItem[];
  source: "suggested" | "custom";
}

// ─── Fit Score ─────────────────────────────────────────────────────────────

export interface FitScoreBreakdown {
  riskAlignment: number;
  goalCoherence: number;
  diversification: number;
  historicalConsistency: number;
  temporalCoherence: number;
}

export type FitLabel =
  | "Muy alineado"
  | "Alineado"
  | "Moderadamente fuera de perfil"
  | "Fuera de perfil";

export interface FitScoreResult {
  score: number;
  label: FitLabel;
  breakdown: FitScoreBreakdown;
}

// ─── AI ────────────────────────────────────────────────────────────────────

export interface PortfolioInsight {
  type: "warning" | "info" | "positive";
  message: string;
}

export interface WhatIfScenario {
  id: string;
  label: string;
  description: string;
  impact: {
    returnOneYear: number;
    volatility: number;
    fitScoreDelta: number;
  };
  narrative: string;
}
