# Especificacion Funcional
**Proyecto:** HackITBA 2026
**Version:** 0.3
**Ultima actualizacion:** 2026-03-28

---

## 1. Vision del producto

Una plataforma de smart finance que ayuda al usuario retail a convertir la inversion en un habito sostenible, mediante una estrategia personalizada, automatizacion de aportes y validacion inteligente de su cartera.

El producto opera en dos canales complementarios:

- **WhatsApp**: canal principal de interaccion conversacional. El usuario hace onboarding, ajusta su cartera, recibe alertas y recomendaciones proactivas sin instalar ninguna app.
- **Dashboard web**: vista interactiva donde el usuario puede ver su cartera, editarla, conectar su banco y configurar el debito automatico.

El diferencial no es solo recomendar una cartera: es estar encima del cliente, hablar con el en su lenguaje, acompanarlo proactivamente y ayudarlo a sostener buenas decisiones de inversion de forma simple y consistente.

---

## 2. Problema que resuelve

Muchas personas quieren invertir, pero no logran sostener el habito en el tiempo.

El problema no es la falta de informacion, sino la falta de constancia. Las decisiones quedan libradas al recuerdo o al momento. Incluso cuando alguien entiende que deberia invertir, no tiene una forma simple de automatizar ese comportamiento y sostenerlo como parte de su rutina.

La solucion resuelve eso con:
- Un chatbot en WhatsApp que acompana al inversor: lo perfila, le sugiere una estrategia, le recuerda sus aportes, le avisa cuando su cartera se desalinea y le manda insights utiles.
- Un dashboard web donde puede ver su cartera visualmente, editarla con stocks reales (Dinari API), conectar su banco y configurar debito automatico.

---

## 3. Usuario objetivo

| Perfil | Descripcion |
|--------|-------------|
| Inversor nuevo | Quiere empezar a invertir pero no sabe como. Necesita una experiencia guiada, simple y que no le exija aprender una app nueva. WhatsApp baja toda la friccion. |
| Inversor con nocion | Ya tiene experiencia basica. Busca una estrategia alineada a su perfil, visibilidad sobre su cartera y automatizacion de aportes. |

Ambos perfiles comparten la necesidad de invertir con mayor constancia. WhatsApp es el canal comun que elimina la barrera de adopcion. El dashboard web complementa con visualizacion y control.

---

## 4. Canales del producto

| Canal | Rol |
|-------|-----|
| **WhatsApp** | Canal principal de interaccion conversacional. Onboarding, consultas, ajuste de cartera, confirmaciones, alertas y recomendaciones proactivas. |
| **Dashboard web** | Vista interactiva. Login con email/password, visualizacion del portfolio (grafico de torta, fit score, returns, insights, aportes), edicion de cartera con stocks de Dinari, conexion de banco y configuracion de debito automatico. |

---

## 5. Flujo principal (WhatsApp)

```mermaid
flowchart TD
    START([Usuario manda el primer mensaje]) --> CHECK_PROFILE{¿Tiene perfil\nde inversor?}

    CHECK_PROFILE -->|No| ONBOARDING[Onboarding conversacional\npreguntas naturales de a una]
    ONBOARDING --> SAVE_PROFILE[Guarda perfil del inversor]
    SAVE_PROFILE --> SUGGEST

    CHECK_PROFILE -->|Sí| CHECK_PORTFOLIO{¿Tiene portfolio\nactivo?}
    CHECK_PORTFOLIO -->|No| SUGGEST[Genera cartera sugerida]
    CHECK_PORTFOLIO -->|Sí| CONVERSATION[Conversación libre\nsobre su portfolio]

    SUGGEST --> SHOW[Muestra cartera\nFit Score + insight del Doctor]

    SHOW --> CHOICE{¿Acepta o\najusta?}
    CHOICE -->|Ajustar| ADJUST[Ajuste conversacional\nrecalcula score en tiempo real]
    ADJUST --> SHOW
    CHOICE -->|Aceptar| CONFIRM[Confirma cartera\ny configura aportes automáticos]
    CONFIRM --> ACTIVE([Portfolio activo guardado\nAportes programados])

    CONVERSATION --> WHATIF[What-if / consulta libre]
    CONVERSATION --> SHOW
```

### 5.1 Onboarding conversacional

El usuario inicia una conversacion con el bot. No hay formulario ni pasos forzados: el usuario habla libremente y el agente de IA extrae la informacion necesaria haciendo preguntas naturales de a una a la vez.

El agente captura:

- Experiencia previa en inversiones.
- Objetivo financiero (ahorro de corto plazo, proteccion contra inflacion, crecimiento, jubilacion u otro).
- Horizonte temporal.
- Tolerancia al riesgo (extraida del lenguaje, no de un formulario).
- Monto o porcentaje del ingreso para aportes.
- Frecuencia del aporte (semanal, quincenal, mensual).

### 5.2 Cartera sugerida

El agente genera una cartera inicial basada en el perfil y la presenta en el chat con:

- Composicion en porcentajes por tipo de activo.
- Rentabilidad historica (1 mes, 3 meses, 1 año).
- Nivel de riesgo.
- Portfolio Fit Score.
- Un insight breve del Portfolio Doctor.

### 5.3 Ajuste conversacional de cartera

Si el usuario quiere personalizar, lo hace hablando: "quiero menos dolar y mas renta fija", "saca las acciones", "pone mas en algo conservador". El agente interpreta el pedido, ajusta los porcentajes, recalcula el Fit Score y muestra la nueva composicion.

### 5.4 Portfolio Fit Score

Score de 0 a 100 que mide que tan alineada esta la cartera con el perfil del inversor. Se comunica en lenguaje simple luego de cada cambio.

| Rango | Etiqueta |
|-------|----------|
| 85-100 | Muy alineado |
| 65-84 | Alineado |
| 45-64 | Moderadamente fuera de perfil |
| 0-44 | Fuera de perfil |

### 5.5 Portfolio Doctor

Insights accionables generados sobre la cartera actual. Se presentan como parte de la conversacion o en el dashboard.

### 5.6 What-if Simulator

El usuario puede explorar escenarios hablando naturalmente: "que pasaria si aporto el doble?", "como me iria con una cartera mas agresiva?".

---

## 6. Dashboard web

### 6.1 Login

- Formulario de email + password (mock, sin hash ni JWT).
- Cookie `user_id` HttpOnly para sesion.
- Usuario demo pre-cargado: `demo@hackitba.com` / `demo123`.
- Boton "Salir" para cerrar sesion.

### 6.2 Dashboard principal (`/`)

Muestra la cartera activa del usuario logueado:

| Componente | Descripcion |
|------------|-------------|
| **Warning banner** | Aparece si no hay banco conectado o debito automatico sin configurar. Boton para ir a `/debit/setup`. |
| **Historical Returns** | Retornos ponderados a 1 mes, 3 meses, 1 año. |
| **Composicion (pie chart)** | Grafico de torta interactivo con colores unicos por activo (nunca repetidos). |
| **Fit Score Widget** | Score circular con breakdown por dimension. |
| **Portfolio Doctor** | Insights de tipo warning, info y positive. |
| **Contribution History** | Tabla de aportes historicos + proximo aporte programado. |
| **Botones de accion** | "Editar cartera", "Configurar debito", "Salir". |

### 6.3 Editor de cartera (`/portfolio/edit`)

Pagina interactiva para modificar la composicion de la cartera:

- **Columna izquierda**: grafico de torta en tiempo real + Fit Score live + indicador de total (debe sumar 100%) + boton guardar.
- **Columna derecha**: nombre de la cartera + lista de instrumentos con porcentajes editables.
- **Seccion inferior (ancho completo)**: "Agregar activos" con dos tabs:
  - **Locales**: instrumentos de la base de datos (8 instrumentos argentinos).
  - **Stocks (Dinari)**: acciones del mercado americano via Dinari Enterprise API (sandbox). Se puede buscar por nombre o simbolo. Al seleccionar un stock se agrega a la cartera con 0%.
- Validacion estricta: los porcentajes deben sumar exactamente 100% tanto en frontend como backend.
- Al guardar: archiva la cartera anterior, crea una nueva con status `active`, calcula fit score, y si hay stocks de Dinari nuevos los crea como instrumentos en la base de datos.

### 6.4 Conexion de banco y debito automatico (`/debit/setup`)

Flujo de dos pasos:

**Paso 1 — Seleccion de banco:**
- Grilla de 20 bancos argentinos (Nacion, Galicia, BBVA, Brubank, Macro, Santander, etc.).
- Al seleccionar se guarda en la BD y avanza al paso 2.

**Paso 2 — Configuracion del debito:**
- Monto en pesos (input numerico).
- Frecuencia: semanal, quincenal o mensual (selector de botones).
- Fecha del primer debito (date picker, desde hoy en adelante).
- Resumen legible: "Se debitaran $10.000 de forma mensual desde Brubank, comenzando el 5 de abril de 2026."
- Boton "Activar debito automatico" que guarda la configuracion en el portfolio activo.

---

## 7. Flows proactivos (bot → usuario)

### 7.1 Revision semanal de cartera

Una vez por semana, el sistema evalua el portfolio activo del usuario:
- Calcula si el Fit Score bajo significativamente.
- Detecta desbalance o sobreexposicion.
- Si encuentra algo relevante, manda un mensaje con el insight y una sugerencia accionable.

### 7.2 Recordatorio de aporte

Cuando llega la fecha de aporte configurada, el bot notifica al usuario y simula la ejecucion del debito.

---

## 8. Integracion con Dinari

El editor de cartera permite agregar stocks del mercado americano obtenidos de la **Dinari Enterprise API** (sandbox):

- Endpoint: `GET /api/v2/market_data/stocks/`
- Muestra: nombre, simbolo, logo, estado de tradability.
- Al guardar una cartera con stocks de Dinari, se crean como instrumentos en la BD con:
  - `category`: `renta_variable`
  - `risk_level`: `high`
  - `returns` mockeados (2%, 6%, 25%)
  - `volatility`: 15%

---

## 9. Features del MVP

| Feature | Canal | Estado |
|---------|-------|--------|
| Onboarding conversacional libre | WhatsApp | Incluido |
| Extraccion de perfil por LLM | N8N / AI Agent | Incluido |
| Cartera sugerida con botones de accion | WhatsApp | Incluido |
| Ajuste conversacional de cartera | WhatsApp | Incluido |
| Portfolio Fit Score | WhatsApp + Web | Incluido |
| Portfolio Doctor con insights | WhatsApp + Web | Incluido |
| What-if Simulator conversacional | WhatsApp | Incluido |
| Confirmacion y guardado de cartera | WhatsApp + Web | Incluido |
| Aporte automatico mockeado | WhatsApp | Incluido |
| Revision semanal proactiva | N8N (scheduled) | Incluido |
| Login mock (email/password) | Web | Incluido |
| Dashboard interactivo | Web | Incluido |
| Editor de cartera con Dinari stocks | Web | Incluido |
| Conexion de banco (mock) | Web | Incluido |
| Configuracion de debito automatico | Web | Incluido |
| Crowd intelligence por perfiles similares | - | Roadmap |
| Alerta de mercado en tiempo real | - | Roadmap |
| Debito automatico real (integracion bancaria) | - | Roadmap |
| Marketplace de carteras | - | Roadmap |
| Inversion tokenizada | - | Roadmap |

---

## 10. Modelo de negocio

### Tier gratuito
- Onboarding completo.
- Cartera sugerida.
- Ajuste basico de cartera.
- Portfolio Fit Score basico.

### Tier premium
- Portfolio Doctor con insights avanzados.
- What-if Simulator completo.
- Revisiones proactivas semanales.
- Escenarios de simulacion extendidos.
- Crowd intelligence con perfiles similares.

### B2B / white-label (roadmap)
- Licenciamiento del motor de perfilado y validacion de carteras para bancos, brokers o fintechs.

---

## 11. Wording y posicionamiento

| Usar | Evitar |
|------|--------|
| Cartera personalizada | Fondo propio |
| Portfolio inteligente | Fondo de inversion |
| Estrategia de inversion | Crear un fondo |
| Composicion de activos | Administrar un fondo |

---

## 12. Criterios de exito del MVP

- El usuario puede loguearse en el dashboard y ver su cartera con metricas reales de la BD.
- El usuario puede editar su cartera, agregar stocks de Dinari, y guardar con validacion de 100%.
- El usuario puede conectar un banco y configurar debito automatico (frecuencia, monto, fecha).
- El grafico de torta se actualiza en tiempo real al cambiar los porcentajes.
- El Fit Score se recalcula live al editar la cartera.
- El flujo completo de WhatsApp funciona de punta a punta: onboarding → cartera → confirmacion.
- El bot interpreta correctamente el perfil del usuario a partir de una conversacion libre.
- El flow proactivo semanal envia un mensaje coherente con el estado real del portfolio.
- La experiencia es entendible sin conocimiento financiero previo.

---

## 13. Restricciones y decisiones tomadas

- El MVP no ejecuta inversiones reales ni integra debito automatico real con bancos.
- El MVP no administra fondos regulados. Opera con carteras de simulacion y recomendacion.
- Los datos de rentabilidad historica son informativos y no constituyen asesoramiento financiero regulado.
- La AI actua como capa de explicacion y alertas, no como asesor financiero ni entidad regulada.
- La autenticacion es mock (plain text password, cookie session). No apta para produccion.
- Los stocks de Dinari provienen del sandbox; en produccion se usaria la API de produccion.

---

## 14. Roadmap de producto

### Fase 1 (MVP - HackITBA 2026)
- Onboarding conversacional por WhatsApp.
- Cartera sugerida y ajuste conversacional.
- Portfolio Fit Score y Portfolio Doctor.
- What-if Simulator conversacional.
- Aporte automatico mockeado.
- Revision semanal proactiva.
- Dashboard web interactivo con login.
- Editor de cartera con stocks de Dinari.
- Conexion de banco y configuracion de debito automatico.

### Fase 2
- Crowd intelligence por perfiles similares.
- Goal-first investing (el flujo arranca por meta, no por instrumento).
- Rebalanceo inteligente.
- Alertas de mercado en tiempo real.

### Fase 3
- Marketplace curado de estrategias.
- Integracion con partners regulados para ejecucion real.
- Debito automatico real e inversion tokenizada con partner.
