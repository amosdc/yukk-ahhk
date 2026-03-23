/**
 * CONTROLLER — UIController
 * Menginisialisasi semua elemen UI umum via UIView.
 */
import { UIView } from "../views/Uiview.js";

export const UIController = {
  init() {
    // Loader
    window.addEventListener("load", () => {
      setTimeout(() => UIView.hideLoader(), 2000);
    });

    UIView.spawnParticles();
    UIView.initCursor();
    UIView.initNavbar();
    UIView.initNavActive();
    UIView.initScrollReveal();
    UIView.initGlobe();
    UIView.initAboutCards();
    UIView.initSolutionGlow();
    UIView.initSolutionArrows();
    UIView.initEconomicsTabs();
    UIView.initContactForm();

    // Expose switchEcon ke global (dipanggil dari HTML onclick)
    window.switchEcon = (type) => UIView.switchEcon(type);
  },
};
