// === Visualisation D3.js : Top 10 des pays les plus corrompus ===

// Vérification de l’exécution du script
console.log("✅ Le script.js est bien exécuté !");

// Dimensions du graphique
const width = 1700;
const height = 900;
const margin = { top: 70, right: 120, bottom: 70, left: 180 };

// Création du SVG
const svg = d3.select("#scene")
  .attr("width", width)
  .attr("height", height);

const colorScale = d3.scaleOrdinal()
  .domain(["Afrique", "Europe", "Asie", "Amérique", "Océanie", "Monde"])
  .range(["#e67e22", "#2980b9", "#27ae60", "#c0392b", "#8e44ad", "#95a5a6"]);

// === Création de l'infobulle ===
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background", "white")
  .style("padding", "6px 10px")
  .style("border-radius", "5px")
  .style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)")
  .style("font-size", "13px")
  .style("color", "#333")
  .style("visibility", "hidden");

// === Variables globales ===
let data = [];
let x, y;
let currentYear = 2013;
let interval = null;
let filteredRegion = "Monde";
let topN = 10;
// === Dictionnaire pays → région ===
const countryToRegion = {
  // 🌍 Afrique
  "Algeria": "Afrique", "Angola": "Afrique", "Benin": "Afrique", "Botswana": "Afrique", "Burkina Faso": "Afrique",
  "Burundi": "Afrique", "Cameroon": "Afrique", "Cape Verde": "Afrique", "Central African Republic": "Afrique",
  "Chad": "Afrique", "Comoros": "Afrique", "Congo": "Afrique", "Democratic Republic of the Congo": "Afrique",
  "Djibouti": "Afrique", "Egypt": "Afrique", "Equatorial Guinea": "Afrique", "Eritrea": "Afrique", "Eswatini": "Afrique",
  "Ethiopia": "Afrique", "Gabon": "Afrique", "Gambia": "Afrique", "Ghana": "Afrique", "Guinea": "Afrique",
  "Guinea-Bissau": "Afrique", "Ivory Coast": "Afrique", "Kenya": "Afrique", "Lesotho": "Afrique", "Liberia": "Afrique",
  "Libya": "Afrique", "Madagascar": "Afrique", "Malawi": "Afrique", "Mali": "Afrique", "Mauritania": "Afrique",
  "Mauritius": "Afrique", "Morocco": "Afrique", "Mozambique": "Afrique", "Namibia": "Afrique", "Niger": "Afrique",
  "Nigeria": "Afrique", "Rwanda": "Afrique", "Sao Tome and Principe": "Afrique", "Senegal": "Afrique",
  "Seychelles": "Afrique", "Sierra Leone": "Afrique", "Somalia": "Afrique", "South Africa": "Afrique",
  "South Sudan": "Afrique", "Sudan": "Afrique", "Tanzania": "Afrique", "Togo": "Afrique", "Tunisia": "Afrique",
  "Uganda": "Afrique", "Zambia": "Afrique", "Zimbabwe": "Afrique",

  // 🇪🇺 Europe
  "Albania": "Europe", "Andorra": "Europe", "Armenia": "Europe", "Austria": "Europe", "Azerbaijan": "Europe",
  "Belarus": "Europe", "Belgium": "Europe", "Bosnia and Herzegovina": "Europe", "Bulgaria": "Europe",
  "Croatia": "Europe", "Cyprus": "Europe", "Czech Republic": "Europe", "Denmark": "Europe", "Estonia": "Europe",
  "Finland": "Europe", "France": "Europe", "Georgia": "Europe", "Germany": "Europe", "Greece": "Europe",
  "Hungary": "Europe", "Iceland": "Europe", "Ireland": "Europe", "Italy": "Europe", "Kazakhstan": "Europe",
  "Kosovo under UNSCR 1244": "Europe", "Latvia": "Europe", "Liechtenstein": "Europe", "Lithuania": "Europe",
  "Luxembourg": "Europe", "Malta": "Europe", "Moldova": "Europe", "Monaco": "Europe", "Montenegro": "Europe",
  "Netherlands": "Europe", "North Macedonia": "Europe", "Norway": "Europe", "Poland": "Europe", "Portugal": "Europe",
  "Romania": "Europe", "Russian Federation": "Europe", "San Marino": "Europe", "Serbia": "Europe", "Slovakia": "Europe",
  "Slovenia": "Europe", "Spain": "Europe", "Sweden": "Europe", "Switzerland": "Europe", "Turkey": "Europe",
  "Ukraine": "Europe", "United Kingdom (England and Wales)": "Europe",

  // 🇦🇸 Asie
  "Afghanistan": "Asie", "Bahrain": "Asie", "Bangladesh": "Asie", "Bhutan": "Asie", "Brunei Darussalam": "Asie",
  "Cambodia": "Asie", "China": "Asie", "India": "Asie", "Indonesia": "Asie", "Iran": "Asie", "Iraq": "Asie",
  "Israel": "Asie", "Japan": "Asie", "Jordan": "Asie", "Kuwait": "Asie", "Kyrgyzstan": "Asie", "Laos": "Asie",
  "Lebanon": "Asie", "Malaysia": "Asie", "Maldives": "Asie", "Mongolia": "Asie", "Myanmar": "Asie",
  "Nepal": "Asie", "North Korea": "Asie", "Oman": "Asie", "Pakistan": "Asie", "Philippines": "Asie",
  "Qatar": "Asie", "Saudi Arabia": "Asie", "Singapore": "Asie", "South Korea": "Asie", "Sri Lanka": "Asie",
  "Syria": "Asie", "Tajikistan": "Asie", "Thailand": "Asie", "Timor-Leste": "Asie", "Turkmenistan": "Asie",
  "United Arab Emirates": "Asie", "Uzbekistan": "Asie", "Vietnam": "Asie", "Yemen": "Asie",

  // 🌎 Amérique
  "Antigua and Barbuda": "Amérique", "Argentina": "Amérique", "Bahamas": "Amérique", "Barbados": "Amérique",
  "Belize": "Amérique", "Bolivia": "Amérique", "Brazil": "Amérique", "Canada": "Amérique", "Chile": "Amérique",
  "Colombia": "Amérique", "Costa Rica": "Amérique", "Cuba": "Amérique", "Dominica": "Amérique",
  "Dominican Republic": "Amérique", "Ecuador": "Amérique", "El Salvador": "Amérique", "Grenada": "Amérique",
  "Guatemala": "Amérique", "Guyana": "Amérique", "Haiti": "Amérique", "Honduras": "Amérique", "Jamaica": "Amérique",
  "Mexico": "Amérique", "Nicaragua": "Amérique", "Panama": "Amérique", "Paraguay": "Amérique", "Peru": "Amérique",
  "Saint Kitts and Nevis": "Amérique", "Saint Lucia": "Amérique", "Saint Vincent and the Grenadines": "Amérique",
  "Suriname": "Amérique", "Trinidad and Tobago": "Amérique", "United States of America": "Amérique", "Uruguay": "Amérique",
  "Venezuela": "Amérique",

  // 🇦🇺 Océanie
  "Australia": "Océanie", "Fiji": "Océanie", "Kiribati": "Océanie", "Marshall Islands": "Océanie", "Micronesia": "Océanie",
  "Nauru": "Océanie", "New Zealand": "Océanie", "Palau": "Océanie", "Papua New Guinea": "Océanie",
  "Samoa": "Océanie", "Solomon Islands": "Océanie", "Tonga": "Océanie", "Tuvalu": "Océanie", "Vanuatu": "Océanie"
};



// === Chargement du fichier JSON ===
d3.json("data_treatment/data/corruption.json").then(json => {
  if (!json || json.length === 0) {
    console.error(" Le fichier corruption.json est vide ou introuvable !");
    return;
  }

  data = json;
  console.log("✅ Données chargées :", data);

// === Vérification automatique des pays non reconnus ===
const knownCountries = Object.keys(countryToRegion);
const unmatched = [];

data.forEach(d => {
  // Normalisation légère pour éviter les erreurs dues aux espaces ou majuscules
  const normalized = d.Country.trim().toLowerCase();
  const match = knownCountries.find(c => c.toLowerCase() === normalized);

  if (!match) {
    unmatched.push(d.Country);
    d.Region = "Monde"; // valeur par défaut temporaire
  } else {
    d.Region = countryToRegion[match];
  }
});

if (unmatched.length > 0) {
  console.warn("⚠️ Pays non reconnus (à corriger) :", unmatched);
} else {
  console.log("✅ Tous les pays sont correctement mappés !");
}
// === Légende horizontale en HTML ===
const legendContainer = d3.select("#legendContainer");

const legendItems = legendContainer.selectAll(".legend-item")
  .data(colorScale.domain())
  .enter()
  .append("div")
  .attr("class", "legend-item");

legendItems.append("div")
  .attr("class", "legend-color")
  .style("background-color", d => colorScale(d));

legendItems.append("span")
  .text(d => d)
  .style("font-size", "14px")
  .style("color", "#333");




  // Conversion des types
  data.forEach(d => {
    d.Value = +d.Value;
    d.Year = +d.Year;
  });
  data.forEach(d => {
    d.Region = countryToRegion[d.Country] || "Monde";
  });

  // Initialisation des échelles
  x = d3.scalePow()
    .exponent(0.5)
    .range([margin.left, width - margin.right]);


  y = d3.scaleBand()
    .range([margin.top, height - margin.bottom])
    .padding(0.2);

  // Premier affichage (année 2013)
  updateChart(currentYear);

  // Ajout des axes initiaux
  svg.append("g").attr("class", "x-axis").attr("transform", `translate(0, ${margin.top})`);
  svg.append("g").attr("class", "y-axis").attr("transform", `translate(${margin.left}, 0)`);



  // === Animation fluide année par année ===
  function nextYear() {
    currentYear++;
    if (currentYear > 2020) currentYear = 2013;

    updateChart(currentYear);
    svg.transition()
      .duration(900)
      .ease(d3.easeLinear);  
  }

  d3.select("#play").on("click", () => {
    if (interval) return;
    interval = d3.interval(() => {
      nextYear();
    }, 1200); // vitesse fluide
  });

  d3.select("#pause").on("click", () => {
    if (interval) {
      interval.stop();
      interval = null;
    }
  });



  // === Filtrage par région ===
  d3.select("#regionFilter").on("change", function() {
    const region = this.value;
    console.log("🌍 Région sélectionnée :", region);

  

  // Si "Monde" → toutes les données
    let filteredData = data;

    if (region !== "Monde") {
    filteredData = data.filter(d => d.Region && d.Region.includes(region));
    }

  // Met à jour le graphique avec les données filtrées
  updateChart(currentYear, filteredData);
});
  // === Filtrage par Top N ===
d3.select("#topN").on("change", function() {
  const topN = +this.value;
  console.log("📊 Top sélectionné :", topN);

  // On garde la région actuelle sélectionnée
  const region = d3.select("#regionFilter").property("value");
  let filteredData = data;

  if (region !== "Monde") {
    filteredData = data.filter(d => d.Region && d.Region.includes(region));
  }

  updateChart(currentYear, filteredData, topN);
});


});

// === Fonction principale de mise à jour ===
function updateChart(year, dataset = data, topNParam = null) {
  if (!dataset || dataset.length === 0) return;

  // 🔹 Récupère automatiquement les valeurs actuelles
  const region = d3.select("#regionFilter").property("value");
  const topN = topNParam || +d3.select("#topN").property("value");

  // 🔹 Filtrage dynamique selon la région
  let filteredData = dataset;
  if (region !== "Monde") {
    filteredData = dataset.filter(d => d.Region === region);
  }

  // 🔹 Données pour l’année courante
  const yearData = filteredData.filter(d => d.Year === year);

  // 🔹 Classement et sélection du Top N
  const topData = yearData.sort((a, b) => b.Value - a.Value).slice(0, Math.min (topN ,20));

  // === Mise à jour des domaines ===
  x.domain([0, d3.max(topData, d => d.Value)]);
  y.domain(topData.map(d => d.Country));

  // === Mise à jour des axes ===
  svg.select(".x-axis")
    .transition().duration(800)
    .call(d3.axisTop(x).ticks(6));

  svg.select(".y-axis")
    .transition().duration(800)
    .call(d3.axisLeft(y));

  svg.selectAll(".x-axis text")
    .style("font-size", "12px")
    .style("fill", "#333");

  svg.selectAll(".y-axis text")
    .style("font-size", "12px")
    .style("fill", "#333");

  
  // === Barres ===
  const bars = svg.selectAll(".bar")
    .data(topData, d => d.Country);

  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", margin.left)
    .attr("y", d => y(d.Country))
    .attr("height", y.bandwidth())
    .attr("width", 0)
    .attr("fill", d => d3.color(colorScale(d.Region)).copy({opacity: 0.9}))

    .on("mouseover", function(event, d) {
      tooltip.style("visibility", "visible")
        .html(`
          <strong>${d.Country}</strong><br>
          Valeur : ${d3.format(",")(d.Value)}<br>
          Région : ${d.Region || "Inconnue"}
        `);

      // 🔹 Utilise la couleur correcte même si d.Region est vide
      const regionColor = d.Region ? colorScale(d.Region) : colorScale("Monde");

      d3.select(this)
        .attr("fill", d3.rgb(regionColor).brighter(0.6)); // effet survol
    })
    .on("mousemove", function(event) {
      tooltip
        .style("top", (event.pageY - 40) + "px")
        .style("left", (event.pageX + 15) + "px");
    })
    .on("mouseout", function(event, d) {
      tooltip.style("visibility", "hidden");

      // 🔹 On remet la couleur d’origine correspondant à la région
    const regionColor = d.Region ? colorScale(d.Region) : colorScale("Monde");

      d3.select(this)
      .attr("fill", regionColor); // couleur normale
    })

    .merge(bars)
    .transition()
    .ease(d3.easeCubicOut)
    .duration(1200)
    .attr("width", d => x(d.Value) - margin.left)
    .attr("y", d => y(d.Country));

  bars.exit()
    .transition().duration(500)
    .attr("width", 0)
    .remove();


  // === Labels ===
  const fontSize = topN <= 10 ? "12px" : topN <= 20 ? "10px" : "8px";

  const labels = svg.selectAll(".label")
    .data(topData, d => d.Country);

  labels.enter()
    .append("text")
    .attr("class", "label")
    .attr("x", margin.left)
    .attr("y", d => y(d.Country) + y.bandwidth() / 2)
    .attr("alignment-baseline", "middle")
    .merge(labels)
    .transition()
    .duration(800)
    .attr("x", d => x(d.Value) + 5)
    .attr("y", d => y(d.Country) + y.bandwidth() / 2)
    .style("font-size", fontSize)
    .text(d => d3.format(".2s")(d.Value));

  labels.exit()
    .transition().duration(500)
    .style("opacity", 0)
    .remove();

  // Appliquer un style clair et lisible aux labels
  svg.selectAll(".label")
    .style("font-family", "IBM Plex Sans, sans-serif")
    .style("font-weight", "500")
    .style("fill", "#222")
    .style("text-shadow", "1px 1px 3px rgba(255,255,255,0.8)");

  // === Titre ===
  svg.selectAll(".title").remove();
  svg.append("text")
    .attr("class", "title")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text(`Top ${topN} des pays les plus corrompus (${region}) en ${year}`);

  // === Année en grand (affichage dynamique) ===
  svg.selectAll(".year-label").remove();
  svg.append("text")
    .attr("class", "year-label")
    .attr("x", width - 200)
    .attr("y", height - 60)
    .attr("text-anchor", "end")
    .style("font-size", "100px")
    .style("fill", "#d0d0d0")
    .style("font-weight", "bold")
    .style("opacity", 0.4)
    .text(year);
}
