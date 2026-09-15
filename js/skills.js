/* =============================================================
   skills.js
   Animasi skill bar — ter-trigger saat section skills
   masuk viewport (IntersectionObserver), dengan stagger
   ringan antar bar agar muncul satu per satu.
   ============================================================= */

(function () {
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const delay = parseInt(bar.getAttribute('data-index') || '0', 10) * 100;

        setTimeout(() => {
          bar.style.width = bar.getAttribute('data-pct') + '%';
        }, delay);

        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  // Tandai urutan bar untuk stagger (dua kolom berjalan paralel per kolom)
  const columns = new Map();
  skillBars.forEach(bar => {
    const col = bar.closest('[data-aos]') || document.body;
    const i   = columns.get(col) || 0;
    bar.setAttribute('data-index', i);
    columns.set(col, i + 1);
  });

  skillBars.forEach(bar => skillObserver.observe(bar));
})();
