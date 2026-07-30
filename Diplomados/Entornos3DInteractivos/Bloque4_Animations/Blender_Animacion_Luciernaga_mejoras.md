# Diplomado en Creación de Entornos 3D para Sistemas Interactivos

# Laboratorio

## Mejora de la trayectoria y fundamentos de rigging

Semillero INFORMA

---

# Objetivo

En este laboratorio se mejorará la animación de la luciérnaga desarrollada previamente.

Se aprenderá a:

- mejorar una trayectoria Bézier;
- controlar la orientación durante el vuelo;
- ajustar la velocidad;
- suavizar el movimiento;
- comprender los fundamentos del rigging;
- preparar el modelo para animar alas y abdomen.

Al finalizar la práctica, LULÚ tendrá un vuelo mucho más natural y estará lista para comenzar su proceso de rigging.

---

# Parte 1
# Mejorando la trayectoria

La trayectoria ya existe.

La luciérnaga la recorre utilizando un Constraint tipo

```
Follow Path
```

Ahora el objetivo será transformar un movimiento mecánico en uno orgánico.

---

# Paso 1
## Seleccionar la curva

En el Outliner seleccionar

```
BezierCurve
```

Cambiar a

```
Edit Mode
```

Ahora aparecerán los puntos de control.

---

# Paso 2
## Comprender la anatomía de una curva Bézier

Cada punto posee:

```
Punto de control

↓

Handle izquierdo

↓

Handle derecho
```

Los handles determinan la dirección de entrada y salida.

Una trayectoria natural depende mucho más de los handles que de la posición de los puntos.

---

# Paso 3
## Mover un punto

Seleccionar un punto.

Presionar

```
G
```

Mover ligeramente.

Evitar cambios bruscos.

Los insectos normalmente describen curvas suaves.

---

# Paso 4
## Ajustar los Handles

Seleccionar un Handle.

Presionar

```
G
```

Mover lentamente.

Un handle largo produce una curva amplia.

Un handle corto produce un cambio más pronunciado.

---

# Paso 5
## Cambiar el tipo de Handle

Con el punto seleccionado:

```
V
```

Elegir:

```
Automatic
```

o

```
Auto Clamped
```

En la mayoría de trayectorias de vuelo, **Auto Clamped** produce excelentes resultados porque evita curvas demasiado exageradas.

---

# Parte 2
# Hacer que la luciérnaga mire hacia adelante

Uno de los errores más comunes consiste en que el modelo se desplaza correctamente pero siempre permanece mirando en la misma dirección.

---

## Constraint

Seleccionar la luciérnaga.

Ir a

```
Object Constraints
```

Seleccionar

```
Follow Path
```

Activar

```
Follow Curve
```

---

## Ajustar los ejes

Dependiendo del modelo puede ser necesario probar diferentes combinaciones.

Por ejemplo

```
Forward

-Y
```

```
Up

Z
```

Si la luciérnaga vuela de espaldas:

Cambiar el eje Forward.

Si queda acostada:

Modificar el eje Up.

No existe una única combinación correcta.

Depende del sistema de coordenadas con el que fue exportado el modelo.

---

# Parte 3
# Mejorar la velocidad

Hasta ahora la velocidad es completamente constante.

Los insectos rara vez vuelan así.

---

## Abrir

```
Graph Editor
```

Seleccionar la curva

```
Evaluation Time
```

---

## Cambiar interpolación

Seleccionar todos los Keyframes.

Presionar

```
T
```

Elegir

```
Bezier
```

Ahora la velocidad acelera y desacelera suavemente.

---

## Editar la curva

Crear pequeñas zonas:

- aceleración
- vuelo estable
- desaceleración

Esto hace que el movimiento resulte mucho más creíble.

---

# Parte 4
# Añadir pequeñas oscilaciones

Una luciérnaga nunca permanece completamente estable.

Puede inclinarse ligeramente.

---

Seleccionar el objeto.

Insertar algunos Keyframes de rotación.

Por ejemplo:

```
Rotación Z

-5°

0°

+6°

0°

-4°
```

La variación debe ser muy pequeña.

No debe parecer una mariposa.

---

# Parte 5
# Movimiento vertical

Los insectos vuelan describiendo pequeñas ondulaciones.

Agregar algunos Keyframes en

```
Location Z
```

o modificar ligeramente la propia curva Bézier.

La amplitud puede ser de unos pocos centímetros.

---

# Parte 6
# Variaciones de velocidad

Duplicar algunos puntos de la curva.

En esas zonas hacer que

```
Evaluation Time
```

avance más lentamente.

En otras zonas acelerar.

La velocidad irregular aporta mucha naturalidad.

---

# Parte 7
# Coordinar el brillo

La animación del

```
Emission Strength
```

puede sincronizarse parcialmente con la velocidad.

Cuando la luciérnaga acelera:

Mayor intensidad.

Cuando disminuye la velocidad:

Menor intensidad.

No es obligatorio.

Pero produce un resultado muy agradable.

---

# Parte 8
# Preparando el rig

Hasta ahora el modelo completo se mueve como un único objeto.

Para animar las alas necesitaremos un esqueleto.

---

# ¿Qué es un Armature?

Un Armature es un conjunto de huesos virtuales.

Cada hueso controla una parte de la malla.

```
Mesh

↓

Armature

↓

Bones

↓

Animación
```

---

# Paso 1
## Crear el Armature

```
Shift + A

Armature

Single Bone
```

Activar

```
In Front
```

para visualizar los huesos a través de la malla.

---

# Paso 2
## Colocar el hueso principal

Este será el cuerpo.

Debe recorrer aproximadamente

```
Tórax

↓

Abdomen
```

---

# Paso 3
## Crear un Joint en la cintura

Entrar en

```
Edit Mode
```

del Armature.

Seleccionar el extremo posterior.

Presionar

```
E
```

Extruir un nuevo hueso.

Este hueso controlará el abdomen luminoso.

Ahora existirán dos segmentos.

```
Torax

↓

Joint

↓

Abdomen
```

Con esto el abdomen podrá oscilar ligeramente durante el vuelo.

---

# Paso 4
# Huesos para las alas

Seleccionar el hueso del tórax.

Extruir dos nuevos huesos.

Uno hacia cada ala.

```
Torax

├── Ala izquierda

└── Ala derecha
```

Cada ala tendrá su propio controlador.

---

# Paso 5
## Parentar la malla

Seleccionar

Primero

```
Mesh
```

Luego

```
Armature
```

Presionar

```
Ctrl + P
```

Elegir

```
With Automatic Weights
```

Blender calculará automáticamente la influencia de cada hueso.

---

# Paso 6
## Verificar pesos

Cambiar a

```
Weight Paint
```

Seleccionar un hueso.

Comprobar que únicamente afecte la zona correcta.

Si alguna ala mueve parte del abdomen:

Corregir posteriormente los pesos.

---

# Parte 9
# Primera animación de las alas

Cambiar el Armature a

```
Pose Mode
```

Seleccionar el hueso del ala.

Insertar tres poses.

Frame 1

```
Ala arriba
```

Frame 5

```
Ala abajo
```

Frame 10

```
Ala arriba
```

Insertar Keyframes de rotación.

---

# Parte 10
# Repetir el ciclo

Abrir

```
Graph Editor
```

Seleccionar las curvas.

Añadir

```
Cycles Modifier
```

Ahora el batido será infinito.

---

# Mejoras futuras

Una vez dominado este laboratorio pueden añadirse:

- patas con IK;
- antenas con Noise Modifier;
- abdomen flexible;
- inclinación automática en curvas;
- sincronización entre alas y velocidad;
- pequeñas pausas sobre flores;
- aterrizajes;
- vuelo errático mediante curvas procedurales;
- enjambres completos utilizando Geometry Nodes.

---

# Conceptos aprendidos

Durante este laboratorio se utilizaron:

✓ Curvas Bézier

✓ Handles

✓ Follow Path

✓ Follow Curve

✓ Evaluation Time

✓ Interpolación Bézier

✓ Rotaciones suaves

✓ Armatures

✓ Bones

✓ Weight Paint

✓ Parenting

✓ Automatic Weights

✓ Cycles Modifier

---

# Resultado esperado

Al finalizar la práctica, LULÚ dejará de ser un objeto que simplemente sigue una trayectoria y comenzará a comportarse como un personaje animado.

El siguiente paso natural será la creación de un sistema completo de locomoción, donde el movimiento del cuerpo, las alas, las antenas y el abdomen trabajen de forma coordinada para producir un vuelo orgánico y expresivo.
