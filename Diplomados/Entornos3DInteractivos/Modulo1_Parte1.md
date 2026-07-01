# Módulo 1 — Blender: Diseño y Modelado 3D
## Diplomado en Desarrollo de Escenarios 3D y Entornos Virtuales Inmersivos
### Guía docente — Semana 1 (Sesiones 1 a 7) y hoja de ruta completa del módulo (17 sesiones / 40 horas)

---

## Parte A — Hoja de ruta general del módulo

Criterio de secuenciación: primero **fundamentos de manipulación del espacio 3D y del objeto** (esta semana), luego **apariencia** (materiales, texturizado, iluminación, render), y finalmente **comportamiento en el tiempo y salida hacia motores en tiempo real** (animación, optimización, exportación), que es lo que conecta directamente con la parte de "entornos virtuales inmersivos" del diplomado.

| Sesión | Día sugerido | Duración | Bloque temático | Objetivo central |
|---|---|---|---|---|
| S1 | Hoy (miércoles) | 3h | Introducción: Blender, interfaz y fundamentos de espacio 3D | Ubicarse en el entorno de Blender y en los conceptos de espacio/coordenadas |
| S2 | Jueves AM | 4h | Transformaciones y propiedades del objeto | Dominar traslación, rotación, escala, origen y jerarquía |
| S3 | Jueves PM | 2h | Anatomía de la malla (Edit Mode básico) | Entender vértice/arista/cara como estructura de datos y editarla |
| S4 | Viernes AM | 4h | Edit Mode avanzado | Extrude, inset, loop cut, bevel, bridge; topología intencional |
| S5 | Viernes PM | 2h | Modificadores no destructivos | Mirror, Array, Subdivision Surface, Solidify como *pipeline* de edición |
| S6 | Sábado AM | 4h | Proyecto integrador guiado | Combinar todo lo anterior en un objeto/escena compuesta |
| S7 | Sábado PM | 2h | Organización de escena + cierre de semana | Colecciones, *naming*, *parenting*, revisión entre pares |
| S8 | Semana 2 | 3h | Materiales y shaders (Principled BSDF) | Entender el modelo PBR y su aplicación práctica |
| S9 | Semana 2 | 3h | UV Mapping y texturizado | Desenvolver mallas y aplicar texturas |
| S10 | Semana 2 | 2h | Iluminación | Tipos de luces, *World*, HDRI, temperatura de color |
| S11 | Semana 2 | 2h | Cámaras y composición | Encuadre, profundidad de campo, reglas de composición |
| S12 | Semana 2 | 2h | Motores de render | Eevee vs Cycles, configuración y optimización de render |
| S13 | Semana 3 | 3h | Animación básica | Keyframes, timeline, graph editor, interpolación |
| S14 | Semana 3 | 2h | Rigging / animación de objetos articulados | Armatures básicos o animación por jerarquía |
| S15 | Semana 3 | 2h | Física y partículas (opcional según enfoque) | Rigid body, partículas básicas para ambientación |
| S16 | Semana 3 | 2h | Optimización y exportación para tiempo real | Poly count, *baking*, exportación FBX/glTF para Unity/Unreal/WebXR |
| S17 | Semana 3 | 3h | Proyecto integrador final | Escenario 3D completo + sustentación |

> Nota: las duraciones de S8–S17 son una sugerencia (≈19h) para completar las 40h totales; puedes ajustarlas según el calendario real y si decides profundizar más en animación o en render.

---

## Metodología transversal para las 4 sesiones de esta semana

Cada sesión sigue la misma estructura de cuatro momentos que solicitaste:

1. **Conceptos esenciales** — marco teórico mínimo necesario, explicado en el lenguaje de ciencias de la computación cuando ayuda (estructuras de datos, pipelines, matrices).
2. **Actividad dirigida de profundización conceptual** — ejercicio corto, guiado por el docente, para fijar el concepto antes de tocar el software.
3. **Actividad dirigida práctica en Blender** — ejercicio guiado paso a paso.
4. **Actividad independiente** — tarea que el estudiante trae lista a la siguiente sesión, con entregable claro.

---

## SESIÓN 1 — Hoy (3 horas) — Introducción a Blender y al espacio 3D

### 1. Conceptos esenciales
- **Qué es un entorno 3D**: una escena como grafo de objetos, cada uno con transformación propia (espacio local) compuesta dentro de un espacio global (*world space*).
- **Sistema de coordenadas de Blender**: Z arriba, mano derecha; unidades y escala real vs escala arbitraria (importante para VR).
- **Pipeline conceptual**: geometría → transformación → shading → render (rasterización en Eevee / trazado de rayos en Cycles). No se profundiza aún, solo se ubica el mapa mental completo.
- **Interfaz de Blender**: *Workspaces*, editores (Viewport 3D, Outliner, Properties, Timeline), sistema de áreas configurables.
- **Distinción Objeto vs. Data-block**: un objeto (posición/transformación) referencia un bloque de datos de malla (geometría) — análogo a un puntero/referencia compartida en programación (varios objetos pueden apuntar a la misma malla).
- **Navegación**: órbita, *pan*, zoom, vistas de numpad (frontal, lateral, superior, de cámara), *Perspective* vs *Orthographic*.

### 2. Actividad dirigida — profundización conceptual (35 min)
Con el tablero (sin computador): dibujar una escena simple con 3 objetos y pedir a los estudiantes que identifiquen, para cada uno, su origen, su sistema de coordenadas local y cómo se compone con el sistema global. Cerrar relacionando esto con la jerarquía de transformaciones tipo *scene graph* que ya conocen de estructuras de datos (árboles).

### 3. Actividad dirigida práctica en Blender (110 min)
1. Instalación/verificación de Blender (versión LTS más reciente).
2. Tour guiado de la interfaz: cambiar entre *Workspaces*, identificar Outliner y Properties.
3. Navegación en el viewport: practicar órbita/pan/zoom con mouse y con numpad (1,3,7,9, Ctrl+numpad).
4. Añadir primitivas (`Shift+A`): cubo, esfera, cilindro, plano. Observar el Outliner (jerarquía) y Properties (transform, N-panel).
5. Guardar archivo con convención de nombres (`ApellidoNombre_S1.blend`) en carpeta de trabajo del diplomado.

### 4. Actividad independiente (para mañana jueves)
- Completar una "caza de elementos" de la interfaz: identificar y anotar en una hoja (o documento) 10 elementos de la interfaz (Outliner, Properties tabs, N-panel, Header, Status bar, etc.) con su función en una frase.
- Practicar navegación 15 minutos libres en el archivo guardado hoy, añadiendo al menos 5 primitivas distintas organizadas visualmente sin superponerse.
- Traer el archivo `.blend` guardado.

---

## SESIÓN 2 — Jueves AM (4 horas) — Transformaciones y propiedades del objeto

### 1. Conceptos esenciales
- **Transformaciones fundamentales**: traslación (G), rotación (R), escala (S); entrada numérica y restricción a eje (X/Y/Z).
- **Composición de transformaciones**: intuición de T·R·S (sin entrar en álgebra matricial formal, pero mencionándola dado el perfil del grupo).
- **Origen vs. geometría**: el origen del objeto no es necesariamente su centro geométrico; impacto en rotación/escala.
- **Punto de pivote (*Pivot Point*)**: *Median Point*, *3D Cursor*, *Individual Origins*.
- **Aplicar transformaciones (`Ctrl+A`)**: diferencia entre transformar el objeto y "hornear" la transformación en los datos de malla — por qué importa antes de usar modificadores.
- **Snapping** (`Shift+Tab`) y **3D Cursor** como herramientas de precisión.
- **Parenting básico**: jerarquía padre-hijo y herencia de transformación (análogo a herencia en árboles de escena).

### 2. Actividad dirigida — profundización conceptual (30 min)
Ejercicio en papel/pizarra: dado un objeto con origen desplazado, predecir visualmente el resultado de rotarlo y escalarlo antes de probarlo en Blender. Discutir por qué "aplicar transform" cambia el comportamiento futuro del objeto.

### 3. Actividad dirigida práctica en Blender (3h aprox.)
1. Ejercicios cortos de G/R/S con entrada numérica y restricción de eje.
2. Cambiar el *Pivot Point* y observar diferencias al rotar/escalar un grupo de objetos.
3. Mover el 3D Cursor y usarlo como pivote y como punto de creación de nuevos objetos.
4. Practicar *snapping* a grid, a vértice y a incremento.
5. Ejercicio de `Apply` transform: mover/rotar/escalar un cubo sin aplicar, luego comparar con uno aplicado, evidenciando la diferencia en Properties (Item/Transform).
6. *Parenting*: crear una jerarquía simple (ej. una "rueda" hija de un "eje") y mover el padre para observar la herencia.
7. Armar una escena tipo "naturaleza muerta": 6-8 primitivas organizadas con transformaciones variadas y al menos una relación de *parenting*.

### 4. Actividad independiente (para viernes)
- Terminar y pulir la escena tipo "naturaleza muerta" (mínimo 8 objetos, transformaciones aplicadas correctamente, al menos un *parent-child*).
- Exportar una captura de pantalla desde 2 ángulos distintos.
- Documento corto (5-8 líneas) explicando qué pivote usaron y por qué.

---

## SESIÓN 3 — Jueves PM (2 horas) — Anatomía de la malla y Edit Mode

### 1. Conceptos esenciales
- **La malla como grafo**: vértices (V), aristas (E) y caras (F) — estructura análoga a un grafo con restricciones geométricas (planaridad de caras, adyacencia).
- **Manifold vs. no-manifold**: por qué importa para impresión 3D, simulación y para motores de render/tiempo real.
- **Normales**: qué representan, orientación (hacia afuera/adentro), *shading* plano vs. suave y su relación con la normal de cada cara/vértice.
- **Modos de selección**: vértice, arista, cara (`1`, `2`, `3` en Edit Mode).
- **Topología de calidad**: preferencia por cuads sobre triángulos y n-gons en modelado *subdivision-ready*.

### 2. Actividad dirigida — profundización conceptual (20 min)
Mostrar dos versiones del mismo objeto: una con buena topología (cuads) y otra con n-gons/triángulos desordenados. Pedir que identifiquen problemas visuales al aplicar *Subdivision Surface* mentalmente (se confirmará en la práctica de S5).

### 3. Actividad dirigida práctica en Blender (90 min)
1. Entrar/salir de Edit Mode (`Tab`), practicar los tres modos de selección.
2. Mover vértices/aristas/caras individualmente para deformar un cubo.
3. Extrude básico (`E`) sobre una cara para crear volumen adicional.
4. Practicar borrado correcto: diferencia entre `X > Vertices`, `Edges`, `Faces` y `Limited Dissolve`.
5. Recalcular normales (`Shift+N`) y activar *Face Orientation* (overlay) para detectar normales invertidas.
6. Modelar un objeto simple usando solo estas herramientas (ej. una mesa básica o una caja tipo casa con techo a dos aguas).

### 4. Actividad independiente (para viernes)
- Modelar un objeto asignado de baja complejidad (a elegir: una silla simple, un banco o una caja de herramientas) usando únicamente edición de vértices/aristas/caras y extrude.
- Verificar que no haya normales invertidas (usar Face Orientation antes de guardar).
- Traer el archivo `.blend` nombrado según convención.

---

## SESIÓN 4 — Viernes AM (4 horas) — Edit Mode avanzado

### 1. Conceptos esenciales
- **Extrude en variantes**: a lo largo de normal, en región, individual por caras.
- **Inset Faces** (`I`): crear caras concéntricas para detalle.
- **Loop Cut & Slide** (`Ctrl+R`): añadir *edge loops* controlando densidad de malla.
- **Bevel** (`Ctrl+B`): suavizar aristas, control de segmentos.
- **Bridge Edge Loops**: conectar dos bordes abiertos.
- **Subdivide** y **Merge** (`M`): dividir y fusionar geometría.
- **Flujo de aristas (*edge flow*)**: por qué planear la topología antes de modelar detalla mejor el resultado, especialmente pensando en *subdivision* y animación futura.

### 2. Actividad dirigida — profundización conceptual (30 min)
Análisis guiado de un modelo de referencia (imagen) discutiendo dónde irían los *loop cuts* necesarios para mantener la forma al aplicar subdivisión, antes de tocar el software.

### 3. Actividad dirigida práctica en Blender (3h)
1. Practicar cada herramienta de forma aislada sobre un cubo (extrude, inset, loop cut, bevel, bridge).
2. Ejercicio combinado: modelar un objeto de complejidad media guiado paso a paso (sugerido: una taza con asa, usando bridge edge loops para el asa).
3. Revisión de topología del resultado con overlay de *wireframe* y *statistics*.

### 4. Actividad independiente (para sábado)
- Modelar un objeto de complejidad moderada asignado (sugerido: una lámpara de mesa, un buzón o una silla con respaldo curvo) aplicando al menos 4 de las herramientas vistas (extrude, inset, loop cut, bevel).
- Cuidar el *edge flow* pensando en que el objeto podría subdividirse después.
- Traer `.blend`.

---

## SESIÓN 5 — Viernes PM (2 horas) — Modificadores no destructivos

### 1. Conceptos esenciales
- **Concepto de *stack* de modificadores**: pipeline de transformaciones sobre la geometría, aplicadas en orden, sin destruir la malla base — análogo a una tubería de funciones (*pipe-and-filter*) que probablemente reconozcan de arquitectura de software.
- **Mirror**: simetría automática respecto a un eje/objeto.
- **Array**: repetición controlada (lineal, con offset, con curva).
- **Subdivision Surface**: suavizado por subdivisión — aquí se conecta directamente con la discusión de topología de S4.
- **Bevel (modificador)** y **Solidify**: variantes no destructivas de operaciones ya vistas en Edit Mode.
- **Orden de los modificadores**: por qué el orden en el *stack* cambia el resultado final.

### 2. Actividad dirigida — profundización conceptual (15 min)
Retomar el ejemplo de topología mala/buena de S3 y aplicar mentalmente Subdivision Surface a ambos casos; luego confirmarlo en vivo en Blender como demostración del docente.

### 3. Actividad dirigida práctica en Blender (95 min)
1. Aplicar Mirror + Subdivision Surface sobre medio objeto simétrico (ej. medio rostro low-poly o media taza).
2. Usar Array para crear elementos repetidos (ej. una cerca o una escalera).
3. Reordenar modificadores en el *stack* y observar cambios de resultado.
4. Aplicar Bevel (modificador) y Solidify sobre una malla plana para darle grosor.

### 4. Actividad independiente (para sábado)
- Rehacer el objeto de S4 (o modelar uno nuevo simétrico) usando Mirror + Subdivision Surface para simplificar el flujo de trabajo.
- Nota corta comparando el tiempo/esfuerzo de modelar con y sin modificadores.

---

## SESIÓN 6 — Sábado AM (4 horas) — Proyecto integrador guiado

### 1. Conceptos esenciales
- Repaso integrado de: transformaciones, edición de malla, topología y modificadores.
- **Organización de escena para proyectos más grandes**: colecciones (*Collections*), convenciones de nombres, *parenting* para agrupar piezas de un objeto compuesto.

### 2. Actividad dirigida — profundización conceptual (20 min)
Presentación breve de un caso: cómo se organiza un archivo de producción real (colecciones por tipo de asset, nomenclatura consistente) y por qué esto importa para trabajo colaborativo y para flujos hacia motores de tiempo real.

### 3. Actividad dirigida práctica en Blender (3h 40min)
Proyecto guiado paso a paso: modelar una pequeña escena compuesta (sugerido: un set de mobiliario de escritorio — mesa, silla, lámpara, y un objeto decorativo) combinando:
- Modelado desde primitivas y Edit Mode.
- Modificadores (Mirror, Subdivision, Bevel, Array donde aplique).
- Organización en colecciones nombradas.
- Jerarquía de *parenting* donde tenga sentido (ej. piezas de la lámpara).

### 4. Actividad independiente (para la tarde de hoy sábado / presentación)
- Terminar y pulir la escena.
- Organizar el archivo en colecciones con nombres claros y consistentes.
- Preparar una presentación corta (3-5 minutos) explicando decisiones de modelado y organización.

---

## SESIÓN 7 — Sábado PM (2 horas) — Cierre de semana: revisión entre pares y puente a Semana 2

### 1. Conceptos esenciales
- Recapitulación de buenas prácticas de topología y organización vistas durante la semana.
- **Introducción conceptual (sin práctica aún) al modelo PBR**: *albedo*, *roughness*, *metallic*, *normal map* — para preparar el terreno de la Sesión 8.

### 2. Actividad dirigida — profundización conceptual (30 min)
Checklist guiada de evaluación entre pares: cada estudiante revisa el archivo de un compañero usando una lista de criterios (topología limpia, normales correctas, transformaciones aplicadas, colecciones organizadas, nomenclatura) y da retroalimentación estructurada.

### 3. Actividad dirigida práctica en Blender (60 min)
1. Presentaciones cortas de los proyectos de S6 (rotación de 3-4 estudiantes representativos o todos si el grupo es pequeño).
2. Sesión de corrección en vivo de errores comunes detectados durante la revisión entre pares.

### 4. Actividad independiente (para Semana 2 — Sesión 8)
- Revisar material introductorio (video o lectura corta sugerida por el docente) sobre el modelo de materiales PBR (albedo, roughness, metallic, normal maps) para llegar con el vocabulario listo a la Sesión 8.
- Dejar el archivo del proyecto de la semana completamente organizado y respaldado.

---

## Notas finales para el docente

- Todas las actividades independientes están calibradas para completarse en 45-90 minutos fuera de clase; puedes ajustar la complejidad del objeto asignado según el ritmo observado del grupo.
- Dado el perfil técnico del grupo (ingeniería, con base en ciencias de la computación), las analogías con estructuras de datos, grafos y arquitecturas de software (pipeline, herencia, referencias compartidas) funcionan como puente conceptual y pueden reforzarse libremente en las explicaciones en vivo.
- La Sesión 7 está diseñada como cierre de ciclo (revisión + puente), lo que te da flexibilidad si alguna sesión anterior se extiende un poco.
- A partir de la Sesión 8 (Semana 2) el eje cambia de "geometría" a "apariencia" (materiales, texturizado, iluminación, render), y en la Semana 3 se cierra con animación y exportación hacia motores de tiempo real, que es el puente natural hacia los siguientes módulos del diplomado sobre entornos virtuales inmersivos.
