# Texturizado de Agua Low-Poly — UV Unwrap, Mapeado y Shading
## Extensión: Sesiones 6-7 — aplicando las texturas de agua a `Agua_Lago` y `Agua_Cascada`

---

## 0. Antes de empezar: sobre los formatos de archivo

Se tienen las dos texturas en formato `.jpg` y `.eps`. Aclaración importante: **Blender no puede leer archivos `.eps`** en el nodo Image Texture. EPS es un formato **vectorial** (PostScript), pensado para Illustrator/Inkscape — Blender solo lee formatos de imagen **raster**: JPG, PNG, TIFF, TGA, BMP, OpenEXR, HDR, etc.

- Para este instructivo vamos a usar directamente los `.jpg` que ya tienes (`summer_background_47_a.jpg` y `Triangle_pattern_007.jpg`) — funcionan sin problema.
- Si en algún momento se necesita más resolución de la que trae el `.jpg` (por ejemplo, para un render final en alta calidad), se debe exportar el `.eps` a PNG en alta resolución desde Illustrator/Inkscape (`File > Export > PNG`, 2048px o más) y usa ese PNG en vez del JPG. El `.eps` en sí, tal cual, no sirve para Blender.

**Asignación de texturas para este proyecto:**
- `summer_background_47_a.jpg` (patrón de caustics/ondas) → `Agua_Lago` (la poza), porque imita el reflejo ondulado típico de una superficie de agua en calma.
- `Triangle_pattern_007.jpg` (degradado facetado triangular) → `Agua_Cascada`, porque su patrón geométrico refuerza visualmente el faceteado low-poly que ya tiene la malla extruida de la caída.

---

## Parte 1 — Concepto: qué es el UV Unwrapping y el mapeado UV

Antes de tocar Blender, el porqué:

- Una textura es una imagen **2D** (tiene coordenadas U y V, de 0 a 1 en cada eje — por eso "UV"). Tu malla es un objeto **3D**. Para "pegar" la imagen sobre la superficie 3D, cada vértice de la malla necesita una coordenada (u, v) que le diga **qué punto de la imagen le corresponde**.
- **Unwrap** ("desenvolver") es el proceso de aplanar la malla 3D en el plano 2D de coordenadas UV — como desarmar una caja de cartón y extenderla plana para poder imprimirle un diseño, y luego volver a armarla.
- **Seams** ("costuras") son las aristas donde le dices a Blender "corta aquí para poder aplanar sin distorsión" — igual que los patrones de costura de una prenda de ropa: sin cortes en los lugares correctos, la tela no se puede aplanar sin arrugarse.
- Para geometría casi plana (como nuestros dos planos de agua), el unwrap es simple: en muchos casos ni siquiera hace falta marcar seams — un `Unwrap` directo o un `Smart UV Project` ya da un resultado limpio, porque no hay curvas complejas que aplanar.

---

## Parte 2 — Preparar los archivos en el proyecto

1. Abre tu archivo `.blend` del diorama.
2. Cambia al workspace **Shading** (pestaña superior).
3. No hace falta "importar" las texturas por separado: las vamos a cargar directamente desde los nodos de material en la Parte 5 y 6, con el explorador de archivos integrado de Blender.
4. Recomendación de organización: copia `summer_background_47_a.jpg` y `Triangle_pattern_007.jpg` a una carpeta `texturas/` dentro de la misma carpeta donde tienes el `.blend`, para que las rutas de archivo no se rompan si mueves el proyecto.

---

## Parte 3 — UV Unwrap de `Agua_Lago` (malla simple)

1. Selecciona `Agua_Lago`.
2. Cambia al workspace **UV Editing** (pestaña superior) — verás el viewport 3D a la derecha (entra automáticamente en Edit Mode) y el editor UV vacío a la izquierda.
3. En el viewport 3D: `A` para seleccionar toda la malla.
4. Presiona `U` (menú de Unwrap) → elige **Unwrap** (la opción estándar). Como esta malla es casi plana, el resultado en el editor UV de la izquierda debería verse como un plano limpio, muy parecido a la silueta del lago.
5. Si el lago tiene una forma muy irregular (por el ajuste a las rocas de la Parte 1 del instructivo anterior) y el `Unwrap` normal se ve estirado o pisado, prueba en su lugar: `U` → **Smart UV Project** (déjalo con los valores por defecto, `Angle Limit ≈ 66°`) — genera una proyección automática que suele funcionar bien para superficies mayormente planas con algo de relieve.
6. Revisa en el editor UV que no haya caras superpuestas exactamente una sobre otra (eso causaría que la textura se repita de forma extraña). Si las ves muy encimadas, repite el paso 5 con Smart UV Project.

---

## Parte 4 — UV Unwrap de `Agua_Cascada` (malla con extrusiones)

Esta malla es más delicada porque tiene varios tramos extruidos en ángulos distintos (donde el agua "dobla" al caer) — si la desenvuelves sin seams, Blender va a intentar aplanarla toda de un solo golpe y la textura puede quedar estirada en las zonas de quiebre.

1. Selecciona `Agua_Cascada`, workspace **UV Editing**.
2. En el viewport 3D, modo arista (`2`).
3. Selecciona las aristas horizontales que están **justo en cada quiebre** entre un tramo y el siguiente (donde extruiste y cambiaste de ángulo en el instructivo anterior).
4. `Ctrl+E` → **Mark Seam** (las aristas marcadas se ven en rojo). Esto le dice a Blender "corta aquí".
5. `A` para seleccionar toda la malla.
6. `U` → **Unwrap**. Ahora, gracias a los seams, cada tramo de la caída se despliega como un rectángulo separado en el editor UV, sin estirarse en los quiebres.
7. En el editor UV (columna izquierda), selecciona cada "islote" de UV (cada tramo) y usa `G` para reacomodarlos uno debajo del otro, alineados, para que la textura fluya de forma continua verticalmente a lo largo de la caída (esto ayuda mucho a que el patrón de `Triangle_pattern_007` se vea como una caída continua en vez de fragmentos sueltos).

---

## Parte 5 — Shading: material con textura para `Agua_Lago`

Ya tienes el material `Agua_PBR` del instructivo anterior (Base Color, Metallic, Roughness, Transmission, IOR). Ahora vamos a **añadir** la textura sin destruir ese look de agua translúcida — la usamos como *bump* (relieve superficial) y como un tinte de color muy sutil, no como Base Color directo (si la pusieras directa en Base Color, perderías la transparencia/refracción que ya calibraste).

1. Selecciona `Agua_Lago`, workspace **Shading**, con el material `Agua_PBR` activo en el editor de nodos inferior.
2. `Shift+A > Texture > Image Texture`. En el nodo, clic en `Open` y selecciona `summer_background_47_a.jpg`.
3. En el desplegable `Color Space` del nodo Image Texture, dejarlo en `sRGB` (porque lo vamos a usar tanto para color como, indirectamente, para relieve).
4. `Shift+A > Vector > Bump`.
5. Arrastra (conecta manualmente) la salida `Color` del `Image Texture` hasta la entrada `Height` del nodo `Bump`.
6. Arrastra la salida `Normal` del nodo `Bump` hasta la entrada `Normal` del `Principled BSDF`.
7. En el nodo `Bump`, baja `Strength` a un valor pequeño (`0.08` a `0.15`) — queremos relieve sutil de ondas, no una superficie rugosa.
8. Para el tinte de color: `Shift+A > Color > Mix Color` (modo `Multiply`). Conecta el color base actual (`#4BA3E3`, puedes escribirlo directo en el primer socket de color del Mix, o dejar el valor tal cual estaba en Base Color) como color A, y la salida `Color` del `Image Texture` como color B. Baja el `Factor` del Mix a `0.15-0.2` (mezcla sutil). Conecta la salida del `Mix Color` a `Base Color` del `Principled BSDF`.

---

## Parte 6 — Shading: material con textura para `Agua_Cascada`

1. Selecciona `Agua_Cascada`. Si aún comparte el material `Agua_PBR` (por el `Ctrl+L` de la sesión anterior), primero desvincúlalo: en Material Properties, clic en el número junto al nombre del material (icono "2" o similar de usuarios del dato) → esto crea una copia independiente, o simplemente crea un material nuevo con `New` y renómbralo `Cascada_PBR`.
2. Copia los mismos valores base del Principled BSDF que en `Agua_PBR` (Metallic 0, Roughness 0.05, Transmission 1.0, IOR 1.333) para mantener coherencia física entre el agua del lago y la de la cascada.
3. `Shift+A > Texture > Image Texture` → `Open` → `Triangle_pattern_007.jpg`.
4. Igual que antes: `Shift+A > Vector > Bump`, conecta `Color` del Image Texture a `Height` del Bump, y `Normal` del Bump a `Normal` del Principled BSDF. `Strength ≈ 0.1-0.2` — aquí puedes ir un poco más fuerte que en el lago, porque el patrón triangular refuerza el faceteado que ya tiene la malla.
5. Tinte de color: mismo procedimiento con `Mix Color` en `Multiply`, `Factor ≈ 0.2-0.25`, mezclando el azul base con la textura.

---

## Parte 7 — Detalles adicionales para una apariencia más "pro"

Estos son opcionales, pero suman bastante con poco esfuerzo:

### 7.1 Controlar el tiling (repetición) de la textura
Si la textura se ve demasiado grande o demasiado pequeña sobre la malla:
1. `Shift+A > Input > Texture Coordinate`.
2. `Shift+A > Vector > Mapping`.
3. Conecta `UV` (salida de Texture Coordinate) → `Vector` (entrada de Mapping) → `Vector` (entrada del Image Texture, reemplazando su input por defecto).
4. En el nodo `Mapping`, sube los valores de `Scale` (X e Y) para repetir la textura más veces sobre la superficie, o bájalos para que se vea una sola vez más grande.

### 7.2 Dar sensación de movimiento en la cascada (preparación para animación futura)
En el nodo `Mapping` del material `Cascada_PBR`, el valor `Location Y` (o Z, según la orientación de tu UV) se puede animar con keyframes más adelante (Sesión 13-14, bloque de animación) para que la textura parezca "fluir" hacia abajo — no lo animes todavía, pero vale la pena dejar el nodo Mapping ya conectado desde ahora para no tener que rearmar el árbol después.

### 7.3 Fresnel para reforzar el borde del agua (efecto "vidrio de agua")
1. `Shift+A > Input > Fresnel`.
2. `Shift+A > Shader > Mix Shader`.
3. Conecta el `Principled BSDF` actual a una de las entradas de `Mix Shader`, y un segundo `Principled BSDF` (o un `Glossy BSDF` simple, Roughness bajo) a la otra entrada.
4. Conecta la salida `Fac` del nodo `Fresnel` a la entrada `Fac` del `Mix Shader`.
5. Conecta la salida del `Mix Shader` a `Material Output`.

Esto hace que los bordes de la superficie de agua (vistos en ángulo rasante) reflejen más luz, mientras que mirando de frente se vea más transparente — es el comportamiento físico real del agua y es un detalle que distingue un material "amateur" de uno "pro".

### 7.4 Variación de Roughness con la textura
En vez de dejar `Roughness = 0.05` fijo, puedes conectar el `Image Texture` (a través de un `Color Ramp` para controlar el rango) a la entrada `Roughness` del Principled BSDF, para que las zonas más claras del patrón se vean un poco más pulidas y las oscuras un poco más difusas — rompe la uniformidad perfecta de un valor fijo.

---

## Parte 8 — Verificación final

1. Cambia el shading del viewport a `Rendered` (círculo relleno en la esquina superior derecha del viewport, o `Z` → Rendered).
2. Revisa que:
   - El patrón de `summer_background_47_a` se vea como ondas sutiles sobre `Agua_Lago`, sin romper la transparencia.
   - El patrón de `Triangle_pattern_007` refuerce (no compita con) el faceteado de `Agua_Cascada`.
   - No haya estiramientos raros de textura en los quiebres de la cascada (si los hay, revisa los seams de la Parte 4).
3. `F12` para un render de prueba y comparar el resultado con el material sin textura del instructivo anterior — la diferencia debería notarse en el detalle superficial, sin perder el look translúcido del agua.

---

## Resumen de la lógica detrás de esta guía

No pusimos las texturas directamente como color: las usamos principalmente como **relieve (bump)** y **tinte sutil**, porque el agua ya tenía su apariencia física correcta (transmisión + IOR) desde el instructivo anterior — texturizar agua no es lo mismo que texturizar una roca o una pared; el objetivo es *agregar detalle de superficie* sin destruir la transparencia que ya calibraste con cuidado.
