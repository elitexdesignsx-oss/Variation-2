/**
 * Mistress Mei — Variation 2 Core JavaScript
 * $90,000 Haute Minimalist Luxury Editorial Experience
 */
(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // UTILITIES
  // --------------------------------------------------------------------------
  const getEl = (sel, ctx = document) => ctx.querySelector(sel);
  const getEls = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, type, handler, opts) => el && el.addEventListener(type, handler, opts);

  // --------------------------------------------------------------------------
  // 1. AGE GATE (18+ Strict Verification)
  // --------------------------------------------------------------------------
  const initAgeGate = () => {
    const gate = getEl('#age-gate');
    if (!gate) return;

    const TTL_DAYS = 30;
    const enterBtn = getEl('[data-age-enter]', gate);
    const exitBtn = getEl('[data-age-exit]', gate);

    const isVerified = () => {
      try {
        const stored = localStorage.getItem('dk_age_verified_v2');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Date.now() < parsed.expiry) return true;
          localStorage.removeItem('dk_age_verified_v2');
        }
      } catch (e) {}
      return document.cookie.indexOf('dk_age_verified_v2=1') !== -1;
    };

    const dismissGate = () => {
      document.documentElement.classList.add('age-verified');
      gate.hidden = true;
      gate.style.display = 'none';
      gate.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    };

    if (isVerified()) {
      dismissGate();
      return;
    }

    on(enterBtn, 'click', () => {
      const expiry = Date.now() + TTL_DAYS * 24 * 60 * 60 * 1000;
      try {
        localStorage.setItem('dk_age_verified_v2', JSON.stringify({ verified: true, expiry }));
      } catch (e) {}
      document.cookie = `dk_age_verified_v2=1; max-age=${TTL_DAYS * 86400}; path=/; SameSite=Lax`;
      dismissGate();
    });

    on(exitBtn, 'click', () => {
      window.location.href = 'https://www.google.com';
    });
  };

  // --------------------------------------------------------------------------
  // 2. NAVIGATION & SCROLLSPY
  // --------------------------------------------------------------------------
  const initNav = () => {
    const drawer = getEl('#nav-drawer');
    const openBtn = getEl('[data-nav-open]');
    const closeBtn = getEl('[data-nav-close]');
    const drawerLinks = getEls('.nav-drawer__nav a');
    const navLinks = getEls('.desktop-nav a');

    // Mobile drawer toggle
    const toggleDrawer = (open) => {
      if (open) {
        drawer?.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      } else {
        drawer?.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    };

    on(openBtn, 'click', () => toggleDrawer(true));
    on(closeBtn, 'click', () => toggleDrawer(false));
    drawerLinks.forEach((link) => on(link, 'click', () => toggleDrawer(false)));

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && drawer?.classList.contains('is-open')) {
        toggleDrawer(false);
      }
    });

    // Scrollspy
    const sections = getEls('section[id]');
    const handleScrollSpy = () => {
      const scrollY = window.scrollY + 140;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    };

    on(window, 'scroll', handleScrollSpy, { passive: true });
  };

  // --------------------------------------------------------------------------
  // 3. TOAST NOTIFICATION & ONE-CLICK CLIPBOARD COPIER
  // --------------------------------------------------------------------------
  let toastTimer;
  const showToast = (text) => {
    let toast = getEl('#toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-msg';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2800);
  };

  const initTributeCopier = () => {
    const copyChips = getEls('[data-copy-tag]');
    copyChips.forEach((chip) => {
      on(chip, 'click', () => {
        const text = chip.dataset.copyTag;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied "${text}" to clipboard`);
        }).catch(() => {
          showToast(`Tag: ${text}`);
        });
      });
    });
  };

  // --------------------------------------------------------------------------
  // 4. BOOKING SYSTEM & X (TWITTER) DM ROUTING
  // --------------------------------------------------------------------------
  const initBookingSystem = () => {
    const form = getEl('#booking-form');
    const successBanner = getEl('#booking-success');
    if (!form) return;

    on(form, 'submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      const name = getEl('#book-name', form)?.value?.trim() || 'Anonymous';
      const contact = getEl('#book-contact', form)?.value?.trim() || 'N/A';
      const service = getEl('#book-service', form)?.value || 'Custom Inquiries';
      const budget = getEl('#book-budget', form)?.value || 'Discuss in DM';
      const platform = getEl('#book-platform', form)?.value || 'Cash App';
      const details = getEl('#book-details', form)?.value?.trim() || 'N/A';

      const briefText = 
`Hey Mistress Mei, I want to order a custom:
• Name: ${name}
• My X Handle: ${contact}
• What I want: ${service}
• Budget: ${budget}
• Payment via: ${platform}
• Details / Notes: ${details}`;

      btn.textContent = 'Formatting & Opening X...';
      btn.disabled = true;

      // Copy brief to clipboard
      navigator.clipboard.writeText(briefText).then(() => {
        showToast('Request copied! Opening X (@GoddesMei)...');
      }).catch(() => {
        showToast('Opening X...');
      }).finally(() => {
        setTimeout(() => {
          if (successBanner) {
            successBanner.style.display = 'block';
            successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          btn.textContent = originalText;
          btn.disabled = false;
          window.open('https://x.com/GoddesMei', '_blank', 'noopener,noreferrer');
        }, 600);
      });
    });
  };

  // --------------------------------------------------------------------------
  // 5. HERO CURATED IMAGE RANDOM SWITCHER (10s Intervals)
  // --------------------------------------------------------------------------
  const initHeroImageSwitcher = () => {
    const primaryImg = getEl('#heroPrimaryImg');
    const secondaryImg = getEl('#heroSecondaryImg');
    if (!primaryImg || !secondaryImg) return;

    const images = [
      'assets/img/mei_img_1.webp',
      'assets/img/mei_img_2.webp',
      'assets/img/mei_img_3.webp',
      'assets/img/mei_img_4.webp',
      'assets/img/mei_img_5.webp',
      'assets/img/mei_img_6.webp',
      'assets/img/mei_img_7.webp',
      'assets/img/mei_img_8.webp',
      'assets/img/mei_img_9.webp',
      'assets/img/mei_img_10.webp'
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    let currentIndex = 0;
    let isShowingPrimary = true;
    let timer = null;

    const getNextRandomIndex = () => {
      let nextIndex = currentIndex;
      while (nextIndex === currentIndex && images.length > 1) {
        nextIndex = Math.floor(Math.random() * images.length);
      }
      return nextIndex;
    };

    const switchImage = () => {
      if (document.hidden) return;

      const nextIndex = getNextRandomIndex();
      currentIndex = nextIndex;
      const nextSrc = images[nextIndex];

      const activeLayer = isShowingPrimary ? primaryImg : secondaryImg;
      const incomingLayer = isShowingPrimary ? secondaryImg : primaryImg;

      incomingLayer.src = nextSrc;
      incomingLayer.classList.add('is-incoming');

      requestAnimationFrame(() => {
        incomingLayer.classList.add('is-active');
        setTimeout(() => {
          activeLayer.classList.remove('is-active', 'is-incoming');
          incomingLayer.classList.remove('is-incoming');
          isShowingPrimary = !isShowingPrimary;
        }, 1400);
      });
    };

    timer = setInterval(switchImage, 10000);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        clearInterval(timer);
        timer = setInterval(switchImage, 10000);
      }
    });
  };

  // --------------------------------------------------------------------------
  // BOOTSTRAP
  // --------------------------------------------------------------------------
  const start = () => {
    initAgeGate();
    initNav();
    initTributeCopier();
    initBookingSystem();
    initHeroImageSwitcher();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
