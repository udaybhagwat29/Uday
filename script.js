"use strict";
/* ================================================================
   EAZY ITR — script.js (CRO Optimized 2025 — Full Upgrade)
   Features: Countdown timers, Social proof, Exit intent,
             Offer banner, Floating CTA, Bundle section
   Formspree endpoint
   ================================================================ */

const FORMSPREE_URL = 'https://formspree.io/f/xykbngzo';

/* ---------------------------------------------------------------
   UTILS
   --------------------------------------------------------------- */
const $ = (id) => document.getElementById(id);
const setText = (id, t) => { const el = $(id); if (el) el.textContent = t; };
const setHTML = (id, h) => { const el = $(id); if (el) el.innerHTML = h; };

/* ---------------------------------------------------------------
   1. SHARED — footer copyright
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

  const open  = () => { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; hamburger.setAttribute('aria-expanded', 'true'); };
  const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; hamburger.setAttribute('aria-expanded', 'false'); };

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
   4. COUNTDOWN TIMERS — Daily reset at midnight
   --------------------------------------------------------------- */

/** Returns seconds remaining until midnight */
function getSecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 59, 59, 999);
  return Math.max(0, Math.floor((midnight - now) / 1000));
}

/** Formats seconds → HH:MM:SS */
function formatHMS(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}

function initCountdownTimers() {
  // IDs of all daily countdown elements
  const dailyTimerIds = ['bannerCountdown', 'heroCountdown', 'pricingCountdown', 'aboutCountdown'];

  let remaining = getSecondsUntilMidnight();

  function tick() {
    const display = formatHMS(remaining);
    dailyTimerIds.forEach(id => {
      const el = $(id);
      if (el) el.textContent = display;
    });
    if (remaining > 0) {
      remaining--;
    } else {
      // Reset to full day at midnight
      remaining = 86399;
    }
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------------
   5. DYNAMIC URGENCY — filed today count
   --------------------------------------------------------------- */
function initDynamicUrgency() {
  const today = new Date();
  const seed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
  const pseudo = (seed * 9301 + 49297) % 233280;
  const filedCount = 18 + (pseudo % 28); // 18–45 range

  const els = document.querySelectorAll('#filedTodayTop, #filedTodayCard');
  els.forEach(el => { if (el) el.textContent = `${filedCount}`; });
}

/* ---------------------------------------------------------------
   6. OFFER BANNER — close button
   --------------------------------------------------------------- */
function initOfferBanner() {
  const banner  = $('offerBanner');
  const closeBtn = $('obClose');
  if (!banner || !closeBtn) return;

  // Check if dismissed today
  const dismissed = sessionStorage.getItem('bannerDismissed');
  if (dismissed) {
    banner.style.display = 'none';
    return;
  }

  closeBtn.addEventListener('click', () => {
    banner.style.maxHeight = banner.offsetHeight + 'px';
    banner.style.overflow = 'hidden';
    banner.style.transition = 'max-height .35s ease, opacity .35s ease, padding .35s ease';
    requestAnimationFrame(() => {
      banner.style.maxHeight = '0';
      banner.style.opacity = '0';
      banner.style.padding = '0';
    });
    setTimeout(() => { banner.style.display = 'none'; }, 380);
    sessionStorage.setItem('bannerDismissed', '1');
  });
}

/* ---------------------------------------------------------------
   7. HOME PAGE — service cards
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
    const waMsg = encodeURIComponent(`Hi, I'm interested in ${svc.title}. Please help.`);
    card.innerHTML = `
      <div class="svc-icon">${svc.icon || '📄'}</div>
      <span class="badge-fast">⚡ 24–48 Hours</span>
      <h2 class="card-title">${svc.title}</h2>
      <p class="card-desc">${svc.desc || svc.description || ''}</p>
      <ul class="card-benefits">${benefits}</ul>
      <div class="card-footer">
        <span class="card-price">${svc.price}</span>
        <div class="card-cta-group">
          <a href="https://wa.me/919270267331?text=${waMsg}" class="btn-card-wa">💬 Ask CA</a>
          <a href="about.html#contact" class="btn-primary">Pay Now →</a>
        </div>
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
   8. ABOUT PAGE — stats, founder, contact details
   --------------------------------------------------------------- */
function initAboutPage() {
  const a = CONFIG?.about;
  if (!a) return;

  // Set title both instances
  ['overviewTitle', 'overviewTitle2'].forEach(id => setText(id, a.overviewTitle));

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
   9. COUNT-UP ANIMATION
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
   10. FADE-IN ON SCROLL
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
   11. FAQ ACCORDION
   --------------------------------------------------------------- */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
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
   12. CONTACT FORM → FORMSPREE
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
      validate: v => !v.trim() ? 'Please enter your phone number.' : !/^[\d\s+\-()]{7,20}$/.test(v) ? 'Enter a valid phone number.' : ''
    },
    message: {
      el: $('fmessage'), err: $('err-message'),
      validate: v => !v.trim() ? 'Please enter a message.' : v.trim().length < 10 ? 'Message too short.' : ''
    }
  };

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
   13. SOCIAL PROOF POPUP (NEW)
   --------------------------------------------------------------- */
const SOCIAL_PROOF_DATA = [
  { name: 'Rohit', city: 'Mumbai',     initial: 'R', action: 'just filed their ITR ✅' },
  { name: 'Priya', city: 'Pune',       initial: 'P', action: 'just paid for ITR filing 💳' },
  { name: 'Amit',  city: 'Delhi',      initial: 'A', action: 'just got their ITR filed ✅' },
  { name: 'Sneha', city: 'Bangalore',  initial: 'S', action: 'just saved ₹12,000 in taxes 🎉' },
  { name: 'Raj',   city: 'Hyderabad',  initial: 'R', action: 'just filed GST returns 📊' },
  { name: 'Meera', city: 'Chennai',    initial: 'M', action: 'just filed their ITR ✅' },
  { name: 'Kiran', city: 'Ahmedabad',  initial: 'K', action: 'just registered for GST 📋' },
  { name: 'Deepa', city: 'Kolkata',    initial: 'D', action: 'just got ITR acknowledgement ✅' },
  { name: 'Vikas', city: 'Jaipur',     initial: 'V', action: 'just saved ₹8,500 in taxes 💰' },
  { name: 'Anita', city: 'Nagpur',     initial: 'A', action: 'just filed business ITR 🏢' },
];

function initSocialProof() {
  const popup    = $('spPopup');
  const spName   = $('spName');
  const spAction = $('spAction');
  const spAvatar = $('spAvatar');
  const spClose  = $('spClose');
  if (!popup) return;

  let idx = 0;
  let hideTimer = null;

  function showPopup() {
    const person = SOCIAL_PROOF_DATA[idx % SOCIAL_PROOF_DATA.length];
    idx++;

    if (spName)   spName.textContent   = `${person.name} from ${person.city}`;
    if (spAction) spAction.textContent = person.action;
    if (spAvatar) spAvatar.textContent = person.initial;

    popup.classList.add('visible');

    // Auto-hide after 5 seconds
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => popup.classList.remove('visible'), 5000);
  }

  // Close button
  if (spClose) {
    spClose.addEventListener('click', () => {
      clearTimeout(hideTimer);
      popup.classList.remove('visible');
    });
  }

  // Initial delay then every 12–20 seconds
  setTimeout(() => {
    showPopup();
    setInterval(showPopup, 14000 + Math.random() * 6000);
  }, 8000);
}

/* ---------------------------------------------------------------
   14. EXIT INTENT POPUP (NEW)
   --------------------------------------------------------------- */
function initExitIntent() {
  const overlay  = $('exitOverlay');
  const closeBtn = $('exitClose');
  const decline  = $('exitDecline');
  const ctaLink  = $('exitCta');
  if (!overlay) return;

  let shown = false;
  let exitTimerInterval = null;

  function showExitPopup() {
    if (shown) return;
    shown = true;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    startExitCountdown();
  }

  function hideExitPopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    clearInterval(exitTimerInterval);
  }

  // Exit countdown — 10 minutes
  function startExitCountdown() {
    let seconds = 10 * 60;
    const el = $('exitCountdown');

    function tick() {
      if (!el) return;
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      el.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      if (seconds <= 0) {
        clearInterval(exitTimerInterval);
        el.textContent = 'EXPIRED';
        el.style.color = '#6b7280';
      } else {
        seconds--;
      }
    }

    tick();
    exitTimerInterval = setInterval(tick, 1000);
  }

  // Mouse leave from top 20% of page
  document.addEventListener('mouseleave', e => {
    if (e.clientY < window.innerHeight * 0.08) {
      // Small delay to avoid false triggers
      setTimeout(showExitPopup, 300);
    }
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', hideExitPopup);
  if (decline)  decline.addEventListener('click', hideExitPopup);
  if (ctaLink)  ctaLink.addEventListener('click', hideExitPopup);
  overlay.addEventListener('click', e => { if (e.target === overlay) hideExitPopup(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('active')) hideExitPopup(); });

  // Mobile: show after 90s of inactivity
  let mobileTimer = null;
  function resetMobileTimer() {
    clearTimeout(mobileTimer);
    mobileTimer = setTimeout(showExitPopup, 90000);
  }
  if ('ontouchstart' in window) {
    ['touchstart', 'scroll'].forEach(ev => window.addEventListener(ev, resetMobileTimer, { passive: true }));
    resetMobileTimer();
  }
}

/* ---------------------------------------------------------------
   15. FLOATING CTA — show after scroll
   --------------------------------------------------------------- */
function initFloatingCta() {
  const btn = $('floatingCta');
  if (!btn) return;

  // Always visible on mobile, show after 300px scroll on desktop
  function toggleVisibility() {
    if (window.innerWidth <= 768) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'all';
    } else {
      const visible = window.scrollY > 300;
      btn.style.opacity = visible ? '1' : '0';
      btn.style.pointerEvents = visible ? 'all' : 'none';
    }
  }

  btn.style.transition = 'opacity .3s ease';
  btn.style.opacity = '0';
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
}

/* ---------------------------------------------------------------
   INIT
   --------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initShared();
  initMobileNav();
  initHeaderScroll();
  initCountdownTimers();
  initDynamicUrgency();
  initOfferBanner();
  initHomePage();
  initAboutPage();
  initFAQ();
  initContactForm();
  initSocialProof();
  initExitIntent();
  initFloatingCta();
  initFadeIn();
});
