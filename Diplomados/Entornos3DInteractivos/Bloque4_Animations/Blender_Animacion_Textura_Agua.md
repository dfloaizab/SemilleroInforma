# Animación de la Textura del Agua (Nodo Mapping)
## Extensión — Sesión 13: Animación básica (keyframes, timeline, graph editor)

Este instructivo anima el nodo **Mapping** que ya tienes conectado en los materiales de agua (`Agua_PBR` y `Cascada_PBR`, ver el instructivo de texturizado UV, Parte 7.1), para simular flujo: desplazamiento horizontal en `Agua_Lago` y desplazamiento vertical en `Agua_Cascada`.

---

## Nota técnica importante antes de empezar

En el instructivo de texturizado se conectó el nodo Mapping de esta forma: `Texture Coordinate (UV) > Mapping > Image Texture`. Esto significa que el Mapping está trabajando en **espacio UV (2D)**, donde solo los ejes **X** y **Y** tienen efecto visual — el eje **Z** no hace nada en este caso, porque el UV no tiene profundidad.

Por lo tanto:
- Para `Agua_Lago` (plano horizontal): animar `Location X` (o `Y`, según hacia dónde quieras que fluya el patrón — pruébalo y usa el que te dé el efecto deseado).
- Para `Agua_Cascada`: como en el unwrap ya organizaste los tramos de la caída **uno debajo del otro** a lo largo del eje V del UV (que corresponde al campo `Y` del nodo Mapping, no a `Z`), la coordenada que realmente debes animar para lograr el efecto de caída es `Location Y`.

Si en tu grafo de nodos el Mapping está conectado a `Generated` u `Object` (coordenadas 3D) en lugar de `UV`, ahí sí el eje `Z` tiene efecto real, y puedes seguir exactamente los mismos pasos usando `Z` en vez de `Y`. Revisa qué entrada usa tu `Texture Coordinate` antes de continuar, para animar el campo correcto.

---

## Parte 1 — Animar el plano horizontal (`Agua_Lago`)

1. Seleccionar `Agua_Lago`, workspace **Shading**, localizar el nodo `Mapping` ya existente en el material `Agua_PBR`.
2. En la Timeline (parte inferior de la pantalla), llevar el cabezal de reproducción al `Frame 1`.
3. Pasar el cursor del mouse sobre el campo `Location X` del nodo `Mapping` (sin hacer clic para editarlo) y presionar `I` — esto inserta un keyframe en ese campo con el valor actual (normalmente `0`). El campo se pondrá de color amarillo/verde, indicando que ya tiene una animación.
4. Mover el cabezal de la Timeline a un frame posterior — por ejemplo, `Frame 250` (clic y arrastre en la Timeline, o escribir el número directamente en el campo de frame actual, arriba a la izquierda de la Timeline).
5. Hacer clic en el campo `Location X` y escribir un valor mayor, por ejemplo `4.0` (representa cuánto se desplaza el patrón de textura entre el Frame 1 y el Frame 250).
6. Con el cursor sobre el mismo campo, presionar `I` de nuevo para insertar el segundo keyframe.
7. Reproducir la animación (`Barra espaciadora`) para verificar que el patrón se desplace de forma visible sobre `Agua_Lago`.

---

## Parte 2 — Animar los planos de la cascada (`Agua_Cascada`)

1. Seleccionar `Agua_Cascada`, localizar el nodo `Mapping` del material `Cascada_PBR`.
2. Con el cabezal en `Frame 1`: cursor sobre el campo `Location Y` (ver nota técnica al inicio), presionar `I`.
3. Mover el cabezal a `Frame 250` (o el mismo rango usado en el lago, para mantener consistencia temporal entre ambos elementos).
4. Cambiar `Location Y` a un valor que simule la caída — por ejemplo `-6.0` (negativo, para que el patrón se desplace hacia abajo; si al reproducir ves que fluye hacia arriba, invierte el signo).
5. Insertar el segundo keyframe (`I` sobre el campo).
6. Reproducir y confirmar visualmente que la dirección del flujo coincide con la caída física del agua.

---

## Parte 3 — Hacer que el flujo sea continuo (Graph Editor)

Con solo dos keyframes, el movimiento se detiene al llegar al Frame 250 y no continúa. Para que el agua "fluya" de forma indefinida (no solo dentro del rango animado), hay que extender la curva más allá del último keyframe:

1. Cambiar a un editor **Graph Editor** (o al workspace **Animation**, que ya lo incluye).
2. Con `Agua_Lago` seleccionado, en el Graph Editor debería aparecer el canal correspondiente al `Location X` del nodo Mapping (si no aparece, confirmar que el filtro del editor incluya "Shape Keys/Node" o que el objeto correcto esté seleccionado).
3. Seleccionar la curva (clic sobre ella o `A` para seleccionar todo).
4. Abrir el panel N del Graph Editor → pestaña `Modifiers`, o usar el atajo `Shift+E` → elegir **Linear Extrapolation** (también accesible desde el menú `Channel > Extrapolation Mode > Linear Extrapolation`).
5. Esto hace que, más allá del último keyframe, la curva **continúe subiendo a la misma tasa** en la que venía — el desplazamiento de textura sigue avanzando indefinidamente en vez de detenerse.
6. Repetir el mismo procedimiento (pasos 2-5) para la curva `Location Y` del nodo Mapping de `Agua_Cascada`.

### Recomendación: interpolación lineal entre keyframes

Por defecto, Blender interpola entre keyframes con curvas Bézier (con aceleración/desaceleración), lo cual haría que el flujo del agua se sienta como si "arrancara y frenara" — un efecto poco natural para un desplazamiento continuo como este.

1. En el Graph Editor, seleccionar ambos keyframes de la curva (`A`).
2. Presionar `T` → elegir **Linear**.
3. Repetir para la curva de `Agua_Cascada`.

Con esto, la velocidad del desplazamiento es constante entre keyframes y, combinada con la extrapolación lineal del paso anterior, el flujo se ve uniforme en toda la línea de tiempo.

---

## Parte 4 — Ajustar la velocidad percibida del flujo

La velocidad aparente depende de la relación entre el desplazamiento total (diferencia entre el valor del primer y segundo keyframe) y la cantidad de frames entre ellos:

- Mismo desplazamiento en menos frames → flujo más rápido.
- Menor desplazamiento en el mismo rango de frames → flujo más lento.

Para calibrarlo con criterio: revisar Output Properties → `Frame Rate` (usualmente 24 o 30 fps) y pensar el desplazamiento en términos de "unidades de patrón por segundo" en lugar de por frame. Por ejemplo, si el patrón se repite cada `1.0` unidad en el UV (tiling por defecto) y se quiere que dé una vuelta completa cada 2 segundos a 25 fps, el desplazamiento debería ser `1.0` unidad cada `50` frames.

---

## Parte 5 (opcional, más avanzada) — Alternativa con Drivers

En vez de keyframes + extrapolación, existe una forma más directa de lograr un desplazamiento infinito: un **Driver** vinculado al número de frame actual, sin necesidad de gestionar curvas ni extrapolación manualmente.

1. Clic derecho sobre el campo `Location X` (o `Y`, según el caso) del nodo Mapping → `Add Driver`.
2. En el panel emergente, cambiar el tipo a `Scripted Expression` y escribir: `frame * 0.01` (el multiplicador controla la velocidad — ajustar según el resultado deseado).
3. Cerrar el panel. El valor del campo ahora avanza automáticamente con cada frame, sin necesidad de keyframes ni de tocar el Graph Editor.

Esta alternativa es más rápida de configurar, pero al ser una expresión de código, resulta menos visual/pedagógica que el flujo de trabajo con keyframes — por eso se presenta como método principal el de la Parte 1-3, reservando esta para quienes ya se sientan cómodos con el concepto de Drivers.

---

## Verificación final

1. Reproducir la animación completa (`Barra espaciadora`) con el viewport en modo `Rendered`.
2. Confirmar que `Agua_Lago` fluye de forma continua en el eje elegido, y que `Agua_Cascada` fluye hacia abajo, coherente con la dirección física de la caída.
3. Si el flujo se ve entrecortado o repite un salto brusco, revisar que la extrapolación lineal (Parte 3) se haya aplicado correctamente a ambas curvas.
