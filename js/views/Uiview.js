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
      const y = window.scrollY;
      if (orb1) orb1.style.transform = `translateY(${y * 0.07}px)`;
      if (orb2) orb2.style.transform = `translateY(${-y * 0.05}px)`;
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
};
