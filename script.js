/* ══════════════════════════════════════════════
   MANO BALAJE — Executive Finance Portfolio
   Premium JavaScript — Animations & Interactions
   ══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Preloader & Init ─── */
  window.addEventListener('load', function () {
    // Dynamic year update
    const copyrightYearEl = document.getElementById('copyrightYear');
    if (copyrightYearEl) {
      copyrightYearEl.textContent = new Date().getFullYear();
    }

    const preloader = document.getElementById('preloader');
    setTimeout(function () {
      preloader.classList.add('hidden');
      document.body.classList.remove('loading');
      animateHeroCounters();
    }, 2200);
  });

  /* ─── Navbar Scroll Effect ─── */
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', function () {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;

    // Back to Top button
    const backToTop = document.getElementById('backToTop');
    if (currentScrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link
    updateActiveNav();
  });

  /* ─── Mobile Nav Toggle ─── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* ─── Active Navigation Link ─── */
  function updateActiveNav() {
    const sections = document.querySelectorAll('.section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ─── Back to Top ─── */
  document.getElementById('backToTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Scroll Reveal Animation ─── */
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ─── Timeline Expand/Collapse ─── */
  window.toggleTimeline = function (id) {
    const card = document.getElementById(id);
    card.classList.toggle('expanded');
  };

  /* ─── Count-Up Animation ─── */
  function animateCounter(element, target, suffix, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(start) + (suffix || '');
    }, 16);
  }

  function animateHeroCounters() {
    const heroStatNumbers = document.querySelectorAll('.hero-stat-number[data-count]');
    heroStatNumbers.forEach(function (el) {
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      animateCounter(el, target, suffix, 2000);
    });
  }

  /* ─── Dashboard KPI Counter Animation ─── */
  const dashboardObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const kpiObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const kpiValues = entry.target.querySelectorAll('.kpi-value[data-count]');
        kpiValues.forEach(function (el) {
          const target = parseInt(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, suffix, 2200);
        });

        // Animate bar chart fills
        const barFills = entry.target.querySelectorAll('.bar-chart-fill[data-width]');
        barFills.forEach(function (fill) {
          setTimeout(function () {
            fill.style.width = fill.getAttribute('data-width') + '%';
          }, 300);
        });

        // Animate donut chart
        animateDonutChart();

        kpiObserver.unobserve(entry.target);
      }
    });
  }, dashboardObserverOptions);

  const dashboardSection = document.getElementById('dashboard');
  if (dashboardSection) {
    kpiObserver.observe(dashboardSection);
  }

  /* ─── Donut Chart Animation ─── */
  function animateDonutChart() {
    const donutFills = document.querySelectorAll('.donut-fill');
    const circumference = 2 * Math.PI * 70; // r=70

    donutFills.forEach(function (circle) {
      const percent = parseFloat(circle.getAttribute('data-percent'));
      const offset = parseFloat(circle.getAttribute('data-offset') || 0);

      // Calculate the stroke dashoffset for this segment
      const segmentLength = (percent / 100) * circumference;
      const offsetRotation = (offset / 100) * circumference;

      // We need to set dasharray to show only this segment
      circle.style.strokeDasharray = segmentLength + ' ' + (circumference - segmentLength);

      // Rotate to position
      const rotationDeg = (offset / 100) * 360 - 90;
      circle.style.transform = 'rotate(' + rotationDeg + 'deg)';
      circle.style.transformOrigin = '80px 80px';

      // Animate: remove the offset to reveal
      setTimeout(function () {
        circle.style.strokeDashoffset = '0';
      }, 500);
    });
  }

  /* ─── Contact Form Handler ─── */
  window.handleFormSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const subject = document.getElementById('formSubject').value;
    const message = document.getElementById('formMessage').value;

    // Compose mailto link
    const mailtoSubject = encodeURIComponent(subject || 'Portfolio Contact from ' + name);
    const mailtoBody = encodeURIComponent(
      'Name: ' + name + '\n' +
      'Email: ' + email + '\n\n' +
      'Message:\n' + message
    );

    window.location.href = 'mailto:mano.balaje1997@gmail.com?subject=' + mailtoSubject + '&body=' + mailtoBody;

    // Show confirmation
    const btn = document.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">✓</span> Message Prepared';
    btn.style.background = 'linear-gradient(135deg, #059669, #10B981)';

    setTimeout(function () {
      btn.innerHTML = originalText;
      btn.style.background = '';
    }, 3000);
  };

  /* ─── Smooth Scroll for Anchor Links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.offsetTop - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

})();
