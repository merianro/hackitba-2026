import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-sm text-sky-400 mb-8">
        <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        HackITBA 2026 · Smart Finance
      </div>

      {/* Hero */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white max-w-3xl leading-tight tracking-tight mb-6">
        Armá tu{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
          cartera inteligente
        </span>
      </h1>

      <p className="text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
        Te perfilamos, sugerimos una cartera, te dejamos personalizarla y te
        explicamos todo con IA — en menos de 5 minutos.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-colors"
        >
          Empezar ahora
          <span aria-hidden>→</span>
        </Link>
        <p className="text-sm text-slate-600">
          Sin registro · Sin dinero real
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mt-16 max-w-2xl">
        {[
          { icon: "🎯", label: "Perfilado inteligente" },
          { icon: "📊", label: "Cartera sugerida" },
          { icon: "⚡", label: "Fit Score en tiempo real" },
          { icon: "🔬", label: "Portfolio Doctor AI" },
          { icon: "🧪", label: "Simulador What-if" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
