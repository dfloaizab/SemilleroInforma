# Hoja de Ruta — Módulo 1: Blender (Diseño y Modelado 3D)
## Diplomado en Desarrollo de Escenarios 3D y Entornos Virtuales Inmersivos
### Reestructurada según el calendario real de las 17 sesiones

---

## Lógica de la reestructuración

Con el calendario real quedan **tres bloques naturales**:

- **Bloque 1 — Modelado (S1 a S5, 1-4 jul):** ya está en curso; S1 (ayer) avanzó más rápido de lo previsto (navegación + modelado con primitivas + modificador booleano), así que el resto del bloque se ajusta para consolidar edición de malla y modificadores no destructivos.
- **Bloque 2 — Apariencia: materiales, texturizado, iluminación y render (S6 a S13, 7-17 jul):** es la "otra semana" que mencionas; queda completo y cierra justo con render el viernes 17.
- **Bloque 3 — Animación, optimización y proyecto final (S14 a S17, 29 jul-1 ago):** después del vacío de dos semanas (7-28 en el que no hay sesión de Blender), por lo que conviene dejar una actividad independiente "puente" para que no se enfríe el tema entre el 17 de julio y el 29.

---

## Hoja de ruta — 17 sesiones

| # | Día y fecha | Horario | Duración | Bloque temático | Objetivo de la sesión |
|---|---|---|---|---|---|
| S1 | Miércoles 01/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | **(Ya realizada)** Introducción a Blender | Navegación, interfaz y primer modelado con primitivas (casita, árboles, booleanos) |
| S2 | **Jueves 02/07/2026 — HOY** | 6:30 p.m. – 9:00 p.m. | 2.5h | Transformaciones y Edit Mode básico | Consolidar G/R/S, origen vs. geometría, y edición de vértices/aristas/caras |
| S3 | Viernes 03/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Edit Mode avanzado | Extrude, inset, loop cut, bevel, bridge edge loops |
| S4 | Sábado 04/07/2026 | 8:00 a.m. – 12:00 p.m. | 4h | Modificadores no destructivos + proyecto guiado | Mirror, Array, Subdivision Surface, Solidify aplicados a un objeto compuesto |
| S5 | Sábado 04/07/2026 | 2:00 p.m. – 4:00 p.m. | 2h | Organización de escena y cierre de bloque | Colecciones, *naming convention*, *parenting*; revisión entre pares |
| S6 | Martes 07/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Materiales y shaders I | Principled BSDF: base color, roughness, metallic |
| S7 | Miércoles 08/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Materiales y shaders II | Introducción a nodos y texturas procedurales |
| S8 | Jueves 09/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | UV Mapping | Unwrap, *seams*, UV Editor, revisión de distorsión |
| S9 | Viernes 10/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Texturizado | Aplicar texturas de imagen, mapas (normal, roughness), pintura de textura básica |
| S10 | Martes 14/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Iluminación | Tipos de luces, World Settings, HDRI |
| S11 | Miércoles 15/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Cámaras y composición | Encuadre, profundidad de campo, reglas de composición |
| S12 | Jueves 16/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Motores de render | Eevee vs. Cycles, parámetros de calidad/tiempo |
| S13 | Viernes 17/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Render final del bloque | Escena materializada, iluminada y renderizada; cierre del bloque "apariencia" |
| S14 | Miércoles 29/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Animación básica | Keyframes, timeline, graph editor, interpolación |
| S15 | Jueves 30/07/2026 | 6:30 p.m. – 9:00 p.m. | 2.5h | Rigging / animación de objetos | Armature básico o animación jerárquica (parenting + keyframes) |
| S16 | Viernes 31/07/2026 | 6:30 p.m. – 9:30 p.m. | 3h | Optimización y exportación en vivo | Poly count, *baking*, exportación FBX/glTF para Unity/Unreal/WebXR |
| S17 | Sábado 01/08/2026 | 9:00 a.m. – 12:00 p.m. | 3h | Proyecto integrador final | Escenario 3D completo + sustentación |

**Total del módulo:** ≈ 44.5 horas repartidas en 17 sesiones.

---
<!--
## Nota sobre el vacío del 18 al 28 de julio

Entre S13 (17 de julio) y S14 (29 de julio) pasan casi dos semanas sin sesión de Blender. Para que los estudiantes no pierdan continuidad entre el bloque de "apariencia" (render) y el de animación, conviene dejar en S13 una **actividad puente** de entrega opcional o de bajo esfuerzo, por ejemplo:

- Pulir y re-renderizar la escena final del bloque 2 con los ajustes vistos en S12-S13.
- Investigar/documentar (sin entrega práctica en Blender) los conceptos básicos de *keyframe* y *timeline* como lectura previa a S14, para llegar con el vocabulario listo.

---

## Ajuste para hoy (Sesión 2, jueves 02/07)

Como en S1 ya trabajaron modelado con primitivas y booleanos, S2 puede arrancar directamente en:

1. **Transformaciones a fondo** (origen vs. geometría, aplicar transform, *pivot point*) — útil porque ya tienen objetos creados ayer para practicar sobre ellos.
2. **Edit Mode básico** (selección por vértice/arista/cara, mover geometría, extrude simple) como puente hacia S3 (Edit Mode avanzado).

Si quieres, en el siguiente mensaje te preparo ya el detalle de la Sesión 2 de hoy (conceptos, actividad dirigida, práctica y tarea) siguiendo esta misma estructura de cuatro momentos.
-->
---
