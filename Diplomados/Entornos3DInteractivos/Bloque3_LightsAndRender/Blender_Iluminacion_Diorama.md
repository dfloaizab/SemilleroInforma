# Iluminación del Diorama: Exploración de Tipos de Luz y Configuración Final
## Extensión — Sesión 10: Iluminación

---

## Objetivo

El propósito de esta guía es doble: en primer lugar, familiarizar al estudiante con los cuatro tipos de luz disponibles en Blender (Point, Sun, Spot y Area) mediante pruebas controladas sobre la misma escena; en segundo lugar, a partir de dicha exploración, definir la configuración de iluminación definitiva del diorama, buscando un resultado visual coherente con la referencia de estilo isométrico low-poly utilizada como guía del proyecto.

---

## Parte 1 — Fundamentos conceptuales

Antes de manipular los comandos, conviene precisar qué distingue a cada tipo de luz y qué parámetros comparten:

- **Point (Punto)**: emite luz en todas direcciones desde un punto único en el espacio, de forma análoga a una bombilla. Su intensidad disminuye con la distancia (atenuación cuadrática inversa).
- **Sun (Sol)**: simula una fuente de luz infinitamente distante (como el sol real); por esta razón, su intensidad **no depende de la distancia ni de la posición** del objeto respecto a la luz, sino únicamente de su rotación. Se mide en irradiancia (W/m²), no en potencia absoluta.
- **Spot (Foco)**: como Point, pero restringida a un cono de dirección definido por un ángulo (`Spot Size`) y un borde de suavizado (`Blend`).
- **Area (Área)**: emite luz desde una superficie plana (rectangular, cuadrada, disco o elipse) en una única dirección; produce sombras más suaves cuanto mayor es el tamaño de dicha superficie.

Parámetros comunes a todas ellas, ubicados en Object Data Properties (ícono de bombilla):
- **Power**: intensidad de la emisión (unidad depende del tipo de luz).
- **Color**: temperatura cromática de la luz.
- **Radius / Size** (Point, Spot, Area): tamaño físico de la fuente; a mayor tamaño, sombras más suaves y difusas.
- **Angle** (exclusivo de Sun): controla la suavidad del sombreado simulando el tamaño angular aparente del sol.

---

## Parte 2 — Preparación del entorno de prueba

1. Ubicar la cámara isométrica ya configurada (Sesión 5) y fijar la vista activa (`Numpad 0`) para comparar los resultados bajo el mismo encuadre en todas las pruebas.
2. Eliminar temporalmente cualquier luz existente en la escena (seleccionar y `X > Delete`), de manera que cada prueba parta de cero.
3. Ajustar temporalmente el color de fondo (World Properties) a un gris neutro de valor medio, para no interferir en la lectura de cada prueba. El color definitivo se restablecerá en la Parte 5.
4. Cambiar el modo de sombreado del viewport a `Rendered` (icono correspondiente en la esquina superior derecha, o tecla `Z`), de forma que cada prueba sea visible en tiempo real.

---

## Parte 3 — Prueba 1: Point Light

1. `Shift+A > Light > Point`.
2. Posicionar la luz en diagonal, sobre la escena (`G`, luego ajustar en X/Y/Z), a una altura moderada respecto a la montaña.
3. En Object Data Properties: `Power = 1000 W`, `Color` blanco neutro, `Radius = 0.25 m`.
4. Observar: las sombras proyectadas son relativamente definidas, y la intensidad decae de forma perceptible entre los elementos más cercanos y los más lejanos a la fuente — comportamiento poco adecuado para una escena de esta escala, donde se busca una iluminación más homogénea.

---

## Parte 4 — Prueba 2: Sun Light

1. Eliminar la luz anterior. `Shift+A > Light > Sun`.
2. Rotar la luz (`R`, sobre los ejes correspondientes) hasta lograr un ángulo de incidencia diagonal, similar al de la referencia (aproximadamente 45° respecto al plano de la plataforma).
3. En Object Data Properties: `Strength = 3 W/m²`, `Angle = 0.526°` (valor por defecto, adecuado para sombras nítidas pero no completamente duras).
4. Observar: la intensidad es uniforme en toda la escena, independientemente de la distancia a cada objeto — comportamiento coherente con la simulación de una fuente lejana como el sol, y por ello, adecuado como luz principal (*key light*) del diorama.

---

## Parte 5 — Prueba 3: Spot Light

1. Eliminar la luz anterior. `Shift+A > Light > Spot`.
2. Posicionar sobre la montaña, apuntando hacia el área de la cascada (`R` para orientar el cono de emisión).
3. En Object Data Properties: `Power = 2000 W`, `Spot Size = 45°`, `Blend = 0.3`.
4. Observar: el resultado concentra la iluminación en un área reducida, dejando el resto de la escena considerablemente más oscuro. Este comportamiento resulta apropiado para resaltar un punto focal específico (por ejemplo, la caída de agua), pero no para servir como luz principal de toda la composición.

---

## Parte 6 — Prueba 4: Area Light

1. Eliminar la luz anterior. `Shift+A > Light > Area`.
2. Posicionar en diagonal opuesta a donde se ubicó el Sun en la Parte 4 (a manera de contraluz o relleno).
3. En Object Data Properties: `Power = 150 W`, `Shape = Rectangle`, `Size X = 2 m`, `Size Y = 1.5 m`.
4. Observar: produce una iluminación suave, sin bordes de sombra marcados, adecuada para atenuar el contraste generado por una única fuente direccional — comportamiento apropiado como luz de relleno (*fill light*), no como luz principal.

---

## Parte 7 — Tabla comparativa de resultados

| Tipo de luz | Comportamiento observado | Rol recomendado en el diorama |
|---|---|---|
| Point | Atenuación por distancia; sombras definidas pero desiguales entre elementos cercanos y lejanos | No recomendada para esta escena |
| Sun | Intensidad uniforme en toda la escena, independiente de la distancia; sombras consistentes en dirección | **Luz principal (key light)** |
| Spot | Iluminación concentrada en un área reducida; alto contraste entre zona iluminada y el resto | Luz de acento, opcional, sobre la cascada |
| Area | Iluminación suave y difusa, sin bordes de sombra marcados | **Luz de relleno (fill light)** |

---

## Parte 8 — Configuración de iluminación definitiva

A partir de los resultados anteriores, la configuración final combina tres elementos:

### 8.1 Luz principal (Sun)
1. `Shift+A > Light > Sun`. Rotar a un ángulo diagonal de aproximadamente 45°, coherente con la Prueba 2.
2. `Strength = 2.5-3 W/m²`, `Color` ligeramente cálido (ej. `#FFF1DE`), `Angle = 0.526°`.

### 8.2 Luz de relleno (Area)
1. `Shift+A > Light > Area`, posicionada en el lado opuesto a la Sun.
2. `Power = 80-120 W`, `Color` ligeramente frío (ej. `#D6EBFF`), `Size = 2-3 m`.
3. El contraste cromático entre la luz cálida principal y la luz fría de relleno refuerza la sensación de profundidad, siguiendo el mismo principio de contraste cálido-frío observado en la imagen de referencia del diorama.

### 8.3 Luz de acento (Spot, opcional)
1. `Shift+A > Light > Spot`, orientada hacia la zona de la cascada.
2. `Power = 300-500 W` (considerablemente menor que en la Prueba 3, dado que ahora complementa, no reemplaza, a la luz principal), `Spot Size ≈ 35°`, `Blend ≈ 0.4`.
3. Su función es resaltar el punto focal de la composición sin alterar el balance general de la escena.

### 8.4 Ajuste del entorno (World)
1. World Properties → `Color`, restablecer un tono azul petróleo oscuro (ej. `#0D2B3E`), consistente con el fondo de la referencia.
2. `Strength = 0.3-0.5`, de manera que el entorno aporte una iluminación ambiental tenue sin competir con las fuentes direccionales.

---

## Parte 9 — Verificación final

1. Confirmar que el modo de sombreado del viewport esté en `Rendered`.
2. Ajustar de forma fina la posición angular de la Sun (`R`) hasta que la dirección de las sombras proyectadas coincida con la composición deseada.
3. Ejecutar un render de prueba (`F12`) y evaluar el balance entre luz principal, relleno y acento.
4. De ser necesario, ajustar `Power`/`Strength` de cada luz de forma proporcional (evitando modificar una sola fuente de manera aislada, dado que el balance entre las tres es lo que produce el resultado final).

---

## Conclusión

La exploración comparativa de los cuatro tipos de luz permite constatar que ningún tipo resulta suficiente por sí solo para lograr el resultado buscado: la Sun garantiza uniformidad direccional, el Area aporta suavidad de relleno, y el Spot permite un acento puntual sobre el elemento central de la composición. La configuración definitiva del diorama es, en consecuencia, el resultado de la combinación deliberada de estos tres roles, y no de la elección de un único tipo de luz.
