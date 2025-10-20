// src/js/scatter_plot.js

const width = 800;
const height = 500;
const margin = { top: 40, right: 30, bottom: 50, left: 60 };

const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const year = 2000;

const homicidesByCountry = new Map(
  homicidesData.filter(d => d.Year === year).map(d => [d.Country, d.Value])
);

const gdpByCountry = new Map(
  gdpData.filter(d => d.Year === year).map(d => [d.Country, d.Value])
);

const combinedData = [];
for (const [country, gdp] of gdpByCountry.entries()) {
  const homicides = homicidesByCountry.get(country);
  if (gdp != null && homicides != null) {
    combinedData.push({ Country: country, GDP: +gdp, Homicides: +homicides });
  }
}

const xScale = d3.scaleLinear()
  .domain([0, d3.max(combinedData, d => d.GDP) * 1.1])
  .range([margin.left, width - margin.right]);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(combinedData, d => d.Homicides) * 1.1])
  .range([height - margin.bottom, margin.top]);

svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(xScale));

svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yScale));

svg.selectAll("circle")
  .data(combinedData)
  .enter()
  .append("circle")
  .attr("cx", d => xScale(d.GDP))
  .attr("cy", d => yScale(d.Homicides))
  .attr("r", 5)
  .attr("fill", "#007bff")
  .attr("opacity", 0.8)
  .on("mouseover", (event, d) => {
    d3.select("#tooltip")
      .style("opacity", 1)
      .html(`<strong>${d.Country}</strong><br>PIB/hab: ${d.GDP.toFixed(1)}<br>Homicides: ${d.Homicides}`)
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 30}px`);
  })
  .on("mouseout", () => {
    d3.select("#tooltip").style("opacity", 0);
  });

svg.append("text")
  .attr("x", width / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .text("PIB par habitant");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -height / 2)
  .attr("y", 15)
  .attr("text-anchor", "middle")
  .text("Nombre d'homicides");
