# Smart Portfolio Builder — HackITBA 2026

Plataforma de smart finance que ayuda al inversor retail a armar, personalizar y validar una cartera de inversión personalizada, con insights generados por IA. Incluye dashboard web (Next.js) y flujos conversacionales en WhatsApp (n8n).

## Flujo de la app

```
Landing / Login → Dashboard (cartera, Fit Score, Doctor) → Editor de cartera → Débito automático (mock)
```


## Usar la app en el deploy (hackitba-2026.vercel.app)

1. Ir a [hackitba-2026.vercel.app](https://hackitba-2026.vercel.app)
2. demo@hackitba.com / demo123
3. Alli se puede visualizar el portfolio de la cuenta demo, y editarlo.
4. Se puede agregar stocks de Dinari, y guardar el portfolio.
5. Se puede configurar el debito automatico.
6. Se puede ver el historial de aportes.
7. Se puede ver el fit score.
8. Se puede ver los insights.
9. Se puede ver el dashboard.
10. Se puede ver el login.
11. Se puede ver el editor de cartera.
12. Se puede ver el debito automatico.


## Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **Estilos**: Tailwind CSS v4
- **Gráficos**: Recharts
- **Base de datos**: Supabase (PostgreSQL)
- **IA**: OpenAI (opcional; hay fallbacks determinísticos)
- **Stocks**: Dinari Enterprise API (sandbox, opcional)
- **Orquestación WhatsApp**: n8n (workflows en `/n8n`)
- **Deploy**: Vercel

---










## Clonar y correr en local

### Requisitos previos

- **Node.js** 20 o superior (recomendado para Next.js 16)
- **npm** (viene con Node)
- Cuenta de **Supabase** con un proyecto creado (las migraciones viven en `supabase/migrations/`)

### 1. Clonar el repositorio

```bash
git clone https://github.com/merianro/hackitba-2026.git
cd hackitba-2026
```

Si trabajás con Gitflow, creá tu rama desde `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/tu-feature
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Editá `.env.local` y completá al menos:

| Variable | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (solo servidor; no exponer al cliente) |

Opcionales según lo que quieras probar:

| Variable | Uso |
|----------|-----|
| `OPENAI_API_KEY` | Insights y narrativas con modelo real |
| `INTERNAL_API_KEY` | Protege rutas `/api/*` llamadas desde n8n (`x-api-key`) |
| `DINARI_API_KEY_ID` / `DINARI_API_SECRET_KEY` | Búsqueda de stocks en el editor de cartera |

Los placeholders y comentarios están en `.env.example`.

### 4. Base de datos (Supabase)

Aplicá las migraciones SQL del repo al proyecto Supabase (SQL Editor o CLI de Supabase, en orden):

- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_mock_auth.sql`
- `supabase/migrations/003_connected_bank.sql`
- `supabase/migrations/004_onboarding_profile.sql`

Opcional: cargá datos de demo con `supabase/seed.sql` si lo usás en tu entorno.

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

**Usuario demo** (mock auth, ver seed): `demo@hackitba.com` / `demo123`.

### Comandos útiles

```bash
npm run dev      # Desarrollo
npm run build    # Build de producción
npm run start    # Servidor tras build
npm run lint     # ESLint
```

---

## Deploy en Vercel

Conectá el repo a Vercel o usá la CLI:

```bash
npx vercel
```

Configurá en el dashboard de Vercel las mismas variables que en `.env.local` (especialmente Supabase y, si aplica, `INTERNAL_API_KEY`, Dinari y OpenAI).

---

## Features del MVP (resumen)

| Área | Contenido |
|------|-----------|
| Web | Login mock, dashboard, editor de cartera, Fit Score, insights, Dinari (sandbox), débito y banco (mock) |
| API | Rutas REST bajo `app/api/` (perfil, portfolio, market-data, etc.) |
| WhatsApp | Workflows exportados en `n8n/` (Receive Message, Orquestador, On Boarding, Send Message, etc.) |

---

## Estructura (orientativa)

```
app/                 App Router: páginas y API routes
components/          UI del dashboard y portfolio
lib/                 Supabase, auth interna, Dinari, fit score, etc.
supabase/migrations/ Esquema y cambios SQL
n8n/                 JSON de workflows n8n (importar en la instancia)
docs/specs/          Spec funcional y técnica
```

---

## Ramas (Gitflow)

Ver `.cursor/rules/gitflow.mdc`.

| Rama | Propósito |
|------|-----------|
| `master` | Producción |
| `develop` | Integración |
| `feature/*` | Desarrollo de features |

Repositorio: `github.com/merianro/hackitba-2026`
