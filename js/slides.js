"use strict";

(function () {
  const TOTAL_SLIDES = 14;
  const SWIPE_THRESHOLD = 50;

  let current = 1;
  let touchStartX = 0;

  function goTo(n) {
    const prev = document.querySelector(".slide.active");
    if (prev) prev.classList.remove("active", "animate");

    const slide = document.getElementById("slide" + n);
    if (!slide) return;

    slide.classList.add("active");
    current = n;

    requestAnimationFrame(() => slide.classList.add("animate"));
    syncProgress(n);
  }

  function syncProgress(active) {
    const pct = (i) => ((i - 1) / (TOTAL_SLIDES - 1) * 100) + "%";

    document.querySelectorAll(".progress-bar-wrap").forEach((bar) => {
      bar.querySelector(".slide-num").textContent = active;
      bar.querySelector(".progress-fill").style.width = pct(active);

      const inner = bar.querySelector(".progress-bar-inner");
      inner.querySelectorAll(".progress-dot").forEach((d) => d.remove());

      for (let i = 1; i <= TOTAL_SLIDES; i++) {
        const dot = document.createElement("div");
        dot.className = "progress-dot";
        if (i < active) dot.classList.add("done");
        if (i === active) dot.classList.add("active");
        dot.style.left = pct(i);
        dot.addEventListener("click", () => goTo(i));
        inner.appendChild(dot);
      }
    });
  }

  function next() { goTo(current < TOTAL_SLIDES ? current + 1 : 1); }
  function prev() { goTo(current > 1 ? current - 1 : TOTAL_SLIDES); }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  });

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) dx < 0 ? next() : prev();
  });

  window.goTo = goTo;
  window.nextSlide = next;
  window.prevSlide = prev;

  goTo(1);
})();
