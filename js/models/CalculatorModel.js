/**
 * MODEL — CalculatorModel
 * Data dan logika bisnis untuk kalkulator dampak air.
 */
export const CalculatorModel = {
  config: {
    MIN: 50000,
    MAX: 2000000,
    STEP: 50000,
    LITERS_PER_HH: 250, // liter/rumah tangga/hari
    MAX_REDUCTION: 12, // cm/tahun penurunan tanah maks
    TOTAL_DEMAND: 2.6e9, // total kebutuhan Jakarta (liter/hari)
    MAX_INFRA_YEARS: 20,
  },

  /**
   * Hitung semua output dari jumlah rumah tangga yang beralih.
   * @param {number} households
   * @returns {{ gwSaved, subReduction, infraYears, depPct, sliderPct }}
   */
  calculate(households) {
    const {
      MIN,
      MAX,
      LITERS_PER_HH,
      MAX_REDUCTION,
      TOTAL_DEMAND,
      MAX_INFRA_YEARS,
    } = this.config;
    const pct = (households - MIN) / (MAX - MIN); // 0–1

    const gwSaved = households * LITERS_PER_HH; // liter/hari
    const subReduce = (pct * MAX_REDUCTION).toFixed(1); // cm/tahun
    const infraYears = Math.round(pct * MAX_INFRA_YEARS);
    const depPct = Math.min(Math.round((gwSaved / TOTAL_DEMAND) * 100), 100);
    const sliderPct = (((households - MIN) / (MAX - MIN)) * 100).toFixed(1);

    return {
      gwSaved,
      subReduction: subReduce,
      infraYears,
      depPct,
      sliderPct,
      pct,
    };
  },

  /**
   * Format angka besar menjadi string ringkas.
   * @param {number} n
   * @returns {string}
   */
  formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return Math.round(n / 1000) + "K";
    return n.toString();
  },

  /**
   * Format jumlah rumah tangga untuk label besar.
   * @param {number} hh
   * @returns {string}
   */
  formatHouseholds(hh) {
    if (hh >= 1e6) return (hh / 1e6).toFixed(2) + " Juta";
    return Math.round(hh / 1000) + " Ribu";
  },
};
