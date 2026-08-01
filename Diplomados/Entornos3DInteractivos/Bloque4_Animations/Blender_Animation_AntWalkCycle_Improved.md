# Animación del ciclo de caminata de una hormiga en Blender
### Instructivo paso a paso — Rigging, Walk Cycle y Armature Animation

---

## 1. Objetivo

Animar un ciclo de caminata (*walk cycle*) cíclico y reutilizable para el modelo de hormiga importado desde Sketchfab (`scene.gltf`), aprovechando el **armature** que el modelo ya trae incorporado. Este documento cubre:

- Fundamentos de rigging (huesos, jerarquía, Pose Mode).
- Teoría del ciclo de caminata aplicada a un hexápodo (marcha trípode).
- Flujo de trabajo de keyframing sobre el armature existente.
- Herramientas de Blender para ciclar y pulir la animación (Graph Editor, modificador Cyclic, NLA).

**Requisito importante:** el modelo ya viene *rigged* (no es necesario crear huesos ni pintar pesos), por lo que el instructivo se centra en **animar sobre el rig existente**, no en construirlo desde cero.

---

## 2. Requisitos previos

| Elemento | Detalle |
|---|---|
| Blender | Versión 3.6 LTS o superior (4.x recomendado) |
| Archivo | `scene.gltf` (+ `scene.bin` y texturas, si existen en la misma carpeta) |
| Conocimientos previos | Navegación básica en el viewport (rotar, hacer zoom, encuadrar) |

---

## 3. Importar el modelo

1. Abrir Blender con una escena nueva y vacía (`Ctrl+N` → *General*).
2. Eliminar el cubo por defecto: seleccionarlo (clic) y presionar `X` → *Delete*.
3. Ir a `File → Import → glTF 2.0 (.glb/.gltf)`.
4. Ubicar y seleccionar `scene.gltf` → `Import glTF 2.0`.
5. Guardar el proyecto: `File → Save As` → `hormiga_walkcycle.blend`.

Tras la importación, el **Outliner** debe mostrar la jerarquía que ya identificaste en tu captura:

```
Sketchfab_model
 └─ Root
     ├─ Armature
     │   ├─ Pose
     │   └─ Armature (datos del esqueleto)
     │       └─ Armature_rootJoint
     │           └─ hip_Armature
     │               ├─ abdomen_Armature
     │               ├─ thorax3_Armature → ... → thorax1 → neck → head
     │               │       ├─ antennae1.L/.R → antennae2 → antennae3
     │               │       └─ clav.L/.R → upperarm → forearm → wrist → hand1 → hand2
     │               ├─ F_leg1.L_Armature → F_leg2 → F_leg3 → F_foot   (pata delantera)
     │               ├─ F_leg1.R_Armature → ... → F_foot               (pata delantera)
     │               ├─ B_leg1.L_Armature → ... → B_foot               (pata trasera)
     │               └─ B_leg1.R_Armature → ... → B_foot               (pata trasera)
     ├─ Cube / Cube_0   (malla del modelo, ligada al Armature por un modificador Armature)
     └─ Lamp
```

---

## 4. Conceptos básicos de rigging

### 4.1 ¿Qué es un Armature?

Un **Armature** (esqueleto) es un objeto especial de Blender compuesto por **huesos (bones)** organizados en una jerarquía padre-hijo. Cada hueso puede *deformar* la malla (mesh) a la que está vinculado mediante **skinning** (pesos de vértices). En este modelo, ese vínculo ya existe: el objeto `Cube_0` tiene un **Armature Modifier** apuntando al Armature, y cada vértice tiene pesos asignados a los huesos correspondientes (visible en el ícono de "malla con vértices" junto a `Cube_0` en tu Outliner).

### 4.2 Jerarquía padre-hijo

Cuando un hueso rota, **todos sus hijos rotan con él**, heredando la transformación (igual que el hombro mueve el brazo completo). Por eso la cadena de una pata delantera es:

```
F_leg1 (cadera/coxa) → F_leg2 (fémur) → F_leg3 (tibia) → F_foot (tarso)
```

Rotar `F_leg1` mueve toda la pata; rotar solo `F_foot` mueve únicamente la punta.

> **Nota sobre nomenclatura:** los huesos `clav.L/.R → upperarm → forearm → wrist → hand1 → hand2` corresponden, en la práctica, al **par de patas medias** de la hormiga, aunque conservan nombres de un rig bípedo humano (clavícula, brazo, antebrazo, mano) porque probablemente se generaron con una plantilla de auto-rigging genérica. Funcionalmente se animan exactamente igual que las demás patas.

### 4.3 Rest Pose vs. Pose

- **Rest Pose (Edit Mode del Armature):** la postura original en la que se crearon los huesos. No se toca para animar.
- **Pose Mode:** modo en el que se **rotan y posan** los huesos sin alterar su estructura. **Toda la animación de caminata se hace en Pose Mode.**

### 4.4 Deform bones vs. control bones

Este rig es simple: todos los huesos son *deform bones* (deforman la malla directamente). No hay huesos de control IK independientes, por lo que la animación se hará con **FK (Forward Kinematics)**: rotar cada segmento de la pata manualmente, de la cadera hacia el pie. Es el método correcto y suficiente para un ciclo de caminata de insecto.

---

## 5. Teoría del ciclo de caminata (Walk Cycle)

### 5.1 Fases de una pierna/pata al caminar

Toda pata que camina pasa por 4 fases dentro de un ciclo:

| Fase | Descripción |
|---|---|
| **Contact (contacto)** | El pie toca el suelo, adelantado respecto al cuerpo. |
| **Recoil / Down (apoyo)** | El pie está bajo el cuerpo, soportando el peso; es el punto más bajo. |
| **Passing (paso)** | La pata pasa junto al cuerpo, despegada del suelo, a media altura de la zancada. |
| **High Point (elevación)** | El pie está en su punto más alto y más atrasado antes de volver a adelantarse. |

### 5.2 Marcha trípode (tripod gait) — clave en hexápodos

Los insectos con 6 patas (delanteras, medias y traseras a cada lado) no mueven todas las patas igual: usan la **marcha trípode**, el patrón más estable y realista:

- **Grupo A (trípode 1):** pata delantera izquierda + pata media derecha + pata trasera izquierda.
- **Grupo B (trípode 2):** pata delantera derecha + pata media izquierda + pata trasera derecha.

Los dos grupos se mueven **en oposición de fase (desfase de 180°)**: mientras el Grupo A está en el aire (fase de paso), el Grupo B está apoyado en el suelo sosteniendo el cuerpo, y viceversa. Esto da estabilidad (siempre hay 3 patas apoyadas) y es el patrón que hace creíble el caminar de una hormiga.

### 5.3 Duración del ciclo

Un ciclo de caminata completo y cíclico debe iniciar y terminar en **poses idénticas** para poder repetirse sin cortes (*loop*). Para este instructivo usaremos:

- **24 fotogramas por ciclo** (1 segundo a 24 fps), un estándar cómodo para un ciclo de caminata de insecto.
- Fotograma 1 = fotograma 25 (misma pose), de modo que el frame 25 nunca se renderiza; solo marca el cierre del loop.

---

## 6. Preparar la escena para animar

1. Seleccionar el Armature en el Outliner (nombre `Armature`).
2. Cambiar a **Pose Mode**: con el Armature seleccionado, `Ctrl+Tab` → *Pose Mode*, o desde el desplegable de modos en la esquina superior izquierda del viewport.
3. Abrir el **Timeline** (parte inferior) y configurar el rango de animación:
   - `Start`: `1`
   - `End`: `25`
4. Activar **Auto Keying** (círculo rojo en la Timeline) para que cada cambio de rotación en Pose Mode genere un keyframe automáticamente. *(Alternativa manual: usar `I` sobre el hueso seleccionado para insertar keyframes explícitamente — recomendado si prefieres control total).*
5. Abrir un **Graph Editor** o **Dope Sheet** en un panel lateral (`Shift` + clic derecho sobre un borde → *Split Area*) para revisar las curvas de animación más adelante.

---

## 7. Paso a paso: keyframing de las patas

Trabajaremos **una pata a la vez**, seleccionando en Pose Mode el hueso raíz de cada cadena (`F_leg1.L`, `F_leg2.L`, etc.) con clic, y usando `R` (rotate) + eje (`X`, `Y` o `Z`) para posar cada segmento.

### 7.1 Tabla de referencia de fases por grupo trípode

| Fotograma | Grupo A (F.L / Media.R / B.L) | Grupo B (F.R / Media.L / B.R) |
|---|---|---|
| 1 | Contact (pie adelante, en el suelo) | Passing (a media zancada, en el aire) |
| 7 | Recoil (bajo el cuerpo, apoyada) | High Point (atrás, en el aire) |
| 13 | Passing (a media zancada, en el aire) | Contact (pie adelante, en el suelo) |
| 19 | High Point (atrás, en el aire) | Recoil (bajo el cuerpo, apoyada) |
| 25 | = Fotograma 1 (cierre del loop) | = Fotograma 1 |

### 7.2 Procedimiento por hueso

Para cada pata de un grupo, repetir esta secuencia en los fotogramas indicados en la tabla:

1. Mover el playhead de la Timeline al fotograma correspondiente (clic en la regla superior o escribir el número).
2. Seleccionar el primer hueso de la pata (ej. `F_leg1.L_Armature`).
3. Rotar con `R X` (o el eje que corresponda según la orientación del hueso) para llevar la cadera al ángulo de esa fase — adelantada en *Contact*, neutra en *Recoil*, retrasada en *High Point*.
4. Seleccionar el segundo hueso (`F_leg2.L_Armature`) y rotar para doblar/estirar la "rodilla" (más doblada en *Passing*, casi recta en *Contact*).
5. Repetir con el tercer segmento y el pie (`F_leg3.L_Armature`, `F_foot.L_Armature`) para que el pie quede plano contra el suelo en *Contact* y *Recoil*.
6. Confirmar que se generó el keyframe (línea amarilla en la Timeline si Auto Key está activo; si es manual, presionar `I` → *Rotation*).

Repetir el mismo procedimiento con los 6 apéndices de locomoción (2 delanteras `F_leg…`, 2 medias `clav/upperarm/forearm/wrist/hand…`, 2 traseras `B_leg…`), aplicando a cada grupo trípode la fase que le corresponde según la tabla.

> **Consejo práctico:** anima primero **una sola pata en los 4 fotogramas clave** (1-7-13-19) y revisa que el ciclo se vea natural con `Alt+A` (reproducir). Solo después de validar una pata, replica el patrón (con los offsets de fase correctos) en las demás.

---

## 8. Animación del cuerpo (hip, thorax, abdomen)

Un caminar creíble no es solo de patas: el cuerpo también se mueve.

1. **Bobbing vertical (sube y baja):** seleccionar el hueso `hip_Armature` y animar una ligera traslación/rotación en Z, con dos mínimos por ciclo (cuando cualquiera de los dos trípodes está en *Recoil*, el cuerpo está más bajo) — es decir, en los fotogramas 7 y 19.
2. **Balanceo lateral:** pequeña rotación en Y del `hip_Armature`, sincronizada con el trípode de apoyo (el cuerpo se inclina levemente hacia el lado que sostiene el peso).
3. **Abdomen y tórax:** animar `abdomen_Armature` y `thorax3_Armature`/`thorax2_Armature` con una rotación sutil que seguya el balanceo del `hip`, con un ligero retraso (2-3 fotogramas) para dar sensación de inercia.
4. **Antenas:** animar `antennae1.L/.R_Armature` con una oscilación suave y de período distinto al de las patas (por ejemplo, un vaivén completo cada 12 fotogramas) para que se vean vivas sin sincronizarse mecánicamente con el resto.

---

## 9. Cerrar el ciclo (loop perfecto)

1. Verificar que la pose del **fotograma 25 es idéntica a la del fotograma 1** en todos los huesos animados. La forma más segura: en el fotograma 1, con todos los huesos en Pose Mode seleccionados (`A` para seleccionar todos los huesos), copiar la pose (`Ctrl+C`); ir al fotograma 25 y pegarla (`Ctrl+V`), luego insertar keyframe (`I` → *Rotation* o *Rotation & Location* según corresponda).
2. Seleccionar todos los huesos animados y abrir el **Graph Editor**.
3. Seleccionar todas las curvas (`A`) → `Channel → Extrapolation Mode → Make Cyclic (F-Modifier)`. Esto agrega un **F-Curve Modifier "Cycles"** a cada canal, permitiendo que la animación se repita indefinidamente más allá del fotograma 25 sin tener que duplicar keyframes manualmente.
4. (Opcional, recomendado para reutilizar el ciclo) Seleccionar el Armature → pestaña **Animation** → **Push Down** la acción actual a una pista del **NLA Editor** (`Nonlinear Animation`), y nombrarla `WalkCycle`. Esto permite luego repetir, mezclar o desplazar el ciclo a lo largo de una animación más larga (por ejemplo, la hormiga caminando por un escenario).

---

## 10. Pulido con el Graph Editor

1. Seleccionar las curvas de rotación de las patas en el Graph Editor.
2. Ajustar el tipo de interpolación por defecto: `Key → Interpolation Mode → Bezier` para movimientos suaves, o `Linear` en los momentos de *Contact* (el pie debe "clavarse" en el suelo sin suavizado, para evitar que resbale visualmente).
3. Usar `Ease In/Out` (`Key → Easing Type`) en las fases de *Recoil* y *High Point*, donde el movimiento naturalmente desacelera y acelera.
4. Reproducir con `Alt+A` u `Spacebar` (según preferencias configuradas) y comparar visualmente con la tabla de fases de la sección 7.1.

---

## 11. Verificación final y exportación

1. Reproducir el ciclo completo al menos 3 veces seguidas (`Alt+A`, dejar correr) confirmando que no hay "salto" perceptible entre el fotograma 24 y el 1.
2. Revisar desde vista superior (`Numpad 7`) que las patas del mismo trípode tocan el suelo simultáneamente y las del otro trípode están en el aire.
3. Guardar el archivo (`Ctrl+S`).
4. Si se requiere exportar la animación ya rigged de vuelta a glTF: `File → Export → glTF 2.0`, activando en el panel lateral la sección **Animation** → *Export Deformation Bones Only* y *Sampling Animations*.

---

## 12. Glosario de términos clave

| Término | Definición breve |
|---|---|
| **Armature** | Objeto de Blender formado por huesos que deforma una malla vinculada. |
| **Bone / Hueso** | Unidad jerárquica de un Armature; puede trasladarse, rotarse y escalarse. |
| **Pose Mode** | Modo de edición para posar huesos sin alterar la estructura del rig. |
| **Rest Pose** | Postura original del esqueleto, definida en Edit Mode. |
| **FK (Forward Kinematics)** | Técnica de animación donde cada hueso se rota manualmente, de padre a hijo. |
| **Skinning / Weight Painting** | Asignación de la influencia de cada hueso sobre los vértices de la malla. |
| **Keyframe** | Fotograma en el que se registra explícitamente el valor de una propiedad animada. |
| **Walk Cycle** | Secuencia animada y cíclica que reproduce el patrón de caminata. |
| **Marcha trípode** | Patrón de locomoción hexápoda en el que dos grupos de 3 patas se alternan. |
| **F-Curve / Curva de animación** | Representación gráfica de cómo cambia un valor animado a través del tiempo. |
| **Cyclic Modifier** | Modificador de curva que repite la animación indefinidamente fuera del rango de keyframes. |
| **NLA (Non-Linear Animation)** | Sistema para combinar y reutilizar acciones de animación como clips independientes. |


