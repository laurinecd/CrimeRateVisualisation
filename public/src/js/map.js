const container = d3.select('#map');
const svg = container.append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .style('display', 'block');

let projection = d3.geoNaturalEarth1();
let path = d3.geoPath().projection(projection);

let worldData = null;

function resize() {
  const rect = container.node().getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  projection = d3.geoNaturalEarth1().fitSize([width, height], worldData || { type: 'FeatureCollection', features: [] });
  path = d3.geoPath().projection(projection);
  svg.selectAll('path').attr('d', path);
}

d3.json('data_treatment/data/world_map.geojson').then(world => {
  worldData = world;

  svg.append('g')
    .attr('class', 'countries')
    .selectAll('path')
    .data(world.features)
    .join('path')
    .attr('d', path)
    .attr('fill', '#ccc')
    .attr('stroke', '#333')
    .attr('stroke-width', 0.5);

  resize();

  window.addEventListener('resize', resize);

  console.log('Carte affichée avec succès !');
}).catch(err => {
  console.error('Erreur en chargeant world_map.geojson:', err);
});
