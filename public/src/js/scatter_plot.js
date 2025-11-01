// src/js/scatter_plot.js

const width = 800;
const height = 500;
const margin = { top: 40, right: 30, bottom: 50, left: 60 };

const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let currentYear = 2000;
let isLog = false;

// Fonction pour obtenir les données d'une année
function getDataForYear(year) {
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
  
  return combinedData;
}

// Obtenir toutes les années disponibles
// const allYears = [...new Set([
//   ...homicidesData.map(d => d.Year),
//   ...gdpData.map(d => d.Year)
// ])].sort((a, b) => a - b);

// const minYear = d3.min(allYears);
// const maxYear = d3.max(allYears);

const minYear = 2000;
const maxYear = 2023;


function getScales(data) {
  if (isLog) {
    return {
      x: d3.scaleLog()
        .domain([1, d3.max(data, d => d.GDP)])
        .range([margin.left, width - margin.right]),
      y: d3.scaleLog()
        .domain([1, d3.max(data, d => d.Homicides)])
        .range([height - margin.bottom, margin.top])
    };
  } else {
    return {
      x: d3.scaleLinear()
        .domain([0, d3.max(data, d => d.GDP)])
        .range([margin.left, width - margin.right]),
      y: d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Homicides)])
        .range([height - margin.bottom, margin.top])
    };
  }
}

function draw() {
  svg.selectAll("*").remove();

  const data = getDataForYear(currentYear);
  const { x, y } = getScales(data);

  // Axes
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(10, isLog ? ".0s" : null));

  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(10, isLog ? ".0s" : null));

  // Points
  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.GDP))
    .attr("cy", d => y(d.Homicides))
    .attr("r", 5)
    .attr("fill", "#007bff")
    .attr("opacity", 0.8)
    .on("mouseover", function(d) {
      d3.select("#tooltip")
        .style("opacity", 1)
        .html(`<strong>${d.Country}</strong><br>PIB/hab: ${d.GDP.toFixed(1)}<br>Homicides: ${d.Homicides}`)
        .style("left", `${d3.event.pageX + 10}px`)
        .style("top", `${d3.event.pageY - 30}px`);
      
      d3.select(this)
        .attr("r", 8)
        .attr("fill", "#ff6b6b");
    })
    .on("mouseout", function() {
      d3.select("#tooltip").style("opacity", 0);
      d3.select(this)
        .attr("r", 5)
        .attr("fill", "#007bff");
    });

  // Labels des axes
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

  // Titre avec l'année
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 25)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text(`Année : ${currentYear}`);
}

draw();

// Toggle échelle logarithmique
document.getElementById("toggleScale").addEventListener("change", (e) => {
  isLog = e.target.checked;
  draw();
});

// Curseur d'années
const yearSlider = document.getElementById("yearSlider");
const yearDisplay = document.getElementById("yearDisplay");

yearSlider.min = minYear;
yearSlider.max = maxYear;
yearSlider.value = currentYear;
yearDisplay.textContent = currentYear;

yearSlider.addEventListener("input", (e) => {
  currentYear = +e.target.value;
  yearDisplay.textContent = currentYear;
  draw();
});


// const xScale = d3.scaleLinear()
//   .domain([0, d3.max(combinedData, d => d.GDP) * 0.2])
//   .range([margin.left, width - margin.right]);

// const yScale = d3.scaleLinear()
//   .domain([0, d3.max(combinedData, d => d.Homicides) * 0.2])
//   .range([height - margin.bottom, margin.top]);

// svg.append("g")
//   .attr("transform", `translate(0,${height - margin.bottom})`)
//   .call(d3.axisBottom(xScale));

// svg.append("g")
//   .attr("transform", `translate(${margin.left},0)`)
//   .call(d3.axisLeft(yScale));

// svg.selectAll("circle")
//   .data(combinedData)
//   .enter()
//   .append("circle")
//   .attr("cx", d => xScale(d.GDP))
//   .attr("cy", d => yScale(d.Homicides))
//   .attr("r", 5)
//   .attr("fill", "#007bff")
//   .attr("opacity", 0.8)
//   .on("mouseover", (event, d) => {
//     d3.select("#tooltip")
//       .style("opacity", 1)
//       .html(`<strong>${d.Country}</strong><br>PIB/hab: ${d.GDP.toFixed(1)}<br>Homicides: ${d.Homicides}`)
//       .style("left", `${event.pageX + 10}px`)
//       .style("top", `${event.pageY - 30}px`);
//   })
//   .on("mouseout", () => {
//     d3.select("#tooltip").style("opacity", 0);
//   });

// svg.append("text")
//   .attr("x", width / 2)
//   .attr("y", height - 10)
//   .attr("text-anchor", "middle")
//   .text("PIB par habitant");

// svg.append("text")
//   .attr("transform", "rotate(-90)")
//   .attr("x", -height / 2)
//   .attr("y", 15)
//   .attr("text-anchor", "middle")
//   .text("Nombre d'homicides");
