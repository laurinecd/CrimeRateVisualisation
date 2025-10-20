// === Initialisation du SVG ===
const container = d3.select('#map');
const svg = container.append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .style('display', 'block');

let projection = d3.geoNaturalEarth1();
let path = d3.geoPath().projection(projection);
let worldData = null;
let countries;
let crimeData = {};
let currentFilter = 'average';

// === Gestion du redimensionnement ===
function resize() {
  if (!worldData) return;

  const rect = container.node().getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  svg.attr('viewBox', `0 0 ${width} ${height}`);

  projection = d3.geoNaturalEarth1().fitSize([width, height], worldData);
  path = d3.geoPath().projection(projection);
  svg.selectAll('path').attr('d', path);
}

// === Charger les données ===
Promise.all([
  d3.json('data_treatment/data/world_map.geojson'),
  d3.json('data_treatment/data/sexual.json'),
  d3.json('data_treatment/data/corruption.json'),
  d3.json('data_treatment/data/homicide.json')
])
  .then(([world, sexual, corruption, homicide]) => {
    worldData = world;
    crimeData = { sexual, corruption, homicide };

    drawMap();
    window.addEventListener('resize', resize);
    initMenu();
  })
  .catch(err => console.error('Erreur chargement données:', err));

// === Dessiner la carte ===
function drawMap() {
  if (!worldData || !worldData.features) {
    console.error("Les données GeoJSON ne contiennent pas de 'features'.");
    return;
  }

  // Calculer les moyennes
  const avgCrime = computeAverageCrime();
  const maxValue = d3.max(Array.from(avgCrime.values()));

  const colorScale = d3.scaleSequential()
    .domain([0, maxValue])
    .interpolator(d3.interpolateReds);

  // Dessiner les pays
  countries = svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(worldData.features)
    .join('path')
    .attr('d', path)
    .attr('fill', d => {
      const name = d?.properties?.name;
      const val = name ? avgCrime.get(name) : null;
      return val ? colorScale(val) : '#eee';
    })
    .attr('stroke', '#333')
    .attr('stroke-width', 0.4)
    .on('mouseover', handleMouseOver)
    .on('mousemove', handleMouseMove)
    .on('mouseout', handleMouseOut)
    .on('click', handleCountryClick);

  // Zoom interactif
  const zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', (event) => {
      countries.attr('transform', d3.event.transform);
    });

  svg.call(zoom);

  resize();
}

// === Calcul des moyennes de crime ===
function computeAverageCrime() {
  const crimeByCountry = new Map();

  const addData = (dataset) => {
    if (!dataset) return;
    dataset.forEach(d => {
      const c = d.Country?.trim();
      const v = +d.Value || 0;
      if (!c) return;

      if (!crimeByCountry.has(c)) {
        crimeByCountry.set(c, { total: 0, count: 0 });
      }

      const e = crimeByCountry.get(c);
      e.total += v;
      e.count++;
    });
  };

  if (currentFilter === 'average') {
    addData(crimeData.sexual);
    addData(crimeData.corruption);
    addData(crimeData.homicide);
  } else {
    addData(crimeData[currentFilter]);
  }

  return new Map(
    Array.from(crimeByCountry.entries()).map(([c, { total, count }]) => [c, total / count])
  );
}

// === Gestion des tooltips ===
const tooltip = d3.select('#tooltip');

function handleMouseOver(event, d) {
  const name = d?.properties?.name || 'Pays inconnu';
  tooltip
    .style('visibility', 'visible')
    .text(name);

  d3.select(this).attr('stroke-width', 1.5);
}

function handleMouseMove(event) {
  tooltip
    .style('top', `${event.pageY - 40}px`)
    .style('left', `${event.pageX + 10}px`);
}

function handleMouseOut() {
  tooltip.style('visibility', 'hidden');
  d3.select(this).attr('stroke-width', 0.4);
}

function handleCountryClick(event, d) {
  const name = d?.properties?.name || 'Pays inconnu';
  tooltip
    .style('visibility', 'visible')
    .html(`<strong>${name}</strong><br>Détails à venir...`);
}

// === Menu latéral (filtres crimes) ===
function initMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const filterPanel = document.getElementById('filter-panel');

  if (!menuBtn || !filterPanel) return;

  menuBtn.addEventListener('click', () => {
    filterPanel.classList.toggle('show');
  });

  document.querySelectorAll('input[name="crime"]').forEach(input => {
    input.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      svg.selectAll('g.countries').remove();
      drawMap();
    });
  });
}
