"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const BANKS = [
  { id: "nacion", name: "Banco Nación", color: "#1a6b3c" },
  { id: "credicoop", name: "Credicoop", color: "#c41e3a" },
  { id: "ciudad", name: "Ciudad", color: "#0054a6" },
  { id: "galicia", name: "Galicia", color: "#e85d04" },
  { id: "brubank", name: "Brubank", color: "#6c3ae0" },
  { id: "bpn", name: "BPN", color: "#006341" },
  { id: "comafi", name: "Comafi", color: "#003366" },
  { id: "bica", name: "Banco Bica", color: "#d32f2f" },
  { id: "piano", name: "Banco Piano", color: "#8b0000" },
  { id: "corrientes", name: "Banco Corrientes", color: "#1565c0" },
  { id: "mariva", name: "Banco Mariva", color: "#37474f" },
  { id: "dino", name: "Banco Dino", color: "#e53935" },
  { id: "municipal", name: "Banco Municipal", color: "#c62828" },
  { id: "bbva", name: "BBVA", color: "#004481" },
  { id: "santander", name: "Santander", color: "#ec0000" },
  { id: "hsbc", name: "HSBC", color: "#db0011" },
  { id: "macro", name: "Banco Macro", color: "#003399" },
  { id: "supervielle", name: "Supervielle", color: "#009cda" },
  { id: "icbc", name: "ICBC", color: "#c41230" },
  { id: "patagonia", name: "Banco Patagonia", color: "#00529b" },
];

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quincenal" },
  { value: "monthly", label: "Mensual" },
];

interface DebitSetupFormProps {
  connectedBank: string | null;
  currentAmount: number | null;
  currentFrequency: string | null;
  currentNextDate: string | null;
}

export function DebitSetupForm({
  connectedBank,
  currentAmount,
  currentFrequency,
  currentNextDate,
}: DebitSetupFormProps) {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState(connectedBank ?? "");
  const [amount, setAmount] = useState(currentAmount ?? 10000);
  const [frequency, setFrequency] = useState(currentFrequency ?? "monthly");
  const [startDate, setStartDate] = useState(
    currentNextDate ?? new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"bank" | "config">(connectedBank ? "config" : "bank");

  async function handleSelectBank(bankId: string) {
    setSelectedBank(bankId);
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/bank/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bank: bankId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al conectar banco");
        setSaving(false);
        return;
      }
      setStep("config");
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveDebit() {
    if (!amount || amount <= 0) {
      setError("Ingresá un monto válido");
      return;
    }
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/debit/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, frequency, startDate }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Error al configurar débito");
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

  const bankInfo = BANKS.find((b) => b.id === selectedBank);

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Débito automático</h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === "bank"
              ? "Seleccioná tu banco para asociar tu cuenta"
              : "Configurá el monto, frecuencia y fecha de inicio"}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          Volver
        </Link>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
          step === "bank" ? "bg-sky-50 text-sky-700 border border-sky-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            step === "bank" ? "bg-sky-500" : "bg-emerald-500"
          }`}>
            {step === "bank" ? "1" : "✓"}
          </span>
          Banco
        </div>
        <div className="w-8 h-px bg-gray-200" />
        <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium ${
          step === "config" ? "bg-sky-50 text-sky-700 border border-sky-200" : "bg-gray-50 text-gray-400 border border-gray-200"
        }`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white ${
            step === "config" ? "bg-sky-500" : "bg-gray-300"
          }`}>
            2
          </span>
          Configurar
        </div>
      </div>

      {/* STEP 1: Bank selection */}
      {step === "bank" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-5">
            Conectá tu banco
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {BANKS.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleSelectBank(bank.id)}
                disabled={saving}
                className={`flex flex-col items-center gap-2.5 rounded-2xl border p-4 transition-all hover:shadow-md ${
                  selectedBank === bank.id
                    ? "border-sky-400 bg-sky-50 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                } disabled:opacity-50`}
              >
                <span
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: bank.color }}
                >
                  {bank.name.charAt(0)}
                </span>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">
                  {bank.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Debit config */}
      {step === "config" && (
        <div className="flex flex-col gap-6">
          {/* Connected bank */}
          {bankInfo && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-4">
              <span
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: bankInfo.color }}
              >
                {bankInfo.name.charAt(0)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-emerald-800">{bankInfo.name}</p>
                <p className="text-xs text-emerald-600">Banco conectado</p>
              </div>
              <button
                onClick={() => setStep("bank")}
                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium underline"
              >
                Cambiar
              </button>
            </div>
          )}

          {/* Amount */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
              Configuración del débito
            </p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Monto por débito
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-8 pr-4 py-3 text-gray-900 text-lg font-semibold outline-none focus:border-sky-400 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Frecuencia
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFrequency(opt.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                        frequency === opt.value
                          ? "border-sky-400 bg-sky-50 text-sky-700"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fecha del primer débito
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none focus:border-sky-400 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm text-gray-700">
              Se debitarán <span className="font-bold text-gray-900">${amount.toLocaleString("es-AR")}</span>{" "}
              de forma <span className="font-bold text-gray-900">{FREQUENCY_OPTIONS.find((o) => o.value === frequency)?.label.toLowerCase()}</span>{" "}
              desde tu cuenta en <span className="font-bold text-gray-900">{bankInfo?.name ?? "tu banco"}</span>,
              comenzando el <span className="font-bold text-gray-900">{new Date(startDate + "T12:00:00").toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}</span>.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleSaveDebit}
            disabled={saving || !selectedBank}
            className="w-full rounded-xl bg-sky-500 px-6 py-3 text-base font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Guardando..." : "Activar débito automático"}
          </button>
        </div>
      )}

      {error && step === "bank" && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
    </main>
  );
}
