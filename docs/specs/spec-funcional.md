# Especificacion Funcional
**Proyecto:** HackITBA 2026
**Version:** 0.1 (iteracion inicial)
**Ultima actualizacion:** 2026-03-28

---

## 1. Vision del producto

Una plataforma de smart finance que permite al usuario retail crear su propia cartera de inversion personalizada. El flujo combina perfilado del inversor, recomendacion inicial, construccion interactiva de la cartera y validacion inteligente de su coherencia con el perfil y objetivo definidos.

El diferencial no es solo recomendar: es dejar al usuario construir, entender y confiar en lo que esta haciendo.

---

## 2. Problema que resuelve

Las personas que quieren invertir encuentran dos extremos:

- Plataformas simples que dan recomendaciones rigidas sin explicacion.
- Herramientas potentes pensadas para usuarios con experiencia financiera.

Esa brecha genera confusion, baja confianza, malas decisiones y poca adopcion sostenida de habitos de inversion.

El usuario necesita una experiencia que lo ayude a empezar aunque no sepa de finanzas, que le de control progresivo, y que le explique las consecuencias de cada decision en lenguaje simple.

---

## 3. Usuario objetivo

Hay dos perfiles centrales, cubiertos por el mismo flujo:

| Perfil | Descripcion |
|--------|-------------|
| Inversor nuevo | No tiene experiencia. Quiere empezar a ahorrar o invertir sin saber por donde. Necesita guia y educacion implicita en la experiencia. |
| Inversor con nocion | Ya invierte algo o conoce conceptos basicos. Quiere mas control, personalizacion y comprension real de su estrategia. |

Ambos perfiles llegan al mismo producto pero con distinta profundidad de interaccion.

---

## 4. Flujo principal

### 4.1 Onboarding y perfilado

El usuario responde un cuestionario estructurado que determina su perfil de inversor. Las preguntas recogen:

- Experiencia previa en inversiones.
- Objetivo financiero: ahorro de corto plazo, proteccion contra inflacion, crecimiento de mediano plazo, jubilacion u otro.
- Horizonte temporal: menos de 1 año, 1 a 3 años, mas de 3 años.
- Tolerancia al riesgo: conservador, moderado, agresivo.
- Capacidad de aporte: porcentaje del ingreso mensual o monto fijo.

Al finalizar el onboarding, el sistema genera un perfil del inversor y lo persiste para todas las evaluaciones posteriores.

### 4.2 Cartera sugerida

Con base en el perfil, el sistema sugiere una cartera inicial compuesta por categorias de activos ya definidas (fondos o tipos de instrumentos preconfigurados).

La cartera sugerida muestra:

- Composicion en porcentajes por tipo de activo.
- Rentabilidad historica a 1 mes, 3 meses y 1 año.
- Nivel de riesgo calculado.
- Coherencia con el perfil del usuario.

El usuario puede aceptar esta cartera o personalizarla.

### 4.3 Portfolio Builder

Si el usuario decide personalizar, accede al constructor interactivo de cartera.

El builder permite:

- Ajustar porcentajes por tipo de activo o instrumento mediante sliders u otro control visual.
- Agregar o quitar categorias de la composicion.
- Ver la distribucion total de la cartera en tiempo real (siempre debe sumar 100%).

A medida que el usuario modifica la composicion, el sistema actualiza en tiempo real el Portfolio Fit Score y los insights del Portfolio Doctor.

### 4.4 Portfolio Fit Score

Motor central de validacion. Evalua la cartera del usuario en tiempo real segun:

- Alineacion con el perfil de riesgo.
- Coherencia con el objetivo financiero.
- Coherencia con el horizonte temporal.
- Nivel de diversificacion.
- Concentracion en activos o sectores.
- Consistencia historica de los instrumentos incluidos.

Devuelve un puntaje de 0 a 100 y una clasificacion textual simple: `muy conservador`, `alineado`, `moderadamente agresivo`, `fuera de perfil`.

El score se muestra siempre visible durante el armado de la cartera.

### 4.5 Portfolio Doctor

Capa de insights accionables generados sobre la cartera actual.

Ejemplos de observaciones:

- "Tenes sobreexposicion en un solo sector. Considera diversificar."
- "Esta composicion es mas agresiva de lo que tu perfil indica."
- "Tu cartera tiene baja diversificacion para un horizonte de mas de 3 años."
- "La volatilidad historica de esta combinacion supera tu tolerancia declarada."

Los insights son generados por AI y estan formulados en lenguaje simple y accionable, no en jerga financiera tecnica.

### 4.6 AI What-if Simulator

Permite al usuario explorar escenarios alternativos antes de confirmar su cartera.

Ejemplos de simulaciones:

- Que pasaria con la rentabilidad si aumento la proporcion de renta variable.
- Que pasaria si bajo la concentracion en dolar.
- Que pasaria si aporto un monto fijo mensual durante 12 meses.

Cada simulacion muestra el impacto en rentabilidad historica esperada, volatilidad y Portfolio Fit Score.

### 4.7 Confirmacion de cartera

El usuario decide si usa la cartera sugerida o la personalizada.

Al confirmar, el sistema guarda la cartera como su estrategia activa y muestra un resumen de:

- Composicion final.
- Rentabilidad historica esperada.
- Nivel de riesgo.
- Portfolio Fit Score final.
- Principales observaciones del Portfolio Doctor.

---

## 5. Features del MVP

| Feature | Estado en MVP |
|---------|---------------|
| Onboarding y perfilado | Incluido |
| Cartera sugerida con fondos preconfigurados | Incluido |
| Portfolio Builder interactivo | Incluido |
| Portfolio Fit Score en tiempo real | Incluido |
| Portfolio Doctor con insights de AI | Incluido |
| AI What-if Simulator | Incluido |
| Confirmacion y guardado de cartera | Incluido |
| Crowd intelligence por perfiles similares | Segunda capa / roadmap |
| Alertas e insights por WhatsApp | Roadmap |
| Marketplace de carteras o estrategias | Roadmap |
| Rebalanceo inteligente | Roadmap |
| Debito automatico e inversion real | Roadmap |
| Inversion tokenizada | Roadmap |

---

## 6. Modelo de negocio

### Tier gratuito

- Onboarding completo.
- Cartera sugerida.
- Portfolio Builder.
- Portfolio Fit Score basico.
- Rentabilidad historica estandar.

### Tier premium

- Portfolio Doctor con insights avanzados.
- AI What-if Simulator completo.
- Alertas de desbalance y rebalanceo.
- Escenarios de simulacion extendidos.
- Crowd intelligence con perfiles similares.

### B2B / white-label (roadmap)

- Licenciamiento del motor de perfilado y validacion de carteras para bancos, brokers o fintechs.

### Revenue share (roadmap)

- Integracion con partners regulados (ALyCs, brokers). Comision por derivacion de ordenes o apertura de cuentas.

---

## 7. Wording y posicionamiento

Para evitar ambiguedades regulatorias, el producto usa esta terminologia:

| Usar | Evitar |
|------|--------|
| Cartera personalizada | Fondo propio |
| Portfolio inteligente | Fondo de inversion |
| Estrategia de inversion | Crear un fondo |
| Composicion de activos | Administrar un fondo |

"Arma tu propio fondo" puede usarse como frase de marketing superficial, pero el producto siempre aclara que trabaja con carteras personalizadas, no con fondos regulados.

---

## 8. Criterios de exito del MVP

- El usuario puede completar el flujo completo de punta a punta: onboarding, cartera sugerida, personalizacion y confirmacion.
- El Portfolio Fit Score refleja cambios en tiempo real al modificar la composicion.
- El Portfolio Doctor genera al menos un insight relevante para cualquier composicion ingresada.
- El AI What-if Simulator muestra impacto visible ante cambios de composicion o aporte.
- La interfaz es entendible sin conocimiento financiero previo.

---

## 9. Roadmap de producto

### Fase 1 (MVP - HackITBA 2026)

- Onboarding y perfilado.
- Cartera sugerida.
- Portfolio Builder.
- Portfolio Fit Score.
- Portfolio Doctor.
- AI What-if Simulator.

### Fase 2

- Crowd intelligence por perfiles similares.
- Goal-first investing (flujo que arranca por meta en vez de por instrumento).
- Rebalanceo inteligente.

### Fase 3

- Marketplace curado de estrategias.
- Alertas e insights por WhatsApp.
- Integracion con partners regulados para ejecucion real.
- Debito automatico e inversion tokenizada con partner.

---

## 10. Restricciones y decisiones tomadas

- El MVP no ejecuta inversiones reales ni integra debito automatico.
- El MVP no administra fondos regulados. Opera unicamente con carteras de simulacion y recomendacion.
- Los datos de rentabilidad historica son informativos y no constituyen asesoramiento financiero regulado.
- La AI actua como capa de explicacion y alertas, no como asesor financiero ni entidad regulada.
