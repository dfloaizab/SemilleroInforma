# Sesión Final

Cargar:
```python
import pandas as pd
df=pd.read_csv('dataset_stem_programa_sucio.csv')
```

Limpieza:
```python
df.isnull().sum()
df=df.drop_duplicates()
df['Municipio']=df['Municipio'].str.strip().str.title()
df['Genero']=df['Genero'].str.strip().replace({'Masculino':'M','f':'F'})
df.loc[df['Promedio']>5,'Promedio']=None
df['Promedio']=df['Promedio'].fillna(df['Promedio'].mean())
```

Agrupamiento:
```python
df.groupby('Municipio')['Promedio'].mean()
pd.pivot_table(df,values='Promedio',index='Municipio',columns='Beca',aggfunc='mean')
```

Visualización:
```python
import seaborn as sns
import matplotlib.pyplot as plt
sns.countplot(data=df,x='Municipio')
plt.show()
```

Inferencia:
```python
from scipy.stats import ttest_ind
```
