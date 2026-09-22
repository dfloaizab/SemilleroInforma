from pandas import *
from matplotlib import *
import seaborn as sns #Librería gráfica que corre sobre matplotlib
import matplotlib.pyplot as plt #Es el motor gráfico esencial

#1. Leer el dataset:
ds_d = read_csv("dataset_stem_programa_sucio.csv")

print("-- Intro a la ciencia de datos con Python - Sesión final --")

#Análisis preliminar:
print(f"Info del dataset:\n {ds_d.info()}")
print(f"Descripcion del dataset:\n {ds_d.describe()}")

# Imprimir top 5 y últimas 5:
print(f"Top 5: \n {ds_d.head()}")
print(f"Últimas 5: \n {ds_d.tail()}")

# filas con valores nulos:
print(f"Filas con Valores nulos:{ds_d.isnull()}")

# filas con valores duplicados:
print(f"Valores duplicados:\n{ds_d.duplicated()}")
# elimino datos duplicados en el dataset y los dejo en memoria:
ds_d = ds_d.drop_duplicates()
print(f"Valores duplicados:\n{ds_d.duplicated()}")


#2. -------------- Limpieza del dataset: ---------------------

# a. valores nulos
ds_d = ds_d.dropna();
# b. valores duplicados
ds_d = ds_d.drop_duplicates()

print(f"Info del dataset (medio limpio):\n {ds_d.info()}")
print(f"Descripcion del dataset (medio limpio):\n {ds_d.describe()}")

# c. valores fuera de rango (atípicos)
# imprimir valores mínimos y máximos:
print(f"Edad mínima: {ds_d["Edad"].min()}")
print(f"Edad máxima: {ds_d["Edad"].max()}")

#hacemos un replace para corregir datos:
ds_d["Edad"] = ds_d["Edad"].replace(99,25)
#Normalización de datos: asistencia del 105.0% la normaliza al valor máximo razonable que es 100.0%
ds_d["Asistencia"] = ds_d["Asistencia"].replace(105.0,100.0)
print(f"Edad mínima: {ds_d["Edad"].min()}")
print(f"Edad máxima: {ds_d["Edad"].max()}")

# d. formato de datos
print(f"Nombres de ciudades:{ds_d["Municipio"].unique()}")
ds_d["Municipio"] = ds_d["Municipio"].replace("cali","Cali")
ds_d["Municipio"] = ds_d["Municipio"].replace(" Cali ","Cali")
print(f"Nombres de ciudades:{ds_d["Municipio"].unique()}")

print(f"Generos:{ds_d["Genero"].unique()}")
print(f"Beca:{ds_d["Beca"].unique()}")

#Genero = {"M","F"}
ds_d["Genero"] = ds_d["Genero"].replace("Masculino","M")
ds_d["Genero"] = ds_d["Genero"].replace("f ","F")
print(f"Generos:{ds_d["Genero"].unique()}")

ds_d["Beca"] = ds_d["Beca"].replace("NO","False")
ds_d["Beca"] = ds_d["Beca"].replace("Si","True")
ds_d["Beca"] = ds_d["Beca"].replace("Sí","True")
ds_d["Beca"] = ds_d["Beca"].replace("Sí","True")
ds_d["Beca"] = ds_d["Beca"].replace(" si ","True")
print(f"Beca:{ds_d["Beca"].unique()}")

#iloc en el dataset indexa por índice de columna, indice de fila:
print(f"Una casilla del dataset (Edad de la fila 1): {ds_d.iloc[1,1]}")

#loc en el dataset indexa por nombre de columna e indice de fila:
# ¿?
# print(f"Una fila del dataset: {ds_d.loc["Edad",20]}")
ds_d.to_csv("dataset_limpio.csv")

# 3. ------ ANÁLISIS DE DATOS: AGRUPACIONES -------
# Mostrar promedio por municipio:
ds_mun_prom = ds_d.groupby("Municipio")["Promedio"].mean()
print(ds_mun_prom)

ds_mun_prom = ds_d.groupby(["Municipio","Institucion"])["Promedio"].mean()
print(ds_mun_prom)

ds_pt = ds_d.pivot_table(index=["Municipio","Institucion"],values="Promedio",aggfunc="mean")
print(f"Como tabla pivote:\n{ds_pt}")

# 4. ------- ANÁLISIS GRÁFICO -------
#sns.countplot(data=ds_d, x="Municipio")
# plt.show() #Muestra en pantalla (pero no en codespaces)
#plt.savefig("fig1.jpg") #Genera el archivo y lo guarda en un formato gráfico

# ¿Los estudiantes becados tienen mejores promedios?
# ¿Cómo lo miro en un gráfico? ¿qué tipo de gráfico genero?
#sns.boxplot(data=ds_d, x="Beca",y="Promedio")
#plt.savefig("fig2.jpg")


# ¿Qué variables tienen una fuerte correlación o codependencia?
# esto lo responde un "heatmap" o "mapa de calor"
# Obtenemos primero la matriz de correlación: es una métrica que me indica qué tanto incide el 
# cambio en el valor de una variable, en otra
corr = ds_d.corr(numeric_only=True)
sns.heatmap(corr,annot=True,cmap="coolwarm")
plt.savefig("fig3.jpg")

# FIN DE LA PARTE 1 DEL TALLER

# 5. ------- ANÁLISIS ESTADÍSTICO -------
# SE LAS QUEDO DEBIENDO PARA LA PRÓXIMA SESIÓN