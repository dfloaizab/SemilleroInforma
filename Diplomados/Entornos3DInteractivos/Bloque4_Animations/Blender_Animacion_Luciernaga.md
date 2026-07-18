# Animación de Movimiento Aleatorio: La Luciérnaga en el Diorama
## Extensión — entre la Sesión 13 (Animación básica) y el bloque de Rigging

---

## Objetivo

Esta guía desarrolla la animación de un elemento externo incorporado al diorama —un modelo low-poly de luciérnaga, importado en formato `.glb`— mediante una técnica de movimiento aleatorio continuo, sin recurrir todavía a *rigging* (que se abordará en la siguiente semana del módulo). El ejercicio introduce dos conceptos que complementan lo visto en la Sesión 13: el uso de **objetos de control (Empty)** para animar jerarquías completas, y el **modificador Noise** sobre curvas de animación, como alternativa procedural al keyframing manual punto por punto.

---

## Parte 0 — Importación del modelo

1. `File > Import > glTF 2.0 (.glb/.gltf)`.
2. Navegar hasta el archivo `low-poly_firefly_-_stylized.glb` y confirmar la importación.
3. El archivo trae la siguiente jerarquía de objetos (visible en el Outliner): un objeto raíz `Sketchfab_model`, que contiene anidados `root > GLTF_SceneRootNode > Firefly_0 > Object_4` (este último es la malla visible, con el material `Firefly` ya asignado). El modelo no incluye animaciones ni armazones (*armatures*) propios — es una malla estática, lo cual es coherente con el enfoque de esta guía.
4. Renombrar el objeto raíz `Sketchfab_model` a `Luciernaga_Raiz`, para mantener la convención de nombres del proyecto.
5. Comparar visualmente la escala del modelo importado contra un elemento de referencia ya existente en el diorama (por ejemplo, una de las rocas). Los archivos `.glb` pueden traer una escala distinta a la del proyecto; de ser necesario, ajustar con `S` sobre `Luciernaga_Raiz` hasta lograr una proporción coherente con el resto de la escena.

---

## Parte 1 — Creación del objeto de control (Empty)

En lugar de animar directamente la malla importada, se introduce un objeto intermedio que actuará como controlador del movimiento — práctica recomendable siempre que se anima una jerarquía compuesta por varios objetos o proveniente de una fuente externa.

1. `Shift+A > Empty > Plain Axes`, ubicado en un punto inicial razonable dentro del área del diorama (por ejemplo, sobre el espacio aéreo cercano al lago).
2. Renombrar: `Luciernaga_Controlador`.
3. Opcionalmente, reducir su tamaño de visualización (`S` con un valor pequeño) para que no interfiera visualmente con el resto de la escena — los Empty no se renderizan, por lo que este ajuste es solo de comodidad en el viewport.

---

## Parte 2 — Parentesco de la luciérnaga al controlador

1. Seleccionar `Luciernaga_Raiz`; a continuación, con `Shift+clic`, seleccionar `Luciernaga_Controlador` en último lugar (queda como objeto activo).
2. `Ctrl+P > Object (Keep Transform)`.
3. A partir de este punto, cualquier animación aplicada sobre `Luciernaga_Controlador` se transmite a la totalidad de la jerarquía de la luciérnaga.

---

## Parte 3 — Delimitación del área de vuelo

Dado que el movimiento aleatorio se generará de forma procedural (Parte 4), es necesario acotar sus límites para evitar que la luciérnaga se desplace fuera del área del diorama o atraviese el terreno.

1. Seleccionar `Luciernaga_Controlador`.
2. Properties → Object Constraint Properties (ícono de eslabón de cadena) → `Add Object Constraint > Limit Location`.
3. Activar las casillas `Minimum X/Y/Z` y `Maximum X/Y/Z`, ingresando valores coherentes con las dimensiones de `Base_Plataforma` (definidas en la Sesión 2). A modo de referencia: si la plataforma mide aproximadamente 4×4 unidades centrada en el origen, los límites en X y Y podrían establecerse en `-1.8` y `1.8`; en Z, un mínimo ligeramente superior a la altura del terreno (ej. `0.3`) y un máximo que defina el techo del área de vuelo (ej. `1.5`).
4. Activar la casilla `For Transform`, de manera que la restricción también se aplique sobre los valores generados por la animación (Parte 4), y no únicamente sobre transformaciones manuales.

---

## Parte 4 — Animación procedural del movimiento (modificador Noise)

### Fundamento

El modificador Noise, aplicado sobre una curva de animación (F-Curve), genera una función continua de valores pseudoaleatorios a lo largo del tiempo, sin necesidad de definir manualmente una posición por cada instante. Es la técnica estándar en Blender para movimientos orgánicos de bajo control (deambular, temblor, parpadeo), reservando el keyframing manual punto por punto para movimientos donde la trayectoria exacta importa — como ocurrirá la próxima semana con el bloque de rigging.

### Procedimiento

1. Con `Luciernaga_Controlador` seleccionado y el cabezal de reproducción en `Frame 1`, insertar un keyframe base sobre la posición: cursor sobre el campo `Location` en el panel N (pestaña `Item`) y presionar `I`, o `I > Location` con el objeto seleccionado en el viewport. Esto genera las tres curvas (X, Y, Z) necesarias para aplicar el modificador.
2. Cambiar a un editor **Graph Editor** (o al workspace **Animation**).
3. Seleccionar la curva `Location X`. Abrir el panel N del Graph Editor → pestaña `Modifiers` → `Add Modifier > Noise`.
4. Configurar los parámetros del modificador:
   - `Scale`: controla la velocidad de variación (valores mayores producen un movimiento más lento y suave; valores menores, un movimiento más rápido y errático). Para un desplazamiento tipo "deambular" de luciérnaga, se recomienda un rango de `40-80`.
   - `Strength`: controla la amplitud del movimiento generado, y debe calibrarse en función del tamaño del área definida en la Parte 3.
5. Repetir el paso 3-4 sobre las curvas `Location Y` y `Location Z`, asignando a cada una un valor distinto de `Phase` dentro del modificador Noise (por ejemplo, `0` para X, `33` para Y, `67` para Z). Esto evita que los tres ejes varíen de forma sincronizada, lo cual produciría un desplazamiento en línea recta en lugar de un recorrido tridimensional orgánico.
6. Reproducir la animación (`Barra espaciadora`) y confirmar que el movimiento se mantenga dentro de los límites establecidos en la Parte 3, gracias a la restricción `Limit Location`.

---

## Parte 5 — Calibración del movimiento

1. Si el desplazamiento se percibe demasiado errático o "nervioso": aumentar el valor de `Scale` en los tres modificadores Noise.
2. Si el desplazamiento se percibe demasiado lento o casi estático: reducir el valor de `Scale`, o aumentar `Strength` dentro de los límites que la restricción de la Parte 3 permite.
3. Verificar que el recorrido cubra de forma razonable el volumen del área de vuelo, y no quede concentrado en una región reducida — de ser así, incrementar `Strength` de forma proporcional en los tres ejes.

---

## Parte 6 — Efecto de brillo intermitente

El comportamiento distintivo de una luciérnaga es el parpadeo de su luminiscencia; este efecto se construye combinando un material emisivo (técnica ya empleada en el instructivo del farolito) con una luz real, ambos animados con el mismo procedimiento de la Parte 4.

1. Seleccionar el objeto `Object_4` (la malla de la luciérnaga). En Material Properties, renombrar el material existente `Firefly` a `Luciernaga_Emisiva` para mantener la convención del proyecto.
2. En el `Principled BSDF`: ajustar `Emission Color` a un tono cálido característico de la bioluminiscencia (ej. `#C8FF6E` o `#FFE066`, según la variante deseada) y `Emission Strength` en un rango inicial de `8-12`.
3. `Shift+A > Light > Point`, ubicada en el cuerpo de la luciérnaga. Renombrar: `Luciernaga_Luz`. Configurar `Power` en un rango de `3-6 W` y `Color` coincidente con el tono del material emisivo.
4. Parentar `Luciernaga_Luz` a `Luciernaga_Raiz` (mismo procedimiento de la Parte 2: seleccionar la luz, luego `Luciernaga_Raiz` en último lugar, `Ctrl+P > Object (Keep Transform)`), de manera que la luz se desplace junto con el resto de la jerarquía.
5. Insertar un keyframe base sobre `Power` de `Luciernaga_Luz` en el Frame 1 (cursor sobre el campo, `I`).
6. En el Graph Editor, seleccionar la curva de `Power` y añadir un modificador `Noise`, con `Scale` considerablemente menor al usado en el movimiento (rango recomendado: `8-15`), de forma que el parpadeo sea perceptiblemente más rápido que el desplazamiento — este contraste de frecuencias es lo que produce un efecto de parpadeo creíble en lugar de una variación de brillo sincronizada con el vuelo.
7. Repetir el mismo modificador sobre `Emission Strength` del material, para que el resplandor visible de la malla acompañe la variación de la luz real.

---

## Parte 7 — Nota sobre orientación hacia el movimiento (avance conceptual)

Un refinamiento adicional consiste en orientar la luciérnaga en la dirección de su desplazamiento, en lugar de mantenerla con una rotación fija mientras se traslada. Esta técnica requiere una restricción `Track To` apuntando hacia un segundo Empty desplazado ligeramente por delante en la trayectoria (o el uso de `Follow Path` sobre una curva), y se retomará con mayor profundidad durante el bloque de rigging de la próxima semana, una vez introducidos los conceptos de restricciones orientadas a jerarquías articuladas.

---

## Verificación final

1. Reproducir la animación completa con el viewport en modo `Rendered`.
2. Confirmar que el recorrido de la luciérnaga se mantenga dentro del volumen del diorama, sin atravesar el terreno ni salir del área definida.
3. Confirmar que el parpadeo de luz (Parte 6) sea perceptiblemente más rápido que el desplazamiento (Parte 4), y que el resplandor de la malla y la luz real permanezcan sincronizados.
4. Ajustar los valores de `Scale`, `Strength` y `Phase` de los modificadores Noise según el resultado observado, hasta lograr un comportamiento visualmente coherente con el concepto de una luciérnaga deambulando sobre el diorama.
