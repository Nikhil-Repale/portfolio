/* ============================================================
   PROFESSIONAL UPGRADE SCRIPT — Nikhil Repale Portfolio
   ============================================================ */

(function () {
  "use strict";

  // ─────────────────────────────────────────────
  // 1. PRELOADER
  // ─────────────────────────────────────────────
  const preloader = document.getElementById("preloader");
  if (preloader) {
    document.body.style.overflow = "hidden";

    // Animate status messages
    const messages = [
      "$ initializing portfolio.sh ...",
      "$ loading cloud infrastructure ...",
      "$ mounting kubernetes cluster ...",
      "$ starting jenkins pipeline ...",
      "✓  All systems operational",
    ];
    const textEl = preloader.querySelector(".preloader-text");
    let msgIndex = 0;

    function cycleMessage() {
      if (!textEl) return;
      textEl.style.opacity = "0";
      setTimeout(() => {
        textEl.textContent = messages[msgIndex % messages.length];
        textEl.style.opacity = "1";
        msgIndex++;
      }, 250);
    }

    textEl && (textEl.style.transition = "opacity 0.25s ease");
    cycleMessage();
    const msgInterval = setInterval(cycleMessage, 540);

    setTimeout(() => {
      clearInterval(msgInterval);
      preloader.classList.add("hidden");
      document.body.style.overflow = "";
    }, 2700);
  }

  document.addEventListener("DOMContentLoaded", () => {

    // ─────────────────────────────────────────────
    // 2. SCROLL PROGRESS BAR
    // ─────────────────────────────────────────────
    const scrollProgress = document.getElementById("scroll-progress");
    if (scrollProgress) {
      const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = pct.toFixed(2) + "%";
      };
      window.addEventListener("scroll", updateProgress, { passive: true });
      updateProgress();
    }

    // ─────────────────────────────────────────────
    // 3. CUSTOM CURSOR
    // ─────────────────────────────────────────────
    const cursorDot  = document.getElementById("cursor-dot");
    const cursorRing = document.getElementById("cursor-ring");
    const isTouchDevice = () =>
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (cursorDot && cursorRing && !isTouchDevice()) {
      document.body.classList.add("cursor-active");

      let mouseX = -100, mouseY = -100;
      let ringX  = -100, ringY  = -100;
      let rafId;

      document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + "px";
        cursorDot.style.top  = mouseY + "px";
      });

      // Smooth ring follow
      function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + "px";
        cursorRing.style.top  = ringY + "px";
        rafId = requestAnimationFrame(animateRing);
      }
      animateRing();

      // Magnetic expand on interactive elements
      const interactiveEls = document.querySelectorAll(
        "a, button, .selector-btn, .project-card, .skill-group, input, textarea, .scenario-btn, .tab-btn"
      );
      interactiveEls.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursorRing.style.width  = "54px";
          cursorRing.style.height = "54px";
          cursorRing.style.borderColor = "rgba(13,148,136,0.8)";
          cursorDot.style.background   = "#d97706";
          cursorDot.style.boxShadow    = "0 0 10px rgba(217,119,6,0.9)";
        });
        el.addEventListener("mouseleave", () => {
          cursorRing.style.width  = "36px";
          cursorRing.style.height = "36px";
          cursorRing.style.borderColor = "rgba(13,148,136,0.55)";
          cursorDot.style.background   = "#0d9488";
          cursorDot.style.boxShadow    = "0 0 8px rgba(13,148,136,0.9)";
        });
      });
    }

    // ─────────────────────────────────────────────
    // 4. SCROLL REVEAL (Intersection Observer)
    // ─────────────────────────────────────────────
    const revealEls = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale"
    );
    if (revealEls.length) {
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              revealObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );
      revealEls.forEach((el) => revealObs.observe(el));
    }

    // ─────────────────────────────────────────────
    // 5. SECTION HEADING UNDERLINE ANIMATION
    // ─────────────────────────────────────────────
    const headings = document.querySelectorAll(".heading");
    if (headings.length) {
      const headingObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible-heading");
              headingObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      headings.forEach((h) => headingObs.observe(h));
    }

    // ─────────────────────────────────────────────
    // 6. ANIMATED NUMBER COUNTER
    // ─────────────────────────────────────────────
    function animateCounter(el) {
      const target   = parseInt(el.dataset.count, 10);
      const suffix   = el.dataset.suffix || "";
      const duration = 1600;
      const startTime = performance.now();

      function step(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(step);
    }

    const counterEls = document.querySelectorAll("[data-count]");
    if (counterEls.length) {
      const counterObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !entry.target.classList.contains("counted")) {
              entry.target.classList.add("counted");
              animateCounter(entry.target);
              counterObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counterEls.forEach((el) => counterObs.observe(el));
    }

    // ─────────────────────────────────────────────
    // 7. HERO FLOATING PARTICLES
    // ─────────────────────────────────────────────
    const particlesContainer = document.querySelector(".hero-particles");
    if (particlesContainer) {
      const COUNT = 18;
      for (let i = 0; i < COUNT; i++) {
        const p = document.createElement("div");
        p.className = "hero-particle";
        const size = Math.random() * 7 + 3;
        const colors = ["rgba(13,148,136,0.2)", "rgba(37,99,235,0.15)", "rgba(217,119,6,0.12)"];
        p.style.cssText = `
          width:${size}px;
          height:${size}px;
          left:${Math.random() * 100}%;
          animation-duration:${Math.random() * 14 + 10}s;
          animation-delay:${(Math.random() * -20).toFixed(1)}s;
          background:${colors[Math.floor(Math.random() * colors.length)]};
        `;
        particlesContainer.appendChild(p);
      }
    }

    // ─────────────────────────────────────────────
    // 8. PROJECT CARD MOUSE-TRACKING RADIAL GLOW
    // ─────────────────────────────────────────────
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
        const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        card.style.setProperty("--mouse-x", x + "%");
        card.style.setProperty("--mouse-y", y + "%");
      });
      card.addEventListener("mouseleave", () => {
        card.style.setProperty("--mouse-x", "50%");
        card.style.setProperty("--mouse-y", "50%");
      });
    });

    // ─────────────────────────────────────────────
    // 9. HEADER SHRINK ON SCROLL
    // ─────────────────────────────────────────────
    const header = document.querySelector("header");
    if (header) {
      window.addEventListener(
        "scroll",
        () => header.classList.toggle("scrolled", window.scrollY > 80),
        { passive: true }
      );
    }

    // ─────────────────────────────────────────────
    // 10. SKILL GROUP STAGGER REVEAL
    // ─────────────────────────────────────────────
    const skillGroups = document.querySelectorAll(".skill-group");
    if (skillGroups.length) {
      const skillObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity  = "1";
              entry.target.style.transform = "translateY(0)";
              skillObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      skillGroups.forEach((el, i) => {
        el.style.opacity   = "0";
        el.style.transform = "translateY(28px)";
        el.style.transition = `opacity 0.65s ${i * 0.12}s ease, transform 0.65s ${i * 0.12}s ease`;
        skillObs.observe(el);
      });
    }

    // ─────────────────────────────────────────────
    // 11. PROJECT CARD STAGGER REVEAL
    // ─────────────────────────────────────────────
    const projectCards = document.querySelectorAll(".project-card");
    if (projectCards.length) {
      const projObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity  = "1";
              entry.target.style.transform = "translateY(0)";
              projObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      projectCards.forEach((card, i) => {
        card.style.opacity   = "0";
        card.style.transform = "translateY(32px)";
        card.style.transition = `opacity 0.7s ${i * 0.13}s ease, transform 0.7s ${i * 0.13}s ease, box-shadow 0.35s ease, border-color 0.35s ease`;
        projObs.observe(card);
      });
    }

    // ─────────────────────────────────────────────
    // 12. FOCUS LIST STAGGER
    // ─────────────────────────────────────────────
    const focusArticles = document.querySelectorAll(".focus-list article");
    if (focusArticles.length) {
      const focusObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity  = "1";
              entry.target.style.transform = "translateX(0)";
              focusObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      focusArticles.forEach((el, i) => {
        el.style.opacity   = "0";
        el.style.transform = "translateX(-20px)";
        el.style.transition = `opacity 0.65s ${i * 0.15}s ease, transform 0.65s ${i * 0.15}s ease`;
        focusObs.observe(el);
      });
    }

    // ─────────────────────────────────────────────
    // 13. EDUCATION CARD STAGGER
    // ─────────────────────────────────────────────
    const eduArticles = document.querySelectorAll(".education-list article");
    if (eduArticles.length) {
      const eduObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity  = "1";
              entry.target.style.transform = "translateY(0)";
              eduObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      eduArticles.forEach((el, i) => {
        el.style.opacity   = "0";
        el.style.transform = "translateY(24px)";
        el.style.transition = `opacity 0.65s ${i * 0.18}s ease, transform 0.65s ${i * 0.18}s ease`;
        eduObs.observe(el);
      });
    }

    // ─────────────────────────────────────────────
    // 14. CERTIFICATE TIMELINE STAGGER
    // ─────────────────────────────────────────────
    const timelineArticles = document.querySelectorAll(".timeline article");
    if (timelineArticles.length) {
      const timelineObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.opacity  = "1";
              entry.target.style.transform = "translateX(0)";
              timelineObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      timelineArticles.forEach((el, i) => {
        el.style.opacity   = "0";
        el.style.transform = "translateX(-24px)";
        el.style.transition = `opacity 0.6s ${i * 0.2}s ease, transform 0.6s ${i * 0.2}s ease, border-color 0.3s ease, box-shadow 0.3s ease`;
        timelineObs.observe(el);
      });
    }

  }); // end DOMContentLoaded
})();
