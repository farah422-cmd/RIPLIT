'use strict';

/* ── Nav: scroll shadow + mobile hamburger ───────────────────────────── */
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

/* ── Smooth scroll for ALL anchor links ─────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#privacy' || href === '#terms') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ── Reveal on scroll ────────────────────────────────────────────────── */
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
    { threshold: 0.10, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Active nav link on scroll ───────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
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
    { threshold: 0.35 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ── Book appointment form ────────────────────────────────────────────── */
(function initBookForm() {
  const form = document.getElementById('bookForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fname   = form.querySelector('[name="first_name"]').value.trim();
    const lname   = form.querySelector('[name="last_name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const phone   = form.querySelector('[name="phone"]').value.trim();
    const service = form.querySelector('[name="service"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    const body = [
      `Name: ${fname} ${lname}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : '',
      `Service: ${service}`,
      message ? `Notes: ${message}` : '',
    ].filter(Boolean).join('\n');

    const subject = encodeURIComponent(`Appointment Request — ${fname} ${lname}`);
    const bodyEnc = encodeURIComponent(body);

    window.location.href = `mailto:info@aestheticbyfilsan.com?subject=${subject}&body=${bodyEnc}`;

    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Request Sent ✓';
    btn.style.background = 'var(--rose-dark)';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent      = orig;
      btn.disabled         = false;
      btn.style.background = '';
      form.reset();
    }, 4000);
  });
})();

/* ── Contact form ────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fname   = form.querySelector('[name="fname"]').value.trim();
    const lname   = form.querySelector('[name="lname"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    const body = [
      `Name: ${fname} ${lname}`,
      `Email: ${email}`,
      subject ? `Topic: ${subject}` : '',
      message ? `Message: ${message}` : '',
    ].filter(Boolean).join('\n');

    const subjectEnc = encodeURIComponent(`Website Inquiry — ${fname} ${lname}`);
    const bodyEnc    = encodeURIComponent(body);

    window.location.href = `mailto:info@aestheticbyfilsan.com?subject=${subjectEnc}&body=${bodyEnc}`;

    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.textContent;
    btn.textContent      = 'Message Sent ✓';
    btn.style.background = 'var(--rose-dark)';
    btn.disabled         = true;

    setTimeout(() => {
      btn.textContent      = orig;
      btn.disabled         = false;
      btn.style.background = '';
      form.reset();
    }, 4000);
  });
})();
