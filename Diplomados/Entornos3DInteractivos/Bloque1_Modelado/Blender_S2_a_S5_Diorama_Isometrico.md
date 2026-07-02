# Paso a Paso en Blender — Sesiones 2 a 5
## Proyecto guía: Diorama isométrico (montaña, cascada, rocas y bosque)
### Módulo 1 · Diplomado en Desarrollo de Escenarios 3D y Entornos Virtuales Inmersivos

---

## Idea del proyecto

Construir, a lo largo de las sesiones 2 a 5, un **diorama isométrico sobre una base rectangular**: una plataforma con una montaña, una cascada, rocas y un pequeño bosque — en el mismo espíritu de las referencias que compartiste (bloque isométrico tipo "isla flotante"). El proyecto se arma **por capas, sesión a sesión**, y cada capa introduce las herramientas correspondientes al tema de esa sesión:

| Sesión | Duración | Qué se construye | Herramientas protagonistas |
|---|---|---|---|
| S2 | 2.5h | Base/plataforma + bloque inicial de montaña | Transformaciones, origen, Edit Mode básico |
| S3 | 2.5h | Relieve de la montaña + rocas + canal de la cascada | Edit Mode avanzado (extrude, inset, loop cut, bevel, bridge) |
| S4 | 4h | Árboles, bosque, tallado del río/cascada, ensamblaje | Modificadores (Mirror, Array, Subdivision, Boolean, Bevel, Solidify) |
| S5 | 2h | Organización, cámara isométrica, luz y cierre | Colecciones, *parenting*, cámara ortográfica, iluminación |

No busques igualar el nivel de detalle de las referencias (esas son piezas de portafolio profesional); el objetivo es que el resultado se vea **compuesto y presentable**, y que cada estudiante domine las herramientas en el camino.

---

## SESIÓN 2 (2.5 h) — Base, plataforma y bloque de montaña

**Objetivo:** dominar transformaciones y edición básica de malla mientras se construye la base del diorama.

### Paso a paso

1. **Preparar la escena**
   - Archivo nuevo (`File > New > General`). Borra el cubo por defecto o reutilízalo para el paso 2.
   - `Shift+C` para centrar el 3D Cursor en el origen del mundo.

2. **Crear la plataforma base**
   - `Shift+A > Mesh > Cube`.
   - En el panel N (`N`), ajustar `Dimensions` a algo como X=4, Y=4, Z=0.6 (o usar `S` + eje + número: `S X 2 Enter`, `S Y 2 Enter`, `S Z 0.3 Enter`).
   - `Ctrl+A > Scale` para aplicar la escala (deja Object y Data en el mismo estado; es el hábito que evita sorpresas con modificadores más adelante).
   - Renombrar en el Outliner: doble clic → `Base_Plataforma`.

3. **Practicar transformaciones con precisión**
   - Mover la plataforma con `G Z -0.1 Enter` y deshacerlo (`Ctrl+Z`) solo para practicar la entrada numérica.
   - Cambiar el *Pivot Point* (`.` o el menú superior del viewport) entre `Median Point` y `3D Cursor`, y rotar la plataforma 45° en Z con cada uno para **ver la diferencia** (luego deshacer, `Ctrl+Z`, hasta dejarla en 0°,0°,0°).
   - Discusión rápida: origen del objeto vs. centro geométrico.

4. **Bloque inicial de la montaña**
   - `Shift+A > Mesh > Cube` sobre la plataforma.
   - Posicionarlo centrado y algo desplazado hacia atrás (no exactamente al centro, para composición): `G` con valores numéricos, ej. `G Y -0.5 Enter`.
   - Escalar para que sea alto y algo asimétrico: `S Z 3 Enter`, luego `S X 1.3 Enter`.
   - `Ctrl+A > Scale` para aplicar.
   - Renombrar: `Montaña_Base`.

5. **Primera edición de malla (Edit Mode)**
   - `Tab` para entrar a Edit Mode sobre `Montaña_Base`.
   - Modo vértice (`1`). Selecciona la cara superior completa (`3` para modo cara, clic sobre la cara superior).
   - `E` (extrude) hacia arriba y luego `S` para escalar hacia adentro, dejando una especie de "pico" — repite 2-3 veces variando la dirección para lograr una silueta irregular tipo montaña (esto es exactamente lo que ya hicieron con la casita el primer día, aplicado ahora a una forma orgánica).
   - Selecciona vértices individuales de la punta y muévelos ligeramente en X/Y (`G X`, `G Y`) para romper la simetría perfecta.
   - `Tab` para salir de Edit Mode.

6. **Cierre de la sesión**
   - Verificar en el Outliner que existan solo `Base_Plataforma` y `Montaña_Base`, bien nombrados.
   - Guardar como `ApellidoNombre_S2.blend`.

### Tarea independiente (para S3)
- Seguir ajustando la silueta de `Montaña_Base` **solo moviendo vértices existentes** (sin herramientas nuevas) hasta lograr una forma de pico creíble desde varios ángulos.
- Traer el archivo `.blend` guardado.

---

## SESIÓN 3 (2.5 h) — Relieve de montaña, canal de cascada y rocas

**Objetivo:** dar detalle a la montaña y modelar las rocas usando herramientas avanzadas de Edit Mode.

### Paso a paso

1. **Añadir densidad de malla a la montaña**
   - Seleccionar `Montaña_Base`, `Tab` a Edit Mode.
   - `Ctrl+R` sobre una de las caras laterales para insertar un *loop cut*; ajustar la cantidad de cortes con la rueda del mouse antes de confirmar (2-3 cortes horizontales).
   - Repetir en otra cara para tener suficiente geometría donde trabajar el relieve.

2. **Facetado tipo "low-poly rocoso"**
   - Con modo cara (`3`), seleccionar caras alternas de las laderas (selección manual, `Shift+clic`).
   - `E` (extrude) muy poco hacia afuera a lo largo de la normal (`Alt+E > Extrude Faces Along Normals` con un valor pequeño), y luego escalar levemente (`S`) para crear facetas irregulares — es el look "low-poly" de la referencia.

3. **Canal de la cascada**
   - Selecciona una franja vertical de caras en la ladera frontal (de arriba hacia abajo).
   - `I` (Inset Faces) para crear un borde interior a lo largo de esa franja.
   - `E` seguido de moverlo levemente hacia adentro (`G` sobre el eje de la normal) para hundir el canal — repite en 2-3 tramos para simular un cauce escalonado (como una cascada con varios saltos).
   - Si el canal queda con huecos entre tramos, usa `Bridge Edge Loops` (seleccionar los dos bordes abiertos → clic derecho → `Bridge Edge Loops`) para conectar suavemente.

4. **Modelar el set de rocas**
   - Fuera de la montaña (en la base, cerca de donde caerá el agua): `Shift+A > Mesh > Ico Sphere`.
   - `Tab` a Edit Mode, aplanar un poco (`S Z 0.5`), luego usar `I` (inset) y `E` (extrude) sobre varias caras para romper la forma esférica en facetas angulosas tipo roca.
   - Escalar de forma no uniforme (`S X`, `S Y`, `S Z` con valores distintos) para que no se vea como una esfera perfecta.
   - Renombrar: `Roca_01`. Duplicar (`Shift+D`) 2 veces más y editar cada copia ligeramente para variar formas: `Roca_02`, `Roca_03`.

5. **Revisión de normales**
   - En el Overlay del viewport, activar `Face Orientation` para verificar que no haya caras azules (invertidas). Si aparecen, seleccionar esas caras y `Shift+N` (Recalculate Normals).

6. **Cierre de la sesión**
   - Guardar como `ApellidoNombre_S3.blend`.

### Tarea independiente (para S4)
- Modelar 2 rocas adicionales variando la forma con las mismas herramientas (para tener un set de 5 rocas listo).
- Revisar que ninguna tenga normales invertidas.

---

## SESIÓN 4 (4 h) — Modificadores no destructivos y ensamblaje del diorama

**Objetivo:** poblar la escena con vegetación y agua usando modificadores, y ensamblar el diorama completo.

### Paso a paso

1. **Construir el árbol base (30 min)**
   - Tronco: `Shift+A > Mesh > Cylinder`, radio pequeño, altura media. Renombrar `Tronco_Base`.
   - Follaje: `Shift+A > Mesh > Ico Sphere` sobre el tronco. Renombrar `Follaje_Base`.
   - Seleccionar `Follaje_Base` → `Object > Shade Smooth`.
   - Con `Follaje_Base` seleccionado, agregar modificador **Subdivision Surface** (Properties → ícono de llave inglesa → `Add Modifier`), 1-2 niveles, para redondearlo sin necesidad de más geometría manual.
   - Seleccionar ambos objetos (`Follaje_Base` y luego, con `Shift+clic`, `Tronco_Base` al final) y `Ctrl+P > Object (Keep Transform)` para hacer *parenting* del follaje al tronco. Esto los convierte en una unidad que se mueve junta.

2. **Modificador Mirror (30 min)**
   - Elegir un elemento asimétrico ya creado (por ejemplo, si tallaron el canal de la cascada solo de un lado, o si crean un elemento nuevo simétrico como un arco de piedra).
   - Agregar modificador **Mirror**, eje X o Y según el caso, y activar `Clipping` para que no se separen las mitades en el centro.
   - Ajustar el objeto original y observar cómo el espejo se actualiza en tiempo real — este es el ejemplo en vivo del concepto de *stack* de modificadores como *pipeline*.

3. **Modificador Array — el bosque (45 min)**
   - Seleccionar el árbol (tronco con follaje ya *parented*).
   - Agregar modificador **Array** al tronco (o duplicar manualmente con `Alt+D` — duplicado vinculado — y variar transform si prefieres control total en vez de Array).
   - Alternativa recomendada para variedad visual: usar `Shift+D` (duplicar) 6-8 veces, variando ligeramente escala (`S`) y rotación en Z (`R Z`) de cada copia, distribuyéndolas en un costado de la plataforma como "bosque". Explicar que Array es ideal para patrones regulares (cercas, escalones), mientras que para vegetación natural se prefiere variación manual o partículas (tema de sesiones futuras).

4. **Modificador Boolean — tallar el cauce en la plataforma (45 min)**
   - Crear un cilindro alargado y curvo (o una serie de cilindros conectados) que represente el camino del agua desde la base de la cascada hasta el borde de la plataforma. Renombrar `Cortador_Rio` (temporal).
   - Seleccionar `Base_Plataforma`, agregar modificador **Boolean**, tipo `Difference`, objeto objetivo = `Cortador_Rio`.
   - Verificar el resultado (debe verse un canal hundido en la plataforma). Ocultar `Cortador_Rio` (icono de ojo) — **no lo borres todavía**, el modificador lo sigue necesitando mientras no se aplique.

5. **Modificador Bevel — pulir bordes (20 min)**
   - Seleccionar `Base_Plataforma`, agregar modificador **Bevel**, cantidad pequeña (ej. 0.02-0.05), 2-3 segmentos, para suavizar las aristas duras de la plataforma.

6. **Modificador Solidify (opcional, 15 min)**
   - Si alguien modeló hojas o elementos planos tipo "billboard", agregar **Solidify** para darles grosor real sin editar la malla.

7. **Ensamblaje guiado del diorama (75 min)**
   - Distribuir sobre la plataforma: la montaña con su cascada, las 5 rocas (variando posición/rotación/escala con `G`/`R`/`S`), y el bosque de árboles duplicados.
   - Ajustar posiciones para que las rocas queden "al pie" de la cascada y el bosque ocupe un costado, dejando espacio de "agua visible" cerca del cauce tallado.
   - Revisión visual desde varios ángulos (`Numpad 1`, `3`, `7`, y órbita libre) buscando composición equilibrada, como en las imágenes de referencia.

### Tarea independiente (para S5)
- Agregar 2-3 elementos adicionales de vegetación (arbustos con Ico Sphere + Subdivision, por ejemplo) aplicando al menos 2 modificadores distintos a cada uno.
- Dejar el archivo guardado como `ApellidoNombre_S4.blend`.

---

## SESIÓN 5 (2 h) — Organización, cámara isométrica, luz y cierre

**Objetivo:** dejar el archivo organizado profesionalmente y presentar el diorama con una vista isométrica iluminada.

### Paso a paso

1. **Colecciones (20 min)**
   - En el Outliner, clic derecho → `New Collection`. Crear: `Terreno`, `Vegetación`, `Rocas_Agua`, `Camara_Luz`.
   - Arrastrar cada objeto a su colección correspondiente (`Base_Plataforma` y `Montaña_Base` → `Terreno`; árboles → `Vegetación`; rocas → `Rocas_Agua`).

2. **Convención de nombres (10 min)**
   - Revisar y renombrar todo con un patrón consistente, por ejemplo: `Terreno_Plataforma`, `Terreno_Montaña`, `Vegetacion_Arbol_01`, `Roca_01`, etc.

3. **Parenting final (10 min)**
   - Si no se hizo antes, agrupar todos los árboles bajo un Empty (`Shift+A > Empty > Plain Axes`, renombrar `Bosque_Origen`) usando `Ctrl+P > Object (Keep Transform)` para poder mover/escalar el bosque completo como unidad si hace falta.

4. **Decisión sobre aplicar modificadores (10 min)**
   - Discutir cuándo conviene `Apply` (Ctrl+clic derecho sobre el modificador, o desde el menú del modificador) vs. dejarlos activos: aplicar el Boolean del río si ya no se va a tocar el corte; dejar Subdivision y Bevel sin aplicar por si se ajustan luego.

5. **Cámara isométrica (30 min)**
   - `Shift+A > Camera`.
   - Con la cámara seleccionada, en Properties de cámara (icono de cámara) cambiar `Lens > Type` a `Orthographic`.
   - Posicionar la cámara: la forma más rápida es orbitar el viewport a un ángulo agradable (usar `Numpad 4/6/8/2` para rotar en pasos fijos desde una vista frontal) y luego `Ctrl+Alt+Numpad 0` para alinear la cámara a la vista actual. Para un isométrico "de manual" más preciso, ajustar manualmente `Rotation X ≈ 54.7°`, `Rotation Z ≈ 45°` en el panel N de la cámara.
   - Ajustar `Orthographic Scale` para encuadrar toda la plataforma con algo de margen.

6. **Iluminación básica (20 min)**
   - `Shift+A > Light > Sun`. Rotar para que la luz llegue en diagonal (buen contraste de sombras, como en la referencia).
   - En `World Properties`, cambiar el color de fondo a un tono oscuro (azul petróleo, similar a la referencia) para que el diorama resalte.
   - Opcional: agregar una segunda luz `Point` suave para rellenar sombras muy duras.

7. **Revisión entre pares y cierre (30 min)**
   - Checklist final: normales correctas (Face Orientation), colecciones bien organizadas, nombres consistentes, cámara ortográfica encuadrando bien la escena.
   - Render de prueba: `F12` para ver el resultado con Eevee (aunque materiales y texturas llegan la próxima semana, ya se puede apreciar la composición y el volumen).
   - Guardar como `ApellidoNombre_S5.blend`.

### Cierre del bloque
Con esto queda listo el bloque de **modelado** (S1-S5): el diorama tiene forma, volumen, organización y una cámara isométrica funcional. La próxima semana (S6 en adelante) se trabaja sobre esta misma escena para aplicar materiales, texturizado e iluminación avanzada, hasta llegar al render final.
