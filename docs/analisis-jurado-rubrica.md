# Analisis de jurado y rubrica

## Objetivo de este documento

Este analisis resume como puede ser evaluado el proyecto frente a la rubrica de HackITBA 2026 y frente al perfil publico del jurado compartido. El foco no esta en describir la solucion tecnicamente, sino en entender:

- que aspectos del proyecto van a ser mas valorados;
- que objeciones pueden aparecer durante la evaluacion;
- como conviene posicionar la idea para maximizar claridad, credibilidad y puntaje.

## Resumen ejecutivo

La idea tiene potencial competitivo si se presenta como una plataforma de `smart finance` que ayuda al usuario a:

- entender su perfil de inversor;
- recibir una cartera inicial sugerida;
- personalizar esa cartera con una interfaz guiada;
- ver el impacto historico de sus decisiones;
- recibir insights y advertencias generadas por AI.

La presentacion se debilita si el proyecto se describe como un sistema que ya permite `crear un fondo real`, `invertir dinero real`, `tokenizar activos` o `debitar automaticamente` sin una integracion regulada concreta. Para esta instancia conviene presentar eso como roadmap y no como promesa central del MVP.

## Lectura de la rubrica

### 1. Problemática

La rubrica exige que el problema sea relevante y este bien argumentado.

El problema no deberia formularse como:

`Invertir es dificil.`

Conviene formularlo como:

`Las personas que quieren comenzar a invertir o mejorar su estrategia suelen encontrar dos extremos: plataformas simples pero rigidas, o herramientas potentes pero complejas. Eso genera confusion, baja confianza, malas decisiones y poca adopcion sostenida.`

Para aspirar al puntaje maximo, la presentacion deberia mostrar:

- por que la barrera de entrada a la inversion sigue siendo alta;
- por que la personalizacion real hoy es limitada o dificil de entender;
- por que existe una oportunidad entre el asesoramiento generico y la autogestion total.

### 2. Relacion con la tematica

El proyecto encaja bien en `fintech` y `smart finance`, pero la relacion tiene que ser explicita.

La narrativa recomendada es:

`No somos solo una app de inversion. Somos una capa de inteligencia, personalizacion y explicabilidad para que el usuario retail tome mejores decisiones financieras.`

### 3. Innovacion y oportunidad

La innovacion no deberia apoyarse solo en "usar AI".

Lo que realmente puede diferenciar al proyecto es la combinacion de:

- perfilado del usuario;
- recomendacion inicial;
- constructor visual de cartera;
- feedback inmediato sobre riesgo y rendimiento;
- explicaciones simples y accionables.

Si la propuesta se reduce a "una AI que recomienda inversiones", corre riesgo de sentirse generica. Si se muestra como una experiencia donde el usuario construye una cartera y entiende en tiempo real el impacto de sus decisiones, la ventaja competitiva es mucho mas clara.

### 4. Impacto y alcance

El proyecto tiene potencial de impacto porque ataca un problema amplio: la baja educacion financiera aplicada y la dificultad de transformar interes en accion.

Para que el impacto se perciba como grande, conviene destacar:

- que el publico objetivo es masivo;
- que puede escalar a distintos perfiles de usuario;
- que en el futuro podria integrarse con brokers, bancos o fintechs;
- que la misma tecnologia podria funcionar como producto B2C o motor B2B.

### 5. Monetizacion

La rubrica penaliza fuerte una monetizacion vaga.

La explicacion deberia incluir al menos tres capas:

- `Freemium`: onboarding, recomendacion base y simulacion gratis;
- `Premium`: insights avanzados, alertas, escenarios y rebalanceo;
- `B2B o revenue share`: integracion con partners financieros o licenciamiento del motor.

La clave es mostrar que el valor principal no es solo la transaccion, sino la capa de inteligencia y personalizacion.

### 6. Facilidad de ejecucion

Para puntuar alto, el MVP tiene que correr facil. Idealmente:

- deployado;
- con instrucciones simples;
- sin depender de levantar muchos servicios manualmente;
- con un flujo de demo corto y estable.

Si el equipo intenta abarcar demasiadas integraciones, el riesgo es bajar la calidad percibida del MVP.

### 7. Interfaz de usuario

La UX es una parte critica del puntaje. En este proyecto, la interfaz no es decorativa: es parte del valor.

El jurado probablemente va a premiar especialmente:

- onboarding claro;
- visualizacion intuitiva del armado de cartera;
- lenguaje simple para conceptos complejos;
- fluidez entre sugerencia, personalizacion e insights.

### 8. Calidad del MVP

La solucion puede perder fuerza si intenta hacer demasiadas cosas a medias.

Para un hackathon, es mejor que el MVP resuelva muy bien este nucleo:

- entender al usuario;
- sugerir una cartera;
- permitir ajustarla;
- explicar consecuencias;
- mostrar si esa composicion es coherente con su perfil.

## Lectura del jurado

Con la informacion publica disponible, el jurado parece combinar perfiles de negocio, growth, tecnologia y producto. Eso implica que el proyecto no solo debe verse innovador, sino tambien comercialmente entendible y tecnicamente creible.

### Jurados que probablemente miren negocio, marketing y escalabilidad

- Alejandro Vazquez
- Federico Rolando
- Patricia Jebsen

Estos perfiles probablemente valoren:

- claridad de propuesta de valor;
- problema real y frecuente;
- tamaño de mercado;
- diferenciacion frente a otras apps;
- logica de monetizacion;
- potencial de adopcion.

### Jurados que probablemente miren tecnologia, producto y ejecucion

- Demian Schnaidman
- Juan Manuel Costa
- Manu Lopez
- Tomas Holtz

Estos perfiles probablemente valoren:

- foco del MVP;
- credibilidad tecnica;
- calidad de interfaz;
- coherencia entre lo prometido y lo construido;
- estabilidad de la demo;
- capacidad de escalar la idea en el tiempo.

### Jurados con perfil menos verificable en la busqueda rapida

- Lautaro Tombolini
- Mariana Sozzi

Como no hay suficiente informacion publica facilmente validable en esta revision, conviene asumir una mirada generalista: negocio claro, producto convincente y ejecucion defendible.

## Riesgos de posicionamiento

### Riesgo 1: usar la palabra "fondo" como definicion tecnica

Este es el principal riesgo conceptual.

Decir que el usuario "crea su propio fondo" puede sonar atractivo, pero puede abrir preguntas sobre:

- regulacion;
- custodia;
- estructuracion legal del instrumento;
- administracion del fondo;
- responsabilidad fiduciaria.

La recomendacion es:

- usar `tu propio fondo` como frase de marketing si se desea;
- pero explicar tecnicamente que el MVP construye una `cartera personalizada` o `portfolio inteligente`.

### Riesgo 2: sobreprometer ejecucion real

Si el proyecto promete:

- debito automatico;
- compra real de activos;
- inversion tokenizada;
- operacion integrada de punta a punta;

el jurado puede exigir detalles regulatorios o de integracion que no valen la pena para esta etapa.

La recomendacion es dejar eso como:

- roadmap;
- integracion futura;
- posibilidad de partnership con actor regulado.

### Riesgo 3: vender AI como magia

La AI suma mucho si explica, traduce y alerta. Resta si parece una caja negra que "recomienda inversiones".

La mejor posicion es:

- AI como copiloto de comprension;
- AI como explicador de trade-offs;
- AI como capa de insights;
- no AI como sustituto de criterio financiero o asesor regulado.

### Riesgo 4: querer demostrar demasiado

El scope puede volverse inmanejable si el MVP incluye al mismo tiempo:

- onboarding;
- perfilado;
- recomendacion;
- portfolio builder;
- backtesting;
- AI conversacional;
- debito automatico;
- tokenizacion;
- inversion real.

Eso afecta ejecucion, estabilidad y claridad narrativa.

## Posicionamiento recomendado

La propuesta deberia presentarse asi:

`Una plataforma de smart finance que ayuda a usuarios retail a construir una cartera personalizada, alineada a su perfil y entendible desde el primer momento.`

Ese posicionamiento tiene varias ventajas:

- conserva la novedad del producto;
- evita choques regulatorios innecesarios;
- hace mas creible el MVP;
- conecta mejor con negocio, UX y tecnologia al mismo tiempo.

## Mensaje central recomendado para el pitch

`Hoy invertir es intimidante para quien recien empieza y poco flexible para quien quiere mas control. Nuestra solucion perfila al usuario, propone una cartera inicial y le permite personalizarla con una interfaz interactiva. En tiempo real, mostramos rendimiento historico, riesgo e insights generados por AI para que tome decisiones con mas confianza y comprension.`

## Que puede hacer subir el puntaje

- demostrar muy bien el flujo principal de punta a punta;
- mostrar una interfaz prolija y profesional;
- explicar con precision por que es distinto a un broker o roboadvisor tradicional;
- tener una monetizacion concreta;
- separar claramente `MVP actual` de `roadmap futuro`;
- usar ejemplos simples y entendibles de riesgo, perfil y composicion.

## Que puede hacer bajar el puntaje

- hablar de demasiadas cosas que no se ven en el producto;
- exagerar integraciones financieras no implementadas;
- usar terminos regulatorios ambiguos;
- no justificar monetizacion;
- no demostrar una necesidad clara del usuario;
- tener una demo visualmente floja o con demasiada friccion.

## Recomendacion final

La idea es presentable y tiene potencial competitivo si se la enfoca como un `smart portfolio builder` con AI y no como una infraestructura ya resuelta de inversion real.

La prioridad para maximizar resultado deberia ser:

1. claridad del problema;
2. diferenciacion del producto;
3. experiencia de usuario;
4. viabilidad del MVP;
5. monetizacion defendible;
6. roadmap creible sin sobrepromesa.

## Conclusion

El proyecto puede funcionar bien frente a este jurado porque combina una problematica relevante, una experiencia de usuario potencialmente fuerte y una narrativa moderna en fintech. La mejor estrategia no es parecer mas grande o mas regulado de lo que realmente es, sino mostrar un MVP concreto, inteligente y visualmente convincente, con una expansion futura bien pensada.
