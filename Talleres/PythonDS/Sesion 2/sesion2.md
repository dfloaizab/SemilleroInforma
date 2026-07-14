# Taller de Introducción a la Ciencia de Datos con Python

# Sesión 2
# Limpieza de Datos e Introducción a la Visualización

## Objetivo

Al finalizar esta sesión el estudiante será capaz de identificar problemas de calidad en un conjunto de datos, aplicar las principales operaciones de limpieza utilizando Pandas y preparar un conjunto de datos listo para su análisis y visualización.

---

# El flujo de trabajo en Ciencia de Datos

Un proyecto de ciencia de datos sigue normalmente una secuencia de actividades que transforma datos en conocimiento útil para apoyar la toma de decisiones.

La primera etapa consiste en obtener los datos desde diferentes fuentes, como archivos CSV, hojas de cálculo, bases de datos o servicios web. Una vez cargados en Python, se realiza una exploración inicial para comprender su estructura y detectar posibles problemas.

La segunda etapa corresponde a la limpieza de los datos. En esta fase se corrigen errores, se eliminan inconsistencias y se preparan los datos para que representen correctamente la realidad que describen.

Posteriormente se realiza la visualización, cuyo propósito es descubrir patrones, tendencias, relaciones y comportamientos que no son evidentes al observar únicamente una tabla de datos.

Finalmente se desarrolla el análisis de datos. Dependiendo del objetivo del proyecto, este análisis puede ser descriptivo, inferencial o predictivo y constituye la base para la toma de decisiones.

El flujo general puede resumirse de la siguiente manera.

```text
Obtención de datos

↓

Carga de datos

↓

Limpieza

↓

Visualización

↓

Análisis

↓

Conclusiones
```

---

# Exploración inicial

Antes de modificar cualquier dato es indispensable conocer el conjunto de información.

```python
import pandas as pd

df = pd.read_csv("tienda_mascotas_dataset_sucio.csv")
```

Visualizar las primeras filas.

```python
df.head()
```

Observar la estructura.

```python
df.info()
```

Obtener un resumen estadístico.

```python
df.describe()
```

Estas operaciones permiten conocer el número de registros, el número de variables, los tipos de datos y las principales estadísticas descriptivas.

---

# Limpieza de datos

La limpieza de datos busca mejorar la calidad de la información antes de realizar cualquier análisis. En proyectos reales esta etapa suele consumir la mayor parte del tiempo de trabajo.

## Identificación de valores nulos

Los valores faltantes representan información desconocida o no registrada.

```python
df.isnull().sum()
```

Visualizar únicamente los registros afectados.

```python
df[df.isnull().any(axis=1)]
```

---

## Identificación de registros duplicados

Es frecuente encontrar ventas registradas más de una vez.

Detectar registros duplicados.

```python
df.duplicated().sum()
```

Visualizar los duplicados.

```python
df[df.duplicated()]
```

Eliminar duplicados.

```python
df = df.drop_duplicates()
```

---

## Eliminación de espacios innecesarios

Los espacios al inicio o al final de una cadena producen categorías diferentes para un mismo valor.

Observar los barrios registrados.

```python
df["Barrio"].unique()
```

Eliminar espacios.

```python
df["Barrio"] = df["Barrio"].str.strip()
```

Verificar nuevamente.

```python
df["Barrio"].unique()
```

---

## Normalización de texto

Un mismo dato puede aparecer escrito de distintas formas.

Ejemplo.

```text
Labrador
labrador
LABRADOR
```

Convertir todas las razas al mismo formato.

```python
df["Raza"] = df["Raza"].str.title()
```

---

## Corrección de errores ortográficos

Es posible encontrar errores de digitación.

```python
df["Raza"].unique()
```

Corregir un valor.

```python
df["Raza"] = df["Raza"].replace(
    "Labradoor",
    "Labrador"
)
```

---

## Conversión de tipos de datos

Algunas columnas deberían ser numéricas, pero contienen texto.

Verificar tipos.

```python
df.info()
```

Convertir la columna.

```python
df["PrecioUnitario"] = pd.to_numeric(
    df["PrecioUnitario"],
    errors="coerce"
)
```

Los valores incorrectos serán convertidos en valores nulos para su posterior tratamiento.

---

## Detección de valores imposibles

En ocasiones aparecen cantidades negativas, ventas con valor cero o precios fuera de rango.

Buscar cantidades negativas.

```python
df[df["Cantidad"] < 0]
```

Buscar cantidades iguales a cero.

```python
df[df["Cantidad"] == 0]
```

Buscar ventas con valores extremadamente altos.

```python
df[df["ValorTotal"] > 1000000]
```

---

## Verificación de reglas del negocio

Una regla sencilla consiste en verificar que el valor total corresponda al producto entre la cantidad y el precio unitario.

Crear una nueva columna.

```python
df["TotalCalculado"] = (
    df["Cantidad"] *
    df["PrecioUnitario"]
)
```

Comparar ambos valores.

```python
df[
    df["TotalCalculado"] != df["ValorTotal"]
]
```

---

## Exportación del conjunto de datos limpio

Una vez finalizada la limpieza, el conjunto de datos puede almacenarse nuevamente.

```python
df.to_csv(
    "tienda_mascotas_dataset_limpio.csv",
    index=False
)
```

Este archivo será utilizado durante las siguientes sesiones del curso.

---

# Introducción a la visualización de datos

Una vez que los datos han sido limpiados, el siguiente paso consiste en representarlos gráficamente.

La visualización permite comprender rápidamente el comportamiento de las variables, identificar patrones, detectar valores atípicos y comunicar resultados de forma clara.

Las dos bibliotecas más utilizadas en Python para este propósito son Matplotlib y Seaborn.

Matplotlib constituye la biblioteca base para la creación de gráficos científicos y ofrece un alto nivel de personalización.

Seaborn se construye sobre Matplotlib y proporciona visualizaciones estadísticas más elaboradas con una sintaxis más sencilla.

Durante la siguiente sesión se estudiarán gráficos de barras, histogramas, diagramas de dispersión, diagramas de caja, mapas de calor y matrices de correlación.

---

# Actividad integradora

Utilizando el archivo "tienda_mascotas_dataset_sucio.csv", el estudiante deberá realizar un proceso completo de limpieza de datos.

Inicialmente deberá inspeccionar el conjunto de datos utilizando las funciones head(), info() y describe(). Posteriormente identificará valores faltantes, registros duplicados, errores de escritura, diferencias entre mayúsculas y minúsculas, espacios innecesarios, tipos de datos incorrectos y registros que incumplan las reglas básicas del negocio.

Una vez corregidos estos problemas, deberá guardar el resultado en un nuevo archivo denominado "tienda_mascotas_dataset_limpio.csv".

Finalmente elaborará un breve informe respondiendo las siguientes preguntas.

¿Cuántos registros fueron eliminados por duplicidad?

¿Cuántos valores nulos fueron encontrados?

¿Qué columnas requirieron conversión de tipo de dato?

¿Qué errores de escritura fueron corregidos?

¿Qué registros presentaban inconsistencias entre el precio unitario, la cantidad y el valor total?

¿Qué decisiones de limpieza considera que fueron las más importantes para garantizar la calidad del conjunto de datos?

---

# Conclusión

La limpieza de datos constituye una de las etapas más importantes de cualquier proyecto de ciencia de datos. Un análisis realizado sobre datos incorrectos produce conclusiones incorrectas. Por esta razón, antes de construir modelos estadísticos o generar visualizaciones, es indispensable verificar que la información sea consistente, completa y represente adecuadamente el fenómeno que se desea estudiar.

En la siguiente sesión se utilizará el conjunto de datos limpio para construir las primeras visualizaciones con Matplotlib y Seaborn, con el objetivo de descubrir patrones y tendencias presentes en la información.
