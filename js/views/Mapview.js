/**
 * VIEW — MapView
 * Mengelola rendering Leaflet, tooltip, dan panel info.
 */
export const MapView = {
  elements: {
    tooltip: () => document.getElementById("map-tooltip"),
    ttName: () => document.getElementById("tt-name"),
    ttRate: () => document.getElementById("tt-rate"),
    ttRisk: () => document.getElementById("tt-risk"),
    ttBar: () => document.getElementById("tt-bar"),
    ttAction: () => document.getElementById("tt-action"),
    infoPlaceh: () => document.getElementById("info-placeholder"),
    infoDetail: () => document.getElementById("info-detail"),
    infoName: () => document.getElementById("info-name"),
    infoRate: () => document.getElementById("info-rate"),
    infoRisk: () => document.getElementById("info-risk"),
    infoAction: () => document.getElementById("info-action"),
  },

  map: null,
  geoJsonLayer: null,

  initMap(geoData, riskColors, interactionCallbacks) {
    this.map = L.map("mapbox-container", {
      center: [-6.15, 106.8229],
      zoom: 11,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(this.map);

    this.geoJsonLayer = L.geoJSON(geoData, {
      style: (feature) => ({
        color: feature.properties.color,
        weight: 2,
        fillOpacity: 0.4,
      }),

      onEachFeature: (feature, layer) => {
        interactionCallbacks(feature, layer);
      },
    }).addTo(this.map);
  },

  showTooltip(e, data, riskColors, riskBg, barWidth) {
    const el = this.elements;
    el.ttName().textContent = data.name;
    el.ttRate().textContent = `−${data.rate} cm/yr`;

    const rEl = el.ttRisk();
    rEl.textContent = data.risk;
    rEl.style.background = riskBg[data.risk];
    rEl.style.color = riskColors[data.risk];

    const bar = el.ttBar();
    bar.style.background = riskColors[data.risk];
    bar.style.width = barWidth + "%";
    el.ttAction().textContent = data.action;

    const tt = el.tooltip();
    tt.style.left = e.containerPoint.x + 15 + "px";
    tt.style.top = e.containerPoint.y + 15 + "px";
    tt.classList.add("show");
  },

  hideTooltip() {
    this.elements.tooltip().classList.remove("show");
  },

  showInfoPanel(data, riskColors) {
    const el = this.elements;
    el.infoPlaceh().classList.add("hidden");
    el.infoDetail().classList.remove("hidden");

    el.infoName().textContent = data.name;
    el.infoRate().textContent = `−${data.rate}`;
    el.infoRate().style.color = riskColors[data.risk];
    el.infoRisk().textContent = data.risk.toUpperCase();
    el.infoRisk().style.color = riskColors[data.risk];
    el.infoAction().textContent = data.action;
  },
};
