# Taller de Introducción a la Ciencia de Datos con Python

# Sesión 4
# Análisis Gráfico de Datos con Seaborn
## Parte 2

Duración: 2 horas

---

# Objetivo

Al finalizar esta sesión el estudiante será capaz de utilizar la biblioteca Seaborn para construir gráficos estadísticos que faciliten el análisis exploratorio de un conjunto de datos. Además, aprenderá a interpretar las relaciones entre variables numéricas y categóricas utilizando diferentes tipos de visualizaciones.

Se continuará utilizando el caso de estudio de la tienda de mascotas desarrollado durante las sesiones anteriores.

---

# Introducción

Matplotlib proporciona una gran flexibilidad para construir gráficos, pero muchas visualizaciones estadísticas requieren varias líneas de código y configuraciones adicionales.

Seaborn es una biblioteca construida sobre Matplotlib que simplifica este proceso y permite generar gráficos con una apariencia más profesional y una sintaxis más sencilla.

Para utilizar Seaborn es necesario importar la biblioteca.

```python
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd

df = pd.read_csv("tienda_mascotas_dataset_limpio.csv")
```

Opcionalmente puede utilizarse un estilo predeterminado.

```python
sns.set_theme(style="whitegrid")
```

---

# Countplot

El gráfico Countplot permite contar automáticamente la cantidad de registros pertenecientes a cada categoría.

Construir un gráfico de ventas por especie.

```python
sns.countplot(
    data=df,
    x="Especie"
)

plt.title("Número de ventas por especie")

plt.show()
```

Interpretación.

Cada barra representa el número de registros pertenecientes a cada categoría.

---

# Actividad 1

Construir un Countplot para las siguientes variables.

Producto

Barrio

Estrato

Responder.

¿Cuál categoría presenta el mayor número de registros?

¿Cuál categoría presenta el menor número de registros?

---

# Barplot

El gráfico Barplot calcula automáticamente un estadístico, normalmente el promedio.

Promedio del valor de las ventas por estrato.

```python
sns.barplot(
    data=df,
    x="Estrato",
    y="ValorTotal"
)

plt.title("Promedio de ventas por estrato")

plt.show()
```

Interpretación.

La altura de cada barra representa el promedio del valor de las ventas para cada estrato.

---

# Actividad 2

Construir gráficos similares para responder las siguientes preguntas.

¿Cuál barrio presenta el mayor promedio de ventas?

¿Cuál producto presenta el mayor ingreso promedio?

---

# Boxplot

El diagrama de caja resume la distribución de una variable.

Permite identificar.

Mediana.

Cuartiles.

Rango intercuartílico.

Valores atípicos.

Construir un Boxplot.

```python
sns.boxplot(
    data=df,
    x="Especie",
    y="ValorTotal"
)

plt.title(
    "Valor de ventas por especie"
)

plt.show()
```

Interpretación.

La línea central corresponde a la mediana.

La caja representa el cincuenta por ciento central de los datos.

Los puntos ubicados fuera de los límites corresponden a posibles valores atípicos.

---

# Actividad 3

Responder.

¿Existen valores atípicos?

¿Cuál especie presenta mayor dispersión?

¿Cuál especie presenta una mediana más alta?

---

# Violin Plot

El gráfico de violín combina un Boxplot con una estimación de densidad.

```python
sns.violinplot(
    data=df,
    x="Especie",
    y="ValorTotal"
)

plt.title(
    "Distribución de ventas"
)

plt.show()
```

Interpretación.

El ancho del violín representa la concentración de observaciones.

Las zonas más anchas contienen una mayor cantidad de datos.

---

# Actividad 4

Comparar el Boxplot y el Violin Plot.

Responder.

¿Qué información adicional proporciona el gráfico de violín?

---

# Scatter Plot con Seaborn

Seaborn permite colorear automáticamente los puntos de acuerdo con una categoría.

```python
sns.scatterplot(
    data=df,
    x="PrecioUnitario",
    y="ValorTotal",
    hue="Especie"
)

plt.title(
    "Precio Unitario vs Valor Total"
)

plt.show()
```

Interpretación.

Cada color representa una especie diferente.

Esto facilita comparar ambos grupos simultáneamente.

---

# Actividad 5

Construir un Scatter Plot utilizando.

Barrio

Producto

Estrato

como variable de color.

¿Cuál representación resulta más útil?

¿Por qué?

---

# Heatmap

El mapa de calor permite visualizar la correlación entre variables numéricas.

Seleccionar únicamente las columnas numéricas.

```python
correlacion = df.corr(
    numeric_only=True
)
```

Construir el mapa.

```python
plt.figure(figsize=(8,6))

sns.heatmap(
    correlacion,
    annot=True,
    cmap="coolwarm"
)

plt.title(
    "Matriz de correlación"
)

plt.show()
```

Interpretación.

Los valores cercanos a uno representan una correlación positiva fuerte.

Los valores cercanos a menos uno representan una correlación negativa fuerte.

Los valores cercanos a cero indican ausencia de relación lineal.

---

# Actividad 6

Responder.

¿Qué variables presentan la mayor correlación?

¿Qué variables parecen independientes?

---

# Pairplot

El Pairplot permite visualizar simultáneamente todas las relaciones entre variables numéricas.

```python
sns.pairplot(
    df[
        [
            "Cantidad",
            "PrecioUnitario",
            "ValorTotal"
        ]
    ]
)

plt.show()
```

Interpretación.

La diagonal contiene histogramas.

Las demás posiciones contienen diagramas de dispersión.

Este gráfico resulta especialmente útil para descubrir relaciones entre variables.

---

# Actividad 7

Responder.

¿Qué variables parecen estar relacionadas?

¿Cuál variable presenta mayor dispersión?

---

# Comparación entre Matplotlib y Seaborn

Matplotlib ofrece un mayor nivel de personalización y constituye la base para la mayoría de las visualizaciones científicas en Python.

Seaborn proporciona funciones estadísticas de alto nivel que reducen significativamente la cantidad de código necesario para construir gráficos complejos.

En la práctica ambas bibliotecas suelen utilizarse conjuntamente.

---

# Actividad Integradora

Utilizando únicamente el conjunto de datos de la tienda de mascotas, elaborar un informe gráfico que contenga como mínimo.

Un Countplot de las especies.

Un Barplot del promedio de ventas por estrato.

Un Boxplot del valor de las ventas por especie.

Un Violin Plot del valor de las ventas.

Un Scatter Plot entre PrecioUnitario y ValorTotal.

Un Heatmap de correlaciones.

Un Pairplot de las variables numéricas.

Cada gráfico deberá ir acompañado de una interpretación escrita en un párrafo donde se expliquen los principales hallazgos.

---

# Laboratorio Final

A partir de las visualizaciones construidas durante esta sesión, responder las siguientes preguntas.

¿Cuál especie registra un mayor número de ventas?

¿Cuál producto genera mayores ingresos promedio?

¿Qué barrio presenta las ventas más altas?

¿Existen valores atípicos en el conjunto de datos?

¿Qué variable presenta la mayor variabilidad?

¿Existe relación entre el precio unitario y el valor total de la venta?

¿Qué variables presentan una correlación significativa?

¿Qué gráfico considera más útil para comparar categorías?

¿Qué gráfico considera más útil para estudiar relaciones entre variables?

¿Cuáles son las tres conclusiones más importantes obtenidas a partir del análisis gráfico?

El informe deberá incluir todos los gráficos generados, el código utilizado para producirlos y una breve interpretación de cada uno.

---

# Buenas prácticas

Toda visualización debe incluir un título descriptivo.

Los ejes deben estar correctamente etiquetados.

Las unidades de medida deben ser claras.

Los colores deben utilizarse únicamente cuando aporten información.

No se recomienda utilizar gráficos tridimensionales cuando una representación bidimensional comunica adecuadamente la información.

Todo gráfico debe responder una pregunta de análisis previamente planteada.

---

# Conclusiones

El análisis exploratorio de datos constituye una etapa fundamental dentro del flujo de trabajo de la ciencia de datos. Las visualizaciones permiten descubrir patrones, identificar anomalías y comprender las relaciones entre las variables antes de aplicar técnicas estadísticas o modelos predictivos.

Matplotlib proporciona la base para la construcción de gráficos científicos altamente personalizables, mientras que Seaborn facilita la creación de visualizaciones estadísticas mediante funciones de alto nivel.

Las habilidades desarrolladas durante esta sesión preparan al estudiante para la siguiente etapa del curso, dedicada al análisis estadístico descriptivo e inferencial, donde las conclusiones obtenidas mediante las visualizaciones serán respaldadas mediante medidas estadísticas y pruebas de hipótesis.
