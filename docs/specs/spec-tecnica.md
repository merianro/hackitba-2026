# Especificacion Tecnica
**Proyecto:** HackITBA 2026
**Version:** 0.1 (iteracion inicial)
**Ultima actualizacion:** 2026-03-28

---

## 1. Objetivo

Este documento describe la arquitectura, componentes, decisiones tecnicas y alcance de implementacion del MVP. Esta pensado para guiar el desarrollo durante el hackathon y ser iterable a medida que el proyecto evoluciona.

---

## 2. Arquitectura general

El sistema se divide en tres capas:

```
Frontend (SPA)
    |
    v
Backend API (REST)
    |
    v
Servicios externos: AI (LLM) + Datos financieros
```

### Principios de diseno

- Cada modulo tiene una sola responsabilidad clara.
- La comunicacion entre capas es a traves de interfaces bien definidas.
- El MVP prioriza estabilidad y flujo completo sobre features adicionales.
- El sistema debe poder ejecutarse con un solo comando o estar deployado.

---

## 3. Frontend

### Stack

- Framework: React (con Vite como bundler).
- Lenguaje: TypeScript.
- Estilos: Tailwind CSS.
- Graficos e interactividad: Recharts o similar para visualizacion de composicion y simulaciones.
- Estado global: Zustand o React Context segun complejidad.
- Routing: React Router.

### Modulos principales

| Modulo | Responsabilidad |
|--------|----------------|
| `Onboarding` | Cuestionario paso a paso para capturar perfil del inversor. |
| `ProfileSummary` | Muestra el perfil resultante del onboarding. |
| `SuggestedPortfolio` | Presenta la cartera recomendada con metricas de rentabilidad y riesgo. |
| `PortfolioBuilder` | Constructor interactivo con sliders, distribucion en tiempo real y validacion. |
| `FitScoreWidget` | Componente siempre visible que muestra el Portfolio Fit Score actual. |
| `PortfolioDoctor` | Panel lateral o inline con los insights generados por AI. |
| `WhatIfSimulator` | Interfaz para explorar escenarios alternativos y ver impacto. |
| `PortfolioConfirmation` | Resumen final antes de guardar la cartera. |

### Consideraciones de UX

- El flujo principal es lineal y guiado: onboarding → cartera sugerida → builder → confirmacion.
- El Portfolio Fit Score debe estar siempre visible durante el builder, no solo en pantalla de resultado.
- Los insights del Portfolio Doctor deben mostrarse en lenguaje simple, sin jerga financiera.
- Todos los estados de carga deben tener feedback visual.

---

## 4. Backend

### Stack

- Runtime: Node.js con TypeScript.
- Framework: Express o Fastify.
- Base de datos: PostgreSQL (para usuarios, perfiles y carteras guardadas).
- ORM: Prisma.
- Autenticacion: JWT con refresh token.

### Modulos principales

| Modulo | Responsabilidad |
|--------|----------------|
| `auth` | Registro, login, gestion de sesion. |
| `profile` | Creacion y lectura del perfil de inversor del usuario. |
| `portfolio` | CRUD de carteras, logica de composicion y validacion. |
| `fit-score` | Calculo del Portfolio Fit Score en base a perfil y composicion. |
| `market-data` | Integracion con fuente de datos financieros externos para rentabilidad historica. |
| `ai-insights` | Comunicacion con LLM para generacion de insights del Portfolio Doctor y simulaciones. |

### Endpoints principales

```
POST   /auth/register
POST   /auth/login

GET    /profile
POST   /profile

GET    /portfolio/suggested          # Cartera sugerida segun perfil
POST   /portfolio                    # Guardar cartera personalizada
GET    /portfolio/:id

POST   /portfolio/fit-score          # Calcula score para una composicion dada
POST   /portfolio/insights           # Genera insights del Portfolio Doctor
POST   /portfolio/simulate           # Simula escenario what-if
```

---

## 5. Motor de Portfolio Fit Score

El score se calcula en el backend a partir de las siguientes dimensiones:

| Dimension | Descripcion | Peso tentativo |
|-----------|-------------|----------------|
| Alineacion de riesgo | Compatibilidad entre composicion y tolerancia al riesgo declarada. | 30% |
| Coherencia con objetivo | Si la cartera sirve para el objetivo definido (corto, mediano, largo plazo). | 25% |
| Diversificacion | Distribucion entre categorias de activos. Penaliza concentracion excesiva. | 20% |
| Consistencia historica | Volatilidad y rendimiento historico de los activos incluidos. | 15% |
| Coherencia temporal | Si el perfil de riesgo es apropiado para el horizonte declarado. | 10% |

El score resultante va de 0 a 100. Se mapea a una etiqueta:

| Rango | Etiqueta |
|-------|----------|
| 85-100 | Muy alineado |
| 65-84 | Alineado |
| 45-64 | Moderadamente fuera de perfil |
| 0-44 | Fuera de perfil |

---

## 6. Integracion con AI

### Proposito

La AI actua como capa de explicacion y alerta, no como motor de decision. El sistema calcula los datos; la AI los traduce a lenguaje simple y genera recomendaciones accionables.

### Modelo

- LLM via API: OpenAI GPT-4o o similar.
- Las llamadas a AI son bajo demanda (no en tiempo real con cada keypress).
- Se llama a AI al:
  - Confirmar una composicion en el builder para generar insights.
  - Ejecutar una simulacion what-if.

### Prompt design

Los prompts incluyen siempre:

- Perfil del usuario (objetivo, horizonte, tolerancia al riesgo, experiencia).
- Composicion actual de la cartera en porcentajes.
- Datos de rentabilidad y volatilidad historica de cada instrumento.
- Portfolio Fit Score calculado.
- Instruccion de responder en lenguaje simple, sin jerga tecnica.

### Restricciones

- La AI no da consejos de compra/venta de activos especificos.
- La AI no simula retornos futuros como garantia.
- Toda respuesta incluye disclaimer: "Esta informacion es orientativa y no constituye asesoramiento financiero regulado."

---

## 7. Datos financieros

### Estrategia para el MVP

Para el hackathon, los datos de rentabilidad historica pueden venir de:

1. Dataset estatico curado manualmente (fondos comunes argentinos o ETFs conocidos).
2. API publica de datos financieros (Alpha Vantage, Yahoo Finance unofficial, Polygon.io o similar).

La capa `market-data` abstrae el origen del dato para que sea intercambiable sin afectar el resto del sistema.

### Estructura de un instrumento

```typescript
type Instrument = {
  id: string;
  name: string;
  category: 'renta_fija' | 'renta_variable' | 'dolar' | 'mixto' | 'commodities';
  riskLevel: 'low' | 'medium' | 'high';
  returns: {
    oneMonth: number;   // porcentaje
    threeMonths: number;
    oneYear: number;
  };
  volatility: number;  // desviacion estandar historica
};
```

---

## 8. Base de datos

### Entidades principales

```
User
  id, email, passwordHash, createdAt

InvestorProfile
  id, userId, experience, goal, horizon, riskTolerance, monthlyContribution, createdAt

Portfolio
  id, userId, name, composition (JSON), fitScore, status (draft | active), createdAt, updatedAt

PortfolioComposition
  portfolioId, instrumentId, percentage
```

---

## 9. Infraestructura y deployment

### Para el MVP

- Frontend: Vercel o Netlify (deploy con un push).
- Backend: Railway, Render o similar (deploy automatico desde main/master).
- Base de datos: PostgreSQL en Railway o Supabase.
- Variables de entorno: `.env` local + secrets en la plataforma de deploy.

### Ejecucion local

El sistema debe poder levantarse con un solo comando:

```bash
docker-compose up
```

O alternativamente con instrucciones claras de dos pasos: instalar dependencias + correr scripts de desarrollo.

---

## 10. Gestion de ramas

El proyecto sigue Gitflow. Ver `.cursor/rules/gitflow.mdc` para el flujo completo.

Ramas activas:

| Rama | Proposito |
|------|-----------|
| `master` | Produccion |
| `develop` | Integracion continua |
| `feature/*` | Features en desarrollo paralelo |

---

## 11. Decisiones tecnicas tomadas

| Decision | Razon |
|----------|-------|
| No ejecutar inversiones reales en el MVP | Evita complejidad regulatoria y reduce scope a lo demostrable. |
| Score calculado en backend, no en frontend | Permite futuro cacheo, auditoria y consistencia entre plataformas. |
| AI bajo demanda, no en tiempo real | Reduce costos de API y evita llamadas innecesarias durante la edicion. |
| Dataset curado para datos financieros en MVP | Elimina dependencia de APIs externas con rate limits o autenticacion compleja. |
| Terminologia: cartera personalizada, no fondo | Evita implicaciones regulatorias del termino fondo de inversion. |

---

## 12. Pendientes para definir antes de implementar

- Stack definitivo de frontend (confirmar si React o Next.js).
- Fuente de datos financieros para el MVP (dataset estatico vs API).
- Proveedor de LLM (OpenAI, Anthropic, Gemini u otro).
- Plataforma de deployment (Vercel + Railway vs alternativas).
- Instrumentos o categorias de activos que se incluyen en la primera version.
