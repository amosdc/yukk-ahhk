/**
 * MODEL — SimulationModel
 * Data dan logika bisnis untuk simulasi subsiden Jakarta.
 */
export const SimulationModel = {
  states: [
    {
      year: 1970,
      drop: 0,
      aquiferHeight: "75px",
      translateY: 0,
      flood: false,
      desc: "Kondisi masih stabil. Air tanah masih melimpah di bawah bangunan kita.",
    },
    {
      year: 2000,
      drop: 180,
      aquiferHeight: "48px",
      translateY: 38,
      flood: false,
      desc: "Mulai banyak sedot air tanah ilegal. Lapisan air (akuifer) menipis, tanah mulai turun.",
    },
    {
      year: 2026,
      drop: 400,
      aquiferHeight: "18px",
      translateY: 115,
      flood: true,
      desc: '<strong style="color:#E53935">KRITIS!</strong> Air tanah hampir habis dikuras. Daratan Jakarta Utara kini sejajar dengan laut.',
    },
    {
      year: 2050,
      drop: 625,
      aquiferHeight: "4px",
      translateY: 172,
      flood: true,
      desc: '<strong style="color:#E53935">BENCANA.</strong> Tanah ambles parah. Jakarta Utara tenggelam permanen oleh air laut.',
    },
  ],

  getState(index) {
    return this.states[index] || this.states[0];
  },
};
