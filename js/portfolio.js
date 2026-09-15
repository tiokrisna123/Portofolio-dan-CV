/* =============================================================
   portfolio.js
   Filter kartu portfolio berdasarkan kategori
   (data-filter pada tombol vs data-category pada kartu),
   dengan transisi fade halus: fade out → layout update → fade in.
   ============================================================= */

(function () {
  const filterButtons  = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.dataset.filter;

      if (prefersReducedMotion) {
        // Langsung tampilkan/sembunyikan tanpa animasi
        portfolioCards.forEach(card => {
          card.classList.toggle('is-hiding', !(filter === 'all' || card.dataset.category === filter));
        });
        return;
      }

      // 1) Fade out semua kartu yang sedang tampil
      portfolioCards.forEach(card => {
        if (!card.classList.contains('is-hiding')) {
          card.classList.add('is-filtering');
        }
      });

      // 2) Setelah fade out selesai (~250ms), update layout
      setTimeout(() => {
        portfolioCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hiding', !match);

          if (match) {
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                card.classList.remove('is-filtering'); // fade in
              });
            });
          } else {
            card.classList.remove('is-filtering');
          }
        });
      }, 250);
    });
  });
})();
