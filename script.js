"use strict";
/* ================================================================
   EAZY ITR — script.js (Conversion Redesign 2025)
   Formspree endpoint — replace YOUR_ID with your actual form ID
   ================================================================ */

const FORMSPREE_URL = 'https://formspree.io/f/xykbngzo';

/* ---------------------------------------------------------------
   UTILS
   --------------------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const setText = (id, t) => { const el = $(id); if (el) el.textContent = t; };
const setHTML = (id, h) => { const el = $(id); if (el) el.innerHTML = h; };

/* ---------------------------------------------------------------
   1. SHARED — footer, etc.
   --------------------------------------------------------------- */
function initShared() {
  if (typeof CONFIG === 'undefined') return;
  const year = new Date().getFullYear();
  setText('footerName', `© ${year} ${CONFIG.companyName}. All rights reserved.`);
}

/* ---------------------------------------------------------------
   2. MOBILE NAV
   --------------------------------------------------------------- */
function initMobileNav() {
  const hamburger = $('hamburger');
  const overlay   = $('mobileNavOverlay');
  const closeBtn  = $('mobileNavClose');
  if (!hamburger || !overlay) return;

  const open = () => { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; hamburger.setAttribute('aria-expanded','true'); };
  const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; hamburger.setAttribute('aria-expanded','false'); };

  hamburger.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('active')) close(); });
}

/* ---------------------------------------------------------------
   3. HEADER SCROLL
   --------------------------------------------------------------- */
function initHeaderScroll() {
  const h = $('siteHeader');
  if (!h) return;
  window.addEventListener('scroll', () => {
    h.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ---------------------------------------------------------------
   4. HOME PAGE — service cards (top 6 visible, rest hidden)
   --------------------------------------------------------------- */
function initHomePage() {
  const grid      = $('servicesGrid');
  const extraGrid = $('servicesExtraGrid');
  const extraWrap = $('servicesExtra');
  const showBtn   = $('showMoreBtn');
  if (!grid || !CONFIG.services) return;

  const TOP = 6;

  CONFIG.services.forEach((svc, i) => {
    const card = document.createElement('article');
    card.className = 'service-card fade-in';
    card.setAttribute('role', 'listitem');

    const benefits = (svc.benefits || []).map(b => `<li>✔ ${b}</li>`).join('');
    card.innerHTML = `
      <div class="svc-icon">${svc.icon || '📄'}</div>
      <span class="badge-fast">⚡ 24–48 Hours</span>
      <h2 class="card-title">${svc.title}</h2>
      <p class="card-desc">${svc.desc || svc.description || ''}</p>
      <ul class="card-benefits">${benefits}</ul>
      <div class="card-footer">
        <span class="card-price">${svc.price}</span>
        <a href="about.html#contact" class="btn-primary">Pay Now →</a>
      </div>`;

    if (i < TOP) {
      grid.appendChild(card);
    } else if (extraGrid) {
      extraGrid.appendChild(card);
    }
  });

  // Show more toggle
  if (showBtn && extraWrap && CONFIG.services.length > TOP) {
    showBtn.addEventListener('click', () => {
      const open = showBtn.getAttribute('aria-expanded') === 'true';
      if (open) {
        extraWrap.style.display = 'none';
        showBtn.textContent = `View All ${CONFIG.services.length} Services ▼`;
        showBtn.setAttribute('aria-expanded', 'false');
      } else {
        extraWrap.style.display = 'block';
        showBtn.textContent = 'Show Less ▲';
        showBtn.setAttribute('aria-expanded', 'true');
        initFadeIn();
      }
    });
  } else if (showBtn) {
    showBtn.style.display = 'none';
  }

  initCountUp();
  initFadeIn();
}

/* ---------------------------------------------------------------
   5. ABOUT PAGE — stats, founder, contact
   --------------------------------------------------------------- */
function initAboutPage() {
  const a = CONFIG?.about;
  if (!a) return;

  setText('overviewTitle', a.overviewTitle);

  // Stats
  [
    { id: 'stat1', data: a.stat1 },
    { id: 'stat2', data: a.stat2 },
    { id: 'stat3', data: a.stat3 }
  ].forEach(({ id, data }) => {
    if (!data) return;
    setHTML(id, `<span class="stat-val">${data.value}</span><span class="stat-lbl">${data.label}</span>`);
  });

  // Overview — split into 2 paragraphs
  const ovEl = $('overviewText');
  if (ovEl) {
    const sentences = a.overviewText.split('. ');
    const mid = Math.ceil(sentences.length / 2);
    const p1 = sentences.slice(0, mid).join('. ').trim();
    const p2 = sentences.slice(mid).join('. ').trim();
    ovEl.innerHTML = `<p>${p1}${p1.endsWith('.') ? '' : '.'}</p>${p2 ? `<p>${p2}${p2.endsWith('.') ? '' : '.'}</p>` : ''}`;
  }

  setText('missionText', a.missionText);

  // Founder
  const initials = a.founderName.split(' ').map(n => n[0]).join('');
  setText('founderInitial', initials);
  setText('founderName',    a.founderName);
  setText('founderTitle',   a.founderTitle);

  // Multi-paragraph bio
  const bioEl = $('founderBio');
  if (bioEl) {
    const paras = a.founderBio.split('. ');
    const chunk = Math.ceil(paras.length / 3);
    let html = '';
    for (let i = 0; i < paras.length; i += chunk) {
      const seg = paras.slice(i, i + chunk).join('. ').trim();
      if (seg) html += `<p>${seg}${seg.endsWith('.') ? '' : '.'}</p>`;
    }
    bioEl.innerHTML = html;
  }

  const dp = $('detailPhone');
  if (dp) dp.innerHTML = `<a href="tel:${CONFIG.phone}" style="color:inherit;text-decoration:none">${CONFIG.phone}</a>`;

  const de = $('detailEmail');
  if (de) de.innerHTML = `<a href="mailto:${CONFIG.email}" style="color:inherit;text-decoration:none">${CONFIG.email}</a>`;

  initFadeIn();
}

/* ---------------------------------------------------------------
   6. COUNT-UP ANIMATION
   --------------------------------------------------------------- */
function initCountUp() {
  const els = document.querySelectorAll('[data-target]');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur = 1800, interval = 16;
      const inc = target / (dur / interval);
      let cur = 0;
      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) { el.textContent = target.toLocaleString('en-IN'); clearInterval(timer); }
        else el.textContent = Math.floor(cur).toLocaleString('en-IN');
      }, interval);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  els.forEach(el => obs.observe(el));
}

/* ---------------------------------------------------------------
   7. FADE-IN ON SCROLL
   --------------------------------------------------------------- */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}

/* ---------------------------------------------------------------
   8. FAQ ACCORDION
   --------------------------------------------------------------- */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all
      document.querySelectorAll('.faq-q').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = b.closest('.faq-item')?.querySelector('.faq-a');
        if (a) a.hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        ans.hidden = false;
      }
    });
  });
}

/* ---------------------------------------------------------------
   9. CONTACT FORM → FORMSPREE
   --------------------------------------------------------------- */
function initContactForm() {
  const form    = $('contactForm');
  const success = $('formSuccess');
  if (!form) return;

  const fields = {
    name: {
      el: $('fname'), err: $('err-name'),
      validate: v => !v.trim() ? 'Please enter your full name.' : v.trim().length < 2 ? 'Name too short.' : ''
    },
    email: {
      el: $('femail'), err: $('err-email'),
      validate: v => !v.trim() ? 'Please enter your email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email.' : ''
    },
    phone: {
      el: $('fphone'), err: $('err-phone'),
      validate: v => v.trim() && !/^[\d\s+\-()]{7,20}$/.test(v) ? 'Enter a valid phone number.' : ''
    },
    message: {
      el: $('fmessage'), err: $('err-message'),
      validate: v => !v.trim() ? 'Please enter a message.' : v.trim().length < 10 ? 'Message too short.' : ''
    }
  };

  // Live validation on blur/input
  Object.values(fields).forEach(({ el, err, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const e = validate(el.value);
      if (err) err.textContent = e;
      el.classList.toggle('invalid', !!e);
    });
    el.addEventListener('input', () => {
      if (!el.classList.contains('invalid')) return;
      const e = validate(el.value);
      if (err) err.textContent = e;
      el.classList.toggle('invalid', !!e);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    let hasErr = false;
    Object.values(fields).forEach(({ el, err, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      if (err) err.textContent = msg;
      el.classList.toggle('invalid', !!msg);
      if (msg) hasErr = true;
    });
    if (hasErr) return;

    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '⏳ Sending…';
    btn.disabled = true;

    const payload = {
      name:    fields.name.el.value.trim(),
      email:   fields.email.el.value.trim(),
      phone:   fields.phone.el?.value.trim() || 'Not provided',
      service: $('fservice')?.value || 'Not specified',
      message: fields.message.el.value.trim()
    };

    try {
      const res    = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (res.ok) {
        form.style.display = 'none';
        if (success) { success.classList.add('visible'); success.style.display = 'flex'; }
      } else {
        throw new Error(result.error || 'Submission failed.');
      }
    } catch (err) {
      console.error(err);
      btn.innerHTML        = '❌ Error — Try again';
      btn.disabled         = false;
      btn.style.background = '#b91c1c';
      setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; }, 4000);
    }
  });
}

/* ---------------------------------------------------------------
   INIT
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initShared();
  initMobileNav();
  initHeaderScroll();
  initHomePage();
  initAboutPage();
  initFAQ();
  initContactForm();
});
