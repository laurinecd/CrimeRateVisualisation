const DATA_FILES = [
  { key: 'world', path: 'data_treatment/data/world_map.geojson', loader: 'json' },
  { key: 'population', path: 'data_treatment/data/countries.csv', loader: 'csv' },
  { key: 'sexual', path: 'data_treatment/data/sexual.json', loader: 'json' },
  { key: 'corruption', path: 'data_treatment/data/corruption.json', loader: 'json' },
  { key: 'homicide', path: 'data_treatment/data/homicide.json', loader: 'json' },
  { key: 'births_per_woman', path: 'data_treatment/global-data/birth-per-women.json', loader: 'json' },
  { key: 'death_rate', path: 'data_treatment/global-data/death-rate.json', loader: 'json' },
  { key: 'employment_adults', path: 'data_treatment/global-data/employment-adults-rate.json', loader: 'json' },
  { key: 'unemployment_male', path: 'data_treatment/global-data/unemployment-male.json', loader: 'json' },
  { key: 'expense_gdp', path: 'data_treatment/global-data/expense-%25- gdp.json', loader: 'json' },
  { key: 'literacy_adults', path: 'data_treatment/global-data/literacy-adults-rate.json', loader: 'json' },
  { key: 'political_stability', path: 'data_treatment/global-data/political-stability-terrorism-violence.json', loader: 'json' },
  { key: 'poverty_gap', path: 'data_treatment/global-data/poverty-gap.json', loader: 'json' },
  { key: 'tourism_arrivals', path: 'data_treatment/global-data/tourism-arrivals.json', loader: 'json' },
  { key: 'gdp_per_capita', path: 'data_treatment/global-data/gdp-per-capita-usd.json', loader: 'json' }
];

const INDICATOR_GROUPS = [
  { id: 'crime', label: 'Criminalite' },
  { id: 'demography', label: 'Demographie' },
  { id: 'economy', label: 'Economie' },
  { id: 'society', label: 'Societe & Education' },
  { id: 'governance', label: 'Gouvernance' },
  { id: 'mobility', label: 'Mobilite & Tourisme' }
];

const INDICATORS = [
  {
    id: 'crime_average',
    label: 'Criminalite moyenne',
    group: 'crime',
    datasetKeys: ['sexual', 'corruption', 'homicide'],
    description: 'Moyenne des crimes sexuels, de corruption et des homicides declares.',
    digits: 2,
    unit: 'pour 100 000 hab.'
  },
  {
    id: 'sexual',
    label: 'Crimes sexuels',
    group: 'crime',
    datasetKeys: ['sexual'],
    description: 'Nombre de crimes sexuels signales (toutes annees).',
    digits: 2,
    unit: 'pour 100 000 hab.'
  },
  {
    id: 'corruption',
    label: 'Corruption',
    group: 'crime',
    datasetKeys: ['corruption'],
    description: 'Infractions liees a la corruption.',
    digits: 2,
    unit: 'pour 100 000 hab.'
  },
  {
    id: 'homicide',
    label: 'Homicides',
    group: 'crime',
    datasetKeys: ['homicide'],
    description: 'Nombre d\'homicides enregistres.',
    digits: 2,
    unit: 'pour 100 000 hab.'
  },
  {
    id: 'births_per_woman',
    label: 'Naissances par femme',
    group: 'demography',
    datasetKeys: ['births_per_woman'],
    description: 'Nombre moyen d\'enfants par femme.',
    digits: 2
  },
  {
    id: 'death_rate',
    label: 'Taux de mortalite',
    group: 'demography',
    datasetKeys: ['death_rate'],
    description: 'Deces pour 1 000 habitants.',
    digits: 2
  },
  {
    id: 'employment_adults',
    label: 'Taux d\'emploi (adultes)',
    group: 'economy',
    datasetKeys: ['employment_adults'],
    description: 'Part des adultes disposant d\'un emploi.',
    digits: 1,
    unit: '%'
  },
  {
    id: 'unemployment_male',
    label: 'Chomage (hommes)',
    group: 'economy',
    datasetKeys: ['unemployment_male'],
    description: 'Pourcentage d\'hommes au chomage.',
    digits: 1,
    unit: '%'
  },
  {
    id: 'expense_gdp',
    label: 'Depenses publiques (% PIB)',
    group: 'economy',
    datasetKeys: ['expense_gdp'],
    description: 'Depenses publiques en pourcentage du PIB.',
    digits: 1,
    unit: '%'
  },
  {
    id: 'poverty_gap',
    label: 'Profondeur de la pauvrete',
    group: 'economy',
    datasetKeys: ['poverty_gap'],
    description: 'Distance moyenne par rapport au seuil de pauvrete.',
    digits: 1,
    unit: '%'
  },
  {
    id: 'gdp_per_capita',
    label: 'PIB par habitant (USD)',
    group: 'economy',
    datasetKeys: ['gdp_per_capita'],
    description: 'PIB par habitant en dollars courants.',
    digits: 0,
    unit: 'USD'
  },
  {
    id: 'literacy_adults',
    label: 'Alphabetisation adultes',
    group: 'society',
    datasetKeys: ['literacy_adults'],
    description: 'Part des adultes sachant lire et ecrire.',
    digits: 1,
    unit: '%'
  },
  {
    id: 'political_stability',
    label: 'Stabilite politique',
    group: 'governance',
    datasetKeys: ['political_stability'],
    description: 'Indice de stabilite politique et absence de violence.',
    digits: 2
  },
  {
    id: 'tourism_arrivals',
    label: 'Arrivees touristiques',
    group: 'mobility',
    datasetKeys: ['tourism_arrivals'],
    description: 'Nombre moyen d\'arrivees internationales.',
    digits: 2,
    unit: 'pour 1 000 hab.'
  }
];

const DEFAULT_INDICATOR_ID = 'crime_average';
const MISSING_COLOR = '#f4d7d7';

const WORD_REPLACEMENTS = new Map([
  ['dem', 'democratic'],
  ['rep', 'republic'],
  ['st', 'saint'],
  ['ste', 'sainte'],
  ['uae', 'united arab emirates'],
  ['pdr', 'people s democratic republic'],
  ['fed', 'federal'],
  ['sts', 'states']
]);

const RAW_NAME_ALIASES = [
  ['Bahamas, The', 'Bahamas'],
  ['Bolivia (Plurinational State of)', 'Bolivia'],
  ['Cape Verde', 'Cabo Verde'],
  ['Congo, Dem. Rep.', 'Democratic Republic of the Congo'],
  ['Democratic Republic of Congo', 'Democratic Republic of the Congo'],
  ['Congo (Kinshasa)', 'Democratic Republic of the Congo'],
  ['Congo, Rep.', 'Republic of the Congo'],
  ['Congo (Brazzaville)', 'Republic of the Congo'],
  ['Czech Republic', 'Czechia'],
  ['Ivory Coast', 'Cote d Ivoire'],
  ['Cote d\'Ivoire', 'Cote d Ivoire'],
  ['Korea, Republic of', 'South Korea'],
  ['Republic of Korea', 'South Korea'],
  ['Korea, Dem. People\'s Rep.', 'North Korea'],
  ['Korea, Democratic People\'s Republic of', 'North Korea'],
  ['Lao PDR', 'Laos'],
  ['Lao People\'s Democratic Republic', 'Laos'],
  ['Hong Kong SAR, China', 'Hong Kong'],
  ['Macao SAR, China', 'Macao'],
  ['Macau', 'Macao'],
  ['Micronesia, Fed. Sts.', 'Federated States of Micronesia'],
  ['Moldova, Republic of', 'Moldova'],
  ['Iran, Islamic Rep.', 'Iran'],
  ['Syrian Arab Republic', 'Syria'],
  ['Tanzania, United Republic of', 'Tanzania'],
  ['United States', 'United States of America'],
  ['USA', 'United States of America'],
  ['U.S.A.', 'United States of America'],
  ['United Kingdom of Great Britain and Northern Ireland', 'United Kingdom'],
  ['Venezuela, RB', 'Venezuela'],
  ['Venezuela (Bolivarian Republic of)', 'Venezuela'],
  ['Viet Nam', 'Vietnam'],
  ['Yemen, Rep.', 'Yemen'],
  ['Timor-Leste', 'East Timor'],
  ['Gambia, The', 'Gambia'],
  ['West Bank and Gaza', 'Palestine'],
  ['Kyrgyz Republic', 'Kyrgyzstan'],
  ['Slovak Republic', 'Slovakia'],
  ['Brunei Darussalam', 'Brunei'],
  ['Egypt, Arab Rep.', 'Egypt'],
  ['Russian Federation', 'Russia'],
  ['Gambia', 'Gambia'],
  ['UAE', 'United Arab Emirates'],
  ['Turkiye', 'Turkey'],
  ['China Hong Kong Special Administrative Region', 'Hong Kong'],
  ['Saint Vincent Grenadines', 'Saint Vincent and the Grenadines'],
  ['St. Vincent and the Grenadines', 'Saint Vincent and the Grenadines'],
  ['Sao Tome Principe', 'Sao Tome and Principe'],
  ['Micronesia Federal States', 'Federated States of Micronesia'],
  ['State Palestine', 'Palestine'],
  ['Macao SAR China', 'Macao'],
  ['Cabo Verde', 'Cabo Verde'],
  ['Curacao', 'Curacao'],
  ['Antigua Barbuda', 'Antigua and Barbuda'],
  ['American Samoa', 'American Samoa'],
  ['Bahrain', 'Bahrain'],
  ['Comoros', 'Comoros'],
  ['Kiribati', 'Kiribati'],
  ['Marshall Islands', 'Marshall Islands'],
  ['Maldives', 'Maldives'],
  ['Mauritius', 'Mauritius'],
  ['Malta', 'Malta'],
  ['Andorra', 'Andorra'],
  ['Liechtenstein', 'Liechtenstein'],
  ['Aruba', 'Aruba'],
  ['Bermuda', 'Bermuda'],
  ['Grenada', 'Grenada'],
  ['Saint Lucia', 'Saint Lucia'],
  ['British Virgin Islands', 'British Virgin Islands'],
  ['Cayman Islands', 'Cayman Islands'],
  ['Guam', 'Guam'],
  ['Channel Islands', 'Channel Islands']
];

const NAME_ALIASES = new Map(
  RAW_NAME_ALIASES
    .map(([alias, target]) => [normalizeName(alias), target])
    .filter(([alias]) => Boolean(alias))
);

const DATASET_CONFIG = {
  sexual: { normalization: 'perPopulation', per: 100000 },
  corruption: { normalization: 'perPopulation', per: 100000 },
  tourism_arrivals: { normalization: 'perPopulation', per: 1000 }
};

const indicatorIndex = new Map();
INDICATORS.forEach(ind => indicatorIndex.set(ind.id, ind));

const container = d3.select('#map');
const svg = container.append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('preserveAspectRatio', 'xMidYMid meet')
  .style('display', 'block');

const tooltip = d3.select('#tooltip');
const popup = container.append('div')
  .attr('id', 'country-popup')
  .attr('class', 'country-popup')
  .style('visibility', 'hidden')
  .attr('aria-hidden', 'true');

const legend = d3.select('#legend');
const legendTitle = d3.select('#legend-title');
const legendMin = d3.select('#legend-min');
const legendMax = d3.select('#legend-max');
const legendCaption = d3.select('#legend-caption');
const legendToggleBtn = d3.select('#legend-toggle');
const legendBody = d3.select('#legend-body');

let projection = d3.geoNaturalEarth1();
let path = d3.geoPath().projection(projection);

let worldData = null;
let countriesGroup = null;
let zoomBehavior = null;
let zoomTransform = d3.zoomIdentity;

const rawDatasets = {};
let datasetAverages = {};
let indicatorValueMaps = new Map();
let continentAggregates = new Map();
let countryLookup = new Map();
let countryNameIndex = new Map();
let countryProfiles = new Map();
let colorScale = null;
let activePopup = null;
let activeIndicatorId = DEFAULT_INDICATOR_ID;
let populationByCountry = new Map();
let worldPopulationEstimates = new Map();
const warnedCountries = new Set();
let currentColorDomain = { min: 0, max: 1, rawMin: 0, rawMax: 1, truncated: false };

const dataPromises = DATA_FILES.map(file => {
  if (file.loader === 'csv') {
    return d3.csv(file.path);
  }
  return d3.json(file.path);
});

Promise.all(dataPromises)
  .then(responses => {
    responses.forEach((data, index) => {
      rawDatasets[DATA_FILES[index].key] = data;
    });

    worldData = rawDatasets.world;
    prepareWorldData();
    preparePopulationData(rawDatasets.population);
    prepareDatasets();
    prepareIndicatorStore();
    drawMap();

    window.addEventListener('resize', resize);
    initMenu();
    initPopupCloser();
    initLegendToggle();
  })
  .catch(err => console.error('Erreur chargement donnees:', err));

function prepareWorldData() {
  if (!worldData || !Array.isArray(worldData.features)) {
    console.error('  donnees GeoJSON sont invalides.');
    return;
  }

  worldData.features.forEach(feature => {
    const props = feature.properties || {};
    props.normalizedName = normalizeName(props.name || props.admin || '');
    feature.properties = props;
  });

  buildCountryLookup(worldData.features);
}

function prepareDatasets() {
  datasetAverages = {};
  Object.keys(rawDatasets).forEach(key => {
    if (key === 'world' || key === 'population') {
      return;
    }
    datasetAverages[key] = aggregateDataset(rawDatasets[key], key);
  });
}

function prepareIndicatorStore() {
  indicatorValueMaps = new Map();
  continentAggregates = new Map();
  countryProfiles.forEach(profile => {
    profile.indicators = {};
  });

  INDICATORS.forEach(indicator => {
    const indicatorMap = buildIndicatorMap(indicator);
    indicatorValueMaps.set(indicator.id, indicatorMap);

    indicatorMap.forEach((value, countryKey) => {
      if (!Number.isFinite(value)) {
        return;
      }
      const profile = ensureProfile(countryKey);
      profile.indicators[indicator.id] = value;
    });

    continentAggregates.set(indicator.id, buildContinentAggregates(indicatorMap));
  });

  updateColorScale();
}

function buildIndicatorMap(indicator) {
  if (!indicator || !Array.isArray(indicator.datasetKeys)) {
    return new Map();
  }

  if (indicator.datasetKeys.length === 1) {
    return new Map(datasetAverages[indicator.datasetKeys[0]] || []);
  }

  const temp = new Map();
  indicator.datasetKeys.forEach(key => {
    const dataset = datasetAverages[key];
    if (!dataset) {
      return;
    }
    dataset.forEach((value, countryKey) => {
      if (!Number.isFinite(value)) {
        return;
      }
      const ref = temp.get(countryKey) || { total: 0, count: 0 };
      ref.total += value;
      ref.count += 1;
      temp.set(countryKey, ref);
    });
  });

  const combined = new Map();
  temp.forEach((entry, countryKey) => {
    if (!entry.count) {
      return;
    }
    combined.set(countryKey, entry.total / entry.count);
  });

  return combined;
}

function buildContinentAggregates(indicatorMap) {
  const aggregates = new Map();

  indicatorMap.forEach((value, countryKey) => {
    if (!Number.isFinite(value)) {
      return;
    }
    const lookup = countryLookup.get(countryKey);
    const continent = lookup ? lookup.continent : 'Autre';
    const bucket = aggregates.get(continent) || { total: 0, count: 0 };
    bucket.total += value;
    bucket.count += 1;
    aggregates.set(continent, bucket);
  });

  aggregates.forEach(bucket => {
    bucket.value = bucket.count ? bucket.total / bucket.count : null;
  });

  return aggregates;
}

function drawMap() {
  if (!worldData || !Array.isArray(worldData.features)) {
    return;
  }

  resize();

  countriesGroup = svg.select('g.countries');
  if (countriesGroup.empty()) {
    countriesGroup = svg.append('g').attr('class', 'countries');
  }

  countriesGroup
    .selectAll('path.country')
    .data(worldData.features, d => d.properties.normalizedName)
    .join('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', getCountryFill)
    .attr('stroke', '#2d2d2d')
    .attr('stroke-width', 0.4)
    .on('mouseover', handleMouseOver)
    .on('mousemove', handleMouseMove)
    .on('mouseout', handleMouseOut)
    .on('click', handleCountryClick);

  if (!zoomBehavior) {
    zoomBehavior = d3.zoom()
      .scaleExtent([1, 12])
      .on('zoom', handleZoom);
    svg.call(zoomBehavior);
  }

  svg.on('click', () => {
    const event = d3.event;
    if (event && event.target === svg.node()) {
      hidePopup();
    }
  });

  updateMapColors();
}

function resize() {
  if (!worldData) {
    return;
  }

  const rect = container.node().getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  svg.attr('viewBox', `0 0 ${width} ${height}`);

  projection = d3.geoNaturalEarth1().fitSize([width, height], worldData);
  path = d3.geoPath().projection(projection);

  if (countriesGroup) {
    countriesGroup.selectAll('path.country').attr('d', path);
  }

  repositionPopup();
}

function handleZoom() {
  zoomTransform = d3.event.transform;
  if (countriesGroup) {
    countriesGroup.attr('transform', zoomTransform);
  }
  repositionPopup();
}

function handleMouseOver(feature) {
  const event = d3.event;
  if (!event) {
    return;
  }

  tooltip
    .style('visibility', 'visible')
    .html(buildTooltipContent(feature));

  d3.select(this).attr('stroke-width', 1.2);
  handleMouseMove();
}

function handleMouseMove() {
  const event = d3.event;
  if (!event) {
    return;
  }

  tooltip
    .style('top', `${event.pageY - 50}px`)
    .style('left', `${event.pageX + 16}px`);
}

function handleMouseOut() {
  hideTooltip();
  d3.select(this).attr('stroke-width', 0.4);
}

function handleCountryClick(feature) {
  const event = d3.event;
  if (event) {
    event.stopPropagation();
  }

  const profile = getCountryProfile(feature);
  if (!profile) {
    hidePopup();
    return;
  }

  popup
    .html(buildPopupContent(profile))
    .style('visibility', 'visible')
    .attr('aria-hidden', 'false');

  activePopup = { feature };
  repositionPopup();
}

function buildTooltipContent(feature) {
  const profile = getCountryProfile(feature);
  if (!profile) {
    return '<strong>Pays inconnu</strong>';
  }

  const indicator = indicatorIndex.get(activeIndicatorId);
  const indicatorLabel = indicator ? indicator.label : 'Indicateur selectionne';
  const zoomLevel = getZoomScale();
  const continentMap = continentAggregates.get(activeIndicatorId);
  const continentStats = continentMap ? continentMap.get(profile.continent) : null;

  if (zoomLevel < 1.5 && continentStats && Number.isFinite(continentStats.value)) {
    return [
      `<strong>${profile.continent}</strong>`,
      `${indicatorLabel}: ${formatValue(continentStats.value, indicator)}`,
      `Pays couverts: ${continentStats.count || 0}`
    ].join('<br>');
  }

  const value = profile.indicators[activeIndicatorId];
  const lines = [
    `<strong>${profile.name}</strong>`,
    `${indicatorLabel}: ${formatValue(value, indicator)}`
  ];

  const siblings = getSiblingIndicators(indicator);
  const extras = [];
  for (let i = 0; i < siblings.length && extras.length < 2; i += 1) {
    const sibling = siblings[i];
    const siblingValue = profile.indicators[sibling.id];
    if (!Number.isFinite(siblingValue)) {
      continue;
    }
    extras.push(`<span class="tooltip-secondary">${sibling.label}: ${formatValue(siblingValue, sibling)}</span>`);
  }

  if (!Number.isFinite(value) && continentStats && Number.isFinite(continentStats.value)) {
    extras.push(`<span class="tooltip-secondary">Moyenne ${profile.continent}: ${formatValue(continentStats.value, indicator)}</span>`);
  }

  if (!extras.length && !Number.isFinite(value)) {
    extras.push('<span class="tooltip-secondary">Aucune donnee pour cet indicateur</span>');
  }

  return lines.concat(extras).join('<br>');
}

function buildPopupContent(profile) {
  const sections = INDICATOR_GROUPS.map(group => {
    const groupIndicators = INDICATORS.filter(ind => ind.group === group.id);
    if (!groupIndicators.length) {
      return '';
    }

    const rows = groupIndicators.map(indicator => {
      const rowClass = indicator.id === activeIndicatorId ? 'popup-row highlight' : 'popup-row';
      return `
        <div class="${rowClass}">
          <div class="popup-row-info">
            <span class="popup-row-label">${indicator.label}</span>
            ${indicator.description ? `<span class="popup-row-hint">${indicator.description}</span>` : ''}
          </div>
          <span class="popup-row-value">${formatValue(profile.indicators[indicator.id], indicator)}</span>
        </div>
      `;
    }).join('');

    return `
      <section class="popup-section">
        <div class="popup-section-title">${group.label}</div>
        <div class="popup-section-content">
          ${rows}
        </div>
      </section>
    `;
  }).join('');

  return `
    <button class="popup-close" type="button" data-action="close-popup" aria-label="Fermer">&times;</button>
    <div class="popup-header">${profile.name}</div>
    <div class="popup-subheader">${profile.continent}</div>
    ${sections}
    <div class="popup-note">Valeurs basées sur   moyennes ou indices disponibles, toutes années confondues.</div>
  `;
}

function getSiblingIndicators(indicator) {
  if (!indicator) {
    return [];
  }
  return INDICATORS.filter(ind => ind.group === indicator.group && ind.id !== indicator.id);
}

function hideTooltip() {
  tooltip.style('visibility', 'hidden');
}

function hidePopup() {
  popup
    .style('visibility', 'hidden')
    .attr('aria-hidden', 'true')
    .html('');
  activePopup = null;
}

function repositionPopup() {
  if (!activePopup || !activePopup.feature) {
    return;
  }

  const centroid = path.centroid(activePopup.feature);
  if (!centroid || !Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) {
    return;
  }

  const transformed = zoomTransform ? zoomTransform.apply(centroid) : centroid;
  const node = popup.node();
  if (!node) {
    return;
  }

  const width = node.offsetWidth || 0;
  const height = node.offsetHeight || 0;
  const containerNode = container.node();
  const containerWidth = containerNode ? containerNode.clientWidth : window.innerWidth;
  const containerHeight = containerNode ? containerNode.clientHeight : window.innerHeight;
  const padding = 16;

  let left = transformed[0] - width / 2;
  let top = transformed[1] - height - 18;

  let clamped = false;

  if (left < padding) {
    left = padding;
    clamped = true;
  }
  if (left + width + padding > containerWidth) {
    left = Math.max(padding, containerWidth - width - padding);
    clamped = true;
  }

  const desiredTop = top;
  if (top < padding) {
    top = padding;
    clamped = true;
  }
  if (top + height + padding > containerHeight) {
    top = Math.max(padding, containerHeight - height - padding);
    clamped = true;
  }

  if (Math.abs(top - desiredTop) > 1) {
    clamped = true;
  }

  popup
    .style('left', `${left}px`)
    .style('top', `${top}px`)
    .classed('popup-clamped', clamped);
}

function initPopupCloser() {
  popup.on('click', () => {
    const event = d3.event;
    if (!event) {
      return;
    }
    event.stopPropagation();
    const target = event.target;
    if (target && target.getAttribute && target.getAttribute('data-action') === 'close-popup') {
      hidePopup();
    }
  });

  d3.select(document).on('click.country-popup', () => {
    const target = d3.event && d3.event.target;
    if (!target) {
      return;
    }
    if (!popup.node().contains(target)) {
      hidePopup();
    }
  });
}

function initMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const filterPanel = document.getElementById('filter-panel');
  const closeBtn = document.getElementById('filter-close-btn');
  const indicatorContainer = document.getElementById('indicator-groups');

  if (!menuBtn || !filterPanel || !indicatorContainer) {
    return;
  }

  filterPanel.classList.remove('hidden');
  filterPanel.setAttribute('aria-hidden', 'true');

  renderIndicatorOptions(indicatorContainer);
  updateIndicatorInputs();

  menuBtn.addEventListener('click', () => toggleFilterPanel(filterPanel));
  if (closeBtn) {
    closeBtn.addEventListener('click', () => toggleFilterPanel(filterPanel, false));
  }

  indicatorContainer.addEventListener('change', event => {
    if (event.target && event.target.name === 'indicator') {
      setActiveIndicator(event.target.value);
    }
  });
}

function toggleFilterPanel(panel, forceOpen) {
  const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !panel.classList.contains('show');
  panel.classList.toggle('show', shouldOpen);
  panel.setAttribute('aria-hidden', String(!shouldOpen));
}

function renderIndicatorOptions(container) {
  const markup = INDICATOR_GROUPS.map(group => {
    const groupIndicators = INDICATORS.filter(ind => ind.group === group.id);
    if (!groupIndicators.length) {
      return '';
    }

    const options = groupIndicators.map(indicator => {
      const checked = indicator.id === activeIndicatorId ? 'checked' : '';
      return `
        <label class="indicator-option">
          <input type="radio" name="indicator" value="${indicator.id}" ${checked}>
          <div>
            <span class="indicator-title">${indicator.label}</span>
            ${indicator.description ? `<span class="indicator-description">${indicator.description}</span>` : ''}
          </div>
        </label>
      `;
    }).join('');

    return `
      <section class="filter-section">
        <h3>${group.label}</h3>
        <div class="filter-options">${options}</div>
      </section>
    `;
  }).join('');

  container.innerHTML = markup;
}

function setActiveIndicator(indicatorId) {
  if (!indicatorIndex.has(indicatorId)) {
    console.warn(`Indicateur inconnu: ${indicatorId}`);
    return;
  }
  if (activeIndicatorId === indicatorId) {
    return;
  }

  activeIndicatorId = indicatorId;
  updateIndicatorInputs();
  hideTooltip();
  hidePopup();
  updateColorScale();
  updateMapColors();
  refreshActivePopup();
}

function updateIndicatorInputs() {
  document.querySelectorAll('input[name="indicator"]').forEach(input => {
    input.checked = input.value === activeIndicatorId;
  });
}

function refreshActivePopup() {
  if (!activePopup || !activePopup.feature) {
    return;
  }
  const profile = getCountryProfile(activePopup.feature);
  if (!profile) {
    hidePopup();
    return;
  }
  popup.html(buildPopupContent(profile));
  repositionPopup();
}

function updateColorScale() {
  const indicatorMap = indicatorValueMaps.get(activeIndicatorId) || new Map();
  const values = Array.from(indicatorMap.values()).filter(Number.isFinite);

  if (values.length) {
    const sorted = values.slice().sort(d3.ascending);
    const rawMin = sorted[0];
    const rawMax = sorted[sorted.length - 1];
    const lower = d3.quantile(sorted, 0.05) ?? rawMin;
    const upper = d3.quantile(sorted, 0.95) ?? rawMax;
    let domainMin = Math.min(0, lower);
    let domainMax = upper;
    if (domainMax <= domainMin) {
      const delta = Math.abs(domainMin) || 1;
      domainMin -= delta * 0.1;
      domainMax += delta * 0.1;
    }
    currentColorDomain = {
      min: domainMin,
      max: domainMax,
      rawMin,
      rawMax,
      truncated: domainMax < rawMax - 1e-9 || domainMin > rawMin + 1e-9
    };
  } else {
    currentColorDomain = { min: 0, max: 1, rawMin: 0, rawMax: 1, truncated: false };
  }

  const interpolator = d3.interpolateRgb('#fff5f0', '#7a0210');
  colorScale = d3.scaleSequential(interpolator)
    .domain([currentColorDomain.min, currentColorDomain.max])
    .clamp(true);
}

function updateMapColors() {
  if (!countriesGroup) {
    return;
  }

  countriesGroup
    .selectAll('path.country')
    .transition()
    .duration(300)
    .attr('fill', getCountryFill);

  updateLegend(indicatorIndex.get(activeIndicatorId));
}

function getCountryFill(feature) {
  const indicatorMap = indicatorValueMaps.get(activeIndicatorId);
  if (!indicatorMap || !colorScale) {
    return MISSING_COLOR;
  }

  const normalized = feature.properties ? feature.properties.normalizedName : '';
  let value = indicatorMap.get(normalized);

  if (!Number.isFinite(value)) {
    const continent = (feature.properties && feature.properties.continent) ||
      (countryLookup.get(normalized) && countryLookup.get(normalized).continent);
    const continentStats = continentAggregates.get(activeIndicatorId);
    const fallback = continentStats ? continentStats.get(continent) : null;
    value = fallback && Number.isFinite(fallback.value) ? fallback.value : null;
  }

  return Number.isFinite(value) ? colorScale(value) : MISSING_COLOR;
}

function getCountryProfile(feature) {
  if (!feature || !feature.properties) {
    return null;
  }
  const normalized = feature.properties.normalizedName;
  if (!normalized) {
    return null;
  }
  return ensureProfile(normalized, feature.properties.name, feature.properties.continent);
}

function aggregateDataset(dataset, datasetKey) {
  const grouped = new Map();
  const unmatched = new Set();

  (dataset || []).forEach(entry => {
    const rawName = entry && entry.Country ? String(entry.Country) : '';
    const normalized = normalizeName(rawName);
    if (!normalized) {
      return;
    }

    const canonicalKey = resolveCountryKey(normalized);
    if (!canonicalKey) {
      unmatched.add(normalized);
      return;
    }

    const value = parseNumber(entry.Value);
    if (!Number.isFinite(value)) {
      return;
    }

    const bucket = grouped.get(canonicalKey) || { total: 0, count: 0 };
    bucket.total += value;
    bucket.count += 1;
    grouped.set(canonicalKey, bucket);
  });

  const averages = new Map();
  grouped.forEach((bucket, key) => {
    if (!bucket.count) {
      return;
    }
    const average = bucket.total / bucket.count;
    const normalizedValue = applyDatasetNormalization(average, key, datasetKey);
    if (Number.isFinite(normalizedValue)) {
      averages.set(key, normalizedValue);
    }
  });

  if (unmatched.size) {
    console.warn(`[${datasetKey}] Pays non apparies ignores:`, Array.from(unmatched).slice(0, 10));
  }

  return averages;
}

function buildCountryLookup(features) {
  countryLookup = new Map();
  countryProfiles = new Map();
  countryNameIndex = new Map();

  features.forEach(feature => {
    const props = feature.properties || {};
    const canonicalKey = props.normalizedName;
    if (!canonicalKey) {
      return;
    }

    const record = {
      feature,
      name: props.name || props.admin || 'Pays inconnu',
      continent: props.continent || 'Autre'
    };

    countryLookup.set(canonicalKey, record);
    ensureProfile(canonicalKey, record.name, record.continent);

    registerNameVariant(canonicalKey, canonicalKey);
    const variants = collectNameVariants(props);
    variants.forEach(variant => registerNameVariant(variant, canonicalKey));

    const populationEstimate = parseNumber(props.pop_est);
    if (Number.isFinite(populationEstimate) && populationEstimate > 0) {
      worldPopulationEstimates.set(canonicalKey, populationEstimate);
    }
  });

  NAME_ALIASES.forEach((target, alias) => {
    registerAlias(alias, target);
  });
}

function preparePopulationData(rows) {
  populationByCountry = new Map();
  if (!Array.isArray(rows)) {
    return;
  }

  rows.forEach(row => {
    const name = row && row.Country ? String(row.Country).trim() : '';
    if (!name) {
      return;
    }
    const normalized = normalizeName(name);
    const canonicalKey = resolveCountryKey(normalized);
    if (!canonicalKey) {
      return;
    }

    const populationValue = parseNumber(row.Population);
    if (!Number.isFinite(populationValue) || populationValue <= 0) {
      return;
    }

    populationByCountry.set(canonicalKey, populationValue);
    registerNameVariant(normalized, canonicalKey);
  });
}

function registerAlias(aliasName, targetName) {
  const aliasNormalized = normalizeName(aliasName);
  const targetNormalized = normalizeName(targetName);
  if (!aliasNormalized || !targetNormalized) {
    return;
  }
  let canonicalKey = countryNameIndex.get(targetNormalized);
  if (!canonicalKey && countryLookup.has(targetNormalized)) {
    canonicalKey = targetNormalized;
  }
  if (!canonicalKey) {
    const sorted = sortNormalizedWords(targetNormalized);
    canonicalKey = countryNameIndex.get(sorted);
  }
  if (!canonicalKey) {
    return;
  }
  registerNameVariant(aliasNormalized, canonicalKey);
}

function collectNameVariants(props) {
  const variants = new Set();
  const baseFields = [
    'name',
    'name_long',
    'name_sort',
    'admin',
    'formal_en',
    'formal_fr',
    'abbrev',
    'brk_name',
    'sovereignt',
    'postal',
    'iso_a2',
    'iso_a3',
    'gu_a3',
    'su_a3'
  ];

  baseFields.forEach(field => addVariantValue(variants, props[field]));
  addVariantValue(variants, props.name_alt);

  return Array.from(variants);
}

function addVariantValue(collector, value) {
  if (!value) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach(item => addVariantValue(collector, item));
    return;
  }
  if (typeof value !== 'string') {
    return;
  }

  value
    .split(/[,;/|]+/)
    .map(part => part.trim())
    .filter(Boolean)
    .forEach(part => collector.add(part));
}

function registerNameVariant(name, canonicalKey) {
  if (!canonicalKey) {
    return;
  }
  const normalized = typeof name === 'string' ? normalizeName(name) : name;
  addNameIndexEntry(normalized, canonicalKey);
  const sorted = sortNormalizedWords(normalized);
  if (sorted && sorted !== normalized) {
    addNameIndexEntry(sorted, canonicalKey);
  }
}

function addNameIndexEntry(normalized, canonicalKey) {
  if (!normalized) {
    return;
  }
  const existing = countryNameIndex.get(normalized);
  if (!existing) {
    countryNameIndex.set(normalized, canonicalKey);
  }
}

function resolveCountryKey(normalized) {
  if (!normalized) {
    return null;
  }

  const direct = countryNameIndex.get(normalized);
  if (direct) {
    return direct;
  }

  const sorted = sortNormalizedWords(normalized);
  if (sorted && sorted !== normalized) {
    const sortedMatch = countryNameIndex.get(sorted);
    if (sortedMatch) {
      countryNameIndex.set(normalized, sortedMatch);
      return sortedMatch;
    }
  }

  const aliasTarget = NAME_ALIASES.get(normalized);
  if (aliasTarget) {
    const targetNormalized = normalizeName(aliasTarget);
    if (targetNormalized && targetNormalized !== normalized) {
      const resolvedTarget = resolveCountryKey(targetNormalized);
      if (resolvedTarget) {
        countryNameIndex.set(normalized, resolvedTarget);
        return resolvedTarget;
      }
    }
  }

  return null;
}

function ensureProfile(key, fallbackName, fallbackContinent) {
  if (countryProfiles.has(key)) {
    const profile = countryProfiles.get(key);
    if (!profile.name && fallbackName) {
      profile.name = fallbackName;
    }
    if (!profile.continent && fallbackContinent) {
      profile.continent = fallbackContinent;
    }
    return profile;
  }

  const lookup = countryLookup.get(key);
  const profile = {
    key,
    name: lookup ? lookup.name : (fallbackName || 'Pays inconnu'),
    continent: lookup ? lookup.continent : (fallbackContinent || 'Autre'),
    indicators: {}
  };

  countryProfiles.set(key, profile);
  return profile;
}

function normalizeName(name) {
  if (!name) {
    return '';
  }
  let output = String(name);
  if (typeof output.normalize === 'function') {
    output = output.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  output = output
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .replace(/\b( | | | | | | | | | | | | | )\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  if (!output) {
    return '';
  }

  const words = output.split(' ').filter(Boolean);
  const expanded = [];
  words.forEach(word => {
    const replacement = WORD_REPLACEMENTS.get(word);
    if (replacement) {
      replacement.split(' ').forEach(part => {
        if (part) {
          expanded.push(part);
        }
      });
    } else {
      expanded.push(word);
    }
  });

  return expanded.join(' ');
}

function sortNormalizedWords(value) {
  if (!value) {
    return value;
  }
  const parts = value.split(' ').filter(Boolean);
  if (parts.length <= 1) {
    return value;
  }
  return parts.slice().sort().join(' ');
}

function getZoomScale() {
  return zoomTransform ? zoomTransform.k : 1;
}

function formatValue(value, indicator) {
  if (!Number.isFinite(value)) {
    return 'N/A';
  }
  const digits = indicator && typeof indicator.digits === 'number'
    ? indicator.digits
    : (Math.abs(value) >= 1000 ? 0 : 2);
  const formatter = d3.format(`,.${digits}f`);
  const suffix = indicator && indicator.unit ? ` ${indicator.unit}` : '';
  return `${formatter(value)}${suffix}`;
}

function applyDatasetNormalization(value, canonicalKey, datasetKey) {
  const config = DATASET_CONFIG[datasetKey];
  if (!config) {
    return value;
  }

  if (config.normalization === 'perPopulation') {
    const population = getPopulationForCountry(canonicalKey);
    if (!Number.isFinite(population) || population <= 0) {
      warnMissingPopulation(canonicalKey);
      return null;
    }
    const factor = Number.isFinite(config.per) ? config.per : 1;
    return (value / population) * factor;
  }

  return value;
}

function getPopulationForCountry(canonicalKey) {
  if (!canonicalKey) {
    return null;
  }
  if (populationByCountry.has(canonicalKey)) {
    return populationByCountry.get(canonicalKey);
  }
  if (worldPopulationEstimates.has(canonicalKey)) {
    return worldPopulationEstimates.get(canonicalKey);
  }
  return null;
}

function warnMissingPopulation(canonicalKey) {
  if (!canonicalKey || warnedCountries.has(canonicalKey)) {
    return;
  }
  warnedCountries.add(canonicalKey);
  const country = countryLookup.get(canonicalKey);
  const name = country ? country.name : canonicalKey;
  console.warn(`Population inconnue pour ${name}, impossible de normaliser.`);
}

function parseNumber(value) {
  if (value === null || value === undefined) {
    return NaN;
  }
  if (typeof value === 'number') {
    return value;
  }
  let str = String(value)
    .replace(/\u00A0/g, ' ')
    .trim();
  if (!str) {
    return NaN;
  }
  str = str.replace(/\s+/g, '');
  str = str.replace(/,/g, '.');
  str = str.replace(/[^0-9.\-eE]/g, '');
  if (!str) {
    return NaN;
  }
  return Number(str);
}

function updateLegend(indicator) {
  if (!legend || legend.empty()) {
    return;
  }
  const indicatorMap = indicatorValueMaps.get(activeIndicatorId) || new Map();
  const values = Array.from(indicatorMap.values()).filter(Number.isFinite);

  if (!values.length || !indicator) {
    legend.classed('legend-hidden', true)
      .attr('aria-hidden', 'true')
      .attr('aria-expanded', 'false');
    return;
  }

  const domainMin = currentColorDomain.min;
  const domainMax = currentColorDomain.max;
  const formatter = typeof indicator.digits === 'number'
    ? d3.format(`,.${indicator.digits}f`)
    : d3.format(',.2f');

  legendTitle.text(indicator.label);
  legendMin.text(formatter(domainMin));
  legendMax.text(formatter(domainMax));

  let caption = 'Plus clair = valeurs faibles, plus fonce = valeurs elevees.';
  if (indicator.unit) {
    caption += ` Unite: ${indicator.unit}.`;
  } else if (indicator.description) {
    caption += ` ${indicator.description}`;
  }
  if (currentColorDomain.truncated) {
    caption += ' Palette centree sur le 5e-95e percentile pour limiter les valeurs extremes.';
  }
  legendCaption.text(caption);

  const collapsed = legend.classed('legend-collapsed');
  legend.classed('legend-hidden', false)
    .attr('aria-hidden', 'false')
    .attr('aria-expanded', String(!collapsed));
  legendToggleBtn
    .text(collapsed ? '+' : '-')
    .attr('aria-label', collapsed ? 'Afficher la legende' : 'Replier la legende');
}

function initLegendToggle() {
  if (!legendToggleBtn || legendToggleBtn.empty()) {
    return;
  }
  legendToggleBtn.on('click', () => {
    const collapsed = legend.classed('legend-collapsed');
    const nextState = !collapsed;
    legend.classed('legend-collapsed', nextState)
      .attr('aria-expanded', String(!nextState));
    legendToggleBtn
      .text(nextState ? '+' : '-')
      .attr('aria-label', nextState ? 'Afficher la legende' : 'Replier la legende');
  });
}
