// src/js/scatter_plot.js

// === Configuration ===
const width = 900;
const height = 600;
const margin = { top: 40, right: 30, bottom: 50, left: 60 };
const minYear = 2000;
const maxYear = 2023;
const TRANSITION_DURATION = 600;

// === Initialisation SVG ===
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// === Variables d'état ===
let currentYear = 2000;
let isLog = false;
let tooltipElement = null;
let autoPlayInterval = null;
let isPlaying = false;

// === Fonctions utilitaires ===

function getScales(data) {
  if (isLog) {
    const validData = data.filter(d => d.X > 0 && d.Y > 0);
    return {
      x: d3.scaleLog()
        .domain([d3.min(validData, d => d.X) || 1, d3.max(validData, d => d.X) || 100])
        .range([margin.left, width - margin.right]),
      y: d3.scaleLog()
        .domain([d3.min(validData, d => d.Y) || 1, d3.max(validData, d => d.Y) || 100])
        .range([height - margin.bottom, margin.top])
    };
  } else {
    return {
      x: d3.scaleLinear()
        .domain([0, d3.max(data, d => d.X) || 0])
        .range([margin.left, width - margin.right]),
      y: d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Y) || 0])
        .range([height - margin.bottom, margin.top])
    };
  }
}

function handleMouseOver(d) {
  if (!tooltipElement) {
    tooltipElement = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "fixed")
      .style("background", "rgba(0, 0, 0, 0.9)")
      .style("color", "white")
      .style("padding", "12px")
      .style("border-radius", "6px")
      .style("font-size", "14px")
      .style("z-index", "999999")
      .style("pointer-events", "none")
      .style("white-space", "nowrap")
      .style("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.5)");
  }
  
  tooltipElement
    .html(`<strong>${d.Country}</strong><br>${getLabel('x')}: ${d.X.toFixed(1)}<br>${getLabel('y')}: ${d.Y.toFixed(1)}`)
    .style("left", (d3.event.pageX + 15) + "px")
    .style("top", (d3.event.pageY + 15) + "px")
    .style("display", "block")
    .style("opacity", "1");
  
  d3.select(this).classed("hovered", true);
}

function handleMouseOut() {
  if (tooltipElement) {
    tooltipElement.style("display", "none").style("opacity", "0");
  }
  d3.select(this).classed("hovered", false);
}

function drawAxes(x, y, isFirstDraw = false) {
  const duration = isFirstDraw ? 0 : TRANSITION_DURATION;
  
  const xAxis = svg.select(".x-axis");
  if (xAxis.empty()) {
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10, isLog ? ".0s" : null));
  } else {
    xAxis.transition().duration(duration)
      .call(d3.axisBottom(x).ticks(10, isLog ? ".0s" : null));
  }

  const yAxis = svg.select(".y-axis");
  if (yAxis.empty()) {
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(10, isLog ? ".0s" : null));
  } else {
    yAxis.transition().duration(duration)
      .call(d3.axisLeft(y).ticks(10, isLog ? ".0s" : null));
  }
}

function drawAxisLabels() {
  let xLabel = svg.select(".x-label");
  if (xLabel.empty()) {
    xLabel = svg.append("text")
      .attr("class", "axis-label x-label")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle");
  }
  xLabel.text(getLabel('x'));

  let yLabel = svg.select(".y-label");
  if (yLabel.empty()) {
    yLabel = svg.append("text")
      .attr("class", "axis-label y-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle");
  }
  yLabel.text(getLabel('y'));
}

function updateTitle() {
  let title = svg.select(".chart-title");
  if (title.empty()) {
    title = svg.append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", 25)
      .attr("text-anchor", "middle");
  }
  title.text(`Année : ${currentYear}`);
}

function updateDataPoints(data, x, y) {
  const t = d3.transition().duration(TRANSITION_DURATION);
  
  const circles = svg.selectAll("circle.data-point")
    .data(data, d => d.Country);
  
  circles.exit().transition(t).attr("r", 0).style("opacity", 0).remove();
  
  const enterCircles = circles.enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", d => x(d.X))
    .attr("cy", d => y(d.Y))
    .attr("r", 0)
    .style("opacity", 0);
  
  enterCircles.merge(circles)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .transition(t)
    .attr("cx", d => x(d.X))
    .attr("cy", d => y(d.Y))
    .attr("r", 5)
    .style("opacity", 1);
}

function draw(isFirstDraw = false) {
  const data = getDataForYear(currentYear);
  const { x, y } = getScales(data);

  drawAxes(x, y, isFirstDraw);
  updateDataPoints(data, x, y);
  drawAxisLabels();
  updateTitle();
}

function toggleAutoPlay() {
  if (isPlaying) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    isPlaying = false;
  } else {
    isPlaying = true;
    autoPlayInterval = setInterval(() => {
      currentYear = currentYear >= maxYear ? minYear : currentYear + 1;
      yearSlider.value = currentYear;
      yearDisplay.textContent = currentYear;
      draw(false);
    }, 800);
  }
  document.getElementById("playBtn").textContent = isPlaying ? "⏸ Pause" : "▶ Play";
}

function initializeDropdowns() {
  const xSelect = d3.select("#xSelect");
  const ySelect = d3.select("#ySelect");
  
  xSelect.selectAll("option")
    .data(variables.x)
    .enter()
    .append("option")
    .attr("value", d => d.id)
    .text(d => d.label)
    .property("selected", d => d.id === selectedX);
  
  ySelect.selectAll("option")
    .data(variables.y)
    .enter()
    .append("option")
    .attr("value", d => d.id)
    .text(d => d.label)
    .property("selected", d => d.id === selectedY);
  
  xSelect.on("change", function() {
    selectedX = this.value;
    draw(false);
  });
  
  ySelect.on("change", function() {
    selectedY = this.value;
    draw(false);
  });
}

// === Initialisation ===
console.log("Initialisation");
console.log("Datasets disponibles:", Object.keys(datasets));

initializeDropdowns();
draw(true);

// Event listeners
document.getElementById("toggleScale").addEventListener("change", (e) => {
  isLog = e.target.checked;
  draw(false);
});

const yearSlider = document.getElementById("yearSlider");
const yearDisplay = document.getElementById("yearDisplay");
yearSlider.min = minYear;
yearSlider.max = maxYear;
yearSlider.value = currentYear;
yearDisplay.textContent = currentYear;

yearSlider.addEventListener("input", (e) => {
  currentYear = +e.target.value;
  yearDisplay.textContent = currentYear;
  draw(false);
});

document.getElementById("playBtn").addEventListener("click", toggleAutoPlay);

console.log("Ok!");
