# Smart Portfolio Builder — HackITBA 2026

Plataforma de smart finance que ayuda al inversor retail a armar, personalizar y validar una cartera de inversión personalizada, con insights generados por IA.

## Flujo de la app

```
Landing → Onboarding (perfilado) → Portfolio Builder → Portfolio Doctor / What-if → Confirmación
```

## Stack

- **Framework**: Next.js 15 (App Router, full-stack)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS v4
- **Gráficos**: Recharts
- **IA**: OpenAI GPT-4o mini (con fallback determinístico sin key)
- **Deploy**: Vercel

## Setup local

```bash
# 1. Clonar e instalar
npm install

# 2. Variables de entorno (la IA es opcional)
cp .env.example .env.local
# Si querés insights con AI real, agregá OPENAI_API_KEY=sk-...

# 3. Levantar en dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

```bash
# Con Vercel CLI
npx vercel

# O push al repo conectado a Vercel (deploy automático)
git push origin feature/vercel-mvp-demo
```

Variables de entorno a setear en Vercel:

| Variable | Requerida | Descripción |
|---|---|---|
| `OPENAI_API_KEY` | No | Habilita AI real. Sin ella usa fallback determinístico. |

## Features del MVP

| Feature | Estado |
|---|---|
| Onboarding y perfilado (6 pasos) | ✅ |
| Cartera sugerida por perfil | ✅ |
| Portfolio Builder interactivo con sliders | ✅ |
| Portfolio Fit Score en tiempo real | ✅ |
| Portfolio Doctor con insights AI + fallback | ✅ |
| AI What-if Simulator (3 escenarios guiados) | ✅ |
| Confirmación con resumen y disclaimer | ✅ |
| Persistencia local (localStorage) | ✅ |
| Auth / DB real | Roadmap |
| Integración bancaria real | Roadmap |

## Estructura

```
app/
  page.tsx              Landing
  onboarding/page.tsx   Cuestionario de perfilado
  portfolio/page.tsx    Builder + Doctor + What-if + Confirmación
  api/portfolio/        Endpoints fit-score, insights, simulate
components/
  onboarding/           OnboardingFlow
  portfolio/            Builder, FitScoreWidget, Doctor, WhatIf, Confirmation
  ui/                   Button, Card, Badge
lib/
  types.ts              Tipos del dominio
  constants.ts          Labels y pesos
  fit-score.ts          Motor del Fit Score
  portfolio-engine.ts   Lógica de cartera sugerida
  profile-engine.ts     Derivación de perfil
  market-data.ts        Lectura del dataset financiero
  storage.ts            Persistencia en localStorage
  ai/                   Cliente OpenAI y constructores de prompts
data/
  instruments.json      Dataset estático de 8 instrumentos argentinos
```

## Ramas

Este proyecto sigue Gitflow. Ver `.cursor/rules/gitflow.mdc`.

| Rama | Propósito |
|---|---|
| `master` | Producción |
| `develop` | Integración |
| `feature/vercel-mvp-demo` | Esta feature |
