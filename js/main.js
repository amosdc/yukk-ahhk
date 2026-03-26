/**
 * main.js — Entry Point AquaInnovate Jakarta
 */

const SimulationModel = {
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

// Data dan logika bisnis untuk kalkulator dampak air.
const CalculatorModel = {
  config: {
    MIN: 50000,
    MAX: 2000000,
    STEP: 50000,
    LITERS_PER_HH: 250, // liter/rumah tangga/hari
    MAX_REDUCTION: 12, // cm/tahun penurunan tanah maks
    TOTAL_DEMAND: 2.6e9, // total kebutuhan Jakarta (liter/hari)
    MAX_INFRA_YEARS: 20,
  },


  // Hitung semua output dari jumlah rumah tangga yang beralih.
  calculate(households) {
    const {
      MIN,
      MAX,
      LITERS_PER_HH,
      MAX_REDUCTION,
      TOTAL_DEMAND,
      MAX_INFRA_YEARS,
    } = this.config;
    const pct = (households - MIN) / (MAX - MIN); // 0–1

    const gwSaved = households * LITERS_PER_HH; // liter/hari
    const subReduce = (pct * MAX_REDUCTION).toFixed(1); // cm/tahun
    const infraYears = Math.round(pct * MAX_INFRA_YEARS);
    const depPct = Math.min(Math.round((gwSaved / TOTAL_DEMAND) * 100), 100);
    const sliderPct = (((households - MIN) / (MAX - MIN)) * 100).toFixed(1);

    return {
      gwSaved,
      subReduction: subReduce,
      infraYears,
      depPct,
      sliderPct,
      pct,
    };
  },

  // Format angka besar menjadi string ringkas.
  formatNumber(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
    if (n >= 1e3) return Math.round(n / 1000) + "K";
    return n.toString();
  },


  // Format jumlah rumah tangga untuk label besar.
  formatHouseholds(hh) {
    if (hh >= 1e6) return (hh / 1e6).toFixed(2) + " Juta";
    return Math.round(hh / 1000) + " Ribu";
  },
};


// Data risiko penurunan tanah per zona Jakarta dalam format GeoJSON.
const MapModel = {
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


// Semua update DOM umum: loader, cursor, partikel, navbar, globe, ekonomi.
const UIView = {
  /* ── Loader ── */
  hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hide");
  },

  /* ── Particles ── */
  spawnParticles() {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        --dur:${Math.random() * 8 + 6}s;
        --delay:${Math.random() * 8}s;
        --op:${(Math.random() * 0.07 + 0.03).toFixed(3)};
      `;
      container.appendChild(p);
    }
  },

  /* ── Cursor ── */
  initCursor() {
    const dot = document.getElementById("cur-dot");
    const ring = document.getElementById("cur-ring");
    if (!dot || !ring) return;

    const isMob = window.matchMedia("(hover:none)").matches;
    if (isMob) {
      dot.style.display = "none";
      ring.style.display = "none";
      return;
    }

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    (function animR() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animR);
    })();

    document.addEventListener("mousedown", () => {
      ring.style.transform = "translate(-50%,-50%) scale(0.55)";
      ring.style.borderColor = "rgba(0,155,146,0.85)";
    });
    document.addEventListener("mouseup", () => {
      ring.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.borderColor = "rgba(0,155,146,0.42)";
    });

    const interactables =
      "a,button,input,select,textarea,.metric-pill,.tech-badge,.myth-wrap,.about-card,.sol-card,.tl-item,.result-card,.econ-card";
    document.querySelectorAll(interactables).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.style.width = "50px";
        ring.style.height = "50px";
        ring.style.borderColor = "rgba(0,155,146,0.65)";
      });
      el.addEventListener("mouseleave", () => {
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.borderColor = "rgba(0,155,146,0.42)";
      });
    });
  },

  /* ── Navbar ── */
  initNavbar() {
    const navbar = document.getElementById("navbar");
    const burger = document.getElementById("burger");
    const mmenu = document.getElementById("mmenu");
    const icOpen = document.getElementById("ic-open");
    const icClose = document.getElementById("ic-close");
    const orb1 = document.querySelector(".orb-1");
    const orb2 = document.querySelector(".orb-2");

    if (!navbar || !burger) return;

    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
      //const y = window.scrollY;
      //if (orb1) orb1.style.transform = `translateY(${y * 0.07}px)`;
      //if (orb2) orb2.style.transform = `translateY(${-y * 0.05}px)`;
    });

    burger.addEventListener("click", () => {
      mmenu.classList.toggle("open");
      icOpen.classList.toggle("hidden");
      icClose.classList.toggle("hidden");
    });

    document.querySelectorAll(".ml").forEach((a) => {
      a.addEventListener("click", () => {
        mmenu.classList.remove("open");
        icOpen.classList.remove("hidden");
        icClose.classList.add("hidden");
      });
    });
  },

  /* ── Nav active highlight ── */
  initNavActive() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navLinks.forEach((l) => {
              const active = l.getAttribute("href") === "#" + e.target.id;
              l.classList.toggle("active", active);
              l.style.color = active ? "var(--teal)" : "";
            });
          }
        });
      },
      { threshold: 0.45 },
    );

    sections.forEach((s) => obs.observe(s));
  },

  /* ── Scroll reveal ── */
  initScrollReveal() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.08 },
    );

    document
      .querySelectorAll(".sr,.sr-l,.sr-r,.sr-scale")
      .forEach((el) => obs.observe(el));
  },

  /* ── Globe 3D tilt ── */
  initGlobe() {
    const gc = document.getElementById("globeContainer");
    if (!gc) return;
    const inner = gc.querySelector(".globe-inner");
    gc.addEventListener("mousemove", (e) => {
      const r = gc.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = ((e.clientX - cx) / r.width) * 22;
      const dy = ((e.clientY - cy) / r.height) * 22;
      if (inner) inner.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg)`;
    });
    gc.addEventListener("mouseleave", () => {
      if (inner) inner.style.transform = "";
    });
  },

  /* ── About card 3D ── */
  initAboutCards() {
    document.querySelectorAll(".about-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = ((e.clientX - cx) / r.width) * 12;
        const dy = ((e.clientY - cy) / r.height) * 12;
        card.style.transform = `translateY(-8px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  },

  /* ── Solution card glow ── */
  initSolutionGlow() {
    document.querySelectorAll(".sol-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty(
          "--mx",
          (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%",
        );
        card.style.setProperty(
          "--my",
          (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%",
        );
      });
    });
  },

  /* ── Solution flow arrows ── */
  initSolutionArrows() {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target
              .querySelectorAll(".sol-arrow line,.sol-arrow path")
              .forEach((el) => {
                el.style.animation = "none";
                void el.offsetWidth;
                el.style.strokeDasharray = "36";
                el.style.strokeDashoffset = "36";
                el.style.animation = "drawArrow 1.2s ease forwards";
              });
          }
        });
      },
      { threshold: 0.25 },
    );

    const flow = document.getElementById("solution-flow");
    if (flow) obs.observe(flow);
  },

  /* ── Economics mobile tabs ── */
  initEconomicsTabs() {
    const dCard = document.getElementById("econ-d");
    const tCard = document.getElementById("econ-t");
    if (!dCard || !tCard) return;
    if (window.innerWidth < 768) tCard.style.display = "none";
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        dCard.style.display = "";
        tCard.style.display = "";
      }
    });
  },

  switchEcon(type) {
    const dCard = document.getElementById("econ-d");
    const tCard = document.getElementById("econ-t");
    const tabD = document.getElementById("tab-d");
    const tabT = document.getElementById("tab-t");
    if (!dCard || !tCard) return;

    if (type === "d") {
      dCard.style.display = "";
      tCard.style.display = "none";
      tabD.className = "econ-tab active-d";
      tabT.className = "econ-tab";
    } else {
      dCard.style.display = "none";
      tCard.style.display = "";
      tabT.className = "econ-tab active-t";
      tabD.className = "econ-tab";
    }
  },

  /* ── Contact form ── */
  initContactForm() {
    const btn = document.querySelector("[data-contact-send]");
    if (btn) btn.addEventListener("click", () => this.sendMessage());
  },

  sendMessage() {
    const ok = document.getElementById("sent-ok");
    if (ok) ok.classList.remove("hidden");
  },

  /* ── GSAP Animations ── */
  initGSAP() {
    if (typeof gsap === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // A. Hero Section Sequence (Muncul Berurutan)
    // ==========================================
    const heroTl = gsap.timeline({ delay: 2.2 });

    gsap.set(
      ".hero-badge, .hero-title-wrap, .hero-sub, .hero-bullets, .hero-cta, .hero-stats",
      { opacity: 0, y: 30 },
    );
    gsap.set(".hero-globe-wrap", { opacity: 0, scale: 0.8 });

    heroTl
      .to(".hero-badge", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .to(
        ".hero-title-wrap",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
      .to(
        ".hero-sub",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
      .to(
        ".hero-bullets",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
      .to(
        ".hero-cta",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
      .to(
        ".hero-globe-wrap",
        { opacity: 1, scale: 1, duration: 1.2, ease: "elastic.out(1, 0.7)" },
        "-=1.2",
      )
      .to(
        ".hero-stats",
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.8",
      );

    // ==========================================
    // B. ScrollTrigger pada "Linimasa Kerusakan"
    // ==========================================
    // 1. Jalur garis vertikal memanjang perlahan sesuai scroll
    gsap.fromTo(
      ".timeline-track",
      { height: "0%" },
      {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: "#content",
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      },
    );

    // 2. Card item muncul dari kiri/kanan bergantian
    gsap.utils.toArray(".tl-item").forEach((item, i) => {
      item.classList.remove("sr");

      gsap.fromTo(
        item,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
          },
        },
      );
    });

    // ==========================================
    // C. Number Counter (Angka Berjalan)
    // ==========================================
    const stats = document.querySelectorAll(".hero-stats .num");
    stats.forEach((stat) => {
      let text = stat.innerText;

      let targetVal = parseFloat(text.replace(/[^0-9.]/g, ""));

      let counter = { val: 0 };

      if (targetVal > 2000) counter.val = 1900;

      gsap.to(counter, {
        val: targetVal,
        duration: 2.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hero-stats",
          start: "top 95%",
        },
        onUpdate: function () {
          stat.innerText = text.replace(/[0-9.]+/, Math.round(counter.val));
        },
      });
    });

    // ==========================================
    // D. Parallax Background (Orb)
    // ==========================================
    gsap.to(".orb-1", {
      y: 200,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(".orb-2", {
      y: -150,
      ease: "none",
      scrollTrigger: {
        trigger: "#home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // ==========================================
    // E. General Scroll Reveal
    // ==========================================
    const revealElements = document.querySelectorAll(
      ".sr, .sr-l, .sr-r, .sr-scale",
    );

    revealElements.forEach((el) => {
      let xOffset = 0;
      let yOffset = 40;
      let scaleVal = 1;

      if (el.classList.contains("sr-l")) {
        xOffset = -40;
        yOffset = 0;
      } else if (el.classList.contains("sr-r")) {
        xOffset = 40;
        yOffset = 0;
      } else if (el.classList.contains("sr-scale")) {
        scaleVal = 0.9;
        yOffset = 0;
      }

      el.style.transition = "none";

      gsap.fromTo(
        el,
        { opacity: 0, x: xOffset, y: yOffset, scale: scaleVal },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            // toggleActions: "play none none reverse"
          },
        },
      );
    });

    // ==========================================
    // F. Animasi "Draw SVG" Alur Solusi
    // ==========================================
    const flowSection = document.getElementById("solution-flow");
    if (flowSection) {
      gsap.set(".sol-arrow line, .sol-arrow path", {
        strokeDasharray: 36,
        strokeDashoffset: 36,
      });

      gsap.to(".sol-arrow line, .sol-arrow path", {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power2.out",
        stagger: 1.0,
        scrollTrigger: {
          trigger: flowSection,
          start: "top 75%",
        },
      });
    }

    // ==========================================
    // G. Magnetic Button Effect (Efek Magnet)
    // ==========================================
    const magneticButtons = document.querySelectorAll(
      ".btn-primary, .btn-secondary",
    );

    magneticButtons.forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;

        gsap.to(btn, {
          x: x,
          y: y,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
        });
      });
    });
  },
};

// =============================================================================
// VIEW — SimulationView
// Mengelola update DOM untuk simulasi subsiden.
// =============================================================================
const SimulationView = {
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

// =============================================================================
// VIEW — CalculatorView
// Mengelola update DOM untuk kalkulator dampak air.
// =============================================================================
const CalculatorView = {
  elements: {
    slider: () => document.getElementById("calc-slider"),
    hhBig: () => document.getElementById("calc-hh-big"),
    gw: () => document.getElementById("calc-gw"),
    sub: () => document.getElementById("calc-sub"),
    subBar: () => document.getElementById("calc-sub-bar"),
    years: () => document.getElementById("calc-years"),
    dots: () => document.getElementById("calc-dots"),
    pctBig: () => document.getElementById("calc-pct-big"),
    gaugeCirc: () => document.getElementById("gauge-circle"),
  },

  /**
   * Trigger animasi ripple pada elemen.
   * @param {HTMLElement} el
   * @param {string} value
   */
  _pop(el, value) {
    if (!el) return;
    el.classList.remove("ripple");
    void el.offsetWidth; // reflow
    el.textContent = value;
    el.classList.add("ripple");
  },

  /**
   * Render titik-titik indikator tahun tambahan.
   * @param {number} years
   */
  _renderDots(years) {
    const el = this.elements.dots();
    if (!el) return;
    el.innerHTML = "";
    const max = Math.min(years, 20);
    for (let i = 0; i < max; i++) {
      const d = document.createElement("div");
      d.style.cssText = `
        width:5px; height:5px; border-radius:50%; background:var(--cyan);
        transition: background 0.3s ${i * 0.035}s, transform 0.3s ${i * 0.035}s;
        transform: scale(0);
      `;
      el.appendChild(d);
      setTimeout(() => {
        d.style.transform = "scale(1)";
      }, i * 35);
    }
  },

  /**
   * Update gauge SVG.
   * @param {number} depPct   0–100
   */
  _renderGauge(depPct) {
    const g = this.elements.gaugeCirc();
    if (!g) return;
    const circ = 2 * Math.PI * 55;
    g.style.strokeDasharray = circ;
    g.style.strokeDashoffset = circ - (depPct / 100) * circ;
  },

  /**
   * Update slider gradient latar.
   * @param {string} sliderPct  e.g. "23.7%"
   */
  _renderSliderTrack(sliderPct) {
    const sl = this.elements.slider();
    if (sl) sl.style.setProperty("--pct", sliderPct + "%");
  },

  /**
   * Render semua output kalkulator.
   * @param {{ gwSaved, subReduction, infraYears, depPct, sliderPct, pct }} result
   * @param {Function} formatNumber
   * @param {Function} formatHouseholds
   * @param {number}   households
   */
  render(result, formatNumber, formatHouseholds, households) {
    const { gwSaved, subReduction, infraYears, depPct, sliderPct, pct } =
      result;
    const el = this.elements;

    if (el.hhBig()) el.hhBig().textContent = formatHouseholds(households);
    this._pop(el.gw(), formatNumber(gwSaved));
    this._pop(el.sub(), subReduction + "cm");
    this._pop(el.years(), "+" + infraYears + " thn");
    this._pop(el.pctBig(), depPct + "%");

    if (el.subBar()) el.subBar().style.width = Math.min(pct * 100, 100) + "%";

    this._renderSliderTrack(sliderPct);
    this._renderGauge(depPct);
    this._renderDots(infraYears);
  },
};

// =============================================================================
// VIEW — MapView
// Mengelola rendering Leaflet, tooltip, dan panel info.
const MapView = {
  elements: {
    tooltip: () => document.getElementById("map-tooltip"),
    ttName: () => document.getElementById("tt-name"),
    ttRate: () => document.getElementById("tt-rate"),
    ttRisk: () => document.getElementById("tt-risk"),
    ttBar: () => document.getElementById("tt-bar"),
    ttAction: () => document.getElementById("tt-action"),
    infoPlaceh: () => document.getElementById("info-placeholder"),
    infoDetail: () => document.getElementById("info-detail"),
    infoName: () => document.getElementById("info-name"),
    infoRate: () => document.getElementById("info-rate"),
    infoRisk: () => document.getElementById("info-risk"),
    infoAction: () => document.getElementById("info-action"),
  },

  map: null,
  geoJsonLayer: null,

  initMap(geoData, riskColors, interactionCallbacks) {
    const jakartaBounds = L.latLngBounds(
      L.latLng(-6.35, 106.7),
      L.latLng(-6.05, 106.98),
    );

    this.map = L.map("mapbox-container", {
      center: [-6.15, 106.8229],
      zoom: 11,
      minZoom: 12,
      maxBounds: jakartaBounds,
      maxBoundsViscosity: 1.0,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 25,
      attribution: "© OpenStreetMap",
    }).addTo(this.map);

    this.geoJsonLayer = L.geoJSON(geoData, {
      style: (feature) => ({
        color: feature.properties.color,
        weight: 2,
        fillOpacity: 0.4,
      }),

      onEachFeature: (feature, layer) => {
        interactionCallbacks(feature, layer);
      },
    }).addTo(this.map);
  },

  showTooltip(e, data, riskColors, riskBg, barWidth) {
    const el = this.elements;
    el.ttName().textContent = data.name;
    el.ttRate().textContent = `−${data.rate} cm/yr`;

    const rEl = el.ttRisk();
    rEl.textContent = data.risk;
    rEl.style.background = riskBg[data.risk];
    rEl.style.color = riskColors[data.risk];

    const bar = el.ttBar();
    bar.style.background = riskColors[data.risk];
    bar.style.width = barWidth + "%";
    el.ttAction().textContent = data.action;

    const tt = el.tooltip();
    tt.style.left = e.containerPoint.x + 15 + "px";
    tt.style.top = e.containerPoint.y + 15 + "px";
    tt.classList.add("show");
  },

  hideTooltip() {
    this.elements.tooltip().classList.remove("show");
  },

  showInfoPanel(data, riskColors) {
    const el = this.elements;
    el.infoPlaceh().classList.add("hidden");
    el.infoDetail().classList.remove("hidden");

    el.infoName().textContent = data.name;
    el.infoRate().textContent = `−${data.rate}`;
    el.infoRate().style.color = riskColors[data.risk];
    el.infoRisk().textContent = data.risk.toUpperCase();
    el.infoRisk().style.color = riskColors[data.risk];
    el.infoAction().textContent = data.action;
  },
};

// Menginisialisasi semua elemen UI umum via UIView.
const UIController = {
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
    UIView.initGSAP();
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

// Menghubungkan SimulationModel ↔ SimulationView.
const SimulationController = {
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

// Menghubungkan CalculatorModel ↔ CalculatorView.
const CalculatorController = {
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

// Menghubungkan MapModel ↔ MapView dengan integrasi Leaflet.js
const MapController = {
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

// ENTRY POINT
document.addEventListener("DOMContentLoaded", () => {
  UIController.init();
  SimulationController.init();
  CalculatorController.init();
  MapController.init();
});