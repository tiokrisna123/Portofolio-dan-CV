/* =============================================================
   navbar.js
   Navbar: auto-hide (hilang saat scroll ke bawah, muncul saat
   scroll ke atas), glass + menyusut saat scroll, sliding active
   indicator antar menu, dan hamburger menu (mobile navigation).
   ============================================================= */

(function () {
  const navbar   = document.getElementById('navbar');
  const navList  = document.querySelector('.nav-links');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // Animasi masuk saat halaman dibuka (sekali, dihapus saat mulai scroll)
  navbar.classList.add('navbar-intro');

  /* ---------------------------------------------
     Auto-hide navbar
     Scroll ke bawah → navbar slide keluar ke atas.
     Scroll ke atas → navbar slide masuk kembali.
     Selalu tampil saat berada di posisi paling atas.
     --------------------------------------------- */
  const HIDE_AFTER   = 80;  // mulai hide setelah lewat 80px dari atas
  const DELTA_MIN    = 4;   // abaikan jitter scroll < 4px
  let lastY          = window.scrollY;

  function updateHide(currentY) {
    const delta = currentY - lastY;

    if (Math.abs(delta) < DELTA_MIN) return;
    lastY = currentY;

    if (currentY < HIDE_AFTER) {
      // Di dekat atas: selalu tampil
      navbar.classList.remove('nav-hidden');
    } else if (delta > 0) {
      // Scroll ke bawah → sembunyikan
      navbar.classList.add('nav-hidden');
    } else {
      // Scroll ke atas → tampilkan
      navbar.classList.remove('nav-hidden');
    }
  }

  /* ---------------------------------------------
     Sliding active indicator
     Underline ::after pada .nav-links digerakkan
     dari menu lama ke menu aktif via CSS variables
     (transform + width) — tanpa DOM tambahan.
     --------------------------------------------- */
  function moveIndicator(link) {
    if (!navList || !link) return;
    const listRect = navList.getBoundingClientRect();
    const rect     = link.getBoundingClientRect();
    navList.style.setProperty('--indicator-w', rect.width + 'px');
    navList.style.setProperty('--indicator-x', (rect.left - listRect.left) + 'px');
  }

  function setActive(id) {
    let activeLink = null;

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);
      if (isActive) activeLink = link;
    });

    if (activeLink) {
      moveIndicator(activeLink);
    } else {
      // Di posisi paling atas: sembunyikan indicator
      navList.style.setProperty('--indicator-w', '0px');
    }
  }

  /* ---------------------------------------------
     Scroll handler (rAF throttle — hindari layout thrash)
     --------------------------------------------- */
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;

    navbar.classList.toggle('scrolled', y > 40);
    navbar.classList.remove('navbar-intro');
    updateHide(y);

    let current = '';
    sections.forEach(section => {
      if (y >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });

    setActive(current);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Posisi awal saat halaman dibuka
  onScroll();

  // Indicator tetap presisi saat resize / font selesai loading
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-links a.active');
    if (active) moveIndicator(active);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      const active = document.querySelector('.nav-links a.active');
      if (active) moveIndicator(active);
    });
  }

  /* ---------------------------------------------
     Hamburger menu
     --------------------------------------------- */
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();
