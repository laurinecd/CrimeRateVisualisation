// src/js/scatter_plot.js

// === Configuration ===
const width = 800;
const height = 500;
const margin = { top: 40, right: 30, bottom: 50, left: 60 };
const minYear = 2000;
const maxYear = 2023;
const TRANSITION_DURATION = 600; // Durée de l'animation en ms

// === Initialisation SVG ===
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// === Variables d'état ===
let currentYear = 2000;
let isLog = false;
let tooltipElement = null; // Cache pour le tooltip
let autoPlayInterval = null;
let isPlaying = false;

// === Fonctions utilitaires ===

/**
 * Récupère et filtre les données pour une année donnée
 */
function getDataForYear(year) {
  // Vérifie que les données existent
  if (!homicidesData || !gdpData) {
    console.error("Données manquantes!");
    return [];
  }
  
  const homicidesByCountry = new Map(
    homicidesData
      .filter(d => d.Year === year && d.Value != null && !isNaN(d.Value))
      .map(d => [d.Country, d.Value])
  );

  const gdpByCountry = new Map(
    gdpData
      .filter(d => d.Year === year && d.Value != null && !isNaN(d.Value))
      .map(d => [d.Country, d.Value])
  );

  const combinedData = [];
  for (const [country, gdp] of gdpByCountry.entries()) {
    const homicides = homicidesByCountry.get(country);
    if (gdp != null && homicides != null && gdp > 0 && homicides >= 0) {
      combinedData.push({ 
        Country: country, 
        GDP: +gdp, 
        Homicides: +homicides 
      });
    }
  }
  
  return combinedData;
}

/**
 * Crée les échelles X et Y selon le mode (linéaire ou logarithmique)
 */
function getScales(data) {
  if (isLog) {
    const validData = data.filter(d => d.GDP > 0 && d.Homicides > 0);
    return {
      x: d3.scaleLog()
        .domain([d3.min(validData, d => d.GDP) || 1, d3.max(validData, d => d.GDP) || 100])
        .range([margin.left, width - margin.right]),
      y: d3.scaleLog()
        .domain([d3.min(validData, d => d.Homicides) || 1, d3.max(validData, d => d.Homicides) || 100])
        .range([height - margin.bottom, margin.top])
    };
  } else {
    return {
      x: d3.scaleLinear()
        .domain([0, d3.max(data, d => d.GDP) || 0])
        .range([margin.left, width - margin.right]),
      y: d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Homicides) || 0])
        .range([height - margin.bottom, margin.top])
    };
  }
}

/**
 * Gère l'événement mouseover sur un point
 */
function handleMouseOver(d) {
  // Crée le tooltip une seule fois et le réutilise
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
  
  // Mise à jour uniquement du contenu et de la position
  tooltipElement
    .html(`<strong>${d.Country}</strong><br>PIB/hab: ${d.GDP.toFixed(1)}<br>Homicides: ${d.Homicides}`)
    .style("left", (d3.event.pageX + 15) + "px")
    .style("top", (d3.event.pageY + 15) + "px")
    .style("display", "block")
    .style("opacity", "1");
  
  d3.select(this).classed("hovered", true);
}

/**
 * Gère l'événement mouseout sur un point
 */
function handleMouseOut() {
  if (tooltipElement) {
    tooltipElement
      .style("display", "none")
      .style("opacity", "0");
  }
  
  d3.select(this).classed("hovered", false);
}

/**
 * Dessine ou met à jour les axes X et Y
 */
function drawAxes(x, y, isFirstDraw = false) {
  const duration = isFirstDraw ? 0 : TRANSITION_DURATION;
  
  // Axe X
  const xAxis = svg.select(".x-axis");
  if (xAxis.empty()) {
    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10, isLog ? ".0s" : null));
  } else {
    xAxis.transition()
      .duration(duration)
      .call(d3.axisBottom(x).ticks(10, isLog ? ".0s" : null));
  }

  // Axe Y
  const yAxis = svg.select(".y-axis");
  if (yAxis.empty()) {
    svg.append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(10, isLog ? ".0s" : null));
  } else {
    yAxis.transition()
      .duration(duration)
      .call(d3.axisLeft(y).ticks(10, isLog ? ".0s" : null));
  }
}

/**
 * Dessine les labels des axes (une seule fois)
 */
function drawAxisLabels() {
  if (svg.select(".x-label").empty()) {
    svg.append("text")
      .attr("class", "axis-label x-label")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .text("PIB par habitant");
  }

  if (svg.select(".y-label").empty()) {
    svg.append("text")
      .attr("class", "axis-label y-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .text("Nombre d'homicides");
  }
}

/**
 * Met à jour le titre avec l'année courante
 */
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

/**
 * Dessine/met à jour les points de données avec animations
 * PATTERN ENTER/UPDATE/EXIT pour des transitions fluides
 */
function updateDataPoints(data, x, y) {
  const t = d3.transition().duration(TRANSITION_DURATION);
  
  const circles = svg.selectAll("circle.data-point")
    .data(data, d => d.Country);
  
  // EXIT: pays qui disparaissent
  circles.exit()
    .transition(t)
    .attr("r", 0)
    .style("opacity", 0)
    .remove();
  
  // ENTER: nouveaux pays qui apparaissent
  const enterCircles = circles.enter()
    .append("circle")
    .attr("class", "data-point")
    .attr("cx", d => x(d.GDP))
    .attr("cy", d => y(d.Homicides))
    .attr("r", 0)
    .style("opacity", 0);
  
  // MERGE: Fusionne enter + update, puis applique les événements ET la transition
  enterCircles.merge(circles)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut)
    .transition(t)
    .attr("cx", d => x(d.GDP))
    .attr("cy", d => y(d.Homicides))
    .attr("r", 5)
    .style("opacity", 1);
}

/**
 * Fonction principale de rendu
 */
function draw(isFirstDraw = false) {
  const data = getDataForYear(currentYear);
  const { x, y } = getScales(data);

  drawAxes(x, y, isFirstDraw);
  updateDataPoints(data, x, y);
  
  if (isFirstDraw) {
    drawAxisLabels();
  }
  
  updateTitle();
}

/**
 * Toggle l'animation automatique des années
 */
function toggleAutoPlay() {
  if (isPlaying) {
    // Arrête l'animation
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
    isPlaying = false;
  } else {
    // Démarre l'animation
    isPlaying = true;
    autoPlayInterval = setInterval(() => {
      if (currentYear >= maxYear) {
        currentYear = minYear;
      } else {
        currentYear++;
      }
      yearSlider.value = currentYear;
      yearDisplay.textContent = currentYear;
      draw(false);
    }, 800);
  }
  
  // Met à jour le texte du bouton
  const playBtn = document.getElementById("playBtn");
  if (playBtn) {
    playBtn.textContent = isPlaying ? "⏸ Pause" : "▶ Play";
  }
}

// === Initialisation ===
draw(true);

// === Gestionnaires d'événements ===

// Toggle échelle logarithmique
document.getElementById("toggleScale").addEventListener("change", (e) => {
  isLog = e.target.checked;
  draw(false);
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
  draw(false);
});
