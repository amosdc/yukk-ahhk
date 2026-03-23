/**
 * VIEW — SimulationView
 * Mengelola update DOM untuk simulasi subsiden.
 */
export const SimulationView = {
  elements: {
    slider: () => document.getElementById("simSlider"),
    landGroup: () => document.getElementById("land-group"),
    aquifer: () => document.getElementById("aquifer"),
    txtYear: () => document.getElementById("txtYear"),
    txtDrop: () => document.getElementById("txtDrop"),
    txtDesc: () => document.getElementById("txtDesc"),
    floodWarn: () => document.getElementById("floodWarning"),
  },

  /**
   * Update semua elemen visual berdasarkan state simulasi.
   * @param {{ year, drop, aquiferHeight, translateY, flood, desc }} state
   */
  render(state) {
    const { txtYear, txtDrop, txtDesc, landGroup, aquifer, floodWarn } =
      this.elements;

    txtYear().textContent = state.year;
    txtDrop().innerHTML = `${state.drop}<span style="font-size:1rem">cm</span>`;
    txtDesc().innerHTML = `<strong>${state.year}:</strong> ${state.desc}`;
    landGroup().style.transform = `translateY(${state.translateY}px)`;
    aquifer().style.height = state.aquiferHeight;
    floodWarn().classList.toggle("hidden", !state.flood);
  },
};
