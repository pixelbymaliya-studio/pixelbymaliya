/**
 * PIXEL BY MALIYA — CINEMATIC HERO ENGINE (ULTRA-OPTIMIZED)
 * Desktop: Full 60fps Native Particle & Code Constellation Engine
 * Mobile: Zero-JS Overhead Pure CSS Cinematic Mode
 * Battery & Performance First · WCAG AAA Accessible
 */

(function () {
  'use strict';

  function isMobileViewport() {
    return window.matchMedia('(max-width: 1023px)').matches || (window.innerWidth > 0 && window.innerWidth < 1024);
  }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==================== 1. DESKTOP-ONLY CANVAS PARTICLE ENGINE ====================
  // On mobile/tablets, canvas engine is completely disabled to ensure 0ms TBT and 0% CPU consumption.
  if (!isMobileViewport() && !prefersReduced) {
    const canvas = document.getElementById('cinematic-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d', { alpha: true });
      if (ctx) {
        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        let animationFrameId = null;
        let isVisible = true;
        let isPageVisible = !document.hidden;

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
        const particleCount = 30; // Optimized count for buttery 60fps on desktop

        let mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

        function resizeCanvas() {
          if (isMobileViewport() || !canvas.parentElement) return;
          width = canvas.parentElement.offsetWidth || window.innerWidth;
          height = canvas.parentElement.offsetHeight || window.innerHeight;
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          canvas.style.width = width + 'px';
          canvas.style.height = height + 'px';
          ctx.scale(dpr, dpr);
        }

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
              vx: (Math.random() - 0.5) * 0.35,
              vy: (Math.random() - 0.5) * 0.35,
              size: Math.random() * 1.6 + 1,
              colorBase: colors[Math.floor(Math.random() * colors.length)],
              alpha: Math.random() * 0.45 + 0.2
            });
          }

          for (let i = 0; i < 3; i++) {
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

        function renderFrame() {
          if (!isVisible || !isPageVisible || isMobileViewport()) return;

          animationFrameId = requestAnimationFrame(renderFrame);

          ctx.clearRect(0, 0, width, height);

          // Smooth cursor parallax on desktop
          mouse.x += (mouse.targetX - mouse.x) * 0.05;
          mouse.y += (mouse.targetY - mouse.y) * 0.05;

          // Render & Link Particles
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            else if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            else if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.colorBase + p.alpha + ')';
            ctx.fill();

            // Link nearby particles
            for (let j = i + 1; j < particles.length; j++) {
              const p2 = particles[j];
              const dx = p.x - p2.x;
              const dy = p.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 90) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                const linkAlpha = (1 - dist / 90) * 0.14;
                ctx.strokeStyle = `rgba(148, 163, 184, ${linkAlpha})`;
                ctx.lineWidth = 0.7;
                ctx.stroke();
              }
            }
          }

          // Render Floating Code Tokens
          ctx.font = '10px "Space Grotesk", "Fira Code", monospace';
          for (let i = 0; i < tokenEntities.length; i++) {
            const t = tokenEntities[i];
            t.x += t.vx;
            t.y += t.vy;

            if (t.x < -100) t.x = width + 50;
            else if (t.x > width + 50) t.x = -100;
            if (t.y < -20) t.y = height + 20;
            else if (t.y > height + 20) t.y = -20;

            ctx.fillStyle = t.color;
            ctx.globalAlpha = t.alpha;
            ctx.fillText(t.text, t.x, t.y);
            ctx.globalAlpha = 1.0;
          }
        }

        window.addEventListener('mousemove', function (e) {
          if (isMobileViewport()) return;
          const rect = canvas.getBoundingClientRect();
          mouse.targetX = e.clientX - rect.left;
          mouse.targetY = e.clientY - rect.top;
        }, { passive: true });

        window.addEventListener('resize', function () {
          if (isMobileViewport()) {
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          } else {
            resizeCanvas();
            initEntities();
            if (!animationFrameId && isVisible && isPageVisible) {
              animationFrameId = requestAnimationFrame(renderFrame);
            }
          }
        }, { passive: true });

        document.addEventListener('visibilitychange', function () {
          isPageVisible = !document.hidden;
          if (isPageVisible && isVisible && !isMobileViewport()) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(renderFrame);
          } else {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        });

        const observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            isVisible = entry.isIntersecting;
            if (isVisible && isPageVisible && !isMobileViewport()) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = requestAnimationFrame(renderFrame);
            } else {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          });
        }, { threshold: 0.05 });

        const heroSection = document.getElementById('hero');
        if (heroSection) observer.observe(heroSection);

        // Defer desktop canvas start until browser is completely idle
        function startEngine() {
          if (isMobileViewport() || prefersReduced) return;
          if (!canvas || canvas.offsetParent === null) return;
          resizeCanvas();
          initEntities();
          animationFrameId = requestAnimationFrame(renderFrame);
        }

        if (document.readyState === 'complete') {
          (window.requestIdleCallback || setTimeout)(startEngine, 200);
        } else {
          window.addEventListener('load', function () {
            (window.requestIdleCallback || setTimeout)(startEngine, 200);
          });
        }
      }
    }
  }


  // ==================== 2. INTERACTIVE SHOWCASE TABS & KEYBOARD NAV ====================
  // Lightweight DOM-only tab switching for all viewports (0ms continuous CPU)
  const tabButtons = Array.from(document.querySelectorAll('.showcase-tab-btn'));
  const panels = Array.from(document.querySelectorAll('.showcase-panel'));
  let currentTabIndex = 0;
  let autoRotateInterval = null;
  let isHovered = false;

  function activateTab(tabKey, focusTab) {
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
      activateTab(btn.getAttribute('data-tab'), false);
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
  if (showcaseContainer && !isMobileViewport()) {
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

  // Auto-rotation across disciplines on desktop only
  if (!isMobileViewport() && !prefersReduced && tabButtons.length > 0) {
    autoRotateInterval = setInterval(function () {
      if (isHovered || document.hidden || isMobileViewport()) return;
      currentTabIndex = (currentTabIndex + 1) % tabButtons.length;
      const targetBtn = tabButtons[currentTabIndex];
      if (targetBtn) {
        activateTab(targetBtn.getAttribute('data-tab'), false);
      }
    }, 6000);
  }

  // POS Live Demo Revenue Simulation Ticker (Desktop only)
  const posSalesEl = document.getElementById('hero-pos-sales');
  if (posSalesEl && !isMobileViewport()) {
    let baseAmount = 148500;
    setInterval(function () {
      if (document.hidden || isMobileViewport()) return;
      baseAmount += Math.floor(Math.random() * 850) + 150;
      posSalesEl.textContent = 'LKR ' + baseAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }, 5000);
  }
})();
