/**
 * VIEW — CalculatorView
 * Mengelola update DOM untuk kalkulator dampak air.
 */
export const CalculatorView = {
  elements: {
    slider: () => document.getElementById("calc-slider"),
    hhBig: () => document.getElementById("calc-hh-big"),
    gw: () => document.getElementById("calc-gw"),
    sub: () => document.getElementById("calc-sub"),
    subBar: () => document.getElementById("calc-sub-bar"),
    years: () => document.getElementById("calc-years"),
    dots: () => document.getElementById("calc-dots"),
    pctBig: () => document.getElementById("calc-pct-big"),
    gaugeCirc: () => document.getElementById("gauge-circle"),
  },

  /**
   * Trigger animasi ripple pada elemen.
   * @param {HTMLElement} el
   * @param {string} value
   */
  _pop(el, value) {
    if (!el) return;
    el.classList.remove("ripple");
    void el.offsetWidth; // reflow
    el.textContent = value;
    el.classList.add("ripple");
  },

  /**
   * Render titik-titik indikator tahun tambahan.
   * @param {number} years
   */
  _renderDots(years) {
    const el = this.elements.dots();
    if (!el) return;
    el.innerHTML = "";
    const max = Math.min(years, 20);
    for (let i = 0; i < max; i++) {
      const d = document.createElement("div");
      d.style.cssText = `
        width:5px; height:5px; border-radius:50%; background:var(--cyan);
        transition: background 0.3s ${i * 0.035}s, transform 0.3s ${i * 0.035}s;
        transform: scale(0);
      `;
      el.appendChild(d);
      setTimeout(() => {
        d.style.transform = "scale(1)";
      }, i * 35);
    }
  },

  /**
   * Update gauge SVG.
   * @param {number} depPct   0–100
   */
  _renderGauge(depPct) {
    const g = this.elements.gaugeCirc();
    if (!g) return;
    const circ = 2 * Math.PI * 55;
    g.style.strokeDasharray = circ;
    g.style.strokeDashoffset = circ - (depPct / 100) * circ;
  },

  /**
   * Update slider gradient latar.
   * @param {string} sliderPct  e.g. "23.7%"
   */
  _renderSliderTrack(sliderPct) {
    const sl = this.elements.slider();
    if (sl) sl.style.setProperty("--pct", sliderPct + "%");
  },

  /**
   * Render semua output kalkulator.
   * @param {{ gwSaved, subReduction, infraYears, depPct, sliderPct, pct }} result
   * @param {Function} formatNumber
   * @param {Function} formatHouseholds
   * @param {number}   households
   */
  render(result, formatNumber, formatHouseholds, households) {
    const { gwSaved, subReduction, infraYears, depPct, sliderPct, pct } =
      result;
    const el = this.elements;

    if (el.hhBig()) el.hhBig().textContent = formatHouseholds(households);
    this._pop(el.gw(), formatNumber(gwSaved));
    this._pop(el.sub(), subReduction + "cm");
    this._pop(el.years(), "+" + infraYears + " thn");
    this._pop(el.pctBig(), depPct + "%");

    if (el.subBar()) el.subBar().style.width = Math.min(pct * 100, 100) + "%";

    this._renderSliderTrack(sliderPct);
    this._renderGauge(depPct);
    this._renderDots(infraYears);
  },
};
