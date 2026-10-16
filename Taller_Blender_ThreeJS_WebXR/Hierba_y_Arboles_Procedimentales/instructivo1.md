# Dispersión de hierba y árboles con Geometry Nodes en Blender

**Objetivo:** sobre un terreno low poly, distribuir

- **hierba** con cierta *densidad* y solo en una *zona* del terreno (pintada por ti), y
- **árboles** solo en *ciertos puntos* (pocos), usando instancias para no gastar memoria.

**Versión de Blender:** 4.0 o superior (los nombres de nodos corresponden a la 4.x).

---

## 0. Idea general (léela antes de empezar)

Todo se hace con **un solo modificador Geometry Nodes sobre el terreno**. El flujo es:

```
                    ┌─► Distribute Points on Faces (Random) ─► Instance on Points (Hierba) ─┐
Terreno (Group Input)┤                                                                       ├─► Join Geometry ─► Group Output
                    └─► Distribute Points on Faces (Poisson) ─► Instance on Points (Árbol) ─┤
                    └───────────────────────────────────────────────────────────────────────┘
                              (el terreno original también pasa directo al Join)
```

**Por qué esto ahorra memoria:** *Instance on Points* no copia la malla; guarda una sola vez la hierba y el árbol y solo almacena una posición/rotación/escala por instancia. **Nunca uses *Realize Instances*** salvo que lo necesites para exportar.

---

## 1. Preparar los tres objetos

### 1.1 La hierba debe ser UN solo objeto
Tus tres planos "enlazados/agrupados" pueden estar de tres formas. Identifica la tuya:

| Situación | Qué hacer |
|---|---|
| Son 3 objetos sueltos | Selecciónalos y pulsa **Ctrl + J** (Join) para obtener un solo objeto. Renómbralo `Hierba`. |
| Son duplicados enlazados (Alt + D) que comparten malla | Igual: **Ctrl + J**. |
| Están en una colección | Puedes dejarlos así y usar *Collection Info* (ver sección 8), pero lo más simple es unirlos con Ctrl + J. |

Renombra también los otros: `Terreno` y `Arbol`.

### 1.2 Origen en la base (muy importante)
Si el origen no está en la base, la hierba y el árbol quedarán flotando o enterrados.

1. Selecciona `Hierba`, entra a **Edit Mode** (Tab), selecciona los vértices de la base.
2. **Shift + S → Cursor to Selected**.
3. Sal a Object Mode → **Object → Set Origin → Origin to 3D Cursor**.
4. Repite con `Arbol` (origen en la base del tronco).

### 1.3 Aplicar escala y rotación
Con `Hierba` y `Arbol` seleccionados: **Ctrl + A → Rotation & Scale**. Así *Scale* = 1 y no habrá sorpresas de tamaño.

Verifica que "arriba" sea **+Z** en ambos objetos.

### 1.4 Esconder los originales
Colócalos en una colección aparte (por ejemplo `Assets_Dispersion`) y oculta la colección con el ojo (viewport). **Seguirán apareciendo en las instancias**, porque *Object Info* funciona aunque el objeto esté oculto.

---

## 2. Pintar las zonas en el terreno (vertex groups)

Necesitas dos grupos de vértices: uno para la hierba y otro para los árboles.

1. Selecciona `Terreno` → pestaña **Object Data** (triángulo verde) → panel **Vertex Groups**.
2. Pulsa **+** y nómbralo exactamente `Hierba`. Pulsa **+** otra vez y nómbralo `Arboles` (sin tilde, para evitar problemas de escritura).
3. Cambia a **Weight Paint** (menú de modos).
4. Selecciona el grupo `Hierba` en la lista y pinta con el pincel **rojo (peso 1.0)** donde quieres hierba. Lo no pintado (azul = 0) no tendrá hierba.
5. Selecciona `Arboles` y pinta la zona donde pueden aparecer árboles.
6. Vuelve a **Object Mode**.

> **Consejo:** como tu terreno es low poly (pocos vértices), el degradado se verá "en bloques". Está bien. Si quieres bordes más naturales, en el paso 5.4 se explica cómo romper el borde con ruido.

---

## 3. Crear el modificador y la estructura del árbol de nodos

1. Cambia al espacio de trabajo **Geometry Nodes** (pestañas superiores).
2. Selecciona `Terreno` y pulsa **New** en el editor de nodos. Aparecen *Group Input* y *Group Output* conectados.
3. Renombra el grupo a `GN_Dispersion` (campo del nombre arriba del editor).

### 3.1 Crear las entradas del modificador (interfaz)
Abre la barra lateral del editor (**N**) → pestaña **Group**. En *Inputs* pulsa **+** y crea:

| Nombre | Tipo | Valor por defecto | Mín / Máx |
|---|---|---|---|
| `Hierba` | Object | (vacío) | — |
| `Arbol` | Object | (vacío) | — |
| `Densidad Hierba` | Float | 100 | 0 / 2000 |
| `Distancia Arboles` | Float | 4.0 | 0.1 / 100 |
| `Escala Min` | Float | 0.8 | 0 / 10 |
| `Escala Max` | Float | 1.2 | 0 / 10 |
| `Semilla` | Integer | 0 | — |

Luego, en el panel del **modificador** (pestaña llave inglesa), asigna en `Hierba` el objeto `Hierba` y en `Arbol` el objeto `Arbol`.

> Los valores numéricos dependen de la escala de tu escena (la densidad se mide en puntos por m²). Empieza con estos y ajusta mirando el viewport.

---

## 4. Rama A: la hierba (con densidad y zona)

Añade nodos con **Shift + A** (o usa el buscador escribiendo el nombre).

### Paso 4.1: Distribuir puntos sobre el terreno
1. Añade **Distribute Points on Faces**. Modo: **Random**.
2. Conecta `Group Input → Geometry` al socket **Mesh** de este nodo.

### Paso 4.2: Densidad controlada por tu pintura
1. Añade un nodo **Named Attribute** (tipo **Float**) y en *Name* escribe `Hierba` (el nombre del vertex group). Su salida *Attribute* es el peso pintado (0 a 1).
2. Añade un nodo **Math** en modo **Multiply**.
   - Entrada 1: `Group Input → Densidad Hierba`.
   - Entrada 2: `Named Attribute → Attribute`.
3. Conecta la salida de **Math** al socket **Density** de *Distribute Points on Faces*.
4. En *Seed* conecta `Group Input → Semilla`.

**Resultado:** donde el peso es 1 aparece la densidad completa; donde es 0.5, la mitad; donde es 0, nada.

### Paso 4.3: Instanciar la hierba en cada punto
1. Añade **Object Info**:
   - En *Object* conecta `Group Input → Hierba`.
   - **As Instance:** activado ✔.
   - **Transform Space:** *Original*.
2. Añade **Instance on Points**:
   - **Points** ← `Distribute Points on Faces → Points`.
   - **Instance** ← `Object Info → Geometry`.
3. Aún no veas el resultado: falta unir con el terreno (sección 6). Si quieres verlo ya, conecta temporalmente *Instance on Points* a *Group Output*.

### Paso 4.4: Rotación aleatoria (hierba vertical)
1. Añade **Random Value**, tipo **Vector**:
   - *Min* = (0, 0, 0), *Max* = (0, 0, 6.283) (esto es 360° solo sobre Z).
   - *Seed* ← `Group Input → Semilla`.
2. Conecta *Value* al socket **Rotation** de *Instance on Points*.

> Si prefieres que la hierba siga la inclinación de las laderas, conecta en cambio `Distribute Points on Faces → Rotation` al *Rotation*. Con ello el eje Z de cada brizna se alinea con la normal del terreno.

### Paso 4.5: Escala aleatoria
1. Añade **Random Value**, tipo **Float**:
   - *Min* ← `Group Input → Escala Min`, *Max* ← `Group Input → Escala Max`.
   - *Seed* ← `Group Input → Semilla` + 1 (usa un nodo Math *Add* con valor 1; así no se repite el patrón de la rotación).
2. Conecta *Value* al socket **Scale** de *Instance on Points* (Blender lo convierte en escala uniforme).

---

## 5. Rama B: los árboles (solo en ciertos puntos)

Tienes dos formas. **Elige una** (o combina ambas).

### Opción B1: Poisson Disk (automático, pocos puntos, bien separados)

1. Añade un segundo **Distribute Points on Faces** y esta vez modo **Poisson Disk**. Conecta `Group Input → Geometry` a *Mesh*.
2. Configura:
   - **Distance Min** ← `Group Input → Distancia Arboles` (distancia mínima entre árboles; con 4 m jamás habrá dos árboles más cerca que eso).
   - **Density Max**: un valor alto (ej. 10); es el techo de densidad.
   - **Density Factor** ← un nodo **Named Attribute** (Float) con nombre `Arboles` (tu vertex group). Así los árboles solo aparecen donde pintaste.
   - **Seed** ← `Group Input → Semilla` (cambia la semilla para obtener otra distribución).
3. Añade **Object Info** (Object = `Group Input → Arbol`, As Instance ✔, Transform Space: *Original*).
4. Añade **Instance on Points**:
   - **Points** ← Poisson → *Points*.
   - **Instance** ← Object Info → *Geometry*.
   - **Rotation** ← un **Random Value** vectorial (0,0,0) a (0,0,6.283).
   - **Scale** ← un **Random Value** float entre `Escala Min` y `Escala Max`.

### Opción B2: Puntos exactos puestos a mano (control total)

Útil si quieres decidir tú **exactamente** dónde va cada árbol.

1. **Add → Mesh → Plane**, entra a *Edit Mode*, **borra todo** (X → Vertices) para quedar con una malla vacía. Nómbrala `Puntos_Arboles`.
2. En *Edit Mode*, activa el **snapping** (imán) con *Snap To: Face* y **Project Individual Elements**, y agrega vértices con **Ctrl + clic derecho** (o **E** extruyendo un vértice) sobre el terreno en los lugares deseados.
3. En el árbol de nodos del terreno añade un nodo **Object Info** apuntando a `Puntos_Arboles` (*As Instance* desactivado, *Transform Space*: **Relative** para que respete su posición).
4. Conecta su *Geometry* al socket **Points** de un **Instance on Points**. Cada **vértice** se convierte en un árbol.
5. En *Instance* usa el *Object Info* del `Arbol` como en B1 y añade rotación y escala aleatorias.

---

## 6. Unir todo y enviarlo a la salida

1. Añade un nodo **Join Geometry**.
2. Conecta a su **único socket Geometry** (acepta varias conexiones):
   - `Group Input → Geometry` (el terreno original).
   - *Instance on Points* de la **hierba**.
   - *Instance on Points* de los **árboles**.
3. Conecta *Join Geometry → Group Output → Geometry*.

Ya deberías ver el terreno con hierba y árboles. Si no se ve, revisa la sección 9.

---

## 7. Ajustes finales (naturalidad y rendimiento)

### 7.1 Romper el borde de la zona con ruido (opcional)
En el paso 4.2, antes de multiplicar la densidad:

1. Añade **Noise Texture** (escala ≈ 3–5) → **Map Range** (From Min 0.3, From Max 0.7, To Min 0, To Max 1).
2. Multiplica (nodo **Math → Multiply**) el peso de `Named Attribute` por la salida de *Map Range*.
3. Usa el resultado en el *Density*.

Verás un borde irregular y orgánico, aunque el terreno sea low poly.

### 7.2 Menos densidad en el viewport, plena en el render (recomendado)
1. Añade **Is Viewport** y un nodo **Switch** (tipo Float).
2. *Switch*: **False** = densidad completa; **True** = densidad × 0.2 (con un Math *Multiply*).
3. Conecta el *Switch* al *Density* en lugar de la densidad directa.

Así el viewport va fluido y el render final sale con la densidad completa.

### 7.3 Colocar hierba solo por altura o pendiente (alternativa a pintar)
- **Altura:** `Position → Separate XYZ (Z)` → **Compare** (Less Than) → úsalo como *Selection* del *Distribute*.
- **Pendiente:** `Normal → Separate XYZ (Z)` → **Compare** (Greater Than 0.8) → *Selection* (solo zonas casi planas).

---

## 8. Variaciones útiles

- **Varios tipos de hierba o de árbol:** mete los modelos en una colección, usa **Collection Info** con *Separate Children* ✔ y *Reset Children* ✔, y en *Instance on Points* activa **Pick Instance** con un **Random Value (Integer)** en *Instance Index*.
- **Que la hierba no nazca bajo los árboles:** genera primero los árboles, y con un **Geometry Proximity** (target = puntos de árboles) calcula la distancia; usa un *Compare* (mayor que 1.5) como *Selection* de la hierba.

---

## 9. Solución de problemas

| Síntoma | Causa probable | Solución |
|---|---|---|
| No aparece nada | Los sockets *Object* del modificador están vacíos | Asigna `Hierba` y `Arbol` en el panel del modificador |
| No aparece hierba | El nombre del vertex group no coincide | Debe ser idéntico (`Hierba`) en *Named Attribute*; sin tildes en `Arboles` |
| Aparece hierba en toda la malla | No usaste el peso | Revisa que *Named Attribute* esté multiplicando el *Density* |
| Instancias gigantes o diminutas | Escala sin aplicar | Ctrl + A → Scale en los assets |
| Hierba o árboles flotando/enterrados | Origen mal puesto | Origen a la base (paso 1.2) |
| Instancias desplazadas de su punto | *Transform Space* en *Relative* | Usa **Original** en el *Object Info* |
| Blender va lento | Demasiadas instancias | Reduce *Densidad Hierba*, usa el truco *Is Viewport* (7.2); evita *Realize Instances* |
| Los árboles salen amontonados | Distancia pequeña | Aumenta `Distancia Arboles` o cambia `Semilla` |

---

## 10. Nota sobre exportar (por ejemplo, a three.js)

El exportador glTF **convierte las instancias en geometría real**, y la memoria se dispara. Para escenas WebXR/three.js conviene:

- Exportar el terreno y **una sola copia** de la hierba y del árbol.
- Reconstruir la dispersión en three.js con `InstancedMesh` (guardando las posiciones, por ejemplo en un JSON).

---

## Resumen rápido

1. Un objeto de hierba, un árbol y un terreno con origen en la base y escala aplicada.
2. Vertex groups `Hierba` y `Arboles` pintados en el terreno.
3. Modificador Geometry Nodes con entradas para los dos objetos.
4. **Hierba:** *Distribute (Random)* con *Density = Densidad × peso* → *Instance on Points* con rotación Z y escala aleatorias.
5. **Árboles:** *Distribute (Poisson)* con *Density Factor = peso* (o vértices pintados a mano) → *Instance on Points*.
6. *Join Geometry* con el terreno → *Group Output*.
