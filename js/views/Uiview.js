/**
 * VIEW — UIView
 * Semua update DOM umum: loader, cursor, partikel, navbar, globe, ekonomi.
 */
export const UIView = {
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
