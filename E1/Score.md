# Propuesta de Sistema de Puntajes - 
# XR Xperience - Escenario 1 - Átomos y Compuestos

## Objetivos del Sistema de Puntaje

- Incentivar el aprendizaje activo y experimental
- Premiar la precisión en la selección y ubicación de átomos
- Fomentar la exploración sin castigos severos
- Desbloquear contenido educativo significativo
- Generar engagement mediante bonificaciones y leaderboard

---

## PUNTUACIÓN BÁSICA POR ACCIÓN

| Acción                                              | Puntos     |
|-----------------------------------------------------|------------|
| Seleccionar átomo correcto                          | +10        |
| Colocar átomo en la posición correcta (estructura)  | +20        |
| Armar molécula completa sin errores                 | +50        |
| Armar molécula con 1 intento fallido                | +30        |
| Armar molécula con múltiples intentos               | +10        |
| Seleccionar un átomo distractor                     | -5         |
| Posicionar átomo incorrectamente                    | -10        |

---

## BONIFICACIONES

| Situación                                            | Bono       |
|------------------------------------------------------|------------|
| Molécula completada sin errores (perfecta)           | +25        |
| Completar todo el nivel sin errores                  | +50        |
| Completar todo el nivel en tiempo récord             | +10 a +100 |
| Completar 3 moléculas seguidas correctamente         | +30 extra  |

---

## MULTIPLICADOR POR NIVEL DE DIFICULTAD

| Nivel               | Multiplicador de puntaje final |
|---------------------|-------------------------------|
| Nivel 1: Básico     | x1                            |
| Nivel 2: Intermedio | x1.25                         |
| Nivel 3: Avanzado   | x1.5                          |

---

## FEEDBACK

- Al completar correctamente una molécula, se muestra:
  - Una **animación de ensamblaje**
  - Una **explicación didáctica breve** sobre la moléculas (en el documento de diseño)
- Tips deben aparecen si hay errores recurrentes (detección de patrones)

---

## MODOS DE JUEGO Y LEADERBOARD

| Modo               | Ranking por                      |
|--------------------|----------------------------------|
| Aprendizaje        | Sin ranking (enfocado en feedback)|
| Desafío            | Puntos totales + tiempo + precisión |
| Contrarreloj       | Tiempo mínimo por nivel          |

Leaderboard opcional por:
- Tiempo
- Puntaje total
- Precisión (errores vs aciertos)

---

## Elementos por Definir (para futuras iteraciones)

- ¿Duración máxima por nivel?
- ¿Pistas disponibles o ayudas contextuales?
- ¿Sistema de logros/medallas? Ej: "Sin errores", "Velocidad química", etc.
- ¿Historial de moléculas ya completadas por el jugador?

---

## Moléculas por Nivel

### Nivel 1 (Básico)
- Agua (H₂O)
- Sal común (NaCl)

### Nivel 2 (Intermedio)
- Cloroformo (CHCl₃)
- Ácido carbónico (H₂CO₃)
- Piruvato (C₃H₄O₃)

### Nivel 3 (Avanzado)
- Glicina (C₂H₅NO₂)
- Glucosa (C₆H₁₂O₆)

Átomos distractores: elementos que **no pertenecen** a ninguna molécula en el nivel actual (ej. Azufre, Fósforo, etc.)

