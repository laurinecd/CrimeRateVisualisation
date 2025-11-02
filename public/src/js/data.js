// src/js/data.js

const variables = {
  x: [
    { id: 'gdp', label: 'PIB par habitant' },
    { id: 'birth', label: 'Taux de natalité' },
    { id: 'death', label: 'Taux de mortalité' },
    { id: 'employment', label: "Taux d'emploi" },
    { id: 'literacy', label: 'Taux d\'alphabétisation' },
    { id: 'stability', label: 'Stabilité politique' },
    { id: 'poverty', label: 'Taux de pauvreté' }
  ],
  y: [
    { id: 'homicides', label: 'Nombre d\'homicides' },
    { id: 'sexual', label: 'Crimes sexuels' },
    { id: 'corruption', label: 'Taux de corruption' }
  ]
};

const datasets = {
  gdp: gdpData,
  birth: birthData,
  death: deathData,
  employment: employmentData,
  literacy: literacyData,
  stability: stabilityData,
  poverty: povertyData,
  homicides: homicidesData,
  sexual: sexualData,
  corruption: corruptionData
};

let selectedX = 'gdp';
let selectedY = 'homicides';

function getDataForYear(year) {
  if (!datasets[selectedX] || !datasets[selectedY]) {
    console.error("Données manquantes pour:", selectedX, selectedY);
    return [];
  }
  
  const xData = new Map(
    datasets[selectedX]
      .filter(d => d.Year === year && d.Value != null && !isNaN(d.Value))
      .map(d => [d.Country, d.Value])
  );

  const yData = new Map(
    datasets[selectedY]
      .filter(d => d.Year === year && d.Value != null && !isNaN(d.Value))
      .map(d => [d.Country, d.Value])
  );

  const combinedData = [];
  for (const [country, xValue] of xData.entries()) {
    const yValue = yData.get(country);
    if (xValue != null && yValue != null) {
      combinedData.push({ 
        Country: country, 
        X: +xValue, 
        Y: +yValue 
      });
    }
  }
  
  return combinedData;
}

function getLabel(axis) {
  const selected = axis === 'x' ? selectedX : selectedY;
  const list = variables[axis];
  const variable = list.find(v => v.id === selected);
  return variable ? variable.label : '';
}
