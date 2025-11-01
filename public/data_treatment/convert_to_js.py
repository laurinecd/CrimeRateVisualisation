#!/usr/bin/env python3
import json
import os
import sys

# Configuration
DATA_DIR = "data"
GLOBAL_DATA_DIR = "global-data"
OUTPUT_FILE = "../src/js/datasets.js"

# Mapping des fichiers vers les noms de variables
files_mapping = {
    # Axe X (global-data)
    "global-data/gdp-per-capita-usd.json": "gdpData",
    "global-data/birth-per-women.json": "birthData",
    "global-data/death-rate.json": "deathData",
    "global-data/employment-adults-rate.json": "employmentData",
    "global-data/literacy-adults-rate.json": "literacyData",
    "global-data/political-stability-terrorism-violence.json": "stabilityData",
    "global-data/poverty-gap.json": "povertyData",
    
    # Axe Y (data)
    "data/homicide.json": "homicidesData",
    "data/sexual.json": "sexualData",
    "data/corruption.json": "corruptionData"
}

def convert_json_to_js():
    print("🔄 Conversion des JSON en JavaScript...")
    print(f"📁 Dossier actuel: {os.getcwd()}")
    print(f"📁 Fichier de sortie: {OUTPUT_FILE}")
    print()
    
    js_content = "// Fichier généré automatiquement - Ne pas modifier manuellement\n"
    js_content += "// Généré le: " + __import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S') + "\n\n"
    
    files_found = 0
    files_missing = 0
    
    for file_path, var_name in files_mapping.items():
        print(f"🔍 Recherche de: {file_path}")
        
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                # Vérifie que les données ne sont pas vides
                if not data:
                    print(f"⚠️  Fichier vide: {file_path}")
                    continue
                
                # Convertit en JavaScript
                js_content += f"const {var_name} = {json.dumps(data, indent=2)};\n\n"
                print(f"✅ Converti: {file_path} -> {var_name} ({len(data)} entrées)")
                files_found += 1
                
            except json.JSONDecodeError as e:
                print(f"❌ JSON invalide dans {file_path}: {e}")
                files_missing += 1
            except Exception as e:
                print(f"❌ Erreur avec {file_path}: {e}")
                files_missing += 1
        else:
            print(f"❌ Fichier introuvable: {file_path}")
            print(f"   Chemin absolu: {os.path.abspath(file_path)}")
            files_missing += 1
        print()
    
    if files_found == 0:
        print("❌ Aucun fichier trouvé ! Vérifie que tu es dans le bon dossier.")
        print(f"   Tu dois être dans: data_treatment/")
        sys.exit(1)
    
    # Écrit le fichier de sortie
    output_path = OUTPUT_FILE
    output_dir = os.path.dirname(output_path)
    
    print(f"📝 Création du dossier de sortie: {output_dir}")
    try:
        os.makedirs(output_dir, exist_ok=True)
    except Exception as e:
        print(f"❌ Impossible de créer le dossier: {e}")
        sys.exit(1)
    
    print(f"📝 Écriture du fichier: {output_path}")
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
    except Exception as e:
        print(f"❌ Impossible d'écrire le fichier: {e}")
        sys.exit(1)
    
    file_size = os.path.getsize(output_path) / 1024
    
    print()
    print("=" * 50)
    print(f"✅ Fichier généré avec succès!")
    print(f"📊 Fichiers convertis: {files_found}/{len(files_mapping)}")
    print(f"📊 Fichiers manquants: {files_missing}/{len(files_mapping)}")
    print(f"📊 Taille: {file_size:.2f} KB")
    print(f"📁 Emplacement: {os.path.abspath(output_path)}")
    print("=" * 50)

if __name__ == "__main__":
    try:
        convert_json_to_js()
    except KeyboardInterrupt:
        print("\n\n⚠️  Conversion annulée par l'utilisateur")
        sys.exit(0)
    except Exception as e:
        print(f"\n\n❌ ERREUR FATALE: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
