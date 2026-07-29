# Diplomado en Creación de Entornos 3D para Sistemas Interactivos

# Laboratorio
# Animación básica de una hormiga (Walk Cycle)

Autor:
Semillero INFORMA

---

# Objetivo

En esta práctica se realizará un ciclo básico de caminata de una hormiga utilizando un modelo GLTF previamente riggeado.

Al finalizar el ejercicio el estudiante comprenderá:

- navegación en Pose Mode;
- manipulación de un Armature;
- inserción de Keyframes;
- principios básicos de un ciclo de caminata;
- reproducción en bucle (Loop).

---

# ¿Qué es un Walk Cycle?

En animación un Walk Cycle es una secuencia corta que representa un paso completo.

Al reproducirse continuamente produce la ilusión de una caminata infinita.

En videojuegos prácticamente todos los personajes utilizan este principio.

---

# Paso 1
## Abrir el modelo

Archivo

```
File

Import

glTF 2.0
```

Seleccionar

```
scene.gltf
```

---

# Paso 2
## Explorar la jerarquía

Abrir el Outliner.

Identificar:

- Armature
- Mesh
- Materiales

La malla de la hormiga está asociada al Armature mediante grupos de vértices.

---

# Paso 3
## Seleccionar el esqueleto

En el Outliner seleccionar

```
Armature
```

Cambiar el modo

```
Object Mode

↓

Pose Mode
```

Ahora aparecerán todos los huesos del rig.

---

# Paso 4
## Identificar las partes móviles

Explorar el rig.

Mover ligeramente algunos huesos.

Los principales son:

```
Root

Hip

Abdomen

Thorax

Neck

Head

Antenas

Patas izquierdas

Patas derechas
```

No insertar todavía Keyframes.

El objetivo es comprender la anatomía del rig.

---

# Paso 5
## Configurar la duración

Timeline

```
Frame inicial

1
```

```
Frame final

24
```

24 fotogramas equivalen aproximadamente a un paso completo.

---

# Paso 6
## Pose inicial

En el Frame 1 crear una postura natural.

La hormiga debe apoyar:

Tres patas.

Las otras tres permanecerán adelantadas.

Este patrón se denomina

```
Tripod Gait
```

y es el utilizado por la mayoría de insectos.

---

## Grupo A

- Delantera izquierda
- Central derecha
- Trasera izquierda

Apoyadas.

---

## Grupo B

- Delantera derecha
- Central izquierda
- Trasera derecha

Avanzando.

---

# Paso 7
## Insertar Keyframes

Seleccionar todos los huesos.

Presionar

```
A
```

Luego

```
I
```

Elegir

```
LocRot
```

o

```
LocRotScale
```

según el rig.

---

# Paso 8
## Mitad del ciclo

Ir al

```
Frame 13
```

Invertir completamente el movimiento.

Ahora

Grupo A

Avanza.

Grupo B

Apoya.

Insertar nuevamente

```
I

LocRot
```

---

# Paso 9
## Final del ciclo

Ir al

```
Frame 25
```

Copiar exactamente la pose del Frame 1.

Esto garantiza un ciclo continuo.

Insertar Keyframe.

---

# Paso 10
## Movimiento del abdomen

Seleccionar

```
abdomen_Armature
```

Durante el apoyo:

levantar ligeramente.

Durante el avance:

bajar ligeramente.

El movimiento debe ser muy pequeño.

Aproximadamente

5°

es suficiente.

---

# Paso 11
## Movimiento del tórax

Mover el tórax en sentido contrario al abdomen.

Esto aporta equilibrio visual.

---

# Paso 12
## Movimiento de la cabeza

La cabeza apenas oscila.

No debe parecer que asiente.

Solo un pequeño balanceo.

---

# Paso 13
## Antenas

Las antenas nunca permanecen completamente quietas.

Crear una pequeña oscilación.

Puede hacerse con dos Keyframes.

Posteriormente puede añadirse un Noise Modifier.

---

# Paso 14
## Reproducción

Presionar

```
Espacio
```

o

```
Barra espaciadora
```

La hormiga deberá caminar continuamente.

---

# Paso 15
## Mejorar las curvas

Abrir

```
Graph Editor
```

Seleccionar las curvas.

Presionar

```
T

Bezier
```

Las curvas suaves producen un movimiento mucho más natural.

---

# Paso 16
## Crear un ciclo

Abrir

```
Graph Editor
```

Seleccionar todas las curvas.

```
Channel

Extrapolation Mode

Make Cyclic
```

o añadir

```
Cycles Modifier
```

Ahora la animación podrá repetirse indefinidamente.

---

# Recomendaciones

No exagerar los movimientos.

Las hormigas poseen un centro de gravedad muy bajo.

La mayor parte del movimiento ocurre en las patas.

El abdomen acompaña el desplazamiento.

La cabeza y las antenas aportan naturalidad.

---

# Posibles mejoras

Una vez construido el ciclo básico pueden añadirse:

- movimiento independiente de antenas;
- apertura y cierre de mandíbulas;
- transporte de una hoja;
- cambio de velocidad;
- caminar siguiendo una curva Bézier;
- múltiples hormigas utilizando el mismo Action;
- animaciones Idle;
- animaciones de búsqueda;
- interacción con partículas.

---

# Conceptos aprendidos

Durante esta práctica se utilizaron:

✓ Armatures

✓ Pose Mode

✓ Keyframes

✓ Timeline

✓ Walk Cycle

✓ Graph Editor

✓ Curvas Bézier

✓ Ciclos de animación

✓ Reutilización de animaciones

---

# Resultado esperado

Al finalizar la práctica la hormiga será capaz de caminar mediante un ciclo repetitivo que podrá utilizarse posteriormente en Unity, Godot o cualquier motor compatible con glTF.
