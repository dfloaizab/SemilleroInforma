# Farolito Decorativo para el Diorama
## Extensión — modelado low-poly + material emisivo + luz real (Point Light)

Este instructivo combina dos bloques ya trabajados: **modelado con Edit Mode y modificadores** (Sesiones 2-5) y **luces** (Sesión 10). El resultado es un farolito que no solo se ve encendido (material emisivo), sino que **ilumina de verdad** su entorno cercano en la escena, gracias a una luz Point real colocada dentro de la cabeza del farol.

---

## Parte 1 — Modelado del poste y la base

1. `Shift+A > Mesh > Cylinder`. En el panel "Adjust Last Operation" (F6): `Vertices = 8` (mantiene el estilo low-poly), `Radius = 0.03 m`, `Depth = 0.6 m`.
2. Renombrar: `Farol_Poste`.
3. `Tab` a Edit Mode, modo cara (`3`). Seleccionar la cara inferior del cilindro.
4. `E` (extrude) hacia abajo apenas (`G Z -0.02`), luego `S 1.6` (escalar hacia afuera) para crear una pequeña base/pedestal que ancle el poste al terreno.
5. Seleccionar la arista superior del cilindro, `Ctrl+B` (Bevel), un segmento pequeño, para suavizar el borde superior donde luego se apoyará la cabeza del farol.
6. `Tab` de vuelta a Object Mode.

---

## Parte 2 — Modelado de la cabeza del farol (housing)

1. `Shift+A > Mesh > Cube`, posicionado en la parte superior del poste (`G Z` para alinearlo con el extremo superior de `Farol_Poste`).
2. `S 0.06` (aprox.) para reducirlo a un tamaño proporcional al poste.
3. `Tab` a Edit Mode. Seleccionar todas las caras verticales (modo cara, `Shift+clic` en cada una) e `I` (Inset Faces) con un valor pequeño, para crear un marco/moldura en cada cara — simula la estructura metálica que sostiene el vidrio.
4. Extruir (`E`) muy levemente hacia adentro las caras centrales resultantes del inset, para dar una sensación de profundidad entre el marco y el vidrio.
5. Renombrar: `Farol_Cabeza`.
6. Agregar modificador **Bevel** (Properties → Modifiers → Generate → Bevel), cantidad pequeña, 2 segmentos, para quitarle dureza a las aristas rectas del cubo.

---

## Parte 3 — El "vidrio" / bombilla

1. `Shift+A > Mesh > Ico Sphere`, `Subdivisions = 1`, `Radius` pequeño, ubicada en el centro exacto de `Farol_Cabeza`.
2. Renombrar: `Farol_Bombilla`.
3. `Object > Shade Smooth` (clic derecho sobre el objeto en Object Mode → Shade Smooth), para que se vea como una esfera de vidrio y no como un poliedro facetado.

---

## Parte 4 — Material metálico del poste y la cabeza

1. Seleccionar `Farol_Poste`, workspace **Shading**, `New` material. Renombrar: `Metal_Farol`.
2. En el `Principled BSDF`: `Base Color` gris oscuro/negro (ej. `#2B2B2B`), `Metallic = 0.8`, `Roughness = 0.35`.
3. Seleccionar `Farol_Cabeza`, `Ctrl+L > Link Materials` (con `Farol_Poste` como último seleccionado/activo) para que comparta el mismo material metálico.

---

## Parte 5 — Material emisivo de la bombilla

1. Seleccionar `Farol_Bombilla`, `New` material. Renombrar: `Vidrio_Emisivo`.
2. En el `Principled BSDF`: `Base Color` amarillo-anaranjado cálido (ej. `#FFC170`).
3. Bajar a la sección `Emission` del mismo nodo: `Emission Color` el mismo tono cálido, `Emission Strength = 15-25` (ajustar según qué tan intenso se vea el "foco" en el render — valores altos generan además un efecto de resplandor/bloom si está activado en Render Properties → `Bloom`).
4. Opcional: `Transmission = 0.3-0.5` para dar una ligera sensación de vidrio translúcido detrás del brillo emisivo.

> Nota conceptual: el canal `Emission` hace que el objeto **se vea** como si emitiera luz (aporta brillo a la superficie misma), pero **no proyecta luz real** sobre los demás objetos de la escena — para eso se necesita una luz real, que es el siguiente paso.

---

## Parte 6 — Luz real dentro del farol

1. `Shift+A > Light > Point`, ubicada en el mismo punto donde está `Farol_Bombilla` (usar `Shift+S > Cursor to Selected` con la bombilla seleccionada, luego `Shift+A` para que la luz nueva se cree justo en el 3D Cursor).
2. Renombrar: `Farol_Luz`.
3. Object Data Properties (ícono de bombilla): `Power = 15-25 W`, `Color` igual al tono cálido usado en el material emisivo (`#FFC170`), `Radius = 0.03 m` (un radio pequeño da sombras más definidas, apropiado para una fuente puntual pequeña como esta).
4. **Parenting**: seleccionar `Farol_Luz`, luego con `Shift+clic` seleccionar `Farol_Poste` en último lugar (objeto activo), `Ctrl+P > Object (Keep Transform)`. Esto asegura que si mueves o duplicas el farol completo más adelante, la luz se mueve junto con él.
5. Repetir el parenting con `Farol_Cabeza` y `Farol_Bombilla` respecto a `Farol_Poste`, si no quedaron ya agrupados, para que el farolito se comporte como una sola unidad.

---

## Parte 7 — Ubicación en la escena y organización

1. Posicionar el farolito en un punto relevante de la composición: junto al borde del cauce, en el inicio del área boscosa, o marcando la entrada al sendero — un solo farolito bien ubicado suele aportar más que varios repartidos sin criterio compositivo.
2. En el Outliner, crear (si no existe) una colección `Props_Iluminacion` y mover ahí `Farol_Poste`, `Farol_Cabeza`, `Farol_Bombilla` y `Farol_Luz`.
3. Renombrar el conjunto de forma consistente con la convención ya establecida en la Sesión 5 (ej. `Prop_Farol_01`).

---

## Parte 8 — Variante opcional: varios farolitos con Array

Si el diorama contempla un sendero con varios farolitos:

1. Seleccionar el conjunto completo del farolito (los cuatro objetos, o mejor, agruparlos primero bajo un Empty: `Shift+A > Empty > Plain Axes`, renombrar `Farol_Grupo`, y hacer `Ctrl+P > Object (Keep Transform)` de los cuatro objetos hacia ese Empty).
2. Con `Farol_Grupo` seleccionado, `Alt+D` (duplicado vinculado) para crear copias que compartan datos de malla y material, distribuidas manualmente a lo largo del sendero con `G` — esta técnica es más adecuada que un modificador Array cuando el camino no es perfectamente recto (como suele ocurrir en un terreno con relieve como el de este diorama).

---

## Parte 9 — Verificación final

1. Cambiar el shading del viewport a `Rendered`.
2. Confirmar que el resplandor de `Farol_Bombilla` (Emission) coincida en posición y color con la luz proyectada por `Farol_Luz` sobre el terreno y los objetos cercanos — si se ven desalineados, revisar que ambos objetos queden efectivamente en el mismo punto del espacio.
3. Comparar el balance de esta nueva fuente puntual cálida frente a la iluminación general definida en la Sesión 10 (Sun + Area + World) — el farolito debe leerse como un acento adicional, sin competir en intensidad con la luz principal de la escena.
4. `F12` para el render de prueba.
