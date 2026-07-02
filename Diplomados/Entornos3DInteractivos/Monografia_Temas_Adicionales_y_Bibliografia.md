# Trabajo de Grado — Temas Adicionales y Bibliografía de Apoyo
## Diplomado en Desarrollo de Escenarios 3D y Entornos Virtuales Inmersivos

---

## Parte A — 5 temas adicionales de monografía

Pensados para cubrir vacíos que no cubren los 15 temas ya propuestos (fotogrametría, generación procedural, gemelos digitales, accesibilidad y WebXR):

**16. Fotogrametría y reconstrucción 3D basada en nubes de puntos para la generación de activos realistas en Blender.**
Investigación aplicada sobre flujos de trabajo *Structure from Motion* (SfM), limpieza de malla y reducción de topología (*retopology*) para llevar un escaneo fotogramétrico a un asset optimizado y listo para tiempo real.

**17. Generación procedural de entornos naturales (terreno, vegetación) mediante Geometry Nodes en Blender para escenarios inmersivos a gran escala.**
Metodología para construir sistemas paramétricos de terreno y vegetación que reduzcan el tiempo de modelado manual en escenarios extensos.

**18. Gemelos digitales (*digital twins*) en Blender y motores de tiempo real: metodología para la representación de espacios físicos reales.**
Aplicación del concepto de gemelo digital (más allá de manufactura/industria) a la representación de espacios arquitectónicos o educativos como entornos virtuales sincronizables con su contraparte física.

**19. Accesibilidad e inclusión en el diseño de experiencias de realidad virtual: pautas y patrones de interacción para usuarios con discapacidad.**
Revisión y aplicación de guías de accesibilidad XR (movilidad reducida, discapacidad visual/auditiva) en el diseño de un entorno virtual inmersivo desarrollado en el diplomado.

**20. WebXR como alternativa de bajo costo para el despliegue de entornos inmersivos educativos: comparación con soluciones nativas Unity/Unreal.**
Estudio comparativo de rendimiento, alcance de dispositivos y facilidad de despliegue entre una solución basada en navegador (WebXR/Three.js/A-Frame) y una solución nativa compilada.

---

## Parte B — Bibliografía de apoyo (organizada por bloque temático)

> Los libros clásicos de computación gráfica (bloque 1) son transversales y le sirven de base teórica a casi cualquiera de los 20 temas, independientemente del enfoque elegido.

### 1. Fundamentos de computación gráfica y render (temas 1, 5, 12, 17, 20)
- Pharr, M., Jakob, W., & Humphreys, G. (2023). *Physically Based Rendering: From Theory to Implementation* (4.ª ed.). MIT Press.
- Akenine-Möller, T., Haines, E., Hoffman, N., Pesce, A., Iwanicki, M., & Hillaire, S. (2018). *Real-Time Rendering* (4.ª ed.). A K Peters/CRC Press.
- Gregory, J. (2018). *Game Engine Architecture* (3.ª ed.). A K Peters/CRC Press.
- Blender Foundation. *Blender Manual* [documentación oficial]. https://docs.blender.org/manual/en/latest/

### 2. Diseño modular y flujos de trabajo de escenarios 3D (temas 2, 17, 18)
- Gregory, J. (2018). *Game Engine Architecture* (3.ª ed.). A K Peters/CRC Press. (capítulos sobre *pipelines* de contenido y gestión de activos)
- Khronos Group. *glTF — Especificación abierta para transmisión de activos 3D*. https://www.khronos.org/gltf/
- Blender Foundation. *Geometry Nodes — Blender Manual* [documentación oficial]. https://docs.blender.org/manual/en/latest/modeling/geometry_nodes/index.html

### 3. Simulación de sistemas dinámicos y partículas (tema 3)
- Bridson, R. (2015). *Fluid Simulation for Computer Graphics* (2.ª ed.). CRC Press.
- Blender Foundation. *Physics — Particles* [documentación oficial]. https://docs.blender.org/manual/en/latest/physics/particles/index.html

### 4. Reconstrucción digital, fotogrametría y patrimonio (temas 4, 16)
- Remondino, F. (2011). Heritage recording and 3D modeling with photogrammetry and 3D scanning. *Remote Sensing*, 3(12), 1104–1138. https://doi.org/10.3390/rs3061104

### 5. Iluminación y horneado de mapas de luz (tema 5)
- Akenine-Möller, T., Haines, E., Hoffman, N., Pesce, A., Iwanicki, M., & Hillaire, S. (2018). *Real-Time Rendering* (4.ª ed.). A K Peters/CRC Press. (capítulo de iluminación global y *lightmapping*)
- Unity Technologies. *Lightmapping documentation* [documentación oficial]. https://docs.unity3d.com/Manual/Lightmapping.html

### 6. Captura de movimiento y personajes digitales — mocap, Character Creator, iClone (temas 6, 7, 10)
- Menache, A. (2011). *Understanding Motion Capture for Computer Animation* (2.ª ed.). Morgan Kaufmann/Elsevier.
- Reallusion Inc. *Character Creator — documentación oficial*. https://www.reallusion.com/character-creator/
- Reallusion Inc. *iClone — documentación oficial*. https://www.reallusion.com/iclone/

### 7. Animación facial y lip-sync (tema 8)
- Osipa, J. (2010). *Stop Staring: Facial Modeling and Animation Done Right* (3.ª ed.). Sybex/Wiley.
- Ekman, P., & Friesen, W. V. (1978). *Facial Action Coding System (FACS)*. Consulting Psychologists Press. (referencia académica fundacional para animación facial basada en unidades de acción)

### 8. Diseño técnico de personajes y máquinas de estado para animación (tema 9)
- Gregory, J. (2018). *Game Engine Architecture* (3.ª ed.). A K Peters/CRC Press. (capítulo de sistemas de animación y *state machines*)
- Unreal Engine. *Animation Blueprints and State Machines* [documentación oficial]. https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-blueprints-in-unreal-engine

### 9. Avatares, vestuario digital y XR (tema 10)
- Jerald, J. (2016). *The VR Book: Human-Centered Design for Virtual Reality* (ACM Books, vol. 8). Association for Computing Machinery / Morgan & Claypool.

### 10. Integración de activos entre Blender y motores gráficos (tema 11)
- Unity Technologies. *Working with FBX files* [documentación oficial]. https://docs.unity3d.com/Manual/HOWTO-importObject.html
- Unreal Engine. *Importing FBX static meshes* [documentación oficial]. https://dev.epicgames.com/documentation/en-us/unreal-engine

### 11. IA y ambientación dinámica de entornos jugables (tema 12)
- Millington, I. (2019). *AI for Games* (3.ª ed.). CRC Press.

### 12. Prototipado VR aplicado, accesibilidad y despliegue web (temas 13, 19, 20)
- Jerald, J. (2016). *The VR Book: Human-Centered Design for Virtual Reality* (ACM Books, vol. 8). ACM / Morgan & Claypool.
- Baruah, R. (2021). *AR and VR Using the WebXR API: Learn to Create Immersive Content with WebGL, Three.js, and A-Frame*. Apress.
- Accessibility Guidelines for VR Games — A Comparison and Synthesis of a Comprehensive Set. (2021). *Frontiers in Virtual Reality*, 2. https://doi.org/10.3389/frvir.2021.697504
- World Wide Web Consortium (W3C). *WebXR Device API* [especificación oficial]. https://www.w3.org/TR/webxr/

### 13. Documentación técnica y evaluación de rendimiento (tema 14)
- Gregory, J. (2018). *Game Engine Architecture* (3.ª ed.). A K Peters/CRC Press. (capítulos de perfilamiento y optimización)

### 14. UX, interfaces inmersivas y experiencia de usuario (tema 15)
- Jerald, J. (2016). *The VR Book: Human-Centered Design for Virtual Reality* (ACM Books, vol. 8). ACM / Morgan & Claypool.
- Schell, J. (2019). *The Art of Game Design: A Book of Lenses* (3.ª ed.). CRC Press.

### 15. Gemelos digitales (tema 18)
- Semeraro, C., Lezoche, M., Panetto, H., & Dassisti, M. (2021). Digital twin paradigm: A systematic literature review. *Computers in Industry*, 130, 103469. https://doi.org/10.1016/j.compind.2021.103469

---

## Nota metodológica para los estudiantes

- Los libros técnicos (Pharr et al., Akenine-Möller et al., Gregory, Menache, Jerald) sirven como **marco teórico** de la monografía; deben complementarse con al menos 2-3 artículos de revista o *paper* de congreso reciente (últimos 5 años) específicos del tema elegido, que se pueden rastrear en **Google Scholar**, **IEEE Xplore**, **ACM Digital Library** y **ScienceDirect**.
- La documentación oficial (Blender Manual, Unity/Unreal Docs, especificaciones W3C/Khronos) es válida como fuente técnica de referencia, pero no reemplaza la bibliografía académica exigida por un trabajo de grado — debe usarse como apoyo metodológico/técnico, no como única fuente teórica.
- Si el jurado de la universidad exige normas APA, todas las referencias anteriores ya están en formato compatible (autor, año, título en cursiva, editorial/DOI).
