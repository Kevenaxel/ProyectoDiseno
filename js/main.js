
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navbarMenu = document.getElementById("navbarMenu");
  const navbar = document.querySelector(".navbar");

  if (navToggle && navbarMenu) {
    const closeMenu = () => {
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

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeMenu();
    });
  }
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const previous = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");

    if (!track || !previous || !next) return;

    const getScrollAmount = () => {
      const card = track.querySelector("article");
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    };

    const updateControls = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 2;
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= maxScroll;
    };

    previous.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    next.addEventListener("click", () => {
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    track.addEventListener("scroll", updateControls, { passive: true });
    track.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previous.click();
      if (event.key === "ArrowRight") next.click();
    });

    window.addEventListener("resize", updateControls);
    updateControls();
  });
});
