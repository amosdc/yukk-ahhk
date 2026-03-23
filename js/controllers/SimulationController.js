/**
 * CONTROLLER — SimulationController
 * Menghubungkan SimulationModel ↔ SimulationView.
 */
import { SimulationModel } from "../models/SimulationModel.js";
import { SimulationView } from "../views/Simulationview.js";

export const SimulationController = {
  init() {
    const slider = SimulationView.elements.slider();
    if (!slider) return;

    slider.addEventListener("input", (e) => {
      const state = SimulationModel.getState(+e.target.value);
      SimulationView.render(state);
    });

    // Render initial state
    SimulationView.render(SimulationModel.getState(0));
  },
};
