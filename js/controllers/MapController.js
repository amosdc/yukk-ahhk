/**
 * CONTROLLER — MapController
 * Menghubungkan MapModel ↔ MapView untuk peta risiko.
 */
import { MapModel } from "../models/MapModel.js";
import { MapView } from "../views/Mapview.js";

export const MapController = {
  init() {
    const zones = document.querySelectorAll(".map-zone");
    if (!zones.length) return;

    zones.forEach((zone) => {
      zone.addEventListener("mouseenter", () => {
        const barWidth = MapModel.getRiskBarWidth(+zone.dataset.rate);
        MapView.showTooltip(
          zone.dataset,
          zone.getBoundingClientRect(),
          MapModel.riskColors,
          MapModel.riskBg,
          barWidth,
        );
      });

      zone.addEventListener("mouseleave", () => MapView.hideTooltip());

      zone.addEventListener("click", () => {
        MapView.showInfoPanel(zone.dataset, MapModel.riskColors);
      });
    });
  },
};
