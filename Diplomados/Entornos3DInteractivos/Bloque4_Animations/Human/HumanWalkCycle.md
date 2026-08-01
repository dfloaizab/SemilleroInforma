# Animación de una caminata humana en Blender
### Instructivo paso a paso — Rigging, Gait Cycle y Armature Animation

---

## 1. Objetivo

Animar un ciclo de caminata (*walk cycle*) humano, cíclico y reutilizable, sobre el armature ya incluido en el modelo importado (`human.gltf`, rig tipo **Mixamo**, personaje `MikeAlger`). Este documento cubre:

- Fundamentos de rigging aplicados a un biped.
- Fundamentos anatómicos y biomecánicos de la caminata humana (*gait cycle*).
- Flujo de trabajo de keyframing sobre el armature existente.
- Herramientas de Blender para ciclar y pulir la animación (Graph Editor, modificador Cyclic, NLA).

**Requisito importante:** el modelo ya viene *rigged* con nomenclatura estándar Mixamo (no es necesario crear huesos ni pintar pesos). El instructivo se centra en **animar sobre el rig existente**.

---

## 2. Requisitos previos

| Elemento | Detalle |
|---|---|
| Blender | Versión 3.6 LTS o superior (4.x recomendado) |
| Archivo | `human.gltf` (+ `.bin` y texturas, si existen en la misma carpeta) |
| Conocimientos previos | Navegación básica en el viewport; ideal haber completado antes un ciclo de caminata simple (p. ej. hexápodo) |

---

## 3. Importar el modelo

1. Abrir Blender con una escena nueva y vacía (`Ctrl+N` → *General*).
2. Eliminar el cubo por defecto: seleccionarlo y presionar `X` → *Delete*.
3. `File → Import → glTF 2.0 (.glb/.gltf)` → seleccionar `human.gltf` → `Import glTF 2.0`.
4. `File → Save As` → `humano_walkcycle.blend`.

---

## 4. Jerarquía del Armature (nomenclatura Mixamo)

El rig sigue la convención estándar de **Mixamo**, con prefijo `mixamorig_`. Estructura simplificada (ramas de manos abreviadas):

```
mixamorig_Hips_01                              ← raíz del esqueleto (pelvis)
 ├─ mixamorig_Spine_02
 │   └─ mixamorig_Spine1_03
 │       └─ mixamorig_Spine2_04
 │           ├─ mixamorig_Neck_05 → mixamorig_Head_06 → mixamorig_HeadTop_End_07
 │           ├─ mixamorig_LeftShoulder_010 → LeftArm_011 → LeftForeArm_012 → LeftHand_013 (+ dedos)
 │           └─ mixamorig_RightShoulder_034 → RightArm_035 → RightForeArm_036 → RightHand_037 (+ dedos)
 ├─ mixamorig_RightUpLeg_058 → RightLeg_00 → RightFoot_059 → RightToeBase_060 → RightToe_End_061
 └─ mixamorig_LeftUpLeg_062 → LeftLeg_063 → LeftFoot_064 → LeftToeBase_065 → LeftToe_End_066
```

**Puntos clave de esta jerarquía:**

- `mixamorig_Hips_01` es el **hueso raíz**: toda traslación general del personaje (avance, elevación/descenso de la pelvis) se anima aquí.
- Cada pierna es una cadena de 4 huesos: **muslo (UpLeg) → pantorrilla (Leg) → pie (Foot) → dedos (ToeBase)**, equivalente anatómicamente a cadera–rodilla–tobillo–metatarso.
- Los brazos cuelgan de la columna (`Spine2_04`) vía los hombros, no de las caderas — por eso el contra-balanceo de brazos se anima de forma independiente a las piernas, aunque sincronizada con ellas (ver sección 6.4).

---

## 5. Conceptos básicos de rigging (repaso aplicado a un biped)

| Concepto | Aplicación en este rig |
|---|---|
| **Armature** | Objeto único que deforma la malla del personaje vía skinning ya asignado. |
| **Pose Mode** | Modo donde se rotan los huesos para posar/animar. Todo el walk cycle se hace aquí. |
| **Rest Pose (T-pose/A-pose)** | Postura base en la que se creó el rig; no se modifica. |
| **FK (Forward Kinematics)** | Técnica usada en este instructivo: se rota cada hueso manualmente de padre a hijo (cadera → rodilla → tobillo). Es el método estándar para animación de caminata a mano. |
| **IK (Inverse Kinematics)** | Alternativa donde se coloca un "hueso objetivo" en el pie y el resto de la cadena calcula su rotación automáticamente. **No es obligatoria** para este ejercicio, pero se menciona en la sección 10 como mejora opcional, ya que facilita fijar el pie exactamente en el suelo. |
| **Hueso raíz (root)** | `mixamorig_Hips_01`. Todo el desplazamiento del personaje en el espacio se controla, en última instancia, desde este hueso o desde el objeto Armature completo. |

---

## 6. Fundamentos de la caminata humana (Gait Cycle)

### 6.1 El ciclo de marcha (*gait cycle*)

Un ciclo completo de caminata se mide **de un contacto de talón al siguiente contacto del mismo pie**, y se describe en biomecánica como un porcentaje de 0% a 100%. Se divide en dos grandes fases por cada pierna:

- **Fase de apoyo (Stance, ~60% del ciclo):** el pie está en contacto con el suelo, soportando peso.
- **Fase de balanceo (Swing, ~40% del ciclo):** el pie está en el aire, avanzando hacia el siguiente paso.

### 6.2 Las 8 sub-fases del ciclo (referencia clínica de la marcha)

| % del ciclo | Sub-fase | Qué ocurre |
|---|---|---|
| 0% | **Initial Contact (contacto inicial)** | El talón toca el suelo; la pierna está extendida y adelantada. |
| 0–10% | **Loading Response (respuesta a la carga)** | El pie se aplana; la rodilla se flexiona levemente para absorber el impacto. |
| 10–30% | **Mid Stance (apoyo medio)** | El cuerpo pasa sobre el pie apoyado; la pierna está casi recta y vertical, soportando todo el peso. |
| 30–50% | **Terminal Stance (apoyo terminal)** | El talón se despega del suelo; el cuerpo sigue avanzando, la pierna queda atrás. |
| 50–60% | **Pre-Swing (pre-balanceo)** | Solo los dedos tocan el suelo; la rodilla comienza a flexionarse fuertemente para despegar el pie. |
| 60–73% | **Initial Swing (balanceo inicial)** | El pie está en el aire; rodilla muy flexionada para que el pie no arrastre el suelo. |
| 73–87% | **Mid Swing (balanceo medio)** | La pierna se endereza mientras avanza, pasando junto a la pierna de apoyo. |
| 87–100% | **Terminal Swing (balanceo terminal)** | La rodilla termina de extenderse; el talón se prepara para el siguiente contacto inicial. |

### 6.3 Desfase entre piernas (offset 50%)

A diferencia del hexápodo (marcha trípode), el ciclo humano es más simple: **las dos piernas están exactamente desfasadas 50%** entre sí. Cuando la pierna derecha está en 0% (*Initial Contact*), la pierna izquierda está en 50% (*Pre-Swing*), y viceversa. Esto significa que, en la práctica, **solo necesitas animar una pierna completa y luego copiar la pose a la otra pierna con un desfase de medio ciclo** (ver sección 8.4).

### 6.4 Contra-balanceo de brazos (contralateral arm swing)

El cuerpo humano balancea los brazos **en oposición a la pierna del mismo lado**: cuando la pierna derecha avanza, el **brazo izquierdo** avanza junto con ella (y el brazo derecho retrocede). Este contra-balanceo:

- Contrarresta el momento angular generado por las piernas, ayudando al equilibrio.
- Se anima principalmente rotando `LeftArm_011` / `RightArm_035` (hombro) en el eje de avance, con un ligero doblez adicional en `LeftForeArm_012` / `RightForeArm_036` (codo) durante el punto de mayor balanceo.

### 6.5 Movimiento de la pelvis y la columna

Tres movimientos adicionales, sutiles pero esenciales para el realismo:

1. **Elevación/descenso vertical (bobbing):** la pelvis (`Hips_01`) sube en *Mid Stance* (pierna recta y vertical = punto más alto) y baja en el momento de doble apoyo (transición entre pasos = punto más bajo). Dos ciclos de subida-bajada por cada ciclo completo de caminata.
2. **Rotación horizontal de la pelvis (*pelvic rotation*):** al avanzar una pierna, la cadera de ese lado rota levemente hacia adelante sobre el eje vertical (Z).
3. **Inclinación lateral de la pelvis (*pelvic drop / hip hike*):** durante la fase de balanceo de una pierna, la cadera de ese lado desciende levemente respecto a la cadera de apoyo, ya que solo una pierna sostiene el peso.
4. **Contra-rotación de la columna:** `Spine1_03`/`Spine2_04` rotan levemente en sentido opuesto a la pelvis, manteniendo los hombros orientados casi de frente y estabilizando la mirada.

---

## 7. Preparar la escena para animar

1. Seleccionar el Armature en el Outliner y entrar en **Pose Mode** (`Ctrl+Tab` → *Pose Mode*).
2. Configurar la Timeline:
   - `Start`: `1`
   - `End`: `25` (ciclo de 24 fotogramas = 1 segundo a 24 fps; el 25 es el cierre del loop, idéntico al 1)
3. Activar **Auto Keying** (círculo rojo en la Timeline), o trabajar con `I` manualmente sobre cada hueso para mayor control.
4. Abrir un **Graph Editor** o **Dope Sheet** en un panel lateral para revisar las curvas más adelante.

---

## 8. Paso a paso: keyframing de la pierna derecha

### 8.1 Tabla de referencia (pierna derecha, ciclo de 24 fotogramas)

| Fotograma | % ciclo | Sub-fase | Cadera (`RightUpLeg`) | Rodilla (`RightLeg`) | Tobillo/pie (`RightFoot` + `RightToeBase`) |
|---|---|---|---|---|---|
| 1 | 0% | Initial Contact | Adelantada, pierna casi recta | Ligera flexión de amortiguación | Talón toca el suelo, dedos hacia arriba |
| 3 | ~13% | Mid Stance | Vertical, bajo la pelvis | Casi recta | Pie completamente plano contra el suelo |
| 7 | ~29% | Terminal Stance | Empieza a quedar atrás | Casi recta | Talón se despega, dedos aún en el suelo |
| 12 | ~50% | Pre-Swing / Toe-Off | Atrasada, empuja hacia atrás | Flexión fuerte iniciando | Solo dedos en contacto, a punto de despegar |
| 15 | ~63% | Initial Swing | Avanzando, pasa junto a la otra pierna | Máxima flexión (pie no arrastra) | Pie en el aire, relajado |
| 19 | ~79% | Mid Swing | Se adelanta rápidamente | Empieza a extenderse | Pie avanzando, dedos apuntando levemente abajo |
| 23 | ~96% | Terminal Swing | Casi completamente adelantada | Casi extendida | Talón a punto de tocar (preparando contacto) |
| 25 | 100% = 0% | = Fotograma 1 | — | — | — |

### 8.2 Procedimiento por hueso (pierna derecha)

Para cada fotograma de la tabla:

1. Ubicar el playhead en el fotograma correspondiente.
2. Seleccionar `mixamorig_RightUpLeg_058` y rotar (`R` + eje de flexión, normalmente `X` local) según la columna "Cadera".
3. Seleccionar `mixamorig_RightLeg_00` (rodilla) y rotar para doblar/estirar según la columna "Rodilla". **Importante:** la rodilla humana solo flexiona en un eje (no hiperextiende hacia atrás); mantener el ángulo dentro de un rango anatómicamente correcto.
4. Seleccionar `mixamorig_RightFoot_059` y rotar el tobillo para mantener el pie plano en el suelo durante el apoyo, y relajado (ligera flexión) durante el balanceo.
5. Seleccionar `mixamorig_RightToeBase_060` y rotar para el despegue de dedos en *Pre-Swing* (fotograma 12).
6. Confirmar el keyframe (automático con Auto Key, o `I → Rotation` manualmente).

### 8.3 Verificación del punto de apoyo (evitar deslizamiento)

Durante toda la fase de apoyo (fotogramas 1 a 12 aprox.), el punto de contacto del pie con el suelo **no debe desplazarse horizontalmente** en el espacio mundial: es la pierna la que "empuja" el cuerpo hacia adelante sobre un pie fijo, no el pie el que se arrastra bajo el cuerpo. Verificar esto desde una vista lateral (`Numpad 3` o `Numpad 1` según orientación) reproduciendo la animación en cámara lenta.

### 8.4 Pierna izquierda: reutilizar el desfase de 50%

Gracias al desfase de 50% descrito en la sección 6.3, la pierna izquierda es la pierna derecha desplazada 12 fotogramas:

1. En el **Dope Sheet**, seleccionar todos los canales de `RightUpLeg`, `RightLeg`, `RightFoot` y `RightToeBase`.
2. Duplicar las curvas (`Shift+D` sobre los keyframes seleccionados en el Dope Sheet) y reasignarlas a los huesos `LeftUpLeg_062`, `LeftLeg_063`, `LeftFoot_064` y `LeftToeBase_065` (esto puede hacerse copiando manualmente los valores hueso por hueso si no se usa un addon de redirección de curvas — el copiado manual, aunque más lento, es más confiable para un ejercicio introductorio).
3. Desplazar los keyframes copiados **12 fotogramas hacia la derecha** (`G` → `X` → `12` → `Enter` en el Dope Sheet/Graph Editor) y usar el modificador **Cyclic** (sección 9) para que los que "sobran" del final reaparezcan al inicio.
4. Confirmar que en el fotograma 1 la pierna izquierda está en ~50% de su ciclo (*Pre-Swing*), mientras la derecha está en *Initial Contact*.

---

## 9. Brazos, pelvis y columna

1. **Brazos (contra-balanceo):** animar `LeftArm_011` y `RightArm_035` con una oscilación de adelante-atrás en oposición a la pierna del mismo lado (ver 6.4): cuando `RightUpLeg` está más adelantada (fotograma 1), `RightArm_035` debe estar más atrasado, y `LeftArm_011` más adelantado. Añadir un ligero doblez en los codos (`LeftForeArm_012` / `RightForeArm_036`) en el punto medio del balanceo de cada brazo.
2. **Pelvis vertical:** animar `Hips_01` en Z con dos picos por ciclo (puntos altos en fotogramas ~3 y ~15, coincidiendo con cada *Mid Stance*) y dos valles (fotogramas ~1 y ~12-13, doble apoyo).
3. **Rotación de pelvis:** rotar `Hips_01` en Z (eje vertical) siguiendo el avance de cada pierna: rotación máxima hacia el lado de la pierna adelantada.
4. **Inclinación lateral de pelvis:** rotar `Hips_01` en el eje de avance (X o Y local, según orientación del rig) para que el lado en fase de balanceo "caiga" levemente.
5. **Contra-rotación de columna:** rotar `Spine1_03`/`Spine2_04` en sentido opuesto y con menor amplitud que la rotación de la pelvis, para mantener los hombros más estables que las caderas.
6. **Cabeza:** mantener `Neck_05`/`Head_06` casi estáticos (solo una leve compensación) — la cabeza humana se estabiliza activamente al caminar, a diferencia del resto del cuerpo.

---

## 10. Cerrar el ciclo (loop perfecto)

1. Verificar que la pose del **fotograma 25 es idéntica a la del fotograma 1** en todos los huesos animados. Con todos los huesos seleccionados en Pose Mode (`A`) en el fotograma 1: copiar pose (`Ctrl+C`) → ir al fotograma 25 → pegar pose (`Ctrl+V`) → insertar keyframe (`I → Rotation`).
2. En el **Graph Editor**, seleccionar todas las curvas (`A`) → `Channel → Extrapolation Mode → Make Cyclic (F-Modifier)` para que el ciclo se repita indefinidamente.
3. (Opcional) Seleccionar el Armature → pestaña **Animation** → **Push Down** la acción a una pista del **NLA Editor**, nombrarla `WalkCycle_Human`, para poder reutilizarla, mezclarla con otras animaciones (ej. correr, girar) o desplazarla a lo largo de una escena más extensa.

---

## 11. Pulido con el Graph Editor

1. Seleccionar las curvas de piernas en el Graph Editor.
2. Interpolación por defecto `Bezier` para transiciones suaves; considerar `Ease In/Out` en *Mid Stance* (el cuerpo desacelera levemente sobre la pierna de apoyo) y en *Mid Swing* (la pierna acelera al pasar junto al cuerpo y desacelera antes del contacto).
3. Revisar especialmente la curva del tobillo en el momento de *Initial Contact*: debe tener un cambio de dirección marcado (casi `Linear`) para simular el golpe seco del talón contra el suelo.
4. Reproducir con `Alt+A`, comparar contra la tabla de la sección 8.1 y ajustar amplitudes si el paso se ve demasiado corto/largo o rígido.

---

## 12. Mejora opcional: configurar IK para los pies

Si el ciclo en FK se ve inestable en el punto de apoyo (el pie "flota" o se desliza), se puede añadir una capa de IK:

1. `Shift+A` en Edit Mode del Armature → *Single Bone*, crear un hueso corto a la altura de cada pie; nombrarlo `IK_Foot.L` / `IK_Foot.R`.
2. En Pose Mode, seleccionar `mixamorig_RightFoot_059` → panel *Bone Constraint Properties* → *Add Bone Constraint* → **Inverse Kinematics** → como *Target* asignar el Armature y como *Bone* el hueso `IK_Foot.R`; definir `Chain Length: 2` (para que afecte a `RightLeg_00` y `RightUpLeg_058`).
3. Repetir para el lado izquierdo.
4. Animar ahora solo los huesos `IK_Foot.L/.R` (posición) para fijar el pie exactamente en el suelo durante el apoyo; la cadera y la rodilla se resuelven automáticamente.

Esto es una mejora técnica opcional; el ciclo completo puede lograrse únicamente con FK siguiendo las secciones 7 a 11.

---

## 13. Verificación final y exportación

1. Reproducir el ciclo completo al menos 3 veces seguidas, confirmando que no hay salto perceptible entre el fotograma 24 y el 1.
2. Revisar desde vista frontal (`Numpad 1`) que la pelvis no gira ni se balancea de forma exagerada, y desde vista lateral (`Numpad 3`) que el paso tiene una longitud de zancada natural.
3. Guardar el archivo (`Ctrl+S`).
4. Para exportar: `File → Export → glTF 2.0`, activando en el panel lateral **Animation** → *Export Deformation Bones Only* y *Sampling Animations*.

---

## 14. Glosario de términos clave

| Término | Definición breve |
|---|---|
| **Gait Cycle (ciclo de marcha)** | Secuencia completa de eventos de una pierna, de un contacto de talón al siguiente del mismo pie, medida en % (0-100%). |
| **Stance / Swing** | Fase de apoyo (pie en el suelo) y fase de balanceo (pie en el aire) del ciclo. |
| **Initial Contact / Heel Strike** | Instante en que el talón toca el suelo al inicio del ciclo. |
| **Mid Stance** | Momento en que el cuerpo pasa verticalmente sobre el pie de apoyo. |
| **Toe-Off (Pre-Swing)** | Instante en que los dedos se despegan del suelo, iniciando el balanceo. |
| **Contralateral arm swing** | Balanceo de brazos en oposición a la pierna del mismo lado del cuerpo. |
| **Pelvic rotation / drop** | Rotación horizontal y caída lateral de la pelvis durante la marcha. |
| **FK / IK** | Forward / Inverse Kinematics — dos formas de controlar la rotación de una cadena de huesos. |
| **Cyclic Modifier** | Modificador de curva de animación que repite el rango de keyframes indefinidamente. |
| **NLA (Non-Linear Animation)** | Sistema para reutilizar y combinar acciones de animación como clips independientes. |

---
