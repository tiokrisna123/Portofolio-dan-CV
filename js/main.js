/* =============================================================
   main.js
   Entry point: EmailJS, form kontak, toast notification,
   smooth scroll, dan reveal system vanilla
   (IntersectionObserver — menggantikan library AOS).

   Reveal berulang: elemen MUNCUL saat masuk viewport
   (scroll ke bawah) dan MENGHILANG saat keluar viewport
   (scroll ke atas), lalu bisa muncul lagi.

   Konvensi markup (sama seperti AOS sebelumnya, tanpa library):
     data-aos="fade-up"            → reveal dari bawah
     data-aos="fade-left"          → reveal dari kanan
     data-aos="fade-right"         → reveal dari kiri
     data-aos-delay="100"          → delay stagger (ms)
   ============================================================= */

/* =============================================
   REVEAL SYSTEM (pengganti AOS, toggle berulang)
   ============================================= */
(function () {
  const revealEls = document.querySelectorAll('[data-aos]');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Dengan reduced motion: semua konten selalu tampil, tanpa observer
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Toggle is-visible setiap kali status intersect berubah
      // Masuk viewport (dari atas atau bawah) -> muncul
      // Keluar viewport (ke atas atau bawah) -> hilang (siap animasi lagi)
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    // Map data-aos lama → arah reveal
    const dir = el.getAttribute('data-aos');
    if (dir === 'fade-left')  el.classList.add('reveal-right');
    if (dir === 'fade-right') el.classList.add('reveal-left');
    el.classList.add('reveal');

    // Stagger: data-aos-delay (AOS style) → CSS variable
    const delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
    if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');

    revealObserver.observe(el);
  });
})();

/* =============================================
   TIMELINE — garis tumbuh + dot stagger
   (ikut toggle berulang seperti reveal di atas)
   ============================================= */
(function () {
  const timeline     = document.querySelector('.timeline');
  const timelineDots = document.querySelectorAll('.timeline-dot');

  if (!timeline || !('IntersectionObserver' in window)) {
    timelineDots.forEach(dot => dot.classList.add('is-visible'));
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    timeline.classList.add('is-visible');
    timelineDots.forEach(dot => dot.classList.add('is-visible'));
    return;
  }

  // Delay stagger di-set sekali — replay otomatis memakai delay yang sama
  timelineDots.forEach((dot, i) => {
    dot.style.setProperty('--dot-delay', (i * 120) + 'ms');
  });

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const visible = entry.isIntersecting;

      // Garis timeline tumbuh / menyusut
      timeline.classList.toggle('is-visible', visible);

      // Dot muncul satu per satu / hilang
      timelineDots.forEach(dot => dot.classList.toggle('is-visible', visible));
    });
  }, { threshold: 0.1 });

  timelineObserver.observe(timeline);
})();

/* =============================================
   EMAILJS + CONTACT FORM
   ============================================= */
emailjs.init({
  publicKey: 'pRBQa-OZOvxfw5VZJ',
});

(function () {
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

    emailjs
      .sendForm('service_vr2cb9b', 'template_904rtdd', this)
      .then(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan';
        contactForm.reset();
        showToast('Pesan berhasil dikirim! 🎉');
      })
      .catch((error) => {
        console.error(error);
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Pesan';
        showToast('Gagal mengirim pesan.');
      });
  });
})();

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
function showToast(message) {
  const toast    = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

/* =============================================
   SMOOTH SCROLL for all anchor links
   (scroll-margin-top di CSS menjaga section
   tidak tertutup navbar fixed)
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
