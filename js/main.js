document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navbarMenu = document.getElementById("navbarMenu");
  const navbar = document.querySelector(".navbar");

  if (navToggle && navbarMenu) {
    const closeMenu = () => {
      if (!navbarMenu.classList.contains("is-open")) return;
      navbarMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    const openMenu = () => {
      navbarMenu.classList.add("is-open");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navbarMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });

    navbarMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  }

  if (navbar) {
    let lastScrolled = null;
    const onScroll = () => {
      const isScrolled = window.scrollY > 8;
      if (isScrolled !== lastScrolled) {
        lastScrolled = isScrolled;
        navbar.classList.toggle("is-scrolled", isScrolled);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");

    if (!track || !previous || !next) return;

    let autoplayId = null;
    let scrollStep = 0;
    let isVisible = false;

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll;
    };

    const measure = () => {
      const card = track.querySelector("article");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      scrollStep = card ? card.offsetWidth + gap : track.clientWidth;
      updateControls();
    };

    const stopAutoplay = () => {
      if (autoplayId) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      if (reduceMotion.matches || autoplayId || !isVisible || document.hidden) return;

      autoplayId = window.setInterval(() => {
        const maxScroll = track.scrollWidth - track.clientWidth - 2;

        if (track.scrollLeft >= maxScroll) {
          track.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          track.scrollBy({ left: scrollStep, behavior: "smooth" });
        }
      }, 5000);
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    previous.addEventListener("click", () => {
      track.scrollBy({ left: -scrollStep, behavior: "smooth" });
      restartAutoplay();
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: scrollStep, behavior: "smooth" });
      restartAutoplay();
    });

    track.addEventListener("scroll", updateControls, { passive: true });

    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previous.click();
      if (event.key === "ArrowRight") next.click();
    });

    new ResizeObserver(measure).observe(track);

    new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        isVisible ? startAutoplay() : stopAutoplay();
      },
      { threshold: 0.2 }
    ).observe(carousel);

    document.addEventListener("visibilitychange", () => {
      document.hidden ? stopAutoplay() : startAutoplay();
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) startAutoplay();
    });

    measure();
  });
});