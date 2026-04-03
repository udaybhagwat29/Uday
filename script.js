"use strict";

/* ================================================================
   EAZY ITR — script.js
   Form submissions → Formspree (free, no backend needed)
   ⚠️  ONE THING TO CHANGE: Replace YOUR_FORM_ID below with your
       8-character Formspree form ID (e.g. xpwzgkrd)
   ================================================================ */

const FORMSPREE_URL = 'https://formspree.io/f/xykbngzo';

/* ------------------------------------------------------------------
   HELPER
   ------------------------------------------------------------------ */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

/* ------------------------------------------------------------------
   1. SHARED
   ------------------------------------------------------------------ */
function initShared() {
  setText('companyName', CONFIG.companyName);

  const hp = document.getElementById('headerPhone');
  if (hp) { hp.href = `tel:${CONFIG.phone}`; hp.innerHTML = `<span class="hc-icon">📞</span>${CONFIG.phone}`; }

  const he = document.getElementById('headerEmail');
  if (he) { he.href = `mailto:${CONFIG.email}`; he.innerHTML = `<span class="hc-icon">✉</span>${CONFIG.email}`; }

  setText('footerName', `© ${new Date().getFullYear()} ${CONFIG.companyName}`);

  const fp = document.getElementById('footerPhone');
  if (fp) { fp.href = `tel:${CONFIG.phone}`; fp.innerHTML = `📞 ${CONFIG.phone}`; }

  const fe = document.getElementById('footerEmail');
  if (fe) { fe.href = `mailto:${CONFIG.email}`; fe.innerHTML = `✉ ${CONFIG.email}`; }
}

/* ------------------------------------------------------------------
   2. MOBILE NAV
   ------------------------------------------------------------------ */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const overlay   = document.getElementById('mobileNavOverlay');
  const closeBtn  = document.getElementById('mobileNavClose');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeNav() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeNav();
  });
}

/* ------------------------------------------------------------------
   3. HOME PAGE
   ------------------------------------------------------------------ */
function initHomePage() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  setText('heroTagline', CONFIG.tagline);

  CONFIG.services.forEach((svc) => {
    const card = document.createElement('article');
    card.className = 'service-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', svc.title);

    card.innerHTML = `
      <span class="badge-fast">⚡ 24–48 Hours</span>
      <h2 class="card-title">${svc.title}</h2>
      <p class="card-desc">${svc.description}</p>
      <ul class="card-benefits">
        <li>✔ Fast Processing</li>
        <li>✔ CA Verified</li>
        <li>✔ 100% Secure</li>
      </ul>
      <div class="card-footer">
        <span class="card-price">${svc.price}</span>
        <a href="about.html#contact" class="btn-primary" aria-label="Pay Now for ${svc.title}">Pay Now →</a>
      </div>
    `;

    grid.appendChild(card);
  });

  initCountUp();
}

/* ------------------------------------------------------------------
   4. ABOUT PAGE
   ------------------------------------------------------------------ */
function initAboutPage() {
  const a = CONFIG.about;
  if (!a) return;

  setText('overviewTitle', a.overviewTitle);

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

  setText('overviewText', a.overviewText);
  setText('missionText',  a.missionText);

  const initials = a.founderName.split(' ').map(n => n[0]).join('');
  setText('founderInitial', initials);
  setText('founderName',  a.founderName);
  setText('founderTitle', a.founderTitle);
  setText('founderBio',   a.founderBio);

  const dp = document.getElementById('detailPhone');
  if (dp) dp.innerHTML = `<a href="tel:${CONFIG.phone}" style="color:inherit;text-decoration:none;">${CONFIG.phone}</a>`;

  const de = document.getElementById('detailEmail');
  if (de) de.innerHTML = `<a href="mailto:${CONFIG.email}" style="color:inherit;text-decoration:none;">${CONFIG.email}</a>`;
}

/* ------------------------------------------------------------------
   5. COUNT-UP ANIMATION
   ------------------------------------------------------------------ */
function initCountUp() {
  const els = document.querySelectorAll('.trust-number[data-target]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step     = 16;
      const increment = target / (duration / step);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target.toLocaleString('en-IN');
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toLocaleString('en-IN');
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  els.forEach(el => observer.observe(el));
}

/* ------------------------------------------------------------------
   6. CONTACT FORM → FORMSPREE
   ------------------------------------------------------------------ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  const validators = {
    name: {
      field: document.getElementById('fname'),
      errEl: document.getElementById('err-name'),
      validate(val) {
        if (!val.trim())           return 'Please enter your full name.';
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
        if (val.trim() && !/^[\d\s\+\-\(\)]{7,20}$/.test(val)) return 'Please enter a valid phone number.';
        return '';
      }
    },
    message: {
      field: document.getElementById('fmessage'),
      errEl: document.getElementById('err-message'),
      validate(val) {
        if (!val.trim())            return 'Please enter a message.';
        if (val.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      }
    }
  };

  Object.values(validators).forEach(({ field, errEl, validate }) => {
    if (!field) return;
    field.addEventListener('blur', () => {
      const err = validate(field.value);
      errEl.textContent = err;
      field.classList.toggle('invalid', !!err);
    });
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) {
        const err = validate(field.value);
        errEl.textContent = err;
        field.classList.toggle('invalid', !!err);
      }
    });
  });

  form.addEventListener('submit', async (e) => {
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

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Sending…';
    btn.disabled = true;

    const payload = {
      name:    validators.name.field.value.trim(),
      email:   validators.email.field.value.trim(),
      phone:   validators.phone.field.value.trim() || 'Not provided',
      message: validators.message.field.value.trim()
    };

    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept':        'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        form.style.display    = 'none';
        success.classList.add('visible');
        success.style.display = 'flex';
      } else {
        throw new Error(result.error || 'Submission failed. Please try again.');
      }

    } catch (err) {
      console.error('Form error:', err);
      btn.textContent      = '❌ Error — Try Again';
      btn.disabled         = false;
      btn.style.background = '#b91c1c';
      setTimeout(() => {
        btn.textContent      = originalText;
        btn.style.background = '';
        btn.disabled         = false;
      }, 4000);
    }
  });
}

/* ------------------------------------------------------------------
   INIT
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  initShared();
  initMobileNav();
  initHomePage();
  initAboutPage();
  initContactForm();
});
