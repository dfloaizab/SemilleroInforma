# El Puente de Langlois en Blender → three.js → WebXR

**Guía práctica:** mallas low poly, cipreses y vegetación con *Geometry Nodes*, agua low poly animada y textura de pincelada posimpresionista con *Shading Nodes*, y exportación para navegarlo en realidad virtual desde el navegador.

> **Versiones de referencia:** Blender 4.2 LTS o superior (los nombres de nodos corresponden a la 4.x), three.js r160 o superior, glTF 2.0. Visor probado en el navegador de Meta Quest.

---

## 0. Visión general del pipeline

```
Referencia (óleo) ─► Modelado low poly ─► Geometry Nodes ─► Shading Nodes ─► Bake ─► glTF/GLB ─► three.js + WebXR
   levantamiento      (4 componentes)     cipreses, hierba    pincelada, agua    texturas   (.glb)     locomoción VR
```

**Idea central:** en Blender se diseña todo de forma paramétrica y no destructiva; para la web se "congela" (se aplican modificadores, se hornean texturas) porque **glTF no transporta Geometry Nodes ni la mayoría de los Shader Nodes**. El agua animada se reimplementa en three.js (sección 7).

### Qué sobrevive a la exportación y qué no

| Elemento de Blender | ¿Se exporta a glTF? | Qué hacer |
|---|---|---|
| Mallas con modificadores (Mirror, Array, Bevel) | Sí, si *Apply Modifiers* está activo | Aplicar o exportar con la opción activa |
| Geometry Nodes (instancias de cipreses) | Solo el resultado evaluado | *Realize Instances* o exportar posiciones (sección 6.3) |
| Shader Nodes procedurales (Voronoi, Noise, Wave) | **No** | Hornear (*bake*) a imágenes |
| Nodo *Principled BSDF* con imágenes | Sí (Base Color, Normal, Roughness) | Es el material final de exportación |
| Animación del agua por nodos | **No** | Shader propio en three.js o textura desplazada |

### Presupuesto recomendado para VR autónoma (Quest)

| Recurso | Meta |
|---|---|
| Triángulos totales visibles | 100 000 – 150 000 |
| Draw calls | < 100 |
| Texturas | 5–8 imágenes de 1024² (máx. 2048² para cielo) |
| Luces dinámicas | 0–1 (preferir iluminación horneada o *unlit*) |

---

## 1. Preparación de la escena

1. **Nuevo archivo** → *General*. Guardar como `langlois_v01.blend`.
2. **Unidades:** *Scene Properties → Units → Unit System: Metric*, *Unit Scale: 1.0*. Se trabaja en metros para que la escala coincida con `local-floor` en WebXR (1 unidad = 1 m).
3. **Imagen de referencia:** `Shift+A → Image → Reference`, cargar la pintura. Colocarla en vista frontal (`Numpad 1`) y bloquearla.
4. **Colecciones** (organización indispensable para exportar y para Geometry Nodes):

```
Escena
├── 01_Estructura      (estribos, tablero, vigas, pretiles)
├── 02_Terreno         (orillas, lecho del canal)
├── 03_Agua            (plano del agua)
├── 04_Assets_Veg      (ciprés_A, ciprés_B, ciprés_C, tufo_hierba, maleza, loto)  ← oculta en viewport y render
├── 05_Vegetacion_GN   (objetos con modificador Geometry Nodes)
└── 06_Cielo
```

5. **Convención de nombres:** `SM_` mallas estáticas, `GN_` grupos de nodos, `M_` materiales, `T_` texturas. Ejemplo: `SM_Estribo_L`, `GN_Cipres`, `M_Piedra`, `T_Piedra_color`.
6. **Regla de oro (del material de clase):** trabajar con **quads**, escala **1.0** (`Ctrl+A → All Transforms`) antes de aplicar modificadores y normales hacia afuera (`Shift+N`).

---

## 2. Modelado low poly de la estructura (Collection `01_Estructura`)

Se sigue la matriz de construcción de los 4 componentes. Cada pieza conserva **su propio origen** (se usará para animar el puente levadizo en three.js).

### 2.1 Estribos de piedra

1. `Shift+A → Mesh → Cube`. Escalar (`S` + `X/Y/Z`) a aprox. **3 × 2 × 2.5 m**; `Ctrl+A → Scale`.
2. *Edit Mode* (`Tab`): `Ctrl+R` Loop Cut para dividir en 3 filas × 4 columnas (define las hileras de sillares). Con pocas divisiones el aspecto es "bloque" y se mantiene low poly.
3. Seleccionar las aristas verticales/horizontales de los cortes → `Ctrl+B` Bevel, **Segments 1**, **Width 0.03 m** (bisel mínimo: captura highlights sin sumar geometría).
4. Extruir (`E`) las caras laterales para el muro de contención en "L" que se ve en la pintura.
5. Para variación de la mampostería: seleccionar caras al azar (`Select → Select Random`, Ratio 0.25) y desplazarlas **0.02–0.04 m** a lo largo de la normal (`G Z`/`E` con valor mínimo).
6. **Mirror modifier** en eje X para el estribo opuesto; **Mirror Object** = un Empty en el centro del canal.
7. Desactivar *Clipping* y activar *Merge* en Mirror.

### 2.2 Tablero de madera

1. `Shift+A → Mesh → Plane`; escalar a una tabla de **0.25 × 3.0 m**; `E` Extrude hacia -Z **0.04 m**.
2. Biselar con `Ctrl+B` (1 segmento, 0.005 m).
3. **Origen en un extremo de la tabla** (*Object → Set Origin → Origin to 3D Cursor* con el cursor en el borde) para que el *Array* sea predecible.
4. Modificador **Array**: *Fit Type: Fixed Count*, **Count 25**, *Relative Offset* **Y = 1.05** (separación entre tablas).
5. Añadir desgaste: en *Edit Mode*, mover un par de vértices por tabla es innecesario; en su lugar se usa la textura de pincelada con el *Bump* (sección 5).

### 2.3 Estructura basculante (vigas, contrapesos)

1. Cubos escalados como vigas (sección cuadrada ~0.15 m). Marco: dos postes verticales + viga transversal superior + brazo basculante inclinado.
2. Tirantes: aristas convertidas a curva (`Alt+C → Mesh to Curve`) con *Bevel Depth* 0.01 y *Resolution U/V* = 0 (sección triangular al exportar) **o** simples cubos delgados rotados (más barato).
3. `I` Inset en las caras donde van las bisagras; `E` para formar los ejes.
4. **Pivote de la hoja levadiza (clave):**
   - Seleccionar el vértice de la bisagra → `Shift+S → Cursor to Selected`.
   - Seleccionar la hoja → *Object → Set Origin → Origin to 3D Cursor*.
   - Verificar rotando en `R X`; el brazo debe girar sobre la bisagra y no sobre su centro.
5. **Jerarquía:** `Ctrl+P → Object (Keep Transform)` para emparentar tirantes y tablero levadizo al brazo (padre). Nombrar el padre `PIVOT_Hoja_L` / `PIVOT_Hoja_R`.

### 2.4 Pretiles y barandillas

1. Poste base (cubo alargado) + modificador **Array** a lo largo del tablero (*Count* 8, *Relative Offset* ≈ 2.2 en el eje del puente).
2. Travesaño: `E` extruir entre los postes.
3. **Mirror** al otro lado del puente (el Mirror después del Array, como indica el orden de evaluación del stack).
4. **Orden del stack (de arriba hacia abajo):** `Mirror → Array → Solidify → Bevel` según corresponda. Los modificadores se evalúan en ese orden.

### 2.5 Terreno, canal y lecho

1. `Shift+A → Mesh → Grid` (X/Y subdivisions = **24**, tamaño 40 × 40 m): es la malla del terreno.
2. En *Edit Mode*, con *Proportional Editing* (`O`, falloff *Smooth*), bajar el centro para el canal (**-4.5 m** de profundidad respecto a la cota del agua en 0.0, con taludes de ~35° como en el perfil transversal del PDF).
3. Orilla izquierda más alta y ocre-naranja (donde están las lavanderas); orilla derecha con vegetación.
4. **Vertex Groups** (útiles para la dispersión):
   - `bosque` → zona donde irán los cipreses.
   - `hierba` → orillas.
   - `maleza` → franja alta junto al agua.
   Se pintan en *Weight Paint* (o seleccionando vértices en Edit Mode → *Object Data Properties → Vertex Groups → Assign*).
5. Aplanar zonas de anclaje de los estribos con `S Z 0` sobre los vértices seleccionados.

### 2.6 Elementos secundarios (opcionales)

- **Lavanderas y barca:** formas simples (cilindros + esferas de 6 segmentos, ~40–60 tris por figura) con colores planos pintados; en la pintura son manchas, no necesitan detalle.
- **Cielo:** esfera invertida (UV Sphere de 16 × 8 segmentos, *Flip Normals*), material *Emission*; se hornea en 2048 × 1024.

---

## 3. Geometry Nodes I: el ciprés procedural

Se crean **tres variantes** (`ciprés_A/B/C`) con el mismo grupo de nodos cambiando el `Seed` y los parámetros. Así, la dispersión luego puede elegir entre ellas.

### 3.1 Crear el grupo

1. Crear un objeto vacío: `Shift+A → Mesh → Plane`, borrar todos los vértices (`X → Vertices`) para que el objeto solo contenga lo que generen los nodos.
2. Pestaña **Geometry Nodes** → *New*. Nombre del grupo: `GN_Cipres`.
3. **Inputs del grupo** (panel lateral → *Group* → *Interface*):

| Input | Tipo | Valor por defecto |
|---|---|---|
| `Altura` | Float | 6.0 |
| `RadioBase` | Float | 0.45 |
| `Segmentos` | Integer | 10 |
| `LadoCircunf` | Integer | 7 |
| `Irregularidad` | Float | 0.25 |
| `Torsion` | Float | 0.3 |
| `Seed` | Integer | 0 |

### 3.2 Cadena de nodos (en orden)

```
Curve Line ─► Resample Curve ─► Set Curve Radius ─► Set Position (torsión) ─► Curve to Mesh ─► Set Position (ruido facetas) ─► Set Shade Smooth(false) ─► Group Output
                                                                                    ▲
                                                                          Curve Circle (profile)
```

1. **Curve Line**: *Start* (0,0,0), *End* (0,0,`Altura`) (con un nodo *Combine XYZ* en Z).
2. **Resample Curve** → modo *Count* = `Segmentos`. Cada segmento será un "piso" facetado de la silueta.
3. **Set Curve Radius**:
   - `Spline Parameter → Factor` → **Float Curve** (silueta de llama del ciprés):

   | Factor | Radio (multiplicador) |
   |---|---|
   | 0.00 | 0.35 |
   | 0.30 | 1.00 |
   | 0.70 | 0.65 |
   | 1.00 | 0.00 |

   - *Math → Multiply* por `RadioBase` → entrada `Radius`.
4. **Set Position** (curva), *Offset*:
   - `X = sin(Factor × π × 2) × Torsion × Factor`
   - Se construye con *Math → Multiply/Sine* y *Combine XYZ*. Da la curvatura ligera de los cipreses de Van Gogh.
5. **Curve to Mesh**:
   - *Curve* = curva anterior.
   - *Profile Curve* = **Curve Circle** con *Resolution* = `LadoCircunf` (6–8 lados → low poly).
   - Activar **Fill Caps**.
6. **Set Position** (malla) para romper la simetría:
   - `Noise Texture` (*Scale* 2.5, *Detail* 0, *W* = `Seed` si se usa 4D) → *Vector Math → Subtract* 0.5 → *Scale* por `Irregularidad`.
   - Multiplicar el resultado por `Position.z / Altura` (el ruido actúa más arriba) y por **Vector Math → Scale**.
   - Entrada *Offset*.
7. **Set Shade Smooth** (en 4.1+ es un nodo; con `Shade Smooth = False`): sombreado plano para el look facetado.
8. **Group Output** → *Geometry*.

> **Alternativa manual (para sesión de clase):** cilindro de 8 vértices → `E` + `S` repetidos en la cara superior (ver diapositiva *Esculpiendo cipreses*) y luego el Sculpt Mode. El grupo `GN_Cipres` automatiza este flujo y permite generar variantes con un solo número.

### 3.3 Crear variantes

1. Con el modificador activo en el panel *Modifiers*, cambiar `Seed`, `Altura` y `Torsion` y duplicar el objeto con `Shift+D` — o mejor: `Alt+D` (copia enlazada del *mesh*, pero el modificador es independiente).
2. Guardar `ciprés_A` (Altura 6.5), `ciprés_B` (Altura 5.2, Torsion 0.45) y `ciprés_C` (Altura 7.5, Irregularidad 0.35).
3. Moverlos a `04_Assets_Veg`. Aplicar el modificador (`Ctrl+A` → *Visual Geometry to Mesh*) **solo sobre copias**; el original permanece paramétrico.
4. Verificar: origen en la **base del tronco** (Z = 0) y `Ctrl+A → Scale`.

### 3.4 Los dos cipreses gemelos (héroes de la composición)

Los cipreses de primer plano de la pintura son un par asimétrico: colocarlos a mano (no con dispersión), uno más alto que el otro, inclinados 2–4° en sentidos distintos (`R Y`).

---

## 4. Geometry Nodes II: dispersión procedural en el terreno

### 4.1 Preparar el terreno

1. Seleccionar el terreno → pestaña *Geometry Nodes* → *New* → `GN_Dispersion_Bosque`.
2. En *Group Input* añadir:

| Input | Tipo | Nota |
|---|---|---|
| `Geometria` | Geometry | (automático) |
| `Coleccion` | Collection | Colección `04_Assets_Veg` (solo cipreses) |
| `Densidad` | Float | 0.4 |
| `DistMin` | Float | 2.0 |
| `EscalaMin / EscalaMax` | Float | 0.7 / 1.4 |
| `Inclinacion` | Float | 0.08 (rad) |
| `Seed` | Integer | 0 |
| `PendienteMax` | Float | 0.8 |

> Para la dispersión crear una colección aparte `Cipreses` que contenga **solo** `ciprés_A/B/C`; el nodo *Collection Info* leerá esa.

### 4.2 Cadena de nodos

```
Group Input(Geometry) ─► Distribute Points on Faces ─► Instance on Points ─► Realize Instances ─► Join Geometry ─► Group Output
                                 ▲                         ▲                                           ▲
                          Selection (máscara)     Collection Info + Random Value                Group Input (Geometry: el terreno original)
```

1. **Distribute Points on Faces**:
   - *Distribute Method*: **Poisson Disk** (garantiza que dos cipreses no colisionen).
   - *Distance Min* = `DistMin`, *Density Max* = `Densidad`, *Seed* = `Seed`.
2. **Selection (máscara):** combinar con *Boolean Math → AND* tres condiciones:
   - **Vertex Group:** `Named Attribute` (nombre `bosque`, tipo *Float*) → *Compare → Greater Than* 0.5.
   - **Altura sobre el agua:** `Position → Separate XYZ → Z` → *Compare → Greater Than* 0.2.
   - **Pendiente:** `Normal` → *Vector Math → Dot Product* con (0,0,1) → *Compare → Greater Than* `PendienteMax`.
3. **Collection Info**: *Collection* = `Coleccion`; activar **Separate Children** y **Reset Children**; salida *Instances*.
4. **Instance on Points**:
   - *Points* = salida del *Distribute*.
   - *Instance* = salida de *Collection Info*.
   - Activar **Pick Instance**.
   - *Instance Index* = **Random Value (Integer)**, *Min* 0, *Max* 2.
   - *Scale* = **Random Value (Float)**, *Min* `EscalaMin`, *Max* `EscalaMax` → *Combine XYZ* (el mismo valor en X, Y, Z) **o** *Vector* directamente con Z con mayor rango para variar la altura.
   - *Rotation* = *Combine XYZ*:
     - X = **Random Value** (-`Inclinacion`, +`Inclinacion`)
     - Y = **Random Value** (-`Inclinacion`, +`Inclinacion`)
     - Z = **Random Value** (0, 2π)
5. **Realize Instances** (necesario para exportar a glTF desde Blender de forma sencilla; ver 6.3 para la alternativa instanciada).
6. **Join Geometry** con la geometría original del terreno → *Group Output*.

### 4.3 Control de "caos natural"

- Cambiar `Seed` hasta que la composición se parezca a la pintura (los cipreses en la orilla derecha agrupados detrás del puente).
- **Excluir zona del puente:** añadir una condición más a la selección: *Distance* a un Empty (Object Info → Position → *Vector Math Distance*) → *Compare Greater Than* 6 m.
- **Mayor densidad en el borde del bosque:** multiplicar `Densidad` por el peso del vertex group (*Density Factor* en *Distribute Points on Faces*).

### 4.4 Hierba, maleza y hojas de loto (mismo patrón)

Crear tres grupos copiando `GN_Dispersion_Bosque` (`Ctrl+C` / duplicar grupo):

| Grupo | Vertex group / máscara | Assets | Densidad | Notas |
|---|---|---|---|---|
| `GN_Hierba` | `hierba` | `tufo_hierba` (dos quads en cruz a 90°) | alta, *Distance Min* 0.25 | Origen en la base, escala 0.6–1.2 |
| `GN_Maleza` | `maleza` | `maleza_alta` (3–4 hojas alargadas) | media | Rotación Z aleatoria; inclinar hacia el agua |
| `GN_Loto` | Z ≈ 0 en el plano del agua | `hoja_loto` (disco de 8 lados) | baja | Rotación solo en Z; Z = 0.01 para evitar *z-fighting* |

> **Eficiencia:** los tufos de hierba usan *alpha clip* en three.js. Alternativamente se modelan con silueta real (hojas triangulares) para evitar transparencia, preferible en VR.

### 4.5 Color por instancia (variación de pincelada)

1. En *Instance on Points*, tras el nodo, añadir **Store Named Attribute**: *Data Type* **Float**, *Domain* **Instance**, nombre `var`, valor = **Random Value (Float)**.
2. Al hacer *Realize Instances*, esa información pasa a los vértices.
3. En el material se lee con el nodo **Attribute** (*Type: Geometry*, nombre `var`) para variar el tono de cada ciprés (sección 5.3).

---

## 5. Shading Nodes I: textura de pincelada posimpresionista

Objetivo: que cada superficie parezca pintada con trazos cortos y empastados (*impasto*), con colores adyacentes de una misma familia cromática.

### 5.1 Paleta de partida

Valores de referencia sugeridos (ajustar mirando la pintura):

| Uso | Color | Hex |
|---|---|---|
| Cielo claro | Azul cerúleo | `#6FA8DC` |
| Cielo / agua profunda | Azul cobalto | `#2F5DA8` |
| Sombra de agua | Azul de Prusia | `#1F3A5F` |
| Madera del puente | Amarillo cromo | `#E8C547` |
| Piedra | Crema ocre | `#E6D3A0` |
| Orilla izquierda | Naranja tierra | `#D9731A` |
| Hierba | Verde esmeralda | `#3F8F4F` |
| Ciprés | Verde oliva oscuro | `#2E4A1F` |

### 5.2 Construcción del material `M_Pincelada_Base`

Panel **Shader Editor** → *New* material. Estructura:

```
Texture Coordinate(Object) ─► Mapping ─► [Noise: distorsión] ─► Voronoi (F1) ─┬─ Color ─► Separate Color (R) ─┐
                                                                                 └─ Distance ─► Color Ramp ─► Bump ─► Principled (Normal)
Gradiente base ─► Math Add ◄─────────────────────────────────────────────────────────────────────────────┘
        └─► Color Ramp (paleta) ─► Mix (Multiply con cerdas) ─► Principled (Base Color)
```

Paso a paso:

1. **Texture Coordinate → Object** (estable en objetos con *Array/Mirror*).
2. **Mapping**: *Scale* anisótropa. Para trazos horizontales largos: `(3, 3, 22)` en un plano que mira al eje Z; para madera: escala alta en el eje perpendicular a las tablas. **El eje con menor escala es la dirección del trazo.**
3. **Distorsión de trazos:**
   - *Noise Texture* (*Scale* 2, *Detail* 3, *Roughness* 0.5) → *Vector Math → Scale* 0.15 → *Vector Math → Add* con las coordenadas. Evita trazos rectos y mecánicos.
4. **Voronoi Texture** (3D, *F1*, *Euclidean*, *Scale* 6): con la entrada anterior genera "celdas" alargadas = pinceladas.
   - Salida **Color** → *Separate Color (RGB)* → **R**: valor aleatorio por pincelada.
   - Salida **Distance**: distancia al centro de la celda (da relieve a cada trazo).
5. **Color final con variación por trazo:**
   - Gradiente base (por ejemplo `Separate XYZ → Z` normalizado con *Map Range*, o un *Gradient Texture*).
   - **Math → Add**: `gradiente + (R − 0.5) × Variacion` (Variacion ≈ 0.18).
   - **Color Ramp** (interpolación *Linear* o *Constant* para paleta "cortada") con 3–4 colores de la paleta (5.1).
6. **Cerdas del pincel:**
   - *Noise Texture* con *Mapping* **(2, 2, 160)**: líneas finísimas en la dirección del trazo.
   - *Color Ramp* (estrecho) → *Mix* **Multiply** con *Factor* 0.2 sobre el color de la paso 5.
7. **Relieve (empaste):**
   - *Voronoi Distance* → **Color Ramp** (0 → 0.6) → *Math Add* con la textura de cerdas (×0.3) → **Bump** (*Strength* 0.6, *Distance* 0.02) → *Normal* del *Principled BSDF*.
8. **Principled BSDF:** *Roughness* 0.85, *Specular* 0.2, *Metallic* 0.
9. Duplicar el material para cada superficie y cambiar solo: paleta del *Color Ramp*, escala del *Mapping* y el eje del trazo.

| Material | Orientación del trazo | Variación | Notas |
|---|---|---|---|
| `M_Piedra` | Horizontal por hilada (eje X) | 0.15 | Añadir `Ctrl+B` Bevel como "AO" de aristas |
| `M_Madera` | A lo largo de la tabla | 0.12 | Cerdas muy marcadas |
| `M_Terreno` | Radial/diagonal | 0.25 | Mezclar naranja y verde por pendiente |
| `M_Cipres` | Vertical | 0.20 + atributo `var` | Ver 5.3 |
| `M_Cielo` | Remolinos (ver 5.4) | 0.30 | Se hornea |

### 5.3 Variación por instancia

Nodo **Attribute** (*Type: Geometry*, *Name:* `var`) → sumarlo a la entrada del *Color Ramp* con peso 0.3. Cada ciprés tiene un tono distinto sin duplicar materiales (importante para mantener el número de draw calls).

### 5.4 Cielo de remolinos (opcional)

1. En `M_Cielo`: *Texture Coordinate → Generated* → *Noise Texture* **Musgrave**-like (Noise con *Detail* 6, *Distortion* 3) → *Wave Texture* (*Bands*, *Distortion* 8) → *Color Ramp* azul cobalto → cerúleo → crema.
2. La *Distortion* alta produce los espirales del cielo de Van Gogh.

---

## 6. Hornear (bake) para exportar

### 6.1 Preparación

1. **UV Unwrap** de cada objeto: `Tab` → `A` → `U → Smart UV Project` (Angle Limit 66°, Island Margin 0.02) — o *Unwrap* con costuras en la estructura.
2. Para terreno y agua: `U → Project from View (Bounds)` desde `Numpad 7`.
3. **Cycles** como motor de render (*Render Properties → Render Engine → Cycles*, *Device* GPU si es posible).
4. **Un material de bake por objeto:** en el material, añadir un nodo **Image Texture** con una imagen nueva (1024 × 1024, **sin** *32-bit Float*), **sin conectar**, y dejarlo **seleccionado** (activo).

### 6.2 Bakes necesarios

| Mapa | Bake Type | Ajustes | Se conecta en glTF a |
|---|---|---|---|
| Color | **Emit** (conectar el color final a un nodo *Emission* → *Material Output*) **o** *Diffuse* solo con *Color* activado | *Margin* 8 px | Base Color |
| Normal | **Normal** | *Space: Tangent* | Normal Map |

Procedimiento (por objeto):

1. Seleccionar el objeto.
2. *Render Properties → Bake* → *Bake Type: Emit*.
3. **Bake**. Guardar la imagen (`Image → Save As…` en PNG; si no se guarda se pierde).
4. Repetir con *Normal* (conectar los nodos *Bump* al *Principled*; en *Cycles*, el bake de normales **incluye** el bump del shader).
5. **Crear el material de exportación** `M_Piedra_EXP`: un *Principled BSDF* con *Image Texture* (color) → *Base Color* e *Image Texture* (Non-Color) → *Normal Map* → *Normal*.

> **Consejo:** si se prefiere un aspecto más "pintura plana", **no** exportar normal map y usar únicamente el color horneado con material *Unlit* (más barato y más fiel a una pintura).

### 6.3 Instancias vs. geometría real

| Estrategia | Ventaja | Inconveniente |
|---|---|---|
| **A. Realize Instances** (propuesto en 4.2) | Un solo `.glb`, cero código adicional | Más memoria (40 cipreses × ~100 tris ≈ 4 000 tris: despreciable) |
| **B. Exportar posiciones** y usar `InstancedMesh` en three.js | Mínimo de draw calls y memoria con cientos de árboles | Requiere script de exportación |

Para la opción B, ejecutar en la consola de Python de Blender (terreno con el modificador `GN_Dispersion_Bosque`, con *Realize Instances* **desactivado**):

```python
import bpy, json

obj = bpy.context.active_object
dg = bpy.context.evaluated_depsgraph_get()

data = []
for inst in dg.object_instances:
    if inst.is_instance and inst.parent and inst.parent.original == obj:
        m = inst.matrix_world
        # Blender (Z arriba) → three.js (Y arriba): (x, y, z) → (x, z, -y)
        loc = m.to_translation()
        rot = m.to_euler()
        sca = m.to_scale()
        data.append({
            "name": inst.object.original.name,
            "p": [loc.x, loc.z, -loc.y],
            "r": [rot.x, rot.z, -rot.y],
            "s": [sca.x, sca.z, sca.y],
        })

with open(bpy.path.abspath("//cipreses.json"), "w") as f:
    json.dump(data, f)
print(len(data), "instancias exportadas")
```

> Las conversiones de ejes son aproximadas para rotaciones muy inclinadas; para inclinaciones pequeñas (±0.08 rad) funcionan bien.

---

## 7. Shading Nodes II: agua low poly animada

### 7.1 Geometría del agua

1. `Shift+A → Mesh → Grid`, *X/Y Subdivisions* **28**, tamaño 40 × 14 m, en `03_Agua`, a Z = 0.0 (cota del nivel del agua).
2. Cada cara está **sombreada plana** (`Object → Shade Flat`): así se ve el efecto facetado del low poly.
3. **Opcional (vista previa en Blender):** *Geometry Nodes* con *Scene Time → Seconds* → *Noise Texture 4D* (*W* = tiempo × 0.5) → *Set Position* en Z con amplitud 0.04 m. En three.js se reproduce con vertex shader (7.3).

### 7.2 Material animado en Blender (`M_Agua_LowPoly`)

```
Geometry(Position) ─► Mapping(Location animado) ─► Noise 4D / Wave ─► Math(Floor posterización) ─► Color Ramp(constant) ─► Principled / Emission
```

1. **Texture Coordinate → Object**, *Mapping*:
   - *Scale* `(1.2, 7, 1)` → trazos horizontales alargados como los de Van Gogh en el agua.
2. **Movimiento:** crear un nodo **Value** y añadir un *driver* (clic derecho → *Add Driver*) con la expresión `frame / 40`.
   - Conectar ese Value a la entrada **W** de la *Noise Texture 4D* (o a la *Location Y* del *Mapping*).
3. **Noise Texture 4D** (*Scale* 3, *Detail* 2) + **Wave Texture** (*Rings/Bands*, *Direction: Y*, *Distortion* 3, *Phase Offset* = el mismo Value) → *Math Add*.
4. **Posterizado low poly:**
   - *Math → Multiply* por 4 → *Math → Floor* → *Math → Divide* por 3 → valores discretos 0, 0.33, 0.66, 1.
   - **Color Ramp** (interpolación *Constant*) con: `#1F3A5F` → `#2F5DA8` → `#6FA8DC` → `#E6D3A0` (destello).
5. **Reflejos de cielo:** *Layer Weight → Fresnel* → *Mix* (*Factor* 0.2) con el cielo cerúleo.
6. **Salida:** *Emission* (fuerza 1) o *Principled* con *Roughness* 0.3 para ver los highlights. Para el estilo pintura se prefiere *Emission*.

### 7.3 Versión para three.js (la que se verá en VR)

El material animado no se exporta, por lo que se **reconstruye** con un `ShaderMaterial`. El plano del agua se exporta como malla (sin material de nodos) y en JS se reemplaza su material.

```js
import * as THREE from 'three';

export function crearMaterialAgua() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime:  { value: 0 },
      uDeep:  { value: new THREE.Color('#1F3A5F') },
      uMid:   { value: new THREE.Color('#2F5DA8') },
      uLight: { value: new THREE.Color('#6FA8DC') },
      uSpark: { value: new THREE.Color('#E6D3A0') },
    },
    vertexShader: /* glsl */`
      uniform float uTime;
      varying vec3 vWorldPos;
      void main() {
        vec3 p = position;
        // oleaje suave (el plano está en XZ tras la conversión Y-up)
        p.y += sin(p.x * 1.7 + uTime * 0.9) * 0.04
             + sin(p.z * 2.3 + uTime * 1.3) * 0.03;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform vec3 uDeep, uMid, uLight, uSpark;
      varying vec3 vWorldPos;

      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float vnoise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
      }

      void main() {
        // trazos horizontales: poca frecuencia en X, mucha en Z
        vec2 q = vec2(vWorldPos.x * 1.2, vWorldPos.z * 7.0);
        float n = vnoise(q + vec2(uTime * 0.25, 0.0))
                + 0.5 * vnoise(q * 2.1 - vec2(uTime * 0.40, 0.0));
        n /= 1.5;

        // posterizado: 4 niveles discretos
        float band = floor(n * 4.0) / 3.0;

        vec3 c = uDeep;
        c = mix(c, uMid,   step(0.30, band));
        c = mix(c, uLight, step(0.60, band));
        c = mix(c, uSpark, step(0.95, band));

        // sombreado plano (facetas low poly) con derivadas
        vec3 nrm = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
        float l = dot(nrm, normalize(vec3(0.4, 1.0, 0.3)));
        c *= 0.85 + 0.25 * l;

        gl_FragColor = vec4(c, 1.0);
      }
    `,
  });
}
```

**Uso** (en el bucle de animación): `aguaMat.uniforms.uTime.value = clock.getElapsedTime();`

### 7.4 Alternativa sin shader propio (más económica)

1. En Blender, hornear una textura **tileable** de agua (sección 6) de 512–1024 px.
2. En three.js, `tex.wrapS = tex.wrapT = THREE.RepeatWrapping;` y en el *render loop* `tex.offset.x += dt * 0.02;`.
3. Es lo más barato para GPU móvil y suficiente para la mayoría de las demostraciones.

---

## 8. Exportación a glTF desde Blender

### 8.1 Lista de verificación previa

- [ ] `Ctrl+A → All Transforms` en todas las mallas (**Scale = 1**).
- [ ] Normales hacia afuera (*Overlay → Face Orientation*, todo azul; `Shift+N`).
- [ ] Mallas *manifold* en piezas sólidas (*Select → Select All by Trait → Non Manifold*).
- [ ] Modificadores aplicados o *Apply Modifiers* activo.
- [ ] Un material por componente (mantener draw calls bajos).
- [ ] Materiales finales: *Principled BSDF* con imágenes (los de nodos procedurales sustituidos por `*_EXP`).
- [ ] Orígenes correctos en las hojas levadizas (`PIVOT_Hoja_L/R`).
- [ ] Texturas guardadas en disco (empaquetadas o referenciadas).

### 8.2 Ajustes de exportación

`File → Export → glTF 2.0 (.glb/.gltf)`:

| Panel | Opción |
|---|---|
| Format | **glTF Binary (.glb)** |
| Include | *Limit to: Visible Objects* (ocultar `04_Assets_Veg`) |
| Transform | **+Y Up** (activado) |
| Data → Mesh | *Apply Modifiers* ✔, *UVs* ✔, *Normals* ✔, *Tangents* ✖ (si no hay normal map) |
| Data → Material | *Export*; *Images: JPEG/WebP* para color, PNG para normal |
| Data → Compression | *Draco* opcional (requiere `DRACOLoader`; alternativa: *gltf-transform* con Meshopt) |
| Animation | ✖ (el agua y la vegetación se animan en three.js) |

> Optimizar con [`gltf-transform`](https://gltf-transform.dev): `npx @gltf-transform/cli optimize langlois.glb langlois_opt.glb --texture-compress webp`

---

## 9. three.js + WebXR

### 9.1 Estructura del proyecto

```
langlois-vr/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.js
│   └── agua.js        (crearMaterialAgua de la sección 7.3)
└── public/
    ├── langlois.glb
    └── cipreses.json  (opcional, sección 6.3)
```

### 9.2 Instalación y servidor HTTPS

WebXR **exige HTTPS** (excepto `localhost`).

```bash
npm create vite@latest langlois-vr -- --template vanilla
cd langlois-vr
npm install three
npm install -D @vitejs/plugin-basic-ssl
```

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [basicSsl()],
  server: { host: true },   // accesible desde el visor en la red local
});
```

`npm run dev` → abrir `https://<IP-de-tu-PC>:5173` en el navegador del visor (aceptar el certificado autofirmado). Sin visor: extensión **Immersive Web Emulator** (Meta) en Chrome.

### 9.3 `src/main.js` (escena, glTF, locomoción por teletransporte)

```js
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { crearMaterialAgua } from './agua.js';

// --- Escena básica ---------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.xr.enabled = true;
renderer.xr.setReferenceSpaceType('local-floor');   // origen = suelo
document.body.appendChild(renderer.domElement);
document.body.appendChild(VRButton.createButton(renderer));

const scene = new THREE.Scene();
scene.background = new THREE.Color('#6FA8DC');

const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.05, 200);

// "Dolly": grupo que se mueve para teletransportar al usuario
const dolly = new THREE.Group();
dolly.position.set(-4, 0, 6);           // punto de partida (orilla izquierda)
dolly.add(camera);
scene.add(dolly);

// --- Carga del modelo ------------------------------------------------------
const aguaMat = crearMaterialAgua();
const suelos = [];                       // mallas donde se puede teletransportar
let hojaIzq, hojaDer;

new GLTFLoader().load('/langlois.glb', (gltf) => {
  gltf.scene.traverse((o) => {
    if (!o.isMesh) return;

    // Agua: reemplazar por el shader animado
    if (o.name.startsWith('SM_Agua')) {
      o.material = aguaMat;
      return;
    }

    // Estilo pintura: color horneado sin iluminación dinámica (barato y fiel)
    const old = o.material;
    o.material = new THREE.MeshBasicMaterial({ map: old.map, side: THREE.FrontSide });

    if (o.name.startsWith('SM_Terreno')) suelos.push(o);
  });

  hojaIzq = gltf.scene.getObjectByName('PIVOT_Hoja_L');
  hojaDer = gltf.scene.getObjectByName('PIVOT_Hoja_R');
  scene.add(gltf.scene);
});

// --- Controladores y teletransporte ---------------------------------------
const raycaster = new THREE.Raycaster();
const tempMatrix = new THREE.Matrix4();

const marcador = new THREE.Mesh(
  new THREE.RingGeometry(0.15, 0.2, 16).rotateX(-Math.PI / 2),
  new THREE.MeshBasicMaterial({ color: 0xffffff })
);
marcador.visible = false;
scene.add(marcador);

function crearControlador(i) {
  const c = renderer.xr.getController(i);
  c.addEventListener('selectstart', () => { c.userData.apuntando = true; });
  c.addEventListener('selectend', () => {
    c.userData.apuntando = false;
    if (marcador.visible) {
      dolly.position.set(marcador.position.x, marcador.position.y, marcador.position.z);
    }
  });

  // línea láser
  const geo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -5),
  ]);
  c.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff })));

  dolly.add(c);                          // los controladores viajan con el dolly
  return c;
}
const controladores = [crearControlador(0), crearControlador(1)];

function actualizarApuntado() {
  marcador.visible = false;
  for (const c of controladores) {
    if (!c.userData.apuntando) continue;
    tempMatrix.identity().extractRotation(c.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(c.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
    const hit = raycaster.intersectObjects(suelos, false)[0];
    if (hit) { marcador.position.copy(hit.point); marcador.visible = true; }
  }
}

// --- Puente levadizo: alternar con un gatillo corto sobre el puente --------
let abierto = false, anguloObjetivo = 0;
window.addEventListener('keydown', (e) => {          // prueba en escritorio
  if (e.key === 'b') { abierto = !abierto; anguloObjetivo = abierto ? Math.PI / 3 : 0; }
});

// --- Bucle de render -------------------------------------------------------
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  aguaMat.uniforms.uTime.value = clock.elapsedTime;

  if (hojaIzq && hojaDer) {
    hojaIzq.rotation.x += (-anguloObjetivo - hojaIzq.rotation.x) * Math.min(dt * 2, 1);
    hojaDer.rotation.x += ( anguloObjetivo - hojaDer.rotation.x) * Math.min(dt * 2, 1);
  }

  actualizarApuntado();
  renderer.render(scene, camera);
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
```

> **Nota:** el eje de rotación de las hojas depende de cómo se orientó el puente en Blender. Si la hoja gira sobre el eje equivocado, cambiar `rotation.x` por `rotation.z`.

### 9.4 Cipreses con `InstancedMesh` (opción B de la sección 6.3)

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

async function cargarCipreses(scene) {
  const datos = await (await fetch('/cipreses.json')).json();
  const gltf  = await new GLTFLoader().loadAsync('/cipreses_assets.glb');

  const variantes = ['ciprés_A', 'ciprés_B', 'ciprés_C'].map(n => gltf.scene.getObjectByName(n));
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();

  variantes.forEach((v, i) => {
    const lista = datos.filter(d => d.name === v.name);
    const mesh = new THREE.InstancedMesh(v.geometry, v.material, lista.length);
    lista.forEach((d, k) => {
      q.setFromEuler(e.set(...d.r));
      m.compose(new THREE.Vector3(...d.p), q, new THREE.Vector3(...d.s));
      mesh.setMatrixAt(k, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
    scene.add(mesh);
  });
}
```

Tres `InstancedMesh` = tres draw calls para cientos de árboles.

### 9.5 Cielo

Cargar el cielo horneado como textura equirectangular:

```js
const tex = new THREE.TextureLoader().load('/T_Cielo.jpg');
tex.mapping = THREE.EquirectangularReflectionMapping;
tex.colorSpace = THREE.SRGBColorSpace;
scene.background = tex;
```

---

## 10. Pruebas y optimización en VR

| Verificación | Cómo |
|---|---|
| Frecuencia de cuadros | En Quest Browser, 72 fps estables; en consola usar `renderer.info.render` (`calls`, `triangles`) |
| Mareo por locomoción | Teletransporte (no movimiento continuo) y sin rotación forzada de cámara |
| Escala | Altura de la baranda ≈ 1.0–1.1 m; el usuario debe percibir proporciones humanas |
| Aliasing de texturas | `tex.anisotropy = 4` y mipmaps activos |
| Color | `tex.colorSpace = THREE.SRGBColorSpace` en texturas de color; `NoColorSpace` en normales |
| Peso del `.glb` | Objetivo < 15 MB (WebP + Meshopt) |

### Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| El modelo aparece negro/gris | Se exportó el shader procedural | Hornear y usar `*_EXP` con imágenes |
| Los cipreses no aparecen en el `.glb` | Instancias sin *Realize* | Activar *Realize Instances* o usar la opción B |
| Texturas "lavadas" o muy oscuras | Espacio de color incorrecto | Ver tabla anterior |
| El puente se desarma al girar | Origen en el centro de la hoja | Mover origen a la bisagra (sección 2.3) |
| Se ven caras "al revés" | Normales invertidas | `Shift+N` y revisar *Face Orientation* |
| `VRButton` dice "VR not supported" | Sin HTTPS o sin dispositivo | Usar HTTPS (sección 9.2) o el emulador |
| Z-fighting en el agua/loto | Superficies coplanares | Separar 0.01 m en Z |

---

## 11. Ruta de trabajo sugerida (por sesiones)

| Sesión | Contenido | Entregable |
|---|---|---|
| 1 | Levantamiento y estructura (secciones 1–2) | `.blend` con estribos, tablero, vigas y pretiles |
| 2 | Terreno y cipreses (secciones 2.5, 3) | Grupo `GN_Cipres` con 3 variantes |
| 3 | Dispersión procedural (sección 4) | Terreno poblado de cipreses, hierba y maleza |
| 4 | Shading de pincelada (sección 5) | Materiales `M_*` con empaste |
| 5 | Agua y cielo (sección 7) | Material animado + vista previa |
| 6 | Bake y exportación (secciones 6, 8) | `langlois.glb` optimizado |
| 7 | three.js + WebXR (sección 9) | Escena navegable en el visor |

---

## 12. Extensiones posibles

- **Puente levadizo animado** con *Shape Keys* o con rotación de hojas disparada por el gatillo.
- **Audio espacial** (`THREE.PositionalAudio`) con agua y viento.
- **Lavanderas animadas** con *Armature* sencillo y exportación de animación `.glb`.
- **Post-proceso pictórico** (filtro Kuwahara en un `EffectComposer`; en VR solo para escritorio por costo).
- **Modo "ver el cuadro"**: plano de la pintura original en la orilla, para comparar desde el mismo punto de vista de Van Gogh.

---

## Referencias técnicas

- Manual de Blender: *Geometry Nodes*, *Shader Nodes*, *Baking*, *glTF 2.0 add-on*.
- three.js docs: *WebXR*, `GLTFLoader`, `InstancedMesh`, `ShaderMaterial`.
- glTF 2.0 Specification (Khronos Group).
- Material de clase: *Impressionist Blueprint* e *Ingeniería Inversa de Van Gogh en 3D* (estribos, tablero, estructura basculante, pretiles, cipreses y distribución procedimental).
