/**
 * main.js — Entry Point AquaInnovate Jakarta
 *
 * Struktur MVC:
 *   Models      → js/models/  (data & logika bisnis)
 *   Views       → js/views/   (update DOM)
 *   Controllers → js/controllers/ (menghubungkan model & view)
 */

import { UIController } from "./controllers/UIController.js";
import { SimulationController } from "./controllers/SimulationController.js";
import { CalculatorController } from "./controllers/CalculatorController.js";
import { MapController } from "./controllers/MapController.js";

document.addEventListener("DOMContentLoaded", () => {
  UIController.init();
  SimulationController.init();
  CalculatorController.init();
  MapController.init();
});
