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
  function initConsentBanner() {
    try {
      if (localStorage.getItem('pixel_analytics_consent')) return;
    } catch (e) {
      return;
    }

    var banner = document.createElement('aside');
    banner.id = 'pixel-cookie-consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Analytics & Privacy Preferences');
    banner.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-[999] p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl transition-all duration-300 text-slate-700 text-xs';
    banner.innerHTML =
      '<div class="flex items-start gap-3">' +
        '<div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-sm">' +
          '<i class="fas fa-shield-halved"></i>' +
        '</div>' +
        '<div class="flex-1">' +
          '<p class="font-bold text-slate-900 text-xs mb-1">Privacy &amp; Analytics Notice</p>' +
          '<p class="text-slate-600 text-[11px] leading-relaxed mb-3">' +
            'We use privacy-friendly Google Analytics to monitor site performance and popular services. No advertising trackers or personal data are collected.' +
          '</p>' +
          '<div class="flex items-center gap-2">' +
            '<button id="pixel-accept-consent" class="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors">' +
              'Accept Analytics' +
            '</button>' +
            '<button id="pixel-decline-consent" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors">' +
              'Decline' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(banner);

    var acceptBtn = document.getElementById('pixel-accept-consent');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try { localStorage.setItem('pixel_analytics_consent', 'granted'); } catch (_) {}
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
        banner.remove();
      });
    }

    var declineBtn = document.getElementById('pixel-decline-consent');
    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        try { localStorage.setItem('pixel_analytics_consent', 'denied'); } catch (_) {}
        gtag('consent', 'update', { 'analytics_storage': 'denied' });
        banner.remove();
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
