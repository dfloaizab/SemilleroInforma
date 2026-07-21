from pandas import *

# 1er paso: carga de datos. en este caso, un csv
# crea un dataset en memoria a partir de un archivo plano
ds_tienda2 = read_csv("dataset_tienda_muysucio.csv")


#informacion general del dataframe
#qué tan saludable está el dataframe:
print("Informacion del dataset:")
ds_tienda2.info()

#Primer acercamiento a las características estadísticas de los datos:
print("Descripción de los datos:")
print(ds_tienda2.describe())

# Corregir valores nulos
# Obtener cuántos registros nulos tengo en el dataset:
print(f"Valores nulos en el dataset:{ds_tienda2.isnull().sum()}")
# Identificarlos
print(f"Registros afectados:{ds_tienda2[ds_tienda2.isnull().any(axis=1)]}")
# 1 solución (dropna): elimina registros con valores nulos
#ds_tienda2 = ds_tienda2.dropna() # !!!!
print("Después de la solución:")
print(f"Valores nulos en el dataset:{ds_tienda2.isnull().sum()}")
# Identificarlos
print(f"Registros afectados:{ds_tienda2[ds_tienda2.isnull().any(axis=1)]}")

print("---- REGISTROS DUPLICADOS: --------")
print(f"N° de registros Duplicados  {ds_tienda2.duplicated().sum()}  ")
print(f"Valores duplicados:\n {ds_tienda2[ds_tienda2.duplicated()]}")

ds_tienda2 = ds_tienda2.drop_duplicates()

print("---- DESPUÉS DE ELIMINAR DUPLICADOS:-----")
print(f"N° de registros Duplicados  {ds_tienda2.duplicated().sum()}  ")
print(f"Valores duplicados:\n {ds_tienda2[ds_tienda2.duplicated()]}")


print(f"Valores únicos de Especie:{ds_tienda2["Especie"].unique()}")
print("Vamos a poner los valores de Especie con mayúscula inicial para todos los registros:")
ds_tienda2["Especie"] = ds_tienda2["Especie"].str.title()
print(f"Valores únicos de Especie:{ds_tienda2["Especie"].unique()}")

print(f"Valores únicos de Raza:{ds_tienda2["Raza"].unique()}")

print(f"Valores únicos de Especie:{ds_tienda2["Especie"].unique()}"   )

#EXISTEN 3 RAZAS "DISTINTAS" PARA LABRADOR: "Labrador", "LABRADOR" y "Labradoor"
# Vamos a corregirlo:
ds_tienda2["Raza"] = ds_tienda2["Raza"].replace("LABRADOR","Labrador")
ds_tienda2["Raza"] = ds_tienda2["Raza"].replace("Labradoor","Labrador")
ds_tienda2["Raza"] = ds_tienda2["Raza"].replace("Pastor Aleman","Pastor Alemán")
ds_tienda2["Raza"] = ds_tienda2["Raza"].replace("golden retriever","Golden Retriever")

#Correccion de valores de precio unitario:
# (Pone NaN, not a number, si no se puede convertir:)
ds_tienda2["PrecioUnitario"] = to_numeric(ds_tienda2["PrecioUnitario"], errors="coerce")