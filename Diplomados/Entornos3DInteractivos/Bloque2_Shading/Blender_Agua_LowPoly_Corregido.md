# Diplomado "Desarrollo de escenarios 3D y ambientes virtuales"

## Agua Low-Poly — Shading Nodes y Geometry Nodes.
### Extensión: Sesiones 6-7 — Shading y Apariencia

---

### Parte 1 — Shading Nodes: material PBR del agua

Esta parte se trabaja en el workspace **Shading** (pestaña superior de Blender), donde se vé el editor de nodos de material en la mitad inferior de la pantalla.

### 1.1 Preparar las mallas de agua

1. `Agua_Lago`: `Shift+A > Mesh > Plane`, ajustado con snapping a vértice (`Shift+Tab` o el imán del header, modo `Vertex`) para que sus bordes encajen contra las rocas/orillas ya modeladas. Sube un poco en Z (`G Z`) para marcar la profundidad del agua respecto al fondo del cauce.
2. `Agua_Cascada`: `Shift+A > Mesh > Plane` en la boca del canal, `Tab` a Edit Mode, `E` para extrudir la arista superior siguiendo el ángulo del canal (repite por tramos si el canal cambia de dirección), ajustando ancho con `S X`. Modificador **Bevel** (Properties → Modifiers → Generate → Bevel) para suavizar el quiebre entre tramos.

### 1.2 Crear el material en el editor de nodos

1. Selecciona `Agua_Lago`. Ve al workspace **Shading**.
2. En la parte inferior verás el editor de nodos vacío para este objeto. Clic en `New` (botón junto al selector de material, arriba del editor de nodos) — esto crea automáticamente dos nodos ya conectados: **Principled BSDF** → **Material Output**.
3. Renombra el material (doble clic en el nombre, junto al botón `New`): `Agua_PBR`.

### 1.3 Ajustar los parámetros del Principled BSDF

Con el nodo `Principled BSDF` seleccionado (clic sobre él), ajusta directamente en sus campos:

| Parámetro | Valor | Qué controla |
|---|---|---|
| Base Color | `#4BA3E3` (azul-verde) | Color base antes de la interacción de luz |
| Metallic | `0.0` | El agua es dieléctrica, no conductora |
| Roughness | `0.05` | Casi pulido, pero no espejo perfecto |
| Transmission | `1.0` | Habilita que la luz atraviese el material (refracción) |
| IOR (en la sección `Settings` del nodo, desplegable en su parte inferior) | `1.333` | Índice de refracción físico real del agua |

> Estos cinco campos están todos **dentro del mismo nodo** Principled BSDF — no necesitas añadir nodos extra para este material básico; "usar shading nodes" aquí significa trabajar directamente sobre este nodo en el editor, en vez de la pestaña de Properties.

### 1.4 Habilitar la refracción visible en el viewport

El valor de Transmission no se ve en tiempo real a menos que actives lo siguiente:

- **Si previsualizas en Eevee**: Render Properties → activa `Screen Space Reflections` y, dentro de esa sección, `Refraction`. Luego en Material Properties (pestaña Properties, no el editor de nodos) → `Settings` del material `Agua_PBR` → activa `Raytrace Transmission` (Blender 4.x) o `Screen Space Refraction` (versiones anteriores), y sube `Refraction Depth` a un valor mayor que 0 (ej. `0.1`).
- **Alternativa mientras ajustas valores**: cambia el motor de render a **Cycles** temporalmente (Render Properties → Render Engine), que calcula refracción de forma nativa sin configuración extra. Vuelve a Eevee para el trabajo en tiempo real una vez el material esté calibrado.

### 1.5 Aplicar el mismo material a la cascada

1. Selecciona primero `Agua_Cascada`, luego con `Shift+clic` selecciona también `Agua_Lago` en último lugar (el último objeto seleccionado es el "activo", desde el que se copian los datos).
2. `Ctrl+L > Link Materials`. Esto copia el material `Agua_PBR` a todos los objetos seleccionados.

---

## Parte 2 — Geometry Nodes: espuma procedural

### 2.1 Crear la geometría semilla

1. `Shift+A > Mesh > Ico Sphere`. En el panel "Adjust Last Operation" (F6): `Radius ≈ 0.04`, `Subdivisions = 1`.
2. Renombra: `Espuma_Semilla`.
3. Crea su material (mismo procedimiento de la Parte 1.2): `Espuma_Blanca` — Base Color blanco/gris claro, Roughness `0.85`, Metallic `0`, Transmission `0`.

### 2.2 Preparar el área de distribución — ORDEN CORREGIDO

**Importante:** subdividir la malla va **antes** de pintar el peso. Si pintas sobre un plano de 4 vértices, el pincel no tiene dónde "anclar" una mancha localizada — por eso no se veía la zona roja en el intento anterior.

1. `Shift+A > Mesh > Plane`, ubicado y escalado sobre la zona de impacto del agua (donde cae la cascada sobre el lago).
2. Renombra: `Espuma_Area`.
3. `Tab` a Edit Mode → `A` (seleccionar todo) → clic derecho → `Subdivide`. En el panel inferior izquierdo, sube `Number of Cuts` a `8` (o repite Subdivide 2-3 veces si prefieres ir por pasos). Ahora sí hay suficientes vértices para pintar una mancha localizada.
4. `Tab` de vuelta a Object Mode.

### 2.3 Crear el Vertex Group y pintar el peso

1. Object Data Properties (triángulo verde) → `Vertex Groups` → `+`. Renombra el grupo: `Densidad_Espuma`.
2. Confirma que quede **seleccionado/resaltado** en la lista (así queda "activo" para lo que pintes a continuación).
3. Cambia el modo a **Weight Paint** (selector de modos, esquina superior izquierda del viewport — confirma que diga literalmente "Weight Paint", no "Vertex Paint").
4. Pincel en `Draw`, `Weight = 1.0`: pinta de rojo la zona exacta donde cae el agua.
5. Cambia `Weight = 0.0`: pinta de azul el resto del área (para asegurar el contraste).
6. Verificación rápida: `Tab` a Edit Mode, abre el panel N (`N`) → pestaña `Item` → `Vertex Weights`. Selecciona un vértice de la zona roja y confirma un valor cercano a `1.0` bajo `Densidad_Espuma`; selecciona uno de la zona azul y confirma cercano a `0.0`.
7. Vuelve a Object Mode.

### 2.4 Añadir el modificador Geometry Nodes

1. Con `Espuma_Area` seleccionado: Properties → Modifiers → `Add Modifier` → `Generate` → `Geometry Nodes` → `New`.
2. Cambia al workspace **Geometry Nodes** para ver el árbol (ya existen `Group Input` y `Group Output` conectados entre sí — esa conexión inicial la vas a reemplazar en el paso 2.5, punto 6).

### 2.5 Construir el árbol de nodos — con la forma correcta de conectar

**Regla para evitar el error "Unknown socket value":** conecta siempre **arrastrando manualmente** desde el círculo de salida de un nodo hasta el círculo de entrada de otro. No dupliques (`Shift+D`) un nodo ya conectado esperando que el cable se mantenga válido, y si necesitas rehacer una conexión, primero borra el cable viejo (clic sobre la línea → `X`, o `Ctrl` + clic derecho arrastrando sobre el cable para cortarlo).

1. `Shift+A > Point > Distribute Points on Faces`. Arrastra desde `Geometry` (salida de `Group Input`) hasta `Mesh` (entrada de este nodo). `Distribute Method`: `Random` (o `Poisson Disk` para evitar amontonamientos).

2. `Shift+A > Input > Named Attribute`. En el desplegable **Type**, elige `Float`. En el campo **Name**, no lo escribas de memoria: ve a Object Data Properties → Vertex Groups, haz doble clic sobre `Densidad_Espuma` para seleccionarlo, cópialo (`Ctrl+C`) y pégalo (`Ctrl+V`) en el campo Name del nodo — así evitas errores de tipeo.

3. Arrastra desde `Attribute` (salida de `Named Attribute`) hasta `Density Factor` (entrada de `Distribute Points on Faces`). La conexión se verá como línea punteada — es correcto, indica que es un dato calculado por punto, no un valor único.

4. En `Distribute Points on Faces`, ajusta el campo `Density` (valor base, ej. `800`) — el resultado final es `Density × Density Factor` del mapa pintado.

5. `Shift+A > Input > Object Info`. En el campo `Object`, selecciona `Espuma_Semilla`. Activa la casilla `As Instance`.

6. `Shift+A > Instances > Instance on Points`. Borra primero el cable directo que viene de fábrica entre `Group Input` y `Group Output` (clic sobre él → `X`). Luego arrastra: `Points` (salida de `Distribute Points on Faces`) → `Points` (entrada de `Instance on Points`); y `Geometry` (salida de `Object Info`) → `Instance` (entrada de `Instance on Points`).

7. `Shift+A > Utilities > Random Value`, tipo `Float`, `Min = 0.7`, `Max = 1.3`. Arrastra su salida `Value` hasta `Scale` (entrada de `Instance on Points`).

8. *(Opcional)* Otro `Random Value` (tipo `Vector`, rango de rotación en Z) conectado a `Rotation` de `Instance on Points`, para variar la orientación.

9. `Shift+A > Material > Set Material`. Arrastra `Instances` (salida de `Instance on Points`) hasta `Geometry` (entrada de `Set Material`). En el campo `Material` de este nodo, selecciona `Espuma_Blanca`.

10. Arrastra la salida `Geometry` de `Set Material` hasta la entrada `Geometry` de `Group Output`.

### 2.6 Atajos del editor de nodos

| Atajo | Acción |
|---|---|
| `Shift+A` | Añadir nodo |
| `F` | Conectar automáticamente sockets seleccionados (útil, pero si da error, mejor arrastra manualmente) |
| `Ctrl` + clic derecho arrastrando | Cortar conexiones pasando el cursor sobre el cable |
| `G` | Mover un nodo |
| `Shift+D` | Duplicar un nodo (recuerda reconectar manualmente después) |
| `M` | Silenciar (bypass) temporalmente un nodo |
| `Ctrl+G` | Agrupar los nodos seleccionados |

### 2.7 Verificación final

1. En Object Mode, confirma que la espuma aparezca concentrada en la zona pintada de rojo y ausente en el resto.
2. Ajusta `Density` si se ve muy dispersa o muy amontonada.
3. `F12` para un render de prueba y revisar cómo se ve la espuma (opaca, blanca) contra el agua (transparente, con refracción).

---

