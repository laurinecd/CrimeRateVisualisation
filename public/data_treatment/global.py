import pandas as pd
import json
import os

df = pd.read_csv('data/global-data.csv', delimiter=';')

afghanistan_indicators = df[df['Country Code'] == 'AFG']['Indicator Name'].unique()

os.makedirs('global-data', exist_ok=True)

for indicator in afghanistan_indicators:
    indicator_data = df[df['Indicator Name'] == indicator]
    
    result = []
    
    for _, row in indicator_data.iterrows():
        country = row['Country Name']
        for year in range(2000, 2025):
            year_str = str(year)
            if year_str in row.index and pd.notna(row[year_str]) and row[year_str] != '':
                result.append({
                    "Country": country,
                    "Year": year,
                    "Value": float(row[year_str])
                })
    
    safe_filename = indicator.replace('/', '-').replace('\\', '-').replace(':', '-').replace('*', '-').replace('?', '-').replace('"', '-').replace('<', '-').replace('>', '-').replace('|', '-')
    
    filename = f'global-data/{safe_filename}.json'
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

print(f"{len(afghanistan_indicators)} fichiers JSON créés dans le dossier 'global-data'")