/**
 * script.js — Apex Advisory
 * Handles:
 *  1. Injecting CONFIG values into both pages
 *  2. Rendering service cards (index.html)
 *  3. Rendering about/founder content (about.html)
 *  4. Contact form validation & simulated submission
 */

"use strict";

/* ------------------------------------------------------------------
   HELPER: Safely set text content of an element by id
   ------------------------------------------------------------------ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHref(id, href) {
  const el = document.getElementById(id);
  if (el) { el.href = href; el.textContent = href.replace('mailto:', ''); }
}

/* ------------------------------------------------------------------
   1. SHARED — Populate header, footer on BOTH pages
   ------------------------------------------------------------------ */
function initShared() {
  setText('companyName', CONFIG.companyName);

  // Footer
  setText('footerName', `© ${new Date().getFullYear()} ${CONFIG.companyName}`);
  setHref('footerEmail', `mailto:${CONFIG.email}`);
  setText('footerPhone', CONFIG.phone);
}

/* ------------------------------------------------------------------
   2. HOME PAGE — Build the 3×3 services grid
   ------------------------------------------------------------------ */
function initHomePage() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return; // not on home page

  // Hero tagline
  setText('heroTagline', CONFIG.tagline);

  CONFIG.services.forEach((svc, i) => {
    const num  = String(i + 1).padStart(2, '0');
    const card = document.createElement('article');
    card.className = 'service-card';
    card.setAttribute('role', 'region');
    card.setAttribute('aria-label', svc.title);

    card.innerHTML = `
      <span class="card-number">${num}</span>
      <h2 class="card-title">${svc.title}</h2>
      <p class="card-desc">${svc.description}</p>
      <span class="card-price">${svc.price}</span>
      <a href="about.html#contact" class="btn-primary">Get Started →</a>
    `;

    grid.appendChild(card);
  });
}

/* ------------------------------------------------------------------
   3. ABOUT PAGE — Populate stats, founder, contact details
   ------------------------------------------------------------------ */
function initAboutPage() {
  const a = CONFIG.about;
  if (!a) return; // not on about page

  // Hero
  setText('overviewTitle', a.overviewTitle);

  // Stats
  [
    { id: 'stat1', data: a.stat1 },
    { id: 'stat2', data: a.stat2 },
    { id: 'stat3', data: a.stat3 }
  ].forEach(({ id, data }) => {
    const el = document.getElementById(id);
    if (el) {
      el.innerHTML = `
        <span class="stat-value">${data.value}</span>
        <span class="stat-label">${data.label}</span>
      `;
    }
  });

  // Overview + Mission text
  setText('overviewText', a.overviewText);
  setText('missionText',  a.missionText);

  // Founder
  const initials = a.founderName
    .split(' ')
    .map(n => n[0])
    .join('');
  setText('founderInitial', initials);
  setText('founderName',  a.founderName);
  setText('founderTitle', a.founderTitle);
  setText('founderBio',   a.founderBio);

  // Contact detail items
  setText('detailPhone',   CONFIG.phone);
  setText('detailEmail',   CONFIG.email);
  setText('detailAddress', CONFIG.address);
}

/* ------------------------------------------------------------------
   4. CONTACT FORM — Validation & simulated submission
   ------------------------------------------------------------------ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  /* ---- Validators ---- */
  const validators = {
    name: {
      field: document.getElementById('fname'),
      errEl: document.getElementById('err-name'),
      validate(val) {
        if (!val.trim()) return 'Please enter your full name.';
        if (val.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      }
    },
    email: {
      field: document.getElementById('femail'),
      errEl: document.getElementById('err-email'),
      validate(val) {
        if (!val.trim()) return 'Please enter your email address.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
        return '';
      }
    },
    phone: {
      field: document.getElementById('fphone'),
      errEl: document.getElementById('err-phone'),
      validate(val) {
        if (val.trim() && !/^[\d\s\+\-\(\)]{7,20}$/.test(val)) {
          return 'Please enter a valid phone number.';
        }
        return ''; // optional field — empty is fine
      }
    },
    message: {
      field: document.getElementById('fmessage'),
      errEl: document.getElementById('err-message'),
      validate(val) {
        if (!val.trim()) return 'Please enter a message.';
        if (val.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      }
    }
  };

  /* ---- Live validation on blur ---- */
  Object.values(validators).forEach(({ field, errEl, validate }) => {
    if (!field) return;
    field.addEventListener('blur', () => {
      const err = validate(field.value);
      errEl.textContent = err;
      field.classList.toggle('invalid', !!err);
    });
    // Clear error on input
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) {
        const err = validate(field.value);
        errEl.textContent = err;
        field.classList.toggle('invalid', !!err);
      }
    });
  });

  /* ---- Submit handler ---- */
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;

    Object.values(validators).forEach(({ field, errEl, validate }) => {
      if (!field) return;
      const err = validate(field.value);
      errEl.textContent = err;
      field.classList.toggle('invalid', !!err);
      if (err) hasErrors = true;
    });

    if (hasErrors) return;

    // Simulate async submission
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled    = true;

    setTimeout(() => {
      // Hide form, show success message
      form.style.display      = 'none';
      success.classList.add('visible');
      success.style.display   = 'flex';
    }, 900); // 900ms simulated delay
  });
}

/* ------------------------------------------------------------------
   5. INITIALISE on DOMContentLoaded
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initShared();
  initHomePage();
  initAboutPage();
  initContactForm();
});
