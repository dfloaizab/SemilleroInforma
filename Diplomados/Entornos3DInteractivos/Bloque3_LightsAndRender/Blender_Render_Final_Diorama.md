# Renderizado de Alta Calidad para el Diorama Isométrico
## Extensión — Sesiones 12-13: Motores de render y render final

Este instructivo traduce la guía técnica de referencia en pasos ejecutables sobre el proyecto que ya se ha venido construyendo (`Base_Plataforma`, `Montaña_Base`, `Agua_Lago`, `Agua_Cascada`, `Prop_Farol_01`, cámara isométrica de la Sesión 5, esquema de luces de la Sesión 10).

---

## Parte 1 — Verificación de la estructura de la escena

Antes de tocar parámetros de render, conviene confirmar que la jerarquía de la escena esté ordenada. La guía de referencia sugiere una convención de colecciones (`LGT_Global`, `GEO_Terrain`, `GEO_Props`, `CAM_Render`, `VFX_Water`); dado que en la Sesión 5 ya se estableció una convención propia, la siguiente tabla hace la equivalencia para no duplicar esfuerzo:

| Convención de la guía técnica | Colección ya creada en la Sesión 5 | Contenido |
|---|---|---|
| `LGT_Global` | `Camara_Luz` | Sun, Area, Spot, luz del farolito |
| `GEO_Terrain` | `Terreno` | `Base_Plataforma`, `Montaña_Base` |
| `GEO_Props` | `Vegetación`, `Rocas_Agua`, `Props_Iluminacion` | Árboles, rocas, farolito |
| `CAM_Render` | `Camara_Luz` (o una colección `Camara` independiente) | Cámara isométrica |
| `VFX_Water` | `Rocas_Agua` (o crear una colección `Agua` dedicada) | `Agua_Lago`, `Agua_Cascada` |

Si se prefiere separar el agua en su propia colección `Agua` (recomendable, dado que sus materiales se ajustan de forma independiente en esta etapa), basta con crear la colección en el Outliner y arrastrar `Agua_Lago` y `Agua_Cascada` hacia ella.

**Verificación de Object vs. Data-block (repaso de la Sesión 1):** si existen props repetidos (por ejemplo, varias rocas o varios árboles duplicados con `Alt+D`), confirmar que compartan el mismo Data-block de malla en lugar de copias independientes — esto reduce el consumo de memoria en escenas con muchos objetos. Para verificarlo: seleccionar dos props similares y revisar en Object Data Properties si el nombre del dato de malla (junto al ícono de triángulo verde) es el mismo para ambos; si no lo es y deberían compartirlo, seleccionar ambos objetos (el que se quiere conservar como fuente, al final) y usar `Ctrl+L > Link Object Data`.

---

## Parte 2 — Configuración de la cámara isométrica (proyección ortográfica)

Estos valores ya se establecieron de forma aproximada en la Sesión 5; aquí se precisan los valores exactos de "isométrico verdadero":

1. Seleccionar la cámara. Confirmar en Object Data Properties (ícono de cámara) que `Lens > Type = Orthographic`.
2. En el panel N del viewport (`N`), pestaña `Item`, ajustar manualmente la rotación:
   - `Rotation X = 54.736°`
   - `Rotation Y = 0°`
   - `Rotation Z = 45°`
3. En Object Data Properties de la cámara, ajustar `Orthographic Scale` (no la posición en el eje de profundidad) para encuadrar el diorama completo — subir el valor aleja el encuadre (se ve más pequeño y con más margen), bajarlo lo acerca. Evitar resolver el encuadre moviendo la cámara físicamente hacia el objeto, ya que en proyección ortográfica esto puede producir recorte (*clipping*) de geometría cercana según los valores de `Clip Start`/`Clip End`.
4. Verificar composición: `Ctrl+Numpad 0` para entrar a la vista de cámara. Aplicar la Regla de los Tercios (vista en la Sesión 11) activando la cuadrícula de composición: Object Data Properties de la cámara → sección `Viewport Display` → `Composition Guides > Thirds`. Reposicionar la cámara (no rotarla, para no perder el ángulo isométrico) hasta que la cascada quede sobre una de las intersecciones de la cuadrícula.

---

## Parte 3 — Iluminación PBR y entorno (HDRI)

Este paso amplía el esquema de luces ya definido en la Sesión 10 (Sun + Area + Spot) añadiendo un entorno HDRI para iluminación de relleno físicamente más precisa.

### 3.1 Configurar el Environment Texture (World)

1. Ir a World Properties (ícono de globo en Properties).
2. Clic en el botón de color junto a `Color` → cambiar el tipo de `Color` a `Environment Texture`.
3. Clic en `Open` y cargar un archivo HDRI (formato `.hdr` o `.exr`; puede obtenerse de bancos de HDRI de uso libre como Poly Haven).
4. Alternativa con más control manual: cambiar al workspace **Shading**, y en el desplegable superior del editor de nodos (por defecto en "Object") seleccionar **World** — ahí se puede construir manualmente la cadena `Environment Texture > Background > World Output`, y ajustar la `Strength` del nodo `Background` (recomendado: `0.4-0.6`, para que el HDRI aporte reflejos y relleno sin sobreexponer la escena).

### 3.2 Afinar la luz principal (Sun)

Sobre la Sun ya creada en la Sesión 10:

1. `Strength = 2.0-5.0 W/m²` (ajustar dentro de ese rango según qué tan intenso se vea junto al nuevo HDRI).
2. `Angle = 2-5°` — a diferencia del valor por defecto usado en la Sesión 10 (0.526°, que da sombras muy nítidas), un ángulo mayor en este rango produce penumbras más difusas, apropiadas para el acabado orgánico de la montaña.
3. Temperatura de color: para un control preciso en grados Kelvin, activar `Use Nodes` en Object Data Properties de la luz (disponible al renderizar con Cycles) y conectar un nodo `Blackbody` (`Shift+A > Converter > Blackbody`, dentro del editor de nodos de la luz) a la entrada `Color` del nodo `Emission`; ingresar un valor entre `5500` y `6500` para simular luz solar directa. Si se trabaja únicamente en Eevee (sin este árbol de nodos), aproximar manualmente el mismo tono cálido con el selector de color RGB.
4. Para reforzar el contraste cromático, mantener la luz Area de relleno (Sesión 10) en un tono frío, acentuando la diferencia cálido-frío entre luz principal y relleno.

---

## Parte 4 — Motor de render: Cycles vs. Eevee

### 4.1 Cycles (Path Tracing — máxima fidelidad física)

1. Render Properties → `Render Engine = Cycles`.
2. `Device`: seleccionar `GPU Compute` si el equipo lo soporta (Preferences → System, para confirmar la GPU detectada), o `CPU` en caso contrario.
3. Sección `Sampling`: `Render Samples` entre `512` y `1024`. Activar `Denoising` (casilla) y seleccionar `OpenImageDenoise` como denoiser.
4. Sección `Light Paths`: revisar `Max Bounces`. Para esta escena, prestar especial atención a `Transmission Bounces` (subir a `8-12` si es menor): dado que el material de agua usa `Transmission = 1.0`, un número insuficiente de rebotes de transmisión puede hacer que el agua se vea negra o incorrecta en zonas de mayor profundidad óptica.

### 4.2 Eevee (Rasterización — tiempo real, requiere ajustes adicionales)

1. Render Properties → `Render Engine = Eevee` (o `Eevee Next`, según la versión de Blender instalada).
2. Sección `Shadows`: activar `High Bit Depth` y `Soft Shadows`, para mitigar el efecto de "escalonado" (aliasing) en las sombras sobre las pendientes facetadas del terreno.
3. Sección `Screen Space Reflections`: activar, y dentro de esa misma sección activar `Refraction` — imprescindible para que el material de `Agua_Lago` y `Agua_Cascada` muestre transmisión en tiempo real (ver también la Parte 1.4 del instructivo de texturizado de agua).
4. Sección `Ambient Occlusion`: activar y ajustar `Distance` (valores pequeños, 0.2-0.5 m) para resaltar el contacto entre props (rocas, farolito, árboles) y el terreno.

**Recomendación práctica:** usar Eevee durante todo el proceso de ajuste (iteración rápida) y reservar Cycles para el render final de entrega, dado que su cálculo de transmisión y luz global es más preciso, especialmente relevante para el agua.

---

## Parte 5 — Post-procesado en el Compositor

1. Cambiar al workspace **Compositing**. Activar la casilla `Use Nodes` en la parte superior del editor.
2. El nodo `Render Layers` ya está presente por defecto (salidas `Image`, `Alpha`, `Depth`, entre otras).
3. `Shift+A > Filter > Denoise`. Conectar `Image` (salida de Render Layers) a `Image` (entrada de Denoise). En el nodo, configurar `Prefilter = Accurate` — preserva mejor los bordes de la geometría low-poly que las opciones más agresivas.
4. `Shift+A > Filter > Glare`. Conectar la salida de `Denoise` a su entrada. `Type = Fog Glow`. Ajustar `Threshold` entre `0.5` y `1.0`, de forma que solo las zonas de mayor reflectancia (la espuma procedural de la cascada, los reflejos del agua) emitan una dispersión de luz sutil, sin afectar el resto de la imagen.
5. `Shift+A > Color > Color Balance`. Conectar la salida de `Glare` a su entrada. Ajuste fino:
   - `Lift`: sombras profundas.
   - `Gamma`: tonos medios.
   - `Gain`: altas luces.
   Modificar con moderación, en pasos pequeños, verificando el resultado en el editor con `Backdrop` activado (`View > Backdrop` en el editor de Compositing) o mediante un nodo `Viewer` conectado en paralelo.
6. Conectar la salida final (después de `Color Balance`) al nodo `Composite`, para que sea la imagen que efectivamente se guarde al renderizar.

---

## Parte 6 — Verificación de integridad geométrica

Antes del render final, realizar un chequeo de salud de malla sobre todos los objetos de la escena (terreno, agua, props):

1. Activar el overlay `Face Orientation` (menú Overlays del viewport) y recorrer visualmente la escena — cualquier cara en azul indica una normal invertida.
2. Para localizar problemas de forma sistemática: entrar en Edit Mode sobre cada malla sospechosa, `Select > All by Trait > Non Manifold`, para detectar geometría no estanca (bordes sueltos, caras duplicadas).
3. Corregir lo encontrado: `Shift+N` para recalcular normales, o eliminar/soldar (`M > Merge by Distance`) geometría duplicada según corresponda.

Esta verificación es especialmente relevante para los objetos de agua: una malla no-manifold en `Agua_Lago` o `Agua_Cascada` puede producir errores de cálculo en la refracción del material PBR.

---

## Parte 7 — Configuración de salida (Output)

1. Output Properties (ícono de impresora).
2. `Resolution X = 1920`, `Resolution Y = 1080` (o superior, si el destino final lo requiere).
3. Sección `Output`: `File Format = PNG`, `Color Depth = 16`. El uso de 16 bits (en lugar de 8) evita el efecto de bandas visibles (*banding*) en degradados suaves, como el cielo del World o las transiciones de sombra sobre el terreno.
4. Sección `Color Management`: `View Transform = AgX`. Este transformador de vista, disponible por defecto desde versiones recientes de Blender, ofrece mejor manejo de la saturación en zonas de alta luminancia que el anterior estándar `Filmic` — evita que colores brillantes (como el resplandor cálido del farolito o los reflejos del agua) se laven hacia blanco puro.

---

## Parte 8 — Checklist final antes de renderizar

1. Cámara en `Orthographic`, rotación `54.736° / 0° / 45°`, encuadre verificado con la cuadrícula de tercios.
2. Esquema de luces balanceado (Sun cálida + Area fría + Spot de acento + HDRI de relleno), sin ninguna fuente dominando desproporcionadamente sobre las demás.
3. Motor de render definido: Eevee para iteración, Cycles para la entrega final, con `Transmission Bounces` verificado si se usa Cycles.
4. Árbol del Compositor activo y conectado hasta el nodo `Composite` (Denoise → Glare → Color Balance).
5. Sin normales invertidas ni geometría no-manifold en ningún objeto de la escena, particularmente en los objetos de agua.
6. Resolución, formato PNG de 16 bits y `View Transform = AgX` configurados en Output Properties.
7. `F12` para ejecutar el render final; `F3` (o `Image > Save As` en la ventana de render) para guardar el resultado.
