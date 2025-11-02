# CrimeRateVisualisation
Information Visualisation Project: World Crime Rate.

Groupe n°9 sur Moodle :
• Adzaho Selom Ami, SI5, IHM
• Fakir Lamyae, M2, IHM
• Collin Dufresne Laurine, M2, IA-ID

Projet de visualisation interactive de la criminalité mondiale (2000-2024) basé sur les données UNODC et World Bank.

## Description

Cette application web explore l'évolution de la criminalité dans le monde à travers trois visualisations complémentaires :

- **Carte choroplèthe interactive** : répartition géographique mondiale avec filtrage dynamique par indicateur
- **Scatterplot dynamique** : exploration des corrélations entre variables socio-économiques et criminelles
- **Diagramme en barres animé** : évolution temporelle du classement des pays

L'outil permet d'explorer 21 combinaisons d'indicateurs (7 socio-économiques × 3 criminels) sur plus de 150 pays, avec des transitions fluides et des interactions riches (survol, zoom, sélection temporelle, échelle logarithmique).

## Public cible

Journalistes de données, chercheurs, étudiants et professionnels souhaitant analyser les liens entre criminalité et développement socio-économique sans compétences techniques particulières.

## Technologies

- **Frontend** : D3.js v5, HTML5, CSS3, JavaScript ES6+
- **Preprocessing** : Python 3.7+, pandas, json
- **Données** : UNODC, World Bank, Natural Earth (GeoJSON)

## Prérequis

### Pour utiliser l'application

- Navigateur moderne (Chrome, Firefox, Edge, Safari)
- JavaScript activé
- Python 3.7 ou supérieur
- pip (gestionnaire de packages Python)

## Installation et lancement

### Méthode 1 : Serveur Python (recommandé)

Cloner le dépôt
git clone https://github.com/laurinecd/CrimeRateVisualisation.git
cd CrimeRateVisualisation

Lancer le serveur HTTP depuis le dossier public
cd public
python3 -m http.server 8000

Ouvrir dans le navigateur
→ http://localhost:8000/index.html 

### Méthode 2 : Serveur Node.js (npx)

Depuis le dossier public
cd public
npx http-server -p 8000 -c-1

### Méthode 3 : Serveur Node.js (global)

Installer http-server globalement
npm install -g http-server

Lancer depuis le dossier public
cd public
http-server -p 8000 -c-1

## Structure du projet

CrimeRateVisualisation/
├── public/ # Application web
│ ├── index.html 
│ ├── scatter_plot.html 
│ ├── src/
│ │ ├── js/
│ │ │ ├── datasets.js 
│ │ │ ├── data.js 
│ │ │ ├── map.js 
│ │ │ └── scatter_plot.js 
│ │ └── css/ # Styles
│ └── lib/
│ └── d3.v5.min.js 
│
└── data_treatment/ # Scripts de prétraitement
| ├── data/ 
| ├── global-data/ 
| ├── countries.py
| ├── global.py
| ├── pipeline.py
| └── convert_to_js.py 



## Données disponibles

### Variables criminelles (axe Y)
- Homicides volontaires
- Crimes sexuels
- Corruption

### Variables socio-économiques (axe X)
- PIB par habitant
- Taux de natalité
- Taux de mortalité
- Taux d'emploi
- Taux d'alphabétisation
- Stabilité politique
- Taux de pauvreté

### Période couverte
2000-2024 (selon disponibilité des données)

### Couverture géographique
150+ pays sur les 5 continents

## 🎮 Utilisation

1. **Page d'accueil (carte)** : Explorez la répartition géographique d'un indicateur. Utilisez le panneau latéral pour changer d'indicateur, survolez les pays pour voir les valeurs, cliquez pour des détails.

2. **Scatterplot** : Choisissez les variables X et Y via les dropdowns, utilisez le slider pour naviguer dans le temps, activez l'échelle log si nécessaire, cliquez sur "Play" pour une animation automatique.

3. **Diagramme en barres** : Observez l'évolution du classement des pays. 

## Limitations connues

- Données manquantes pour certains pays/années (non interpolées)
- Interface non responsive (optimisée pour desktop)
- Fichier initial de 10 Mo (peut être lent sur connexions faibles)
- Pas de synchronisation entre vues (architecture modulaire)

## Perspectives

- Ajout de nouvelles variables 
- Fonction d'export PNG/SVG
- Coordination entre vues 
- Mode storytelling guidé
- Interface responsive

## Sources

- [UNODC Crime Data Portal](https://dataunodc.un.org/)
- [World Bank Open Data](https://data.worldbank.org/)
- [Natural Earth](https://www.naturalearthdata.com/)


