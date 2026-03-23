/**
 * VIEW — MapView
 * Mengelola tooltip dan panel info untuk peta risiko Jakarta.
 */
export const MapView = {
  elements: {
    tooltip: () => document.getElementById("map-tooltip"),
    mapEl: () => document.getElementById("jakarta-map"),
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

  /**
   * Tampilkan tooltip di posisi relatif zona.
   * @param {DOMStringMap} data       zone.dataset
   * @param {DOMRect}      zoneRect
   * @param {{ [risk]: string }} riskColors
   * @param {{ [risk]: string }} riskBg
   * @param {number}       barWidth
   */
  showTooltip(data, zoneRect, riskColors, riskBg, barWidth) {
    const el = this.elements;
    const map = el.mapEl();
    if (!map) return;

    const mapRect = map.getBoundingClientRect();

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
    tt.style.left =
      Math.max(0, zoneRect.left - mapRect.left + zoneRect.width / 2 - 90) +
      "px";
    tt.style.top = zoneRect.top - mapRect.top + zoneRect.height + 8 + "px";
    tt.classList.add("show");
  },

  hideTooltip() {
    this.elements.tooltip().classList.remove("show");
  },

  /**
   * Update panel samping "Wilayah Terpilih".
   * @param {DOMStringMap} data
   * @param {{ [risk]: string }} riskColors
   */
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
