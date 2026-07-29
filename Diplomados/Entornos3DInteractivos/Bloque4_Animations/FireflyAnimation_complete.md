# Animación de una luciérnaga en Blender 4.5
## Animación del ciclo de luz y trayectoria mediante curva Bézier

Diplomado: Creación de Entornos 3D para Sistemas Interactivos

---

# Objetivo

En este ejercicio se animará una luciérnaga con dos comportamientos independientes:

1. Un ciclo de iluminación (parpadeo de la parte bioluminiscente).
2. Un desplazamiento suave siguiendo una trayectoria definida por una curva Bézier.

El objetivo es familiarizarse con la animación de materiales, el Graph Editor, los modificadores de curvas (F-Curve Modifiers) y las restricciones (*Constraints*).

---

# Parte 1. Animar el brillo del material

## Paso 1. Seleccionar el objeto

En el **Outliner** seleccionar la malla correspondiente a la luciérnaga.

No seleccionar el Empty ni el nodo raíz importado desde Sketchfab, sino la malla que contiene el material.

---

## Paso 2. Abrir el Shader Editor

Cambiar un panel al espacio:

Shader Editor

Seleccionar el material de la luciérnaga.

En este ejemplo el brillo está controlado desde:

```
Principled BSDF
    Emission
        Strength
```

---

## Paso 3. Crear los Keyframes

Mover la línea de tiempo.

### Frame 0

```
Emission Strength = 0
```

Posicionar el cursor sobre **Strength**.

Presionar

```
I
```

para insertar un Keyframe.

---

### Frame 120

Cambiar

```
Strength = 50
```

Presionar nuevamente

```
I
```

---

### Frame 250

Volver a

```
Strength = 0
```

Insertar otro Keyframe.

El resultado será una curva con forma similar a una campana.

---

# Parte 2. Localizar la curva en el Graph Editor

Este fue el detalle que normalmente causa problemas.

## Problema

Los Keyframes existen.

La animación funciona.

Pero en el Graph Editor no aparece ninguna curva.

---

## Solución

En el Graph Editor desactivar el filtro

```
Only Show Selected
```

(o comprobar que el objeto correcto esté realmente seleccionado).

Esta opción puede ocultar completamente los canales de animación.

En nuestro caso fue exactamente el motivo por el cual parecía que Blender no estaba creando las curvas.

Una vez desactivado el filtro apareció inmediatamente la F-Curve correspondiente al parámetro:

```
Material
    Principled BSDF
        Emission Strength
```

---

# Parte 3. Añadir el Noise Modifier

Con la curva visible:

Seleccionar la F-Curve.

Ir al menú

```
Channel
    Add F-Curve Modifier
        Noise
```

o usar el panel lateral de modificadores.

---

## Parámetros recomendados

Los valores dependen del efecto buscado.

Por ejemplo:

```
Scale
8 – 20
```

```
Strength
3 – 10
```

```
Offset
Aleatorio
```

```
Phase
Opcional
```

Si el parpadeo es demasiado lento:

Reducir el valor de **Scale**.

Si la variación es demasiado exagerada:

Reducir **Strength**.

La idea es que el modificador no reemplace la curva original, sino que introduzca pequeñas variaciones naturales.

---

# Parte 4. Crear la trayectoria

Agregar una curva.

```
Shift + A

Curve

Bezier
```

---

Entrar en

```
Edit Mode
```

y modificar los puntos de control.

Se recomienda construir trayectorias amplias y suaves.

Las luciérnagas rara vez realizan giros bruscos.

---

# Parte 5. Vincular la luciérnaga a la curva

Seleccionar primero la luciérnaga.

Abrir la pestaña

```
Object Constraints
```

Agregar

```
Follow Path
```

En Target seleccionar la curva creada.

---

## Alinear la orientación

Activar:

```
Follow Curve
```

y probar los ejes Forward y Up hasta obtener la orientación correcta.

Dependiendo del modelo descargado de Sketchfab puede ser necesario usar:

```
Forward
-Y
```

```
Up
Z
```

o alguna combinación equivalente.

---

# Parte 6. Animar el recorrido

Seleccionar la curva.

Ir a

```
Object Data Properties
```

Buscar

```
Path Animation
```

Activar

```
Frames
```

Por ejemplo

```
250
```

Ahora el parámetro

```
Evaluation Time
```

controlará el recorrido completo.

---

## Crear Keyframes

Frame 0

```
Evaluation Time = 0
```

Insertar Keyframe.

Frame 250

```
Evaluation Time = 250
```

Insertar Keyframe.

La luciérnaga recorrerá automáticamente toda la trayectoria.

---

# Parte 7. Mejorar el movimiento

Para un vuelo más natural se recomienda:

Modificar ligeramente la curva Bézier.

Evitar segmentos completamente rectos.

Añadir pequeñas ondulaciones.

Usar curvas largas.

Evitar cambios bruscos de dirección.

---

# Resultado final

La animación queda compuesta por dos sistemas independientes.

## Material

```
Emission Strength
↓

Keyframes

↓

Noise Modifier

↓

Parpadeo natural
```

---

## Movimiento

```
Curva Bézier

↓

Follow Path Constraint

↓

Evaluation Time animado

↓

Vuelo suave
```

---

# Posibles mejoras

Una vez dominado este procedimiento se pueden incorporar nuevas animaciones:

- Rig de alas.
- Movimiento de patas.
- Movimiento de antenas.
- Variaciones aleatorias de velocidad.
- Escalado del brillo según la velocidad.
- Varias luciérnagas con trayectorias distintas.
- Sincronización parcial del parpadeo entre individuos.
- Sistema de partículas para representar enjambres.

---

# Observaciones

En modelos importados desde Sketchfab es frecuente que:

- La jerarquía contenga varios Empty.
- El material esté asociado únicamente a una malla interna.
- Los canales de animación no aparezcan por culpa del filtro **Only Show Selected** del Graph Editor.

Antes de asumir que Blender no creó la animación, comprobar siempre ese filtro.
