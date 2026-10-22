/**
 * analytics.js - Google Analytics 4 (GA4) Integration & Privacy-Friendly Interaction Tracking
 * Measurement ID: G-12FK7KPLP2
 * Website: Pixel by Maliya (https://pixelbymaliya.lk/)
 */

(function () {
  'use strict';

  var MEASUREMENT_ID = 'G-12FK7KPLP2';

  // 1. Initialize dataLayer and global gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // 2. Google Consent Mode v2 Default Settings
  // Deny advertising/remarketing trackers by default; check stored user preference for analytics
  var storedConsent = null;
  try {
    storedConsent = localStorage.getItem('pixel_analytics_consent');
  } catch (e) {
    // LocalStorage might be disabled in private mode
  }
  var initialAnalytics = storedConsent === 'denied' ? 'denied' : 'granted';

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': initialAnalytics,
    'wait_for_update': 500
  });

  gtag('js', new Date());

  // 3. Configure GA4 with IP anonymization and privacy compliance
  gtag('config', MEASUREMENT_ID, {
    send_page_view: true,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  // 4. PII Sanitizer: Strip any accidental emails, phone numbers, or tokens
  function sanitizeParamValue(val) {
    if (typeof val !== 'string') return val;
    var clean = val
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
      .replace(/(\+?\d[\d\s-]{7,}\d)/g, '[REDACTED_PHONE]');
    if (clean.length > 100) clean = clean.substring(0, 100);
    return clean;
  }

  // Deduplication map to prevent accidental double clicks within 1000ms
  var recentEvents = {};

  function trackEvent(eventName, rawParams) {
    if (typeof window.gtag !== 'function') return;
    rawParams = rawParams || {};

    var safeParams = {};
    for (var key in rawParams) {
      if (Object.prototype.hasOwnProperty.call(rawParams, key)) {
        var lower = key.toLowerCase();
        // Never send passwords, contact names, raw messages, or sensitive fields
        if (lower === 'password' || lower === 'token' || lower === 'name' || lower === 'message' || lower === 'email' || lower === 'phone') {
          continue;
        }
        safeParams[key] = sanitizeParamValue(rawParams[key]);
      }
    }

    var dedupeKey = eventName + '_' + JSON.stringify(safeParams);
    var now = Date.now();
    if (recentEvents[dedupeKey] && (now - recentEvents[dedupeKey]) < 1000) {
      return; // Ignore duplicate within 1 second
    }
    recentEvents[dedupeKey] = now;

    window.gtag('event', eventName, safeParams);

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('[GA4 Event] ' + eventName + ':', safeParams);
    }
  }

  // Expose helper globally
  window.pixelTrackEvent = trackEvent;

  // 5. Automated Click Delegation
  function initAutoTracking() {
    document.addEventListener('click', function (e) {
      var target = e.target.closest('a, button, .portfolio-card');
      if (!target) return;

      var href = target.getAttribute('href') || '';

      // A. Service Inquiry Clicks inside #services
      if (target.closest('#services')) {
        var serviceCard = target.closest('.luxury-card');
        var heading = serviceCard ? serviceCard.querySelector('h3') : null;
        var serviceTitle = heading ? heading.textContent.trim() : 'Service';
        trackEvent('service_inquiry_click', {
          service_name: serviceTitle,
          button_location: 'services_grid'
        });
      }

      // B. Portfolio Project Card Clicks
      var portfolioCard = target.closest('.portfolio-card');
      if (portfolioCard) {
        var titleElem = portfolioCard.querySelector('h3, h4, .font-display');
        var cardTitle = titleElem ? titleElem.textContent.trim() : 'Portfolio Project';
        trackEvent('portfolio_view', {
          project_title: cardTitle,
          interaction_type: 'card_click'
        });
      }

      // C. WhatsApp Inquiries
      if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) {
        var loc = 'other';
        if (target.closest('#hero')) loc = 'hero';
        else if (target.closest('nav') || target.closest('#mobileMenu')) loc = 'navigation';
        else if (target.closest('#services')) loc = 'services_section';
        else if (target.closest('#pos-showcase')) loc = 'pos_showcase';
        else if (target.closest('#apps-showcase')) loc = 'apps_showcase';
        else if (target.closest('#tshirt-showcase')) loc = 'tshirt_showcase';
        else if (target.closest('#contact')) loc = 'contact_section';
        else if (target.closest('footer')) loc = 'footer';

        var service = 'general';
        var hrefLower = href.toLowerCase();
        if (hrefLower.indexOf('pos') !== -1) service = 'POS Systems';
        else if (hrefLower.indexOf('app') !== -1) service = 'Custom Mobile Apps';
        else if (hrefLower.indexOf('graphic') !== -1) service = 'Graphic Design';
        else if (hrefLower.indexOf('website') !== -1) service = 'Website Development';
        else if (hrefLower.indexOf('video') !== -1) service = 'Video Editing';
        else if (hrefLower.indexOf('t-shirt') !== -1 || hrefLower.indexOf('tshirt') !== -1) service = 'DTF T-Shirts';

        trackEvent('whatsapp_click', {
          button_location: loc,
          service_category: service,
          outbound_type: 'whatsapp'
        });
        return;
      }

      // D. Direct Telephone Clicks
      if (href.indexOf('tel:') === 0) {
        var phoneLoc = target.closest('#contact') ? 'contact_section' : (target.closest('footer') ? 'footer' : 'navigation');
        trackEvent('phone_click', {
          button_location: phoneLoc,
          channel: 'telephone'
        });
        return;
      }

      // E. Email Link Clicks
      if (href.indexOf('mailto:') === 0) {
        var mailLoc = target.closest('#contact') ? 'contact_section' : (target.closest('footer') ? 'footer' : 'navigation');
        trackEvent('email_click', {
          button_location: mailLoc,
          channel: 'email'
        });
        return;
      }

      // F. POS Demo Open Clicks
      if (href.indexOf('pos/') !== -1 || href.indexOf('pos/index.html') !== -1 || href === 'pos') {
        var posLoc = 'other';
        if (target.closest('#hero')) posLoc = 'hero_cta';
        else if (target.closest('nav') || target.closest('#mobileMenu')) posLoc = 'navigation';
        else if (target.closest('#pos-showcase')) posLoc = 'pos_showcase_section';
        else if (target.closest('#services')) posLoc = 'services_section';
        else if (target.closest('footer')) posLoc = 'footer';

        trackEvent('pos_demo_open', {
          trigger_location: posLoc,
          interaction_type: 'navigation_link'
        });
        return;
      }
    }, true);
  }

  // 6. Non-Intrusive Privacy & Analytics Banner
  function injectConsentStyles() {
    if (document.getElementById('pixel-cookie-consent-style')) return;
    var style = document.createElement('style');
    style.id = 'pixel-cookie-consent-style';
    style.textContent =
      '#pixel-cookie-consent{' +
        'position:fixed!important;' +
        'bottom:1rem!important;' +
        'bottom:max(1rem,env(safe-area-inset-bottom,1rem))!important;' +
        'left:1rem!important;' +
        'right:1rem!important;' +
        'max-width:calc(100vw - 2rem)!important;' +
        'max-height:calc(100vh - 2rem)!important;' +
        'overflow-y:auto!important;' +
        'z-index:999!important;' +
        'pointer-events:auto!important;' +
        'background:rgba(255,255,255,0.98)!important;' +
        'backdrop-filter:blur(16px)!important;' +
        '-webkit-backdrop-filter:blur(16px)!important;' +
        'border:1px solid rgba(203,213,225,0.9)!important;' +
        'border-radius:1rem!important;' +
        'box-shadow:0 20px 35px -5px rgba(15,23,42,0.2),0 8px 16px -6px rgba(15,23,42,0.12)!important;' +
        'padding:1rem!important;' +
        'font-family:"Plus Jakarta Sans",Inter,system-ui,-apple-system,sans-serif!important;' +
        'color:#334155!important;' +
        'font-size:0.75rem!important;' +
        'line-height:1.4!important;' +
        'box-sizing:border-box!important;' +
        'transform:translateZ(0)!important;' +
        'transition:opacity 0.25s ease,transform 0.25s ease!important;' +
      '}' +
      '@media(min-width:640px){' +
        '#pixel-cookie-consent{' +
          'left:auto!important;' +
          'right:1.25rem!important;' +
          'width:400px!important;' +
          'max-width:calc(100vw - 2.5rem)!important;' +
        '}' +
      '}' +
      '#pixel-cookie-consent *{box-sizing:border-box!important;}' +
      '#pixel-cookie-consent .pixel-consent-card{display:flex!important;align-items:flex-start!important;gap:0.75rem!important;}' +
      '#pixel-cookie-consent .pixel-consent-icon{width:2rem!important;height:2rem!important;min-width:2rem!important;border-radius:0.625rem!important;background:#EEF2FF!important;color:#4F46E5!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:0.875rem!important;}' +
      '#pixel-cookie-consent .pixel-consent-body{flex:1 1 auto!important;min-width:0!important;}' +
      '#pixel-cookie-consent .pixel-consent-title{margin:0 0 0.25rem 0!important;font-weight:700!important;color:#0F172A!important;font-size:0.8125rem!important;line-height:1.25!important;font-family:"Space Grotesk",system-ui,sans-serif!important;}' +
      '#pixel-cookie-consent .pixel-consent-desc{margin:0 0 0.75rem 0!important;color:#475569!important;font-size:0.75rem!important;line-height:1.45!important;}' +
      '#pixel-cookie-consent .pixel-consent-actions{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:0.5rem!important;}' +
      '#pixel-cookie-consent button{appearance:none!important;-webkit-appearance:none!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:38px!important;padding:0.45rem 0.95rem!important;font-size:0.75rem!important;font-weight:700!important;border-radius:0.5rem!important;cursor:pointer!important;pointer-events:auto!important;border:1px solid transparent!important;font-family:inherit!important;transition:all 0.2s ease!important;touch-action:manipulation!important;}' +
      '#pixel-cookie-consent button:focus-visible{outline:2px solid #4F46E5!important;outline-offset:2px!important;}' +
      '#pixel-accept-consent{background:#0F172A!important;color:#FFFFFF!important;border-color:#0F172A!important;}' +
      '#pixel-accept-consent:hover{background:#1E293B!important;border-color:#1E293B!important;transform:translateY(-1px)!important;}' +
      '#pixel-accept-consent:active{transform:translateY(0) scale(0.98)!important;}' +
      '#pixel-decline-consent{background:#F1F5F9!important;color:#334155!important;border-color:#CBD5E1!important;}' +
      '#pixel-decline-consent:hover{background:#E2E8F0!important;color:#0F172A!important;transform:translateY(-1px)!important;}' +
      '#pixel-decline-consent:active{transform:translateY(0) scale(0.98)!important;}' +
      'body:has(#lightbox:not(.hidden)) #pixel-cookie-consent,body:has(#mobileMenu:not(.hidden):not(.translate-x-full)) #pixel-cookie-consent,body:has(.fixed.inset-0[id$="-modal"]:not(.hidden)) #pixel-cookie-consent{z-index:40!important;opacity:0!important;pointer-events:none!important;visibility:hidden!important;}';
    (document.head || document.documentElement).appendChild(style);
  }

  function initConsentBanner() {
    try {
      if (localStorage.getItem('pixel_analytics_consent')) return;
    } catch (e) {
      return;
    }

    if (document.getElementById('pixel-cookie-consent')) return;

    injectConsentStyles();

    var banner = document.createElement('aside');
    banner.id = 'pixel-cookie-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Analytics & Privacy Preferences');
    banner.innerHTML =
      '<div class="pixel-consent-card">' +
        '<div class="pixel-consent-icon" aria-hidden="true">' +
          '<i class="fas fa-shield-halved"></i>' +
        '</div>' +
        '<div class="pixel-consent-body">' +
          '<div class="pixel-consent-title">Privacy &amp; Analytics Notice</div>' +
          '<p class="pixel-consent-desc">' +
            'We use privacy-friendly Google Analytics to monitor site performance and popular services. No advertising trackers or personal data are collected.' +
          '</p>' +
          '<div class="pixel-consent-actions">' +
            '<button type="button" id="pixel-accept-consent" aria-label="Accept Analytics Cookies">' +
              'Accept Analytics' +
            '</button>' +
            '<button type="button" id="pixel-decline-consent" aria-label="Decline Analytics Cookies">' +
              'Decline' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    function dismissBanner() {
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(8px)';
      setTimeout(function () {
        if (typeof banner.remove === 'function') {
          banner.remove();
        } else if (banner.parentNode && typeof banner.parentNode.removeChild === 'function') {
          banner.parentNode.removeChild(banner);
        }
      }, 250);
    }

    var acceptBtn = document.getElementById('pixel-accept-consent');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try { localStorage.setItem('pixel_analytics_consent', 'granted'); } catch (_) {}
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
        dismissBanner();
      });
    }

    var declineBtn = document.getElementById('pixel-decline-consent');
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try { localStorage.setItem('pixel_analytics_consent', 'denied'); } catch (_) {}
        gtag('consent', 'update', { 'analytics_storage': 'denied' });
        dismissBanner();
      });
    }
  }

  // 7. Initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initAutoTracking();
      initConsentBanner();
    });
  } else {
    initAutoTracking();
    initConsentBanner();
  }
})();
