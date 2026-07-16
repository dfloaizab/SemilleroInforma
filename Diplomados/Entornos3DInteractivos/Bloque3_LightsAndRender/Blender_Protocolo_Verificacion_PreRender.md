# Protocolo de Verificación Previa al Render: Geometría, Materiales y Nodos
## Guía general del curso — Blender

---

## Objetivo

Esta guía establece un protocolo sistemático de verificación, a aplicar **antes** de ejecutar cualquier render de entrega, con el fin de anticipar y prevenir los errores más frecuentes relacionados con geometría, normales, materiales y nodos de composición. Su propósito es reducir el tiempo invertido en corrección posterior mediante la identificación temprana de inconsistencias.

---

## Fundamento: las fases del proceso de render

Para interpretar correctamente cualquier resultado inesperado, es necesario comprender que un render no se genera en un único paso, sino en fases sucesivas y dependientes entre sí:

1. **Cálculo geométrico y de iluminación**: el motor de render (Cycles o Eevee) calcula, muestra a muestra, cómo interactúa la luz con la geometría y los materiales de la escena.
2. **Denoising**: una vez acumuladas las muestras, se aplica un proceso de limpieza de ruido, basado en un modelo que reconstruye la imagen a partir de la señal acumulada y de pasadas auxiliares (normal, albedo).
3. **Composición (Compositor)**: sobre la imagen ya renderizada y limpiada de ruido, se aplican ajustes adicionales de post-procesamiento (denoising adicional, efectos de resplandor, corrección de color).

Cada una de estas fases puede introducir un tipo de error distinto. Un protocolo de verificación completo debe, en consecuencia, revisar cada fase de forma independiente, en lugar de asumir que cualquier anomalía visual proviene necesariamente de la geometría de la escena.

---

## Parte 1 — Verificación de geometría y normales

### 1.1 Fundamento teórico

Cada cara de una malla posee un vector normal que determina la dirección considerada "exterior" de dicha superficie; este vector es la base del cálculo de iluminación. Una normal invertida puede producir caras que se comportan como transparentes o que reflejan la luz de forma incorrecta. De manera relacionada, una malla no-manifold (con bordes no compartidos correctamente entre exactamente dos caras, o con geometría duplicada) genera ambigüedades en dicho cálculo y puede producir artefactos visuales impredecibles, tanto en el cálculo de iluminación como en el proceso de denoising.

### 1.2 Procedimiento

Para cada objeto de la escena:

1. Activar el overlay `Face Orientation` (menú Overlays del viewport). Las caras con normal correctamente orientada se muestran en un tono azul; las invertidas, en rojo.
2. Ingresar a Edit Mode (`Tab`). Seleccionar toda la malla (`A`) y ejecutar `Shift+N` (Recalculate Normals), lo que corrige automáticamente las normales invertidas con base en la topología general del objeto.
3. Verificar la existencia de geometría no-manifold: `Select > Select All by Trait > Non Manifold`. Cualquier elemento seleccionado por este comando debe revisarse individualmente.
4. En caso de detectar geometría duplicada o vértices coincidentes no fusionados: `M` (Merge) → `By Distance`, con una distancia de fusión reducida (recomendado: `0.001 m`) para evitar alterar la forma general del modelo.
5. Verificar la ausencia de intersecciones geométricas no intencionales entre objetos cercanos (competencia de profundidad o *Z-fighting*), mediante inspección visual de cerca en las zonas de contacto entre piezas.

---

## Parte 2 — Verificación de materiales y nodos de shading

### 2.1 Fundamento teórico

Un material se define mediante un árbol de nodos que determina cómo interactúa la superficie con la luz incidente. Errores en esta etapa no suelen manifestarse como fallas evidentes, sino como comportamientos visualmente plausibles pero físicamente incorrectos (superficies demasiado brillantes, materiales de transmisión que no dejan pasar la luz, texturas ausentes), por lo cual requieren revisión deliberada y no solo inspección visual superficial.

### 2.2 Procedimiento

1. Confirmar, para cada material de la escena, que el nodo final (`Principled BSDF` u otro shader equivalente) esté efectivamente conectado a `Material Output`. Un nodo desconectado no produce error, sino que el motor de render ignora silenciosamente esa rama del árbol.
2. Revisar los valores del canal `Emission` en materiales emisivos: valores de `Strength` excesivamente altos en relación con el resto de la escena incrementan la probabilidad de artefactos en el denoising (ver Parte 4) y pueden saturar la exposición general del render.
3. En materiales con `Transmission`, confirmar que el valor de `IOR` corresponda al material físico que se busca representar, y que la malla asociada haya sido validada como manifold (Parte 1) — un IOR correcto sobre una malla defectuosa no produce el resultado esperado.
4. Verificar que los nodos `Image Texture` muestren la miniatura de la imagen cargada; la ausencia de dicha miniatura indica que el archivo no se cargó correctamente, con independencia de que el nodo esté conectado.
5. Confirmar que las conexiones entre nodos no presenten enlaces "huérfanos" (líneas punteadas sin nodo de origen o destino válido) — este tipo de inconsistencia puede producirse tras operaciones de deshacer/rehacer o eliminación parcial de nodos, y debe corregirse reconstruyendo la conexión de forma manual.
6. En materiales que utilizan mapas de peso (Vertex Groups) como entrada mediante nodos `Named Attribute`, confirmar que el nombre especificado en el nodo coincida exactamente con el nombre del grupo en Object Data Properties.

---

## Parte 3 — Verificación de los nodos de composición (Compositor)

### 3.1 Fundamento teórico

El Compositor opera sobre la imagen ya renderizada, no sobre la escena 3D; en consecuencia, sus efectos —particularmente aquellos basados en umbrales de brillo, como el nodo `Glare`— no distinguen la forma ni el volumen de los objetos que generaron dicho brillo. Un ajuste inadecuado en esta etapa puede alterar de forma significativa el resultado final, incluso cuando la geometría y los materiales de la escena son correctos.

### 3.2 Procedimiento

1. Confirmar que la casilla `Use Nodes` esté activa en el workspace Compositing, y que exista una cadena continua de conexiones desde `Render Layers` hasta `Composite`.
2. Revisar el nodo `Denoise`: confirmar que su parámetro `Prefilter` sea coherente con el tipo de geometría de la escena (recomendado: `Accurate` para preservar bordes en geometría de baja densidad poligonal).
3. Revisar el nodo `Glare`, en particular su parámetro `Threshold`: un valor demasiado bajo en relación con la intensidad de las fuentes emisivas de la escena puede generar áreas de resplandor que cubran por completo la silueta de los objetos que las originan. Se recomienda ajustar este valor de forma proporcional a los valores de `Emission Strength` presentes en la escena, y verificar el resultado silenciando temporalmente el nodo (`M`) para comparar.
4. Revisar los ajustes de `Color Balance` (Lift, Gamma, Gain), confirmando que las modificaciones aplicadas sean moderadas y verificables mediante el `Viewer` del Compositor antes de darlas por definitivas.

---

## Parte 4 — Verificación de la configuración de render

### 4.1 Fundamento teórico

El proceso de denoising, si bien necesario para obtener un resultado limpio en tiempos de render razonables, puede introducir artefactos en zonas de alto contraste entre elementos muy brillantes (fuentes emisivas de baja área superficial) y su entorno inmediato, al interpretar dicho contraste como ruido. La probabilidad de este tipo de artefacto disminuye con un número mayor de muestras y con la correcta configuración de las pasadas auxiliares de denoising.

### 4.2 Procedimiento

1. Confirmar el número de `Render Samples` configurado (Render Properties → Sampling); valores insuficientes incrementan tanto el ruido visible como la probabilidad de artefactos de denoising en zonas de alto contraste.
2. Confirmar, en View Layer Properties → Passes → Data, que la pasada `Denoising Data` esté activa, dado que aporta información adicional (normal, albedo) que mejora la reconstrucción de detalle fino durante el denoising.
3. Ante cualquier resultado visualmente anómalo y localizado en un elemento específico de la escena, aplicar el siguiente procedimiento de aislamiento antes de descartar o modificar geometría:
   - Desactivar temporalmente el denoising del motor de render y comparar el resultado.
   - Silenciar temporalmente los nodos del Compositor uno a la vez y comparar el resultado.
   - Si el resultado se normaliza al desactivar alguno de estos elementos, la causa corresponde a dicha etapa de post-procesamiento, y no a la geometría o los materiales de la escena.

---

## Checklist consolidado

| Etapa | Verificación | Herramienta / comando |
|---|---|---|
| Geometría | Normales correctamente orientadas | Face Orientation, `Shift+N` |
| Geometría | Ausencia de geometría no-manifold | `Select All by Trait > Non Manifold` |
| Geometría | Ausencia de intersecciones no intencionales | Inspección visual de cerca |
| Materiales | Nodos conectados hasta Material Output | Revisión visual del árbol de nodos |
| Materiales | Valores de Emission razonables | Comparación relativa con el resto de la escena |
| Materiales | Texturas cargadas correctamente | Miniatura visible en el nodo Image Texture |
| Materiales | Nombres de Named Attribute coincidentes | Comparación con Vertex Groups |
| Compositor | Cadena de nodos completa hasta Composite | Revisión visual del árbol |
| Compositor | Threshold del Glare proporcional a la escena | Silenciar el nodo (`M`) y comparar |
| Render | Samples suficientes y Denoising Data activa | Render Properties, View Layer Properties |
| Render | Aislamiento de causa ante anomalías | Desactivar denoising / silenciar nodos por etapas |

Se recomienda ejecutar este protocolo de forma completa antes de cualquier render de entrega, y de forma parcial (Partes 1 y 2) después de cada sesión de modelado o texturizado significativa, con el fin de detectar inconsistencias en la etapa en que se originan y no acumular errores hacia el final del proceso.
