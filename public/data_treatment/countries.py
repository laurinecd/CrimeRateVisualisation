import pandas as pd

df = pd.read_csv('src/data_treatment/data/countries.csv', sep=',', decimal=',')

print(df.head())
