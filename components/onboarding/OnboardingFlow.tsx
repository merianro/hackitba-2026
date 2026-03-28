"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InvestorProfile } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

// ─── Step definitions ─────────────────────────────────────────────────────

type StepId =
  | "experience"
  | "goal"
  | "horizon"
  | "risk"
  | "contribution"
  | "bank";

const STEPS: StepId[] = [
  "experience",
  "goal",
  "horizon",
  "risk",
  "contribution",
  "bank",
];

const STEP_LABELS: Record<StepId, string> = {
  experience: "Experiencia",
  goal: "Objetivo",
  horizon: "Horizonte",
  risk: "Riesgo",
  contribution: "Aportes",
  bank: "Cuenta",
};

type Draft = Partial<InvestorProfile>;

// ─── Option card ──────────────────────────────────────────────────────────

function OptionCard({
  selected,
  onClick,
  title,
  subtitle,
  emoji,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  subtitle?: string;
  emoji?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left rounded-2xl border p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        selected
          ? "border-sky-500 bg-sky-500/15 ring-1 ring-sky-500/40"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        {emoji && (
          <span className="text-2xl" aria-hidden>
            {emoji}
          </span>
        )}
        <div>
          <p className="font-semibold text-white">{title}</p>
          {subtitle && (
            <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Individual steps ─────────────────────────────────────────────────────

function ExperienceStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const options: Array<{
    value: InvestorProfile["experience"];
    title: string;
    subtitle: string;
    emoji: string;
  }> = [
    {
      value: "none",
      title: "Nunca invertí",
      subtitle: "Sé que existe, pero no lo hice antes",
      emoji: "🌱",
    },
    {
      value: "basic",
      title: "Conozco los básicos",
      subtitle: "Entiendo qué es un plazo fijo o un bono",
      emoji: "📖",
    },
    {
      value: "intermediate",
      title: "Ya invertí alguna vez",
      subtitle: "Usé alguna plataforma o fondo de inversión",
      emoji: "📈",
    },
    {
      value: "advanced",
      title: "Invierto regularmente",
      subtitle: "Tengo cartera activa y la sigo de cerca",
      emoji: "🚀",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((o) => (
        <OptionCard
          key={o.value}
          selected={draft.experience === o.value}
          onClick={() => setDraft({ ...draft, experience: o.value })}
          title={o.title}
          subtitle={o.subtitle}
          emoji={o.emoji}
        />
      ))}
    </div>
  );
}

function GoalStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const options: Array<{
    value: InvestorProfile["goal"];
    title: string;
    subtitle: string;
    emoji: string;
  }> = [
    {
      value: "short_term_savings",
      title: "Ahorrar a corto plazo",
      subtitle: "Quiero tener plata disponible en menos de 1 año",
      emoji: "🏦",
    },
    {
      value: "inflation_protection",
      title: "Protegerme de la inflación",
      subtitle: "No quiero que mi dinero pierda valor",
      emoji: "🛡️",
    },
    {
      value: "medium_term_growth",
      title: "Hacer crecer mi dinero",
      subtitle: "Busco rendimiento en 1 a 3 años",
      emoji: "💹",
    },
    {
      value: "retirement",
      title: "Planificar mi jubilación",
      subtitle: "Inversion a largo plazo para el futuro",
      emoji: "🌅",
    },
    {
      value: "other",
      title: "Otro objetivo",
      subtitle: "Tengo una meta específica en mente",
      emoji: "🎯",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((o) => (
        <OptionCard
          key={o.value}
          selected={draft.goal === o.value}
          onClick={() => setDraft({ ...draft, goal: o.value })}
          title={o.title}
          subtitle={o.subtitle}
          emoji={o.emoji}
        />
      ))}
    </div>
  );
}

function HorizonStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const options: Array<{
    value: InvestorProfile["horizon"];
    title: string;
    subtitle: string;
    emoji: string;
  }> = [
    {
      value: "less_than_1yr",
      title: "Menos de 1 año",
      subtitle: "Necesito el dinero pronto",
      emoji: "⚡",
    },
    {
      value: "1_to_3yr",
      title: "Entre 1 y 3 años",
      subtitle: "Tengo tiempo para dejar crecer",
      emoji: "🌿",
    },
    {
      value: "more_than_3yr",
      title: "Más de 3 años",
      subtitle: "Invierto a largo plazo sin necesitar el capital",
      emoji: "🏔️",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((o) => (
        <OptionCard
          key={o.value}
          selected={draft.horizon === o.value}
          onClick={() => setDraft({ ...draft, horizon: o.value })}
          title={o.title}
          subtitle={o.subtitle}
          emoji={o.emoji}
        />
      ))}
    </div>
  );
}

function RiskStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const options: Array<{
    value: InvestorProfile["riskTolerance"];
    title: string;
    subtitle: string;
    emoji: string;
  }> = [
    {
      value: "conservative",
      title: "Conservador",
      subtitle: "Prefiero estabilidad, aunque gane menos",
      emoji: "🛡️",
    },
    {
      value: "moderate",
      title: "Moderado",
      subtitle: "Acepto algo de volatilidad si hay mejor retorno",
      emoji: "⚖️",
    },
    {
      value: "aggressive",
      title: "Agresivo",
      subtitle: "Busco máximo crecimiento aunque fluctúe",
      emoji: "🔥",
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {options.map((o) => (
        <OptionCard
          key={o.value}
          selected={draft.riskTolerance === o.value}
          onClick={() => setDraft({ ...draft, riskTolerance: o.value })}
          title={o.title}
          subtitle={o.subtitle}
          emoji={o.emoji}
        />
      ))}
    </div>
  );
}

function ContributionStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const rule = draft.contributionRule ?? "fixed";
  const amount = draft.contributionAmount ?? 50000;
  const frequency = draft.contributionFrequency ?? "monthly";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-2">
          ¿Cómo preferís definir tu aporte?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <OptionCard
            selected={rule === "fixed"}
            onClick={() => setDraft({ ...draft, contributionRule: "fixed" })}
            title="Monto fijo"
            emoji="💰"
          />
          <OptionCard
            selected={rule === "percentage"}
            onClick={() =>
              setDraft({ ...draft, contributionRule: "percentage" })
            }
            title="% del ingreso"
            emoji="📊"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-400">
          {rule === "fixed"
            ? "Monto mensual (ARS)"
            : "Porcentaje del ingreso (%)"}
        </label>
        <input
          type="number"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          value={amount}
          min={rule === "fixed" ? 1000 : 1}
          max={rule === "percentage" ? 100 : undefined}
          placeholder={rule === "fixed" ? "50000" : "10"}
          onChange={(e) =>
            setDraft({ ...draft, contributionAmount: Number(e.target.value) })
          }
        />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-400 mb-2">Frecuencia</p>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { value: "weekly", label: "Semanal" },
              { value: "biweekly", label: "Quincenal" },
              { value: "monthly", label: "Mensual" },
            ] as const
          ).map((f) => (
            <OptionCard
              key={f.value}
              selected={frequency === f.value}
              onClick={() =>
                setDraft({ ...draft, contributionFrequency: f.value })
              }
              title={f.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function BankStep({
  draft,
  setDraft,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
}) {
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [bank, setBank] = useState("");

  const BANKS = [
    "Banco Nación",
    "Banco Galicia",
    "BBVA Argentina",
    "Santander",
    "Banco Macro",
    "Brubank",
    "Naranja X",
    "Mercado Pago",
  ];

  const handleSelectBank = (b: string) => {
    setBank(b);
    setStep("confirm");
  };

  const handleAuthorize = () => {
    setStep("done");
    setDraft({ ...draft, bankConnected: true });
  };

  if (step === "done") {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="text-5xl">✅</div>
        <p className="text-lg font-semibold text-white">{bank} conectado</p>
        <p className="text-slate-400 text-sm max-w-xs">
          Tu cuenta quedó vinculada para el débito automático de aportes.
          <br />
          <span className="text-xs mt-1 block text-slate-500">
            (Simulado — no se realiza ningún movimiento real)
          </span>
        </p>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <p className="text-lg font-bold text-white">{bank}</p>
          <p className="text-slate-400 text-sm mt-1">CBU: **** **** **** 1234</p>
          <p className="text-slate-400 text-sm">Cuenta: ••• Caja de Ahorro ARS</p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300">
          Esta vinculación es una simulación. No se realizarán débitos reales.
        </div>
        <Button onClick={handleAuthorize} size="lg" className="w-full">
          Autorizar débito automático
        </Button>
        <button
          className="text-sm text-slate-400 hover:text-white text-center"
          onClick={() => setStep("select")}
        >
          Elegir otro banco
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-400">
        Elegí el banco desde donde se debitarán tus aportes automáticos.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {BANKS.map((b) => (
          <OptionCard
            key={b}
            selected={false}
            onClick={() => handleSelectBank(b)}
            title={b}
          />
        ))}
      </div>
      <button
        className="text-sm text-slate-500 hover:text-white text-center mt-2"
        onClick={() => {
          setDraft({ ...draft, bankConnected: false });
        }}
      >
        Omitir por ahora
      </button>
    </div>
  );
}

// ─── Step content ─────────────────────────────────────────────────────────

const STEP_QUESTIONS: Record<StepId, string> = {
  experience: "¿Cuánta experiencia tenés invirtiendo?",
  goal: "¿Cuál es tu objetivo financiero principal?",
  horizon: "¿En cuánto tiempo pensás necesitar este dinero?",
  risk: "¿Qué tipo de inversor sos?",
  contribution: "¿Cómo vas a hacer tus aportes?",
  bank: "Conectá tu cuenta bancaria",
};

function isStepComplete(stepId: StepId, draft: Draft): boolean {
  switch (stepId) {
    case "experience":
      return Boolean(draft.experience);
    case "goal":
      return Boolean(draft.goal);
    case "horizon":
      return Boolean(draft.horizon);
    case "risk":
      return Boolean(draft.riskTolerance);
    case "contribution":
      return Boolean(draft.contributionAmount && draft.contributionFrequency && draft.contributionRule);
    case "bank":
      return draft.bankConnected !== undefined;
  }
}

// ─── Main flow ────────────────────────────────────────────────────────────

export function OnboardingFlow() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    contributionRule: "fixed",
    contributionAmount: 50000,
    contributionFrequency: "monthly",
  });

  const stepId = STEPS[currentIdx];
  const progress = ((currentIdx + 1) / STEPS.length) * 100;

  const handleNext = () => {
    if (currentIdx < STEPS.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      const profile: InvestorProfile = {
        experience: draft.experience ?? "none",
        goal: draft.goal ?? "medium_term_growth",
        horizon: draft.horizon ?? "1_to_3yr",
        riskTolerance: draft.riskTolerance ?? "moderate",
        contributionRule: draft.contributionRule ?? "fixed",
        contributionAmount: draft.contributionAmount ?? 50000,
        contributionFrequency: draft.contributionFrequency ?? "monthly",
        bankConnected: draft.bankConnected ?? false,
      };
      storage.saveProfile(profile);
      router.push("/portfolio");
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) setCurrentIdx((i) => i - 1);
  };

  const isLastStep = currentIdx === STEPS.length - 1;
  const canContinue = isStepComplete(stepId, draft);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-slate-500 mb-2">
            <span>
              Paso {currentIdx + 1} de {STEPS.length}
            </span>
            <span>{STEP_LABELS[stepId]}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={clsx(
                  "w-2 h-2 rounded-full transition-all",
                  i < currentIdx
                    ? "bg-sky-400"
                    : i === currentIdx
                    ? "bg-sky-500 scale-125"
                    : "bg-white/20"
                )}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 shadow-2xl shadow-black/40">
          <h2 className="text-xl font-bold text-white mb-6">
            {STEP_QUESTIONS[stepId]}
          </h2>

          {stepId === "experience" && (
            <ExperienceStep draft={draft} setDraft={setDraft} />
          )}
          {stepId === "goal" && (
            <GoalStep draft={draft} setDraft={setDraft} />
          )}
          {stepId === "horizon" && (
            <HorizonStep draft={draft} setDraft={setDraft} />
          )}
          {stepId === "risk" && (
            <RiskStep draft={draft} setDraft={setDraft} />
          )}
          {stepId === "contribution" && (
            <ContributionStep draft={draft} setDraft={setDraft} />
          )}
          {stepId === "bank" && (
            <BankStep draft={draft} setDraft={setDraft} />
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {currentIdx > 0 && (
              <Button variant="secondary" onClick={handleBack} className="flex-1">
                ← Atrás
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canContinue}
              className="flex-1"
              size="lg"
            >
              {isLastStep ? "Ver mi cartera →" : "Siguiente →"}
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Sin registro requerido · Demo de hackathon
        </p>
      </div>
    </div>
  );
}
