/**
 * MODEL — MapModel
 * Data risiko penurunan tanah per zona Jakarta.
 */
export const MapModel = {
  riskColors: {
    Kritis: "#E53935",
    Tinggi: "#F59E0B",
    Moderat: "#059669",
    Rendah: "#34D399",
  },

  riskBg: {
    Kritis: "rgba(229,57,53,0.1)",
    Tinggi: "rgba(245,158,11,0.1)",
    Moderat: "rgba(5,150,105,0.1)",
    Rendah: "rgba(52,211,153,0.1)",
  },

  /**
   * Hitung persentase lebar risk-bar (0–100) berdasarkan laju maksimum 25 cm.
   * @param {number} rate
   * @returns {number}
   */
  getRiskBarWidth(rate) {
    return Math.min((rate / 25) * 100, 100);
  },
};
