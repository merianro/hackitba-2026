# Analisis de jurado y rubrica

## Objetivo de este documento

Este analisis cruza la rubrica oficial de HackITBA 2026 con el perfil publico de cada jurado para entender:

- que aspectos del proyecto van a ser mas valorados por cada jurado;
- que objeciones pueden aparecer durante la evaluacion;
- como conviene posicionar la idea para maximizar claridad, credibilidad y puntaje.

---

## Rubrica oficial — resumen y pesos

| Categoria | Puntaje maximo | Que evalua |
|-----------|---------------|------------|
| Problematica | 5 | Relevancia, argumentacion, evidencia concreta |
| Relacion con la tematica | 3 | Conexion clara y directa con el vertical elegido |
| Innovacion y oportunidad | 5 | Diferenciacion real, ventaja competitiva visible |
| Impacto y alcance | 5 | Escala del problema, potencial de crecimiento |
| Monetizable | 5 | Modelo de negocio solido, pricing, sustentabilidad. **0 = descalificacion** |
| Facilidad de ejecucion | 3 | Deployado o ejecutable con un unico comando. **0 = descalificacion** |
| Interfaz de usuario | 8 | Diseño profesional, UX fluida, tipografia, colores, usabilidad |
| Calidad del MVP | 10 | Solucion efectiva, bien implementada, solida |
| Video | 3 | Explicacion clara, bien estructurada, convincente |
| **Total** | **47** | |

### Observaciones sobre la rubrica

- **Interfaz + Calidad del MVP suman 18/47 (38%)**. Son los dos items con mas peso. La demo tiene que funcionar impecable.
- **Monetizable con 0 descalifica**. No se puede dejar en "ya veremos como monetizamos". Hay que tener un modelo claro.
- **Facilidad de ejecucion con 0 descalifica**. Estar deployados en Vercel nos da 3/3.
- **El video vale 3 puntos**. Parece poco, pero puede ser la diferencia entre ganar o perder. Tiene que ser claro y bien producido.

---

## Perfiles del jurado

### 1. Alejandro Vazquez

**Co-Founder & President de Nuvemshop / Tiendanube**

| Dato | Detalle |
|------|---------|
| Empresa | Nuvemshop — plataforma e-commerce mas grande para PyMEs en LATAM (150K+ clientes, 6 paises) |
| Trayectoria | 15+ años. Fundo Tiendanube en 2011, la escalo a 1000+ empleados |
| Formacion | Stanford Executive Program for Growing Companies |
| Previo | Dell (online marketing, business operations), SABF (CFO, Co-Director, Board Member) |
| Foco | E-commerce, D2C, growth, liderazgo, escalar en LATAM |

**Que va a mirar:** Tamaño de mercado, potencial de escala en LATAM, claridad de propuesta de valor, modelo de adopcion. Es fundador de una empresa que escalo masivamente — valora la vision de crecimiento realista y no la sobrepromesa.

**Riesgo con nuestro proyecto:** Puede preguntar "cual es tu GTM?" o "como adquiris usuarios?". Tener claro que WhatsApp es el canal de adopcion (0 friccion) y que el modelo B2B/white-label escala sin CAC directo.

---

### 2. Demian Schnaidman

**CEO de Digbang | Co-Founder de Digital House | Director de N5 | Profesor en ORT (18 años)**

| Dato | Detalle |
|------|---------|
| Empresa | Digbang (software dev, 51-200), Digital House (edtech, 1000+), N5 Now (fintech software) |
| Trayectoria | 30+ años en tech. Telecom, SaaS, startups, software factories |
| Formacion | Lic. en Informatica (U. Palermo, mejor alumno 2004) |
| Foco | Arquitectura de software, product design, emprendedurismo, educacion, metodologias agiles |
| Extra | Co-founder de Innovation Tech Week (Miami). Mentor y board advisor activo |

**Que va a mirar:** Calidad de la arquitectura, coherencia tecnica, diseño de producto, escalabilidad del MVP. Es un CTO/arquitecto de larga trayectoria que tambien fundo una empresa de educacion — valora que las cosas esten bien construidas y que el equipo entienda por que tomo las decisiones que tomo.

**Riesgo con nuestro proyecto:** Puede cuestionar decisiones tecnicas si no las defendemos bien. Tener claros los trade-offs: por que Next.js para API + dashboard, por que Supabase, por que cookie session (es MVP), por que N8N para orquestacion conversacional.

---

### 3. Federico Rolando

**Managing Partner de MVP Consulting | Ex-CMO Coca-Cola Argentina | Ex-Head of Marketing Samsung Argentina**

| Dato | Detalle |
|------|---------|
| Empresa | MVP — consultora de transformacion de negocio |
| Trayectoria | 19+ años. 10 años en Coca-Cola (de analista a Marketing Director), Samsung, COR |
| Formacion | MBA (Di Tella), Lic. en Economia (UBA) |
| Foco | Brand strategy, business transformation, marketing, pricing, GTM |
| Extra | Nominado Jerry Goldenberg 2020 (product marketing). Certificado en digital advertising (Coderhouse) |

**Que va a mirar:** Posicionamiento de marca, narrativa del problema, modelo de negocio, pricing, segmento de clientes. Viene del mundo del marketing y la estrategia comercial — le importa que la historia sea convincente y que el negocio tenga sentido economico.

**Riesgo con nuestro proyecto:** La monetizacion tiene que ser concreta, no generica. Este jurado sabe de pricing real. El modelo freemium + premium + B2B tiene que explicarse con claridad. Conviene hablar de "tiers" con ejemplos concretos de que paga cada uno.

---

### 4. Juan Manuel Costa

**CTO de IOL Inversiones (InvertirOnline)**

| Dato | Detalle |
|------|---------|
| Empresa | IOL Inversiones — plataforma de inversiones digitales de Argentina |
| Trayectoria | 15+ años. Director de Ingenieria en PayClip (fintech mexicana, fraude y pagos), Wildlife Studios (gaming, data engineering), 9 años en Despegar (de dev a lider de equipos) |
| Formacion | Ingenieria de Software (Universidad CAECE) |
| Foco | Arquitectura digital, AI, big data, ciberseguridad, plataformas de inversion, fintech |
| Previo | DeRemate.com, Turner Broadcasting |

**Que va a mirar:** Es el jurado mas relevante para nuestro proyecto. Lidera la tecnologia de una plataforma real de inversiones en Argentina. Entiende el dominio: perfilado de inversores, operaciones de mercado, regulacion, experiencia de usuario en fintech financiera. Va a evaluar credibilidad tecnica, dominio del problema y si la solucion tiene sentido en el contexto real del mercado de inversiones argentino.

**Riesgo con nuestro proyecto:** Puede detectar inmediatamente que los rendimientos de instrumentos son mockeados, que no hay integracion real con brokers, o que la terminologia financiera no es precisa. Es fundamental ser transparente: "esto es un MVP, los datos son simulados, la integracion con un broker regulado es el siguiente paso". No intentar parecer mas de lo que somos frente a alguien que vive esto todos los dias.

**Oportunidad:** Si el MVP le parece bien construido y el enfoque de WhatsApp + AI lo ve como una innovacion real sobre la experiencia tradicional de un broker online, puede ser nuestro mayor defensor.

---

### 5. Lautaro Tombolini

**CTO de Bull Market Brokers**

| Dato | Detalle |
|------|---------|
| Empresa | Bull Market Brokers — broker de bolsa argentino |
| Trayectoria | 19+ años. Construyo la plataforma de trading online y BullPay (wallet digital con Mastercard prepaga) desde cero |
| Formacion | Lic. en Finanzas (UADE, 50% completado). Cert. en AI (Berkeley/edX) |
| Previo | 5 años en Estudio GALLO creando plataformas white-label de trading online para 30+ brokers. Atos (proyectos YPF) |
| Foco | Fintech, trading, AWS, microservicios, arquitectura, C#/.NET, finanzas |

**Que va a mirar:** Igual que Costa, entiende el negocio de inversiones desde adentro. Construyo sistemas de trading reales. Va a evaluar si la idea tiene sentido operativo, si la experiencia del usuario inversor es realista, y si la tecnologia esta bien resuelta. Conoce las limitaciones reales del mercado (regulacion, custodia, ejecucion).

**Riesgo con nuestro proyecto:** Dos CTOs de brokers argentinos en el jurado significa que cualquier exageracion sobre "invertir de verdad" o "debito automatico real" se detecta al instante. Ser honestos sobre que es simulacion y que es roadmap.

**Oportunidad:** Puede valorar mucho el canal WhatsApp como innovacion de distribucion. Los brokers tradicionales luchan con la adopcion — si ve que nuestro enfoque resuelve eso, puede puntuarnos alto en innovacion e impacto.

---

### 6. Manu Lopez

**Founder de Plaude | Co-Founder de belo | Ex-Tech Lead Cocos Capital**

| Dato | Detalle |
|------|---------|
| Empresa | Plaude — AI agents conversacionales para fintechs. belo — primera crypto Mastercard de las Americas |
| Trayectoria | 11 años. Fundo belo a los 20 años. Paso por Entrepreneur First (Londres). Tech Lead en Cocos Capital (plataforma de inversiones) |
| Formacion | Ing. en Software (UTN, dropout). Autodidacta |
| Previo | Fundo Dollet (fintech de ahorro). Mobile/full-stack developer |
| Foco | Fintech, crypto, AI conversacional, mobile, startups, producto |

**Que va a mirar:** Producto. Es un founder serial de fintech que ahora construye AI agents conversacionales para fintechs — nuestro proyecto le toca directamente. Va a evaluar calidad de la experiencia conversacional, si el producto se siente real, y si hay un builder detras que entiende lo que esta haciendo. Trabajo en Cocos Capital (inversiones) y fundo belo (crypto fintech) — entiende ambos mundos.

**Riesgo con nuestro proyecto:** Puede ser exigente con la calidad del AI agent y la experiencia en WhatsApp porque literalmente construye eso. Si la demo del chatbot no es fluida o natural, lo va a notar.

**Oportunidad:** Si le gusta como usamos AI conversacional + WhatsApp para bajar la friccion de invertir, puede ser un aliado fuerte. Su startup actual (Plaude) tiene exactamente la misma tesis: AI agents para fintechs.

---

### 7. Mariana Sozzi

**Gerente Ejecutivo Data Analytics & IA en YPF**

| Dato | Detalle |
|------|---------|
| Empresa | YPF (10,000+ empleados) |
| Trayectoria | 23+ años. Directora de Advanced Analytics en DirecTV LATAM (6 paises), Telecom Personal, Nielsen |
| Formacion | Master en Data Mining (U. Austral). Licenciada en Matematica con Diploma de Honor (USAL). Posgrado Management (Di Tella). Big Data (San Andres) |
| Foco | Data science, modelos predictivos, data mining, CRM, segmentacion, analytics para decision de negocio, AI |
| Extra | Programadora de formacion (C++, VB, SQL). Lidera equipos de data science, big data y data governance en YPF |

**Que va a mirar:** Uso de datos y AI. No se conforma con "usamos AI": quiere ver como se modela el perfil del inversor, que datos alimentan el scoring, si hay logica detras de la segmentacion. Es matematica y data scientist — va a notar si el Fit Score tiene sustancia o es una formula arbitraria.

**Riesgo con nuestro proyecto:** Si le pregunta al equipo "como calculan el fit score" y la respuesta es vaga, pierde credibilidad. Tener claro las 5 dimensiones, los pesos, como se normalizan, y por que esas dimensiones.

**Oportunidad:** Si ve que el motor de scoring tiene logica real (5 dimensiones ponderadas, penalizacion por concentracion, coherencia temporal) y que la AI genera insights basados en datos del perfil, puede valorarlo mucho.

---

### 8. Patricia Jebsen

**Board Advisor | Ex-GM Rappi Argentina | Ex-GM Falabella E-Commerce | Ex-Presidenta CACE**

| Dato | Detalle |
|------|---------|
| Empresa | Board advisor en Coppel, Enviopack, Venturino, TUPI, Seeds, entre otras |
| Trayectoria | 30+ años. GM en Rappi Argentina, GM en Beat/FREENOW, GM E-Commerce en Falabella, MercadoLibre. Presidenta de la Camara Argentina de Comercio Electronico (2010-2014) |
| Formacion | Lic. en RRPP (UADE). Next Board (UCEMA). E-Commerce Executive Program Director en Di Tella |
| Foco | E-commerce, omnicanalidad, retail, liderazgo, estrategia de negocio |
| Extra | 214K followers en LinkedIn. Content creator y speaker activa sobre carrera y liderazgo |

**Que va a mirar:** Experiencia de usuario, modelo de negocio, potencial de escala, omnicanalidad. Viene del mundo del retail y e-commerce con foco en la experiencia del consumidor final. No es tecnica de formacion pero entiende producto digital profundamente — estuvo en MercadoLibre, Falabella, Rappi.

**Riesgo con nuestro proyecto:** Si la narrativa es demasiado tecnica y no habla de usuario, la perdemos. Quiere escuchar: quien usa esto, como le mejora la vida, por que lo usa por WhatsApp y no por una app.

**Oportunidad:** La tesis de WhatsApp como canal de distribucion cero-friccion le puede resonar mucho. Viene de empresas que luchan por adopcion (Rappi, Beat). Si ve que eliminamos la barrera de "descarga la app" y "abrite una cuenta", puede valorarlo alto.

---

### 9. Tomas Holtz

**Software Engineer | Estudiante ITBA | Founding Engineer de belo**

| Dato | Detalle |
|------|---------|
| Empresa | Estudiante de Ing. en CS en ITBA (2023-2028) |
| Trayectoria | 2 años formales. Founding engineer de belo: diseño y desarrollo la mobile app desde cero (0 a 700K usuarios). Software engineer en Suku (crypto wallet, 100K usuarios) |
| Formacion | ITBA (en curso). Flutter specialist (Platzi). Cursos de arquitectura, OOP, Git |
| Foco | Mobile development, Flutter, Firebase, startups, crypto, fintech |
| Extra | Construyo la app de belo sin diseñadores ni product managers — solo 3 devs frontend |

**Que va a mirar:** Ejecucion pura. Es un builder joven que escalo un producto real de 0 a 700K usuarios en fintech. Va a evaluar si el MVP funciona bien, si la interfaz tiene calidad, si el codigo y la arquitectura tienen sentido. Siendo compañero de Manu Lopez en belo, probablemente comparten criterios.

**Riesgo con nuestro proyecto:** Puede ser critico con la calidad de la UI si no esta pulida, porque el mismo construyo interfaces para cientos de miles de usuarios. La demo tiene que funcionar sin bugs visibles.

**Oportunidad:** Si ve un MVP bien construido con tech moderna (Next.js, Supabase, API propia, AI integration) desplegado en Vercel, puede apreciarlo como un producto real y no un prototipo de hackathon.

---

## Mapa de intereses del jurado

### Cluster 1 — Fintech / Inversiones (3 jurados)

**Juan Manuel Costa** (CTO IOL Inversiones), **Lautaro Tombolini** (CTO Bull Market Brokers), **Manu Lopez** (Co-Founder belo, Tech Lead Cocos Capital)

Tres jurados que trabajan o trabajaron en plataformas de inversiones o fintechs. Entienden el dominio profundamente. Representan casi un tercio del jurado.

**Implicancia:** No podemos inventar ni exagerar nada sobre inversiones. Pero si el enfoque de WhatsApp + AI como canal de distribucion les parece innovador frente a la experiencia clasica de un broker, pueden darnos ventaja competitiva real en Innovacion e Impacto.

### Cluster 2 — Tecnologia / Producto / Arquitectura (3 jurados)

**Demian Schnaidman** (CEO Digbang, Co-Founder Digital House), **Tomas Holtz** (Founding Eng belo), **Mariana Sozzi** (Data Analytics & AI en YPF)

Tres jurados que van a evaluar la calidad tecnica desde distintos angulos: arquitectura de software, UI/UX de producto, y rigor en el uso de datos y AI.

**Implicancia:** La demo tiene que ser impecable. El scoring tiene que tener logica real. La AI no puede ser un buzzword.

### Cluster 3 — Negocio / Marketing / Estrategia (3 jurados)

**Alejandro Vazquez** (Founder Nuvemshop), **Federico Rolando** (Ex-CMO Coca-Cola), **Patricia Jebsen** (Ex-GM Rappi, ex-Presidenta CACE)

Tres jurados con mirada de negocio, marca y escala. Les importa la propuesta de valor, el modelo de monetizacion, y el potencial de crecimiento.

**Implicancia:** La monetizacion no puede ser un slide generico. Necesita pricing, segmento, y logica de por que paga alguien. La narrativa del problema tiene que conectar emocionalmente.

---

## Estrategia por criterio de la rubrica

### 1. Problematica (5 pts)

**Formulacion recomendada:**

> Millones de personas quieren invertir pero no logran sostener el habito. Las plataformas existentes asumen que el usuario ya sabe lo que quiere: le muestran instrumentos, graficos y botones de compra. Pero el verdadero problema no es la falta de opciones, sino la falta de acompañamiento. Sin guia, sin contexto y sin constancia, la mayoria abandona antes de ver resultados.

**Para los jurados fintech (Costa, Tombolini, Lopez):** Este problema lo viven en sus propias plataformas — la retencion de inversores retail es un desafio constante. No decir que sus productos son malos; decir que el canal (app, web) no es suficiente para sostener el habito.

**Para los jurados de negocio (Vazquez, Rolando, Jebsen):** Apoyar con dato si es posible: "en Argentina, X millones de personas tienen cuenta en un broker pero solo Y% opera mensualmente".

### 2. Relacion con la tematica (3 pts)

La relacion con fintech / smart finance es directa. No requiere argumentacion compleja. Mencionarlo explicitamente al inicio del pitch: "Nuestro proyecto es una plataforma de smart finance para el inversor retail argentino."

### 3. Innovacion y oportunidad (5 pts)

**La innovacion no es "usamos AI".** Ante este jurado, eso no es innovacion.

**La innovacion real es la combinacion de:**

- WhatsApp como canal principal (0 friccion, 0 descarga) — ante jurados que luchan con adopcion.
- Perfilado conversacional (no un formulario) — ante jurados que construyen onboardings.
- Scoring en tiempo real que el usuario entiende — ante jurados de data science.
- AI como explicador, no como caja negra — ante jurados que saben que la AI sola no vende.

**Frase clave para el pitch:** "No inventamos un nuevo broker. Inventamos una capa de inteligencia y acompañamiento que puede funcionar encima de cualquier broker."

### 4. Impacto y alcance (5 pts)

- El publico objetivo es masivo: cualquier persona bancarizada que aun no invierte o invierte sin estrategia.
- WhatsApp tiene penetracion casi universal en Argentina y LATAM.
- El modelo puede escalarse como B2B (white-label para brokers, bancos, fintechs).
- La misma tecnologia sirve para otros verticales: ahorro, seguros, credito.

### 5. Monetizable (5 pts — 0 descalifica)

**Modelo de tres capas:**

| Tier | Que incluye | Precio referencia |
|------|-------------|-------------------|
| **Free** | Onboarding, cartera sugerida, Fit Score basico | $0 |
| **Premium** | Portfolio Doctor avanzado, what-if simulator, alertas proactivas, rebalanceo | Suscripcion mensual |
| **B2B / White-label** | Motor de perfilado, scoring y AI para brokers y fintechs | Licencia o revenue share |

**Ante Rolando (ex-CMO):** Explicar la logica de pricing, no solo los tiers. "El usuario free nos cuesta X en API calls. El premium tiene un willingness to pay de Y porque le ahorra Z horas de analisis."

**Ante Costa y Tombolini (CTOs de brokers):** El B2B es lo que mas les va a interesar. "Un broker podria integrar nuestro motor de perfilado y scoring en su propia plataforma."

### 6. Facilidad de ejecucion (3 pts)

**Tenemos 3/3 asegurado:** el proyecto esta deployado en Vercel (`hackitba-2026.vercel.app`). No se necesita levantar ningun servicio. Login con demo account.

### 7. Interfaz de usuario (8 pts)

Para 7-8 puntos se necesita: "Diseño atractivo y profesional, con atencion a la tipografia, colores y usabilidad" y "Diseño excelente, intuitivo y con altos estandares de usabilidad y estetica."

**Nuestras fortalezas:**
- Tema claro limpio con contraste WCAG AA.
- Grafico de torta interactivo con paleta de 20 colores unicos.
- Editor de cartera con feedback en tiempo real (Fit Score + chart live).
- Flows claros: login → dashboard → editor → debit setup.

**Ante Holtz y Lopez (builders):** La fluidez de la navegacion y que no haya bugs visibles es lo que mas importa.

**Ante Jebsen (UX/e-commerce):** La experiencia debe sentirse como un producto real, no como un hackathon project.

### 8. Calidad del MVP (10 pts)

Para 9-10 puntos: "Solido, con muy pocos errores y alta funcionalidad" / "Aborda completamente la problematica y proporciona una solucion efectiva."

**Lo que tenemos implementado (funcional):**
- Login → dashboard con metricas reales de BD.
- Editor de cartera con instrumentos locales + stocks de Dinari (API real).
- Scoring en tiempo real con 5 dimensiones.
- Guardado en BD con validacion estricta (100%).
- Conexion de banco + config de debito automatico.
- API completa para N8N (onboarding, perfil, cartera, insights, simulacion, transfers).

**Lo que conviene mostrar en la demo (en este orden):**
1. Login con cuenta demo.
2. Dashboard con metricas, chart, fit score, insights.
3. Editor de cartera: cambiar porcentajes, ver chart actualizar en vivo.
4. Agregar un stock de Dinari (datos reales de la API).
5. Guardar y ver fit score actualizado.
6. Config de debito automatico.

### 9. Video (3 pts)

Para 3/3: "Explicacion clara, bien estructurada y atractiva. Presenta la problematica, la solucion y el MVP de forma convincente."

**Estructura recomendada:**
1. El problema (15 seg): la mayoria de la gente quiere invertir pero no logra sostenarlo.
2. Nuestra solucion (15 seg): smart finance por WhatsApp + dashboard inteligente.
3. Demo del MVP (1.5 min): flujo completo de login a cartera editada.
4. Modelo de negocio (15 seg): freemium + B2B.
5. Roadmap (15 seg): integracion con brokers regulados, expansion LATAM.

---

## Riesgos de posicionamiento

### Riesgo 1 — Prometer inversion real ante CTOs de brokers reales

Costa (IOL) y Tombolini (Bull Market) saben exactamente que se necesita para ejecutar inversiones reales: regulacion CNV, custodia, FIX protocol, anti-lavado, etc. Si decimos "el usuario invierte" sin tener nada de eso, perdemos toda credibilidad con un tercio del jurado.

**Mitigacion:** Decir explicitamente "el MVP simula la experiencia de inversion para validar la hipotesis de producto. La integracion con un broker regulado es el siguiente paso."

### Riesgo 2 — Decir "usamos AI" sin sustancia ante una data scientist

Sozzi es matematica y data scientist con 23 años de experiencia. "Usamos GPT-4 para generar insights" sin explicar como se construye el prompt, que datos se le pasan, y como se valida la salida es insuficiente.

**Mitigacion:** Explicar las 5 dimensiones del Fit Score con sus pesos, mostrar que los prompts incluyen perfil + composicion + rendimientos + volatilidad, y que hay disclaimer obligatorio.

### Riesgo 3 — Monetizacion generica ante un ex-CMO de Coca-Cola

Rolando paso 10 años haciendo estrategia comercial en Coca-Cola. "Modelo freemium" no es una respuesta — es una categoria. Quiere escuchar: quien paga, cuanto, por que, y como escala.

**Mitigacion:** Tener numeros: "un usuario premium paga $X/mes porque accede a Y features que le ahorran Z. El TAM de inversores retail con capacidad de pago en Argentina es de N millones."

### Riesgo 4 — UI mediocre ante builders que escalaron apps a 700K usuarios

Holtz construyo la app de belo de 0 a 700K usuarios. Lopez fundo belo y Cocos Capital. Si la interfaz tiene bugs, se ve inconsistente, o tiene friccion innecesaria, lo van a notar inmediatamente.

**Mitigacion:** Testear la demo completa antes de presentar. Cada click, cada transicion, cada estado vacio.

### Riesgo 5 — No hablar de usuario ante jurados de e-commerce y consumo

Vazquez (Nuvemshop), Jebsen (Rappi, Falabella, CACE) y Rolando (Coca-Cola) estan acostumbrados a pensar desde el usuario final. Si el pitch es demasiado tecnico ("usamos Next.js con Supabase y N8N...") sin conectar con una necesidad humana real, no les llega.

**Mitigacion:** Empezar siempre por el problema humano, no por la tecnologia. "Juan tiene 28 años, abrio una cuenta en un broker hace 6 meses y solo opero una vez. No porque no quiera invertir, sino porque nadie lo acompaña."

---

## Posicionamiento recomendado

> Una plataforma de smart finance que acompaña al inversor retail por WhatsApp y en un dashboard inteligente. Lo perfila, le sugiere una cartera personalizada, le muestra en tiempo real si sus decisiones son coherentes con su perfil, y lo ayuda a sostener el habito de invertir.

### Lo que NO somos (ante este jurado)

- No somos un broker.
- No somos un roboadvisor.
- No ejecutamos inversiones reales.
- No administramos fondos.

### Lo que SI somos

- Una capa de inteligencia y acompañamiento.
- Un motor de perfilado, scoring y recomendacion.
- Un canal de distribucion (WhatsApp) que elimina la friccion.
- Una herramienta que puede integrarse con cualquier broker existente.

---

## Mensaje central para el pitch

> Invertir es facil de empezar y dificil de sostener. Nuestra plataforma perfila al usuario por WhatsApp, le sugiere una cartera alineada a su perfil, y le muestra en tiempo real si sus decisiones tienen sentido. No compite con los brokers — los complementa con una capa de inteligencia que hoy no existe.

---

## Que puede subir el puntaje

- Mostrar una demo impecable de punta a punta (login → dashboard → editor → guardar → debit).
- Explicar el Fit Score con sus 5 dimensiones y mostrar como cambia en vivo.
- Que los jurados fintech (Costa, Tombolini, Lopez) digan "esto tiene sentido".
- Monetizacion concreta con pricing, no solo tiers.
- Separar claramente MVP actual de roadmap.
- Contar la historia desde el usuario, no desde la tecnologia.

## Que puede bajar el puntaje

- Decir que "invertimos plata de verdad" o "el debito automatico funciona".
- No poder explicar como funciona el scoring.
- Una demo con bugs o estados inconsistentes.
- Monetizacion vaga ("modelo freemium").
- Pitch demasiado tecnico que no conecta con los jurados de negocio.
- No mencionar explicitamente que es un MVP con datos simulados.
