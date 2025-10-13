const width = 1000;
const height = 600;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

const projection = d3.geoNaturalEarth1()
  .scale(170)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

Promise.all([
  d3.json("../../data/world_map.geojson"),
  d3.csv("crime_index.csv")
]).then(([world, crimeData]) => {
  
  const crimeByCountry = new Map(
    crimeData.map(d => [d.Country, +d["Crime Index"]])
  );

  const colorScale = d3.scaleSequential()
    .domain([0, d3.max(crimeData, d => +d["Crime Index"])])
    .interpolator(d3.interpolateReds);

  svg.append("g")
    .selectAll("path")
    .data(world.features)
    .join("path")
    .attr("d", path)
    .attr("fill", d => {
      const country = d.properties.name;
      const value = crimeByCountry.get(country);
      return value ? colorScale(value) : "#e0e0e0";
    })
    .attr("stroke", "#333")
    .attr("stroke-width", 0.5)
    .on("mouseover", (event, d) => {
      const country = d.properties.name;
      const value = crimeByCountry.get(country);
      tooltip.style("visibility", "visible")
             .html(`<b>${country}</b><br>Crime Index: ${value ?? "No data"}`);
      d3.select(event.currentTarget).attr("stroke-width", 1.5);
    })
    .on("mousemove", event => {
      tooltip.style("top", (event.pageY - 30) + "px")
             .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", event => {
      tooltip.style("visibility", "hidden");
      d3.select(event.currentTarget).attr("stroke-width", 0.5);
    })
    .on("click", (event, d) => {
      const country = d.properties.name;
      const value = crimeByCountry.get(country);
      alert(`Pays : ${country}\nCrime Index : ${value ?? "No data"}`);
    });

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .on("zoom", (event) => {
      svg.selectAll("path").attr("transform", event.transform);
    });

  svg.call(zoom);
});
