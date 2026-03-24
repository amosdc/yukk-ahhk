/**
 * MODEL — MapModel
 * Data risiko penurunan tanah per zona Jakarta dalam format GeoJSON.
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

  getRiskBarWidth(rate) {
    return Math.min((rate / 25) * 100, 100);
  },

  // Data Spasial Jakarta
  geoJSON: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: "Penjaringan",
          rate: 25,
          risk: "Kritis",
          action: "Zona Prioritas 1 — pengerahan segera pusat desalinasi",
          color: "#E53935",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [106.75, -6.11],
              [106.79, -6.11],
              [106.79, -6.14],
              [106.75, -6.14],
              [106.75, -6.11],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Pluit",
          rate: 23,
          risk: "Kritis",
          action: "Pemantauan aktif + larangan penggunaan pompa darurat",
          color: "#E53935",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [106.79, -6.1],
              [106.81, -6.1],
              [106.81, -6.13],
              [106.79, -6.13],
              [106.79, -6.1],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Tanjung Priok",
          rate: 12,
          risk: "Tinggi",
          action: "Integrasi pelabuhan dengan sistem desalinasi",
          color: "#F59E0B",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [106.86, -6.1],
              [106.9, -6.1],
              [106.9, -6.14],
              [106.86, -6.14],
              [106.86, -6.1],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: {
          name: "Jakarta Pusat",
          rate: 6,
          risk: "Moderat",
          action: "Pemantauan rutin — zona penyangga alami",
          color: "#059669",
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [106.8, -6.16],
              [106.85, -6.16],
              [106.85, -6.2],
              [106.8, -6.2],
              [106.8, -6.16],
            ],
          ],
        },
      },
    ],
  },
};
