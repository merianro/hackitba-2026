// ─── Investor Profile ──────────────────────────────────────────────────────

export type Experience = "none" | "basic" | "intermediate" | "advanced";

export type InvestmentGoal =
  | "short_term_savings"
  | "inflation_protection"
  | "medium_term_growth"
  | "retirement"
  | "other";

export type TimeHorizon = "less_than_1yr" | "1_to_3yr" | "more_than_3yr";

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export type ContributionRule = "percentage" | "fixed";

export type ContributionFrequency = "weekly" | "biweekly" | "monthly";

export interface InvestorProfile {
  experience: Experience;
  goal: InvestmentGoal;
  horizon: TimeHorizon;
  riskTolerance: RiskTolerance;
  contributionRule: ContributionRule;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  bankConnected: boolean;
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
  description: string;
  category: AssetCategory;
  riskLevel: RiskLevel;
  returns: {
    oneMonth: number;   // percentage
    threeMonths: number;
    oneYear: number;
  };
  volatility: number;  // historical std dev (percentage)
  color: string;       // hex for chart
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
    returnOneYear: number;   // delta
    volatility: number;      // delta
    fitScoreDelta: number;
  };
  narrative: string;
}

// ─── Session ───────────────────────────────────────────────────────────────

export interface AppSession {
  profile: InvestorProfile | null;
  portfolio: Portfolio | null;
  fitScore: FitScoreResult | null;
}
