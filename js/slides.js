(function () {
  let current = 1;
  const total = 14;

  function goTo(n) {
    const prev = document.querySelector('.slide.active');
    if (prev) {
      prev.classList.remove('active', 'animate');
    }

    const slide = document.getElementById('slide' + n);
    slide.classList.add('active');
    current = n;

    requestAnimationFrame(() => slide.classList.add('animate'));
    updateProgressBars(n);
  }

  function updateProgressBars(slideNum) {
    document.querySelectorAll('.progress-bar-wrap').forEach(bar => {
      bar.querySelector('.slide-num').textContent = slideNum;
      bar.querySelector('.progress-fill').style.width =
        ((slideNum - 1) / (total - 1) * 100) + '%';

      const inner = bar.querySelector('.progress-bar-inner');
      inner.querySelectorAll('.progress-dot').forEach(d => d.remove());

      for (let i = 1; i <= total; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i < slideNum) dot.classList.add('done');
        if (i === slideNum) dot.classList.add('active');
        dot.style.left = ((i - 1) / (total - 1) * 100) + '%';
        dot.onclick = () => goTo(i);
        inner.appendChild(dot);
      }
    });
  }

  function next() { goTo(current < total ? current + 1 : 1); }
  function prev() { goTo(current > 1 ? current - 1 : total); }

  window.goTo = goTo;
  window.nextSlide = next;
  window.prevSlide = prev;

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  });

  goTo(1);
})();
