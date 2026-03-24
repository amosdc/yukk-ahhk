/**
 * CONTROLLER — MapController
 * Menghubungkan MapModel ↔ MapView dengan integrasi Leaflet.js
 */
import { MapModel } from "../models/MapModel.js";
import { MapView } from "../views/Mapview.js";

export const MapController = {
  init() {
    // Fungsi callback untuk menangani interaksi di setiap poligon (zona)
    const handleInteractions = (feature, layer) => {
      const data = feature.properties;

      layer.on({
        mousemove: (e) => {
          layer.setStyle({ fillOpacity: 0.8 });
          const barWidth = MapModel.getRiskBarWidth(data.rate);
          MapView.showTooltip(
            e,
            data,
            MapModel.riskColors,
            MapModel.riskBg,
            barWidth,
          );
        },
        mouseout: (e) => {
          MapView.geoJsonLayer.resetStyle(e.target);
          MapView.hideTooltip();
        },
        click: (e) => {
          MapView.showInfoPanel(data, MapModel.riskColors);
          MapView.map.fitBounds(e.target.getBounds(), { padding: "" });
        },
      });
    };

    // Inisialisasi peta dengan data GeoJSON dan event handlers
    if (document.getElementById("mapbox-container")) {
      MapView.initMap(
        MapModel.geoJSON,
        MapModel.riskColors,
        handleInteractions,
      );
    }
  },
};
