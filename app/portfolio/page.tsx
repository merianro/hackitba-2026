"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  InvestorProfile,
  Portfolio,
  FitScoreResult,
  Instrument,
} from "@/lib/types";
import { storage } from "@/lib/storage";
import { getAllInstruments } from "@/lib/market-data";
import { suggestPortfolio } from "@/lib/portfolio-engine";
import { profileSummary } from "@/lib/profile-engine";
import { PortfolioBuilder } from "@/components/portfolio/PortfolioBuilder";
import { PortfolioDoctor } from "@/components/portfolio/PortfolioDoctor";
import { WhatIfSimulator } from "@/components/portfolio/WhatIfSimulator";
import { PortfolioConfirmation } from "@/components/portfolio/PortfolioConfirmation";
import Link from "next/link";

type Stage = "builder" | "confirmed";

export default function PortfolioPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [suggested, setSuggested] = useState<Portfolio | null>(null);
  const [confirmedPortfolio, setConfirmedPortfolio] = useState<Portfolio | null>(null);
  const [confirmedScore, setConfirmedScore] = useState<FitScoreResult | null>(null);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [stage, setStage] = useState<Stage>("builder");

  useEffect(() => {
    const p = storage.loadProfile();
    if (!p) {
      router.push("/onboarding");
      return;
    }
    setProfile(p);
    const instr = getAllInstruments();
    setInstruments(instr);
    const sugg = suggestPortfolio(p);
    setSuggested(sugg);
    storage.savePortfolio(sugg);
  }, [router]);

  const handleConfirm = (
    allocations: { instrumentId: string; percentage: number }[],
    fitScore: FitScoreResult
  ) => {
    const portfolio: Portfolio = { allocations, source: "custom" };
    storage.savePortfolio(portfolio);
    storage.saveFitScore(fitScore);
    setConfirmedPortfolio(portfolio);
    setConfirmedScore(fitScore);
    setStage("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    storage.clearAll();
    router.push("/");
  };

  if (!profile || !suggested) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm">Armando tu cartera...</p>
        </div>
      </div>
    );
  }

  if (stage === "confirmed" && confirmedPortfolio && confirmedScore) {
    return (
      <div className="min-h-screen px-4 py-12">
        <PortfolioConfirmation
          profile={profile}
          allocations={confirmedPortfolio.allocations}
          fitScore={confirmedScore}
          instruments={instruments}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                ← Inicio
              </Link>
            </div>
            <h1 className="text-2xl font-black text-white">Tu cartera personalizada</h1>
            <p className="text-slate-400 text-sm mt-1">{profileSummary(profile)}</p>
          </div>
        </div>

        {/* Builder */}
        <PortfolioBuilder
          initialAllocations={suggested.allocations}
          instruments={instruments}
          profile={profile}
          onConfirm={handleConfirm}
        />

        {/* Doctor + What-if — solo cuando hay score ya calculado */}
        <DoctorAndSimulatorSection
          profile={profile}
          suggested={suggested}
          instruments={instruments}
        />
      </div>
    </div>
  );
}

function DoctorAndSimulatorSection({
  profile,
  suggested,
  instruments: _instruments,
}: {
  profile: InvestorProfile;
  suggested: Portfolio;
  instruments: Instrument[];
}) {
  const [fitScore, setFitScore] = useState<FitScoreResult | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (fetched) return;
    setFetched(true);
    fetch("/api/portfolio/fit-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile,
        allocations: suggested.allocations,
      }),
    })
      .then((r) => r.json())
      .then((data) => setFitScore(data as FitScoreResult))
      .catch(console.error);
  }, [profile, suggested.allocations, fetched]);

  if (!fitScore) {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <PortfolioDoctor
        profile={profile}
        allocations={suggested.allocations}
        fitScore={fitScore}
      />
      <WhatIfSimulator
        profile={profile}
        allocations={suggested.allocations}
        fitScore={fitScore}
      />
    </div>
  );
}
