# Sistemas de partículas en Blender
### Fundamentos, emisores, fuerzas, simulación de humo/fuego/agua y Metaballs como alternativa

---

## 1. Objetivo

Comprender los fundamentos de los **sistemas de partículas** en Blender —geometría de emisores, tipos de emisión y campos de fuerza— y aplicarlos en dos vías paralelas:

1. **Simulación física** (humo, fuego y agua) usando el sistema de partículas combinado con el simulador de fluidos (Mantaflow).
2. **Metaballs** como alternativa geométrica/estilizada para representar masas fluidas (gotas, salpicaduras, formas orgánicas) sin depender de una simulación física completa.

---

## 2. Requisitos previos

| Elemento | Detalle |
|---|---|
| Blender | Versión 3.6 LTS o superior (4.x recomendado) |
| Hardware | Preferible GPU con soporte OpenVDB/CUDA para bakes de fluido más rápidos (no obligatorio para escenas simples) |
| Conocimientos previos | Navegación básica del viewport, Object Mode / Edit Mode, línea de tiempo y keyframes |

---

## 3. Fundamentos de un sistema de partículas

### 3.1 ¿Qué es un sistema de partículas?

Un **Particle System** genera automáticamente muchas copias de un elemento (puntos, geometría o pelo) a partir de un objeto llamado **emisor**. Cada partícula individual tiene su propio: posición inicial, velocidad, tiempo de vida (*lifetime*), tamaño y, opcionalmente, rotación — todo controlado por reglas generales en lugar de animarse a mano una por una.

### 3.2 Los dos modos principales

Blender distingue dos modos de sistema de partículas en el mismo panel (`Particle Properties`):

| Modo | Uso típico |
|---|---|
| **Emitter** | Partículas que nacen, se mueven durante su *lifetime* y (opcionalmente) mueren. Es el modo usado para humo, fuego, chispas, lluvia, agua, polvo, multitudes, etc. |
| **Hair** | Partículas estáticas usadas para generar geometría tipo cabello/pasto/pelo sobre la superficie del emisor. No se usa para simulación de fluidos, pero comparte el mismo panel de configuración de emisión. |

Este instructivo se centra en el modo **Emitter**.

### 3.3 Ciclo de vida de una partícula

Toda partícula, sin importar el tipo de emisión, pasa por:

1. **Nacimiento (Emission):** aparece en un punto de la geometría del emisor, en un fotograma dentro del rango `Start`–`End`.
2. **Vida activa (Lifetime):** se mueve según su velocidad inicial y las fuerzas que actúan sobre ella (gravedad, viento, turbulencia, etc.).
3. **Muerte:** desaparece al cumplir su `Lifetime` (en fotogramas), o antes si choca con una colisión configurada como absorbente.

---

## 4. Geometría de los emisores

El emisor es cualquier objeto de malla; su **geometría determina desde dónde nacen las partículas**. Esto se configura en `Particle Properties → Emission → Source`:

| Fuente (Source) | Comportamiento |
|---|---|
| **Verts (vértices)** | Las partículas nacen exactamente en los vértices de la malla. Útil para emisiones puntuales controladas (ej. chispas en puntos específicos de un objeto). |
| **Faces (caras)** | Las partículas nacen distribuidas sobre la superficie de las caras, ponderadas por su área. Es la opción más común para humo, fuego superficial, pasto, lluvia sobre un plano, etc. |
| **Volume (volumen)** | Las partículas nacen distribuidas dentro del volumen cerrado de la malla (requiere que la malla sea *manifold*, es decir, sin agujeros). Se usa para simulaciones donde el emisor es un cuerpo sólido completo (ej. una esfera que "emite" partículas desde su interior, o como dominio de fluido). |

**Parámetros adicionales relevantes:**

- `Emit From → Random`: distribuye el nacimiento de forma aleatoria dentro de la fuente elegida, en vez de uniformemente.
- `Even Distribution`: reparte las partículas proporcionalmente al área de cada cara, evitando que caras grandes concentren más partículas que caras pequeñas de forma desigual.

**Regla práctica:** para *humo* y *fuego* casi siempre el emisor es un objeto pequeño (una esfera, un plano, o el propio modelo de una fogata) que actúa como **Flow** dentro de un dominio de fluido (ver sección 8), más que un sistema de partículas puro. Para *chispas*, *polvo* o *salpicaduras decorativas* sí se usa un sistema de partículas clásico con `Source: Faces` o `Verts`.

---

## 5. Tipos de emisión (Emission settings)

Dentro de `Particle Properties → Emission`:

| Parámetro | Función |
|---|---|
| **Number** | Cantidad total de partículas generadas durante todo el rango de emisión. |
| **Start / End** | Fotogramas en los que comienza y termina el nacimiento de nuevas partículas. |
| **Lifetime** | Duración en fotogramas de cada partícula desde su nacimiento. |
| **Lifetime Randomness** | Variación aleatoria del *lifetime*, para que no todas mueran exactamente al mismo tiempo. |

Dentro de `Particle Properties → Velocity`:

| Parámetro | Función |
|---|---|
| **Normal** | Velocidad inicial en la dirección normal a la superficie del emisor (hacia "afuera"). Es la opción más usada: hace que humo/chispas/agua salgan perpendiculares a la superficie de origen. |
| **Tangent** | Velocidad inicial tangente a la superficie (paralela a ella), útil para efectos de "barrido" sobre una superficie. |
| **Object Aligned / Object Velocity** | La partícula hereda velocidad del movimiento del propio emisor (útil si el emisor se está desplazando, ej. una varita mágica en movimiento dejando un rastro de chispas). |
| **Random** | Aleatoriedad adicional aplicada sobre cualquiera de las anteriores, para romper la uniformidad. |

---

## 6. Fuerzas y física (Force Fields)

### 6.1 Panel de física de la partícula

En `Particle Properties → Physics`, el campo `Physics Type` determina cómo se comportan las partículas después de nacer:

| Physics Type | Comportamiento |
|---|---|
| **None** | Las partículas se mueven en línea recta según su velocidad inicial, sin física adicional. |
| **Newtonian** | Aplica física realista: gravedad, masa, arrastre (drag) y respuesta a **Force Fields** de la escena. Es el modo usado para humo, fuego, agua y la mayoría de simulaciones. |
| **Fluid** | Modo legado de partículas tipo SPH (Smoothed Particle Hydrodynamics); en versiones actuales de Blender se recomienda usar el simulador **Mantaflow** (sección 8) en lugar de este modo. |
| **Boids** | Simula comportamiento de bandada/enjambre (evitar obstáculos, seguir un líder), útil para multitudes o cardúmenes, no cubierto en este instructivo. |

### 6.2 Force Fields (campos de fuerza)

Un **Force Field** es un objeto especial (`Shift+A → Force Field`) que influye sobre partículas, simulaciones de tela, fluido o suave (soft body) cercanas. Los más relevantes para humo/fuego/agua:

| Campo de fuerza | Efecto típico |
|---|---|
| **Wind (viento)** | Empuja partículas en una dirección constante; útil para inclinar humo o dispersar chispas. |
| **Turbulence (turbulencia)** | Añade movimiento caótico tipo ruido; esencial para que el humo se vea orgánico en vez de una columna recta. |
| **Vortex (vórtice)** | Genera un movimiento giratorio alrededor de un eje; útil para remolinos de humo o agua. |
| **Drag (arrastre)** | Frena las partículas progresivamente, simulando resistencia del aire/medio. |
| **Force (fuerza radial)** | Atrae o repele partículas desde un punto central; útil para explosiones o implosiones. |

### 6.3 Field Weights

Cada sistema de partículas tiene su propio panel `Field Weights`, donde se ajusta cuánto le afecta cada tipo de fuerza (incluida la gravedad global de la escena) — permite, por ejemplo, que el humo casi no sea afectado por la gravedad pero sí fuertemente por el viento y la turbulencia.

---

## 7. Paso a paso: humo con un sistema de partículas clásico (introducción rápida)

Antes de pasar al simulador de fluidos (más realista), este ejercicio corto ilustra los conceptos de las secciones 3 a 6 con un sistema de partículas simple:

1. Añadir una esfera pequeña (`Shift+A → Mesh → UV Sphere`), escalarla pequeña (`S`, `0.2`) — será el emisor.
2. Con la esfera seleccionada: `Particle Properties → +` (nuevo sistema) → `Type: Emitter`.
3. `Emission`: `Number: 200`, `Start: 1`, `End: 60`, `Lifetime: 90`.
4. `Velocity`: `Normal: 1.0` (las partículas salen hacia arriba/afuera de la esfera).
5. `Physics: Newtonian`, bajar `Weight → Gravity` a `0.1` (el humo casi no cae).
6. Añadir un campo de fuerza `Shift+A → Force Field → Turbulence`, subir `Strength` a `1.5`, ubicarlo sobre la esfera.
7. En `Render → Render As`, cambiar de `Halo` a `Object` y asignar una malla simple (ej. un plano con textura de humo/nube, o dejar `Halo` para una prueba conceptual rápida).
8. Reproducir (`Alt+A`) y observar cómo la turbulencia rompe la trayectoria recta de las partículas.

> Este método es útil para **efectos estilizados o de fondo** (poco costo computacional), pero para humo/fuego con aspecto fotorrealista se recomienda el flujo de la sección 8.

---

## 8. Paso a paso: humo y fuego realistas (Mantaflow / Quick Smoke)

### 8.1 Conceptos clave del simulador de fluidos gaseosos

- **Domain (dominio):** un objeto (normalmente un cubo) que define el volumen del espacio donde se calcula la simulación. Nada fuera del dominio se simula.
- **Flow (flujo):** el objeto que **emite** humo/fuego/densidad dentro del dominio (equivalente al "emisor" del sistema de partículas, pero integrado al simulador de fluidos).
- **Effector (efector):** objetos que colisionan o desvían el humo (ej. un obstáculo sólido dentro del dominio).

### 8.2 Procedimiento — Humo

1. Añadir el objeto que emitirá humo, por ejemplo un `Ico Sphere` pequeño (`Shift+A → Mesh → Ico Sphere`), ubicado cerca del suelo del dominio.
2. Con ese objeto seleccionado: `Physics Properties → Fluid → +Fluid`.
3. `Type: Flow` → `Flow Type: Smoke` → `Flow Behavior: Inflow` (emite humo de forma continua mientras esté activo).
4. Añadir un cubo grande alrededor de la escena (`Shift+A → Mesh → Cube`, escalarlo para cubrir el área donde se espera que el humo se expanda).
5. Con el cubo seleccionado: `Physics Properties → Fluid → +Fluid` → `Type: Domain` → `Domain Type: Gas`.
6. En el panel del **Domain**, ajustar `Resolution Divisions` (ej. `64` para pruebas rápidas, `128+` para calidad final — mayor resolución = más detalle y más tiempo de cómputo).
7. (Opcional) Añadir un campo de fuerza `Turbulence` dentro del dominio para que el humo se vea más orgánico, tal como en la sección 6.2.
8. Ir a `Physics Properties` del **Domain** → `Cache → Bake` (o `Bake All`) para precalcular la simulación fotograma a fotograma.
9. Reproducir (`Alt+A`): el humo debería ascender y disiparse. Ajustar `Domain → Smoke → Density` y `Adaptive Domain` (activarlo para que el dominio se expanda solo hacia donde el humo se propaga, optimizando el cómputo).

### 8.3 Procedimiento — Fuego (extensión del anterior)

1. Sobre el mismo objeto Flow: cambiar `Flow Type` de `Smoke` a **`Fire + Smoke`**.
2. Ajustar `Fuel` (cantidad de "combustible" inicial de cada partícula de flujo) y `Temperature` (qué tan caliente nace, determina si genera llama visible además de humo).
3. En el **Domain**, ir a `Shading` dentro del panel de Fluid: Blender genera automáticamente un material de volumen con gradiente de color fuego→humo (naranja/amarillo → gris), editable en el `Shader Editor` sobre el nodo `Principled Volume`.
4. Volver a hacer `Bake` en el Domain para recalcular con la nueva configuración de fuego.
5. Para que el fuego ilumine la escena, activar en el Domain: `Shading → Fire → usar como fuente de luz` (`Flame` afecta iluminación indirecta si el motor de render es Cycles con volumetrics activos).

### 8.4 Procedimiento — Agua (líquido)

1. Añadir el objeto que actuará como cuerpo de agua inicial, por ejemplo una esfera o un volumen dentro de un contenedor (`Shift+A → Mesh`).
2. Con ese objeto seleccionado: `Physics Properties → Fluid → +Fluid` → `Type: Flow` → `Flow Type: Liquid` → `Flow Behavior: Geometry` (si representa un volumen inicial de agua ya existente) o `Inflow` (si el agua debe seguir entrando, como un grifo).
3. Añadir el **Domain**: un cubo que contenga todo el volumen donde el agua caerá/se moverá → `Physics Properties → Fluid → +Fluid` → `Type: Domain` → `Domain Type: Liquid`.
4. Añadir un plano o malla como **Effector** (`+Fluid → Type: Effector`) para que actúe como el "recipiente" o suelo que contiene el agua.
5. En el Domain, ajustar `Resolution Divisions` (el agua suele necesitar resolución más alta que el humo para que las gotas/salpicaduras se vean bien, ej. `96–150`).
6. Activar `Mesh` dentro del panel del Domain (`Mesh → Use Mesh`) para que el simulador genere una malla sólida de superficie de agua (necesario para renderizar el líquido con reflejos/refracciones reales, a diferencia del humo que se renderiza como volumen).
7. `Bake` el Domain.
8. Aplicar un material de vidrio/agua (`Principled BSDF` con `Transmission: 1.0`, `IOR: 1.33`, `Roughness` bajo) a la malla generada por el Domain (`Domain → Mesh → Use Mesh`, el objeto expone una malla renderizable).

---

## 9. Resumen comparativo (partículas puras vs. Mantaflow)

| Aspecto | Sistema de partículas clásico | Mantaflow (Domain/Flow) |
|---|---|---|
| Costo de cómputo | Bajo | Medio–alto (requiere bake) |
| Realismo físico | Estilizado / aproximado | Alto (resuelve ecuaciones de fluido) |
| Control artístico directo | Alto (cada parámetro es directo) | Indirecto (se ajustan condiciones de borde) |
| Uso recomendado | Chispas, polvo, hojas, multitudes, efectos rápidos | Humo, fuego, agua realistas |

---

## 10. Metaballs como alternativa

### 10.1 Fundamentos: ¿qué es una Metaball?

Una **Metaball** es una **superficie implícita**: en lugar de definirse por vértices y caras como una malla poligonal, se define matemáticamente como la región del espacio donde un campo de "influencia" (generado por uno o más objetos metaball) supera un **umbral (Threshold)**. Cuando dos metaballs se acercan lo suficiente, sus campos de influencia se **fusionan suavemente** — este comportamiento de "gotas que se unen" es exactamente lo que las hace útiles para simular masas líquidas u orgánicas sin resolver física de fluidos real.

### 10.2 Tipos de Metaball (`Shift+A → Metaball`)

| Tipo | Forma base |
|---|---|
| **Ball** | Esfera — la más usada como unidad básica de "gota". |
| **Capsule** | Cápsula alargada. |
| **Plane** | Plano — útil como base que "absorbe" a las demás. |
| **Ellipsoid** | Elipsoide (esfera achatada/alargada en ejes distintos). |
| **Cube** | Cubo con esquinas suavizadas por el campo de influencia. |

### 10.3 Parámetros clave (`Object Data Properties` de la Metaball)

| Parámetro | Función |
|---|---|
| **Threshold** | Nivel del campo de influencia a partir del cual se considera "sólido". Valores más bajos = formas más grandes/infladas; valores más altos = formas más ajustadas al centro. |
| **Stiffness** | Qué tan rápido decae el campo de influencia de cada metaball individual (afecta cuán "pegajosa" se ve la fusión entre dos metaballs cercanas). |
| **Resolution (Viewport / Render)** | Densidad de la malla generada para previsualizar (viewport, más baja para rendimiento) vs. renderizar (más alta para calidad final). |
| **Negative** | Convierte la metaball en un "sustractor" de campo, útil para crear huecos/hendiduras en la masa fusionada. |

> **Nota importante:** todas las metaballs que comparten el **mismo prefijo de nombre base** (ej. `Mball`, `Mball.001`, `Mball.002`) se fusionan entre sí como un único objeto renderizado; metaballs con nombre base distinto no interactúan entre sí. Esto permite tener varios "grupos" independientes de metaballs en la misma escena.

### 10.4 Paso a paso: usar Metaballs para simular una masa líquida (alternativa a Mantaflow)

1. `Shift+A → Metaball → Ball` para crear la primera metaball; renombrarla `Mball` (será el nombre base del grupo).
2. Duplicar (`Shift+D`) varias copias pequeñas (`Mball.001`, `Mball.002`, etc. — Blender las renombra automáticamente al duplicar) y distribuirlas cerca unas de otras: al acercarse, sus superficies se fusionan visualmente formando una masa continua, similar a una gota de agua o mercurio.
3. Ajustar `Threshold` (sección 10.3) hasta lograr el balance deseado entre "gotas separadas" y "masa fusionada".
4. Animar el desplazamiento de cada metaball individual con keyframes de posición (`I → Location`) para simular movimiento (ej. gotas cayendo y fusionándose al tocar una superficie, o una masa que se estira y se separa).
5. Para simular **salpicaduras**, animar la escala (`I → Scale`) de metaballs pequeñas apareciendo súbitamente alrededor del punto de impacto y luego reduciéndose a cero (desapareciendo) — un método mucho más liviano que un `Bake` de líquido en Mantaflow.
6. Aplicar el mismo tipo de material de agua/vidrio descrito en la sección 8.4 (`Principled BSDF` con `Transmission` alto) al objeto metaball resultante.
7. (Opcional) Combinar con un sistema de partículas: configurar un emisor con `Render As: Object`, asignando como objeto renderizado una metaball pequeña — cada partícula generada "dibuja" una metaball individual, y al estar cerca unas de otras se fusionan automáticamente, generando efectos de "masa líquida generativa" (ej. un chorro de agua compuesto por muchas metaballs pequeñas que se funden entre sí) sin necesidad de calcular un dominio de fluido completo.

### 10.5 Cuándo usar Metaballs en vez de Mantaflow

| Escenario | Recomendación |
|---|---|
| Se necesita física de fluido real (colisiones con obstáculos, ondas, oleaje) | Mantaflow (Domain/Flow) |
| Se necesita iterar rápido, sin tiempos de bake, con estética estilizada u orgánica | Metaballs |
| Escena con hardware limitado o restricciones de tiempo de render | Metaballs (mucho más liviano) |
| Gotas, mercurio líquido, formas orgánicas tipo "blob", transiciones morfológicas | Metaballs |
| Humo, fuego (Metaballs no aplica de forma natural — están pensadas para superficies sólidas, no volúmenes gaseosos) | Mantaflow |

---

## 11. Glosario de términos clave

| Término | Definición breve |
|---|---|
| **Emisor** | Objeto de malla desde el cual nacen las partículas. |
| **Source (Verts/Faces/Volume)** | Región geométrica del emisor desde donde nacen las partículas. |
| **Lifetime** | Duración en fotogramas de cada partícula individual. |
| **Force Field** | Objeto que aplica una fuerza (viento, turbulencia, vórtice, etc.) sobre partículas o simulaciones cercanas. |
| **Domain** | Volumen (generalmente un cubo) donde se calcula una simulación de fluido (Mantaflow). |
| **Flow** | Objeto que emite densidad de humo/fuego/líquido dentro de un Domain. |
| **Effector** | Objeto que colisiona o interactúa con una simulación de fluido sin ser el emisor. |
| **Bake** | Precálculo de una simulación física, fotograma a fotograma, guardado en caché. |
| **Metaball** | Superficie implícita definida por un campo de influencia que se fusiona con otras metaballs cercanas. |
| **Threshold** | Umbral del campo de influencia de una metaball a partir del cual se considera parte de la superficie sólida. |
| **Adaptive Domain** | Opción del Domain de Mantaflow que expande/contrae automáticamente el volumen de cálculo según donde se propaga la simulación. |

---
