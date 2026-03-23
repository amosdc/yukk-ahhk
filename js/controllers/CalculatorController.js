/**
 * CONTROLLER — CalculatorController
 * Menghubungkan CalculatorModel ↔ CalculatorView.
 */
import { CalculatorModel } from "../models/CalculatorModel.js";
import { CalculatorView } from "../views/Calculatorview.js";

export const CalculatorController = {
  init() {
    const slider = CalculatorView.elements.slider();
    if (!slider) return;

    const update = () => {
      const hh = +slider.value;
      const result = CalculatorModel.calculate(hh);
      CalculatorView.render(
        result,
        CalculatorModel.formatNumber.bind(CalculatorModel),
        CalculatorModel.formatHouseholds.bind(CalculatorModel),
        hh,
      );
    };

    slider.addEventListener("input", update);

    // Render dengan sedikit delay agar DOM siap
    setTimeout(update, 300);
  },
};
