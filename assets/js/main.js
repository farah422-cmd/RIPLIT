/* ══════════════════════════════════════════════════════════════════════
   Center for AI Inclusion — Main JS
   ══════════════════════════════════════════════════════════════════════ */

'use strict';

/* ── Nav: scroll-glass effect + mobile hamburger ─────────────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ── Hero Canvas: neural network particle animation ──────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles, animId;

  const CONFIG = {
    count:        70,
    maxDist:      160,
    speed:        0.28,
    nodeRadius:   1.8,
    lineOpacity:  0.15,
    nodeOpacity:  0.5,
    colorGreen:   [34, 197, 94],
    colorTeal:    [45, 212, 191],
    colorLight:   [74, 222, 128],
  };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomColor() {
    const colors = [CONFIG.colorGreen, CONFIG.colorTeal, CONFIG.colorLight];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      const c = randomColor();
      particles.push({
        x:   Math.random() * W,
        y:   Math.random() * H,
        vx:  (Math.random() - 0.5) * CONFIG.speed,
        vy:  (Math.random() - 0.5) * CONFIG.speed,
        r:   Math.random() * 1.5 + CONFIG.nodeRadius * 0.5,
        cr:  c[0], cg: c[1], cb: c[2],
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      /* Move */
      a.x += a.vx;
      a.y += a.vy;
      if (a.x < 0 || a.x > W) a.vx *= -1;
      if (a.y < 0 || a.y > H) a.vy *= -1;

      /* Draw connections */
      for (let j = i + 1; j < particles.length; j++) {
        const b    = particles[j];
        const dx   = a.x - b.x;
        const dy   = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > CONFIG.maxDist) continue;

        const alpha = CONFIG.lineOpacity * (1 - dist / CONFIG.maxDist);
        const mx = (a.cr + b.cr) / 2;
        const my = (a.cg + b.cg) / 2;
        const mz = (a.cb + b.cb) / 2;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${mx},${my},${mz},${alpha})`;
        ctx.lineWidth   = 0.7;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      /* Draw node */
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${a.cr},${a.cg},${a.cb},${CONFIG.nodeOpacity})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  function init() {
    resize();
    createParticles();
    if (animId) cancelAnimationFrame(animId);
    draw();
  }

  const ro = new ResizeObserver(() => {
    resize();
    createParticles();
  });
  ro.observe(canvas.parentElement);

  /* Pause when tab not visible (save GPU) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });

  init();
})();

/* ── Reveal on scroll (Intersection Observer) ────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Animated counters ───────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.floor(easeOutQuart(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();

/* ── Active nav link highlight on scroll ────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const links    = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ── Contact form: basic validation + submit ─────────────────────────── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled    = true;

    try {
      const data = new FormData(form);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });

      btn.textContent      = 'Message Sent ✓';
      btn.style.background = 'linear-gradient(135deg,#00ffb3,#00c6ff)';
      btn.style.color      = '#03070f';
      form.reset();

      setTimeout(() => {
        btn.textContent      = orig;
        btn.disabled         = false;
        btn.style.background = '';
        btn.style.color      = '';
      }, 4000);
    } catch {
      btn.textContent = 'Error — please try again';
      btn.disabled    = false;
      setTimeout(() => { btn.textContent = orig; }, 3000);
    }
  });
})();

/* ── Volunteer form ─────────────────────────────────────────────────── */
(function initVolunteerForm() {
  const form = document.getElementById('volunteerForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = document.getElementById('volunteerSubmit');
    const orig = btn.textContent;
    btn.textContent = 'Submitting…';
    btn.disabled    = true;

    try {
      const data = new FormData(form);
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      btn.textContent      = 'Application Submitted ✓';
      btn.style.background = 'linear-gradient(135deg,#22C55E,#2DD4BF)';
      btn.style.color      = '#040D07';
      form.reset();
      setTimeout(() => {
        btn.textContent      = orig;
        btn.disabled         = false;
        btn.style.background = '';
        btn.style.color      = '';
      }, 5000);
    } catch {
      /* Fallback: open mail client */
      const fields = new FormData(form);
      let body = '';
      fields.forEach((v, k) => { body += `${k}: ${v}\n`; });
      window.location.href = `mailto:info@centerforaiinclusion.org?subject=Volunteer Application&body=${encodeURIComponent(body)}`;
      btn.textContent = orig;
      btn.disabled    = false;
    }
  });
})();

/* ── Smooth scroll polyfill for anchor clicks ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
