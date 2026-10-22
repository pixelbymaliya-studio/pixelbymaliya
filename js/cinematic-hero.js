/**
 * PIXEL BY MALIYA — CINEMATIC HERO ENGINE (REFINED)
 * Ultra-efficient 60fps/30fps Adaptive Native Canvas & Accessibility Engine
 * Zero external dependencies · Battery & Low-End Mobile CPU Optimized
 */

(function () {
  'use strict';

  // ==================== 1. PARTICLE & CODE CONSTELLATION CANVAS ====================
  const canvas = document.getElementById('cinematic-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // Frame rate throttling for low-end mobile CPUs & battery conservation
  const targetFPS = isMobile ? 30 : 60;
  const frameInterval = 1000 / targetFPS;
  let lastFrameTime = 0;

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let animationFrameId = null;
  let isVisible = true;
  let isPageVisible = !document.hidden;

  // Code snippets reflecting core studio services
  const codeTokens = [
    'const pos = new CloudTerminal();',
    '<Website speed="0.8s" seo={100} />',
    'OfflineDB.sync({ status: "active" });',
    'printReceipt({ currency: "LKR" });',
    'brand.vectorExport({ dpi: 300 });',
    'DTF.print({ resolution: "1200dpi" });'
  ];

  const particles = [];
  const tokenEntities = [];
  // Highly conservative particle count on mobile to protect battery and low-end CPU
  const particleCount = isMobile ? 12 : 45;

  let mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

  function resizeCanvas() {
    width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  // Initialize Entities
  function initEntities() {
    particles.length = 0;
    tokenEntities.length = 0;

    const colors = [
      'rgba(56, 189, 248, ',  // Cyan
      'rgba(16, 185, 129, ',  // Emerald
      'rgba(129, 140, 248, '  // Violet
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
        vy: (Math.random() - 0.5) * (isMobile ? 0.25 : 0.4),
        size: Math.random() * 1.8 + 1,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    // 1 token on mobile, 3 on desktop for lightweight performance
    const tokenCount = isMobile ? 1 : 3;
    for (let i = 0; i < tokenCount; i++) {
      tokenEntities.push({
        text: codeTokens[i % codeTokens.length],
        x: (Math.random() * 0.7 + 0.15) * width,
        y: (Math.random() * 0.6 + 0.2) * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.15,
        alpha: 0.2,
        color: i % 2 === 0 ? '#38BDF8' : '#34D399'
      });
    }
  }

  function renderFrame(now) {
    if (!isVisible || !isPageVisible) return;

    if (!prefersReduced) {
      animationFrameId = requestAnimationFrame(renderFrame);
    }

    // FPS Throttling logic (capped to 30fps on mobile to preserve CPU & battery)
    const elapsed = now - lastFrameTime;
    if (elapsed < frameInterval) return;
    lastFrameTime = now - (elapsed % frameInterval);

    ctx.clearRect(0, 0, width, height);

    // Smooth mouse parallax on desktop only
    if (!isMobile) {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
    }

    // Render & Link Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!prefersReduced) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.colorBase + p.alpha + ')';
      ctx.fill();

      // Constellation lines (reduced connection radius on mobile)
      const maxDist = isMobile ? 75 : 105;
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          const linkAlpha = (1 - dist / maxDist) * 0.16;
          ctx.strokeStyle = `rgba(148, 163, 184, ${linkAlpha})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }

    // Render Floating Code Tokens
    ctx.font = '10px "Space Grotesk", "Fira Code", monospace';
    for (let i = 0; i < tokenEntities.length; i++) {
      const t = tokenEntities[i];

      if (!prefersReduced) {
        t.x += t.vx;
        t.y += t.vy;

        if (t.x < -100) t.x = width + 50;
        else if (t.x > width + 50) t.x = -100;
        if (t.y < -20) t.y = height + 20;
        else if (t.y > height + 20) t.y = -20;
      }

      ctx.fillStyle = t.color;
      ctx.globalAlpha = t.alpha;
      ctx.fillText(t.text, t.x, t.y);
      ctx.globalAlpha = 1.0;
    }
  }

  // Mouse Parallax on Desktop
  if (!isMobile) {
    window.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    }, { passive: true });
  }

  window.addEventListener('resize', function () {
    resizeCanvas();
    initEntities();
    if (prefersReduced) renderFrame(performance.now());
  }, { passive: true });

  // Page Visibility API: Halt animation immediately when tab is in background
  document.addEventListener('visibilitychange', function () {
    isPageVisible = !document.hidden;
    if (isPageVisible && isVisible && !prefersReduced) {
      lastFrameTime = performance.now();
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(renderFrame);
    } else {
      cancelAnimationFrame(animationFrameId);
    }
  });

  // IntersectionObserver: Pause rendering when scrolled past hero
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      isVisible = entry.isIntersecting;
      if (isVisible && isPageVisible && !prefersReduced) {
        lastFrameTime = performance.now();
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(renderFrame);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0.05 });

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);

  function startEngine() {
    resizeCanvas();
    initEntities();
    if (prefersReduced) {
      renderFrame(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(renderFrame);
    }
  }

  if (document.readyState === 'complete') {
    (window.requestIdleCallback || setTimeout)(startEngine, 100);
  } else {
    window.addEventListener('load', function () {
      (window.requestIdleCallback || setTimeout)(startEngine, 100);
    });
  }


  // ==================== 2. INTERACTIVE SHOWCASE TABS & KEYBOARD NAV ====================
  const tabButtons = Array.from(document.querySelectorAll('.showcase-tab-btn'));
  const panels = Array.from(document.querySelectorAll('.showcase-panel'));
  let currentTabIndex = 0;
  let autoRotateInterval = null;
  let isHovered = false;

  function activateTab(tabKey, focusTab = false) {
    tabButtons.forEach(function (btn, idx) {
      const match = btn.getAttribute('data-tab') === tabKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
      btn.setAttribute('tabindex', match ? '0' : '-1');
      if (match) {
        currentTabIndex = idx;
        if (focusTab) btn.focus();
      }
    });

    panels.forEach(function (panel) {
      const match = panel.id === `panel-${tabKey}`;
      panel.classList.toggle('active', match);
      panel.setAttribute('aria-hidden', match ? 'false' : 'true');
    });
  }

  // Click & Keyboard Arrow Navigation for Tabs
  tabButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
      activateTab(btn.getAttribute('data-tab'));
    });

    btn.addEventListener('keydown', function (e) {
      let targetIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetIndex = (index + 1) % tabButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      } else if (e.key === 'Home') {
        targetIndex = 0;
      } else if (e.key === 'End') {
        targetIndex = tabButtons.length - 1;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        const targetBtn = tabButtons[targetIndex];
        if (targetBtn) {
          activateTab(targetBtn.getAttribute('data-tab'), true);
        }
      }
    });
  });

  const showcaseContainer = document.querySelector('.showcase-deck-container');
  if (showcaseContainer) {
    showcaseContainer.addEventListener('mouseenter', function () {
      isHovered = true;
    });
    showcaseContainer.addEventListener('mouseleave', function () {
      isHovered = false;
    });
    showcaseContainer.addEventListener('focusin', function () {
      isHovered = true;
    });
    showcaseContainer.addEventListener('focusout', function () {
      isHovered = false;
    });
  }

  // Smooth auto-rotation across disciplines (pauses on interaction or reduced motion)
  if (!prefersReduced && tabButtons.length > 0) {
    autoRotateInterval = setInterval(function () {
      if (isHovered || !isVisible || !isPageVisible) return;
      currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
      const targetBtn = tabButtons[currentTabIndex];
      if (targetBtn) {
        activateTab(targetBtn.getAttribute('data-tab'));
      }
    }, 6000);
  }

  // POS Live Demo Revenue Simulation Ticker
  const posSalesEl = document.getElementById('hero-pos-sales');
  if (posSalesEl) {
    let baseAmount = 148500;
    setInterval(function () {
      if (!isVisible || !isPageVisible) return;
      baseAmount += Math.floor(Math.random() * 850) + 150;
      posSalesEl.textContent = 'LKR ' + baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 4500);
  }
})();
