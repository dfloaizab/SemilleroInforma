# Taller de Introducción a la Ciencia de Datos con Python

# Sesión 4
# Análisis Gráfico de Datos con Matplotlib
## Parte 1

Duración: 2 horas

---

# Objetivo

Al finalizar esta sesión el estudiante será capaz de realizar un análisis exploratorio de datos (Exploratory Data Analysis, EDA) utilizando visualizaciones construidas con Matplotlib. El estudiante aprenderá a interpretar distribuciones, comparar categorías, identificar tendencias y comunicar resultados mediante gráficos estadísticos.

El desarrollo de la sesión utiliza el mismo caso de estudio trabajado durante el curso: el conjunto de datos de ventas de una tienda de mascotas.

---

# Introducción

Una vez que un conjunto de datos ha sido cargado, limpiado y transformado, el siguiente paso consiste en comprender su comportamiento.

El análisis exploratorio de datos tiene como propósito descubrir patrones, tendencias, relaciones entre variables y posibles anomalías antes de aplicar técnicas estadísticas o modelos predictivos.

Las visualizaciones permiten responder preguntas que son difíciles de contestar observando únicamente una tabla de datos.

Durante esta sesión se utilizará Matplotlib, la biblioteca base para generación de gráficos científicos en Python.

---

# Preparación del entorno

Importar las bibliotecas necesarias.

```python
import pandas as pd
import matplotlib.pyplot as plt
```

Cargar el conjunto de datos.

```python
df = pd.read_csv("tienda_mascotas_dataset_limpio.csv")
```

Visualizar los primeros registros.

```python
df.head()
```

Observar la estructura.

```python
df.info()
```

Obtener estadísticas descriptivas.

```python
df.describe()
```

---

# Primera exploración

Antes de construir cualquier gráfico es importante formular preguntas sobre el conjunto de datos.

Algunas preguntas pueden ser las siguientes.

¿Cuántas ventas fueron realizadas?

¿Cuáles son los productos más vendidos?

¿Cuál es el barrio con mayor número de clientes?

¿Cuál es el valor promedio de las ventas?

¿Existen diferencias entre propietarios de perros y gatos?

Estas preguntas orientarán la construcción de las visualizaciones.

---

# Introducción a Matplotlib

Matplotlib constituye la biblioteca más utilizada para generar gráficos científicos en Python.

La biblioteca pyplot proporciona una interfaz sencilla para construir gráficos.

```python
import matplotlib.pyplot as plt
```

Todo gráfico en Matplotlib sigue una estructura similar.

```python
plt.plot(...)
plt.title(...)
plt.xlabel(...)
plt.ylabel(...)
plt.show()
```

---

# Gráfico de barras

Los gráficos de barras permiten comparar categorías.

Calcular el número de ventas por especie.

```python
ventas_especie = df.groupby("Especie").size()
```

Construir el gráfico.

```python
ventas_especie.plot(kind="bar")

plt.title("Número de ventas por especie")

plt.xlabel("Especie")

plt.ylabel("Cantidad de ventas")

plt.show()
```

Interpretación.

La altura de cada barra representa la cantidad de registros pertenecientes a cada categoría.

---

# Actividad 1

Construir un gráfico de barras para responder las siguientes preguntas.

¿Cuántas ventas corresponden a perros?

¿Cuántas ventas corresponden a gatos?

¿Cuál especie registra mayor número de ventas?

---

# Gráfico de barras por producto

Calcular las ventas totales por producto.

```python
ventas_producto = df.groupby(
    "Producto"
)["ValorTotal"].sum()
```

Construir el gráfico.

```python
ventas_producto.plot(kind="bar")

plt.title("Ventas por producto")

plt.xlabel("Producto")

plt.ylabel("Valor vendido")

plt.xticks(rotation=45)

plt.show()
```

Interpretación.

Este gráfico permite identificar cuáles productos generan mayores ingresos.

---

# Actividad 2

Construir un gráfico similar utilizando la columna Barrio.

Responder.

¿Qué barrio genera mayores ingresos?

---

# Histograma

El histograma representa la distribución de una variable numérica.

Construir un histograma del valor total de las ventas.

```python
plt.hist(
    df["ValorTotal"],
    bins=20
)

plt.title(
    "Distribución del valor de las ventas"
)

plt.xlabel(
    "Valor de la venta"
)

plt.ylabel(
    "Frecuencia"
)

plt.show()
```

Interpretación.

Un histograma permite identificar concentraciones de datos, valores extremos y posibles distribuciones normales o asimétricas.

---

# Actividad 3

Construir un histograma del precio unitario.

Responder.

¿Los precios presentan una distribución uniforme?

¿Existen valores extremos?

---

# Gráfico de líneas

Los gráficos de líneas permiten representar cambios a través del tiempo.

Convertir la columna Fecha.

```python
df["Fecha"] = pd.to_datetime(
    df["Fecha"]
)
```

Agrupar las ventas por fecha.

```python
ventas_fecha = (
    df.groupby("Fecha")
    ["ValorTotal"]
    .sum()
)
```

Construir el gráfico.

```python
ventas_fecha.plot()

plt.title(
    "Ventas por fecha"
)

plt.xlabel(
    "Fecha"
)

plt.ylabel(
    "Ventas"
)

plt.show()
```

Interpretación.

Este gráfico permite observar tendencias temporales y detectar días con ventas inusualmente altas o bajas.

---

# Actividad 4

Responder.

¿Cuál fue el día con mayores ventas?

¿Se observa alguna tendencia creciente o decreciente?

---

# Scatter Plot

Los diagramas de dispersión permiten estudiar relaciones entre variables numéricas.

Construir un gráfico de dispersión.

```python
plt.scatter(
    df["PrecioUnitario"],
    df["ValorTotal"]
)

plt.title(
    "Precio vs Valor Total"
)

plt.xlabel(
    "Precio Unitario"
)

plt.ylabel(
    "Valor Total"
)

plt.show()
```

Interpretación.

Cada punto representa una venta.

La dispersión de los puntos permite evaluar si existe una relación entre ambas variables.

---

# Actividad 5

Responder.

¿Existe una relación entre el precio unitario y el valor total?

¿Qué explicación tiene esa relación?

---

# Personalización de gráficos

Matplotlib permite modificar prácticamente todos los elementos del gráfico.

Cambiar tamaño.

```python
plt.figure(figsize=(10,6))
```

Agregar cuadrícula.

```python
plt.grid(True)
```

Modificar color.

```python
plt.bar(
    ventas_especie.index,
    ventas_especie.values,
    color="steelblue"
)
```

Rotar etiquetas.

```python
plt.xticks(rotation=45)
```

Guardar una figura.

```python
plt.savefig(
    "ventas_por_producto.png",
    dpi=300
)
```

---

# Ejercicio Integrador

Utilizando únicamente Matplotlib, elaborar un pequeño informe gráfico del conjunto de datos.

El informe deberá contener un gráfico de barras con las ventas por especie, un gráfico de barras con las ventas por producto, un histograma del valor de las ventas, un gráfico de líneas con las ventas por fecha y un gráfico de dispersión entre el precio unitario y el valor total.

Cada gráfico deberá ir acompañado de una breve interpretación de los resultados observados.

---

# Conclusiones

Matplotlib constituye la biblioteca base para la visualización científica en Python. Sus herramientas permiten construir gráficos completamente personalizables que facilitan la comprensión del comportamiento de un conjunto de datos.

