import pandas as pd


df = pd.read_csv("src/data_treatment/data/sexual.csv", skiprows=2)  

df_filtered = df[df["Category"] == "Sexual violence"]

df_filtered = df_filtered[["Country", "Year", "VALUE"]]

df_filtered = df_filtered.rename(columns={"VALUE": "Value"})

df_filtered.to_json("src/data_treatment/data/sexual.json", orient="records", indent=2)




df = pd.read_csv("src/data_treatment/data/homicide.csv", skiprows=2)  

df_filtered = df[df["Indicator"] == "Victims of intentional homicide"]

df_filtered = df_filtered[["Country", "Year", "VALUE"]]

df_filtered = df_filtered.rename(columns={"VALUE": "Value"})

df_filtered.to_json("src/data_treatment/data/homicide.json", orient="records", indent=2)




df = pd.read_csv("src/data_treatment/data/corruption.csv", skiprows=2)  

df_filtered = df[df["Category"] == "Theft"]

df_filtered = df_filtered[["Country", "Year", "VALUE"]]

df_filtered = df_filtered.rename(columns={"VALUE": "Value"})

df_filtered.to_json("src/data_treatment/data/corruption.json", orient="records", indent=2)