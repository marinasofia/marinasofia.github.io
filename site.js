'use strict';
const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
let theme = 'dark';
try { theme = localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'; } catch {}
function applyTheme() {
  root.dataset.theme = theme;
  themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  themeButton.setAttribute('aria-label', 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
}
applyTheme();
themeButton.hidden = false;
themeButton.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});

class OriginalBackdrop {
  constructor() {
    this.mouse = { x: -9999, y: -9999 };
    this.particles = [];
    this.raf = 0;
    this.scrollRaf = 0;
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.pRGB = '234,232,227';
  }
  resizeCanvas() {
    const c = document.querySelector('#backdrop-particles');
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = window.innerWidth * dpr;
    c.height = window.innerHeight * dpr;
    c.style.width = window.innerWidth + 'px';
    c.style.height = window.innerHeight + 'px';
    c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  initParticles() {
    const mobile = matchMedia('(max-width: 860px)').matches;
    const n = mobile ? 25 : 60;
    const w = window.innerWidth, h = window.innerHeight;
    this.particles = Array.from({ length: n }, () => {
      const bvx = (Math.random() - 0.5) * 0.14;
      const bvy = -(0.06 + Math.random() * 0.12);
      return {
        x: Math.random() * w, y: Math.random() * h,
        vx: bvx, vy: bvy, bvx, bvy,
        r: 0.6 + Math.random() * 0.9,
        a: 0.15 + Math.random() * 0.35,
      };
    });
  }

  startLoop() {
    cancelAnimationFrame(this.raf);
    if (this.reduced) { this.drawFrame(false); return; }
    const tick = () => { this.drawFrame(true); this.raf = requestAnimationFrame(tick); };
    this.raf = requestAnimationFrame(tick);
  }

  drawFrame(move) {
    const c = document.querySelector('#backdrop-particles');
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    const ps = this.particles;
    if (move) {
      for (const p of ps) {
        const dx = this.mouse.x - p.x, dy = this.mouse.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500 && d2 > 1) {
          const d = Math.sqrt(d2);
          p.vx += (dx / d) * 0.012;
          p.vy += (dy / d) * 0.012;
        }
        p.vx += (p.bvx - p.vx) * 0.03;
        p.vy += (p.bvy - p.vy) * 0.03;
        p.x += p.vx; p.y += p.vy;
        if (p.y < -12) p.y = h + 10;
        if (p.y > h + 12) p.y = -10;
        if (p.x < -12) p.x = w + 10;
        if (p.x > w + 12) p.x = -10;
      }
      ctx.lineWidth = 0.5;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 12100) {
            const alpha = (1 - Math.sqrt(d2) / 110) * 0.14;
            ctx.strokeStyle = 'rgba(' + this.pRGB + ',' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }
    }
    for (const p of ps) {
      ctx.fillStyle = 'rgba(' + this.pRGB + ',' + p.a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

if (document.querySelector('#backdrop-particles')) {
  const scene = new OriginalBackdrop();
  const skyline = document.querySelector('.original-skyline');
  const motion = document.querySelector('#motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  function updateMotion() {
    cancelAnimationFrame(scene.raf);
    scene.raf = 0;
    scene.reduced = preference.matches || paused;
    scene.pRGB = root.dataset.theme === 'light' ? '28,34,36' : '234,232,227';
    motion.hidden = preference.matches;
    motion.textContent = paused ? 'Resume motion' : 'Pause motion';
    motion.setAttribute('aria-pressed', String(paused));
    if (!document.hidden) scene.startLoop();
  }
  scene.resizeCanvas();
  scene.initParticles();
  motion.addEventListener('click', () => { paused = !paused; updateMotion(); });
  preference.addEventListener('change', () => {
    skyline.style.transform = '';
    updateMotion();
  });
  themeButton.addEventListener('click', updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  window.addEventListener('resize', () => {
    scene.resizeCanvas();
    if (scene.reduced) scene.drawFrame(false);
  });
  window.addEventListener('mousemove', event => {
    scene.mouse.x = event.clientX;
    scene.mouse.y = event.clientY;
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => {
    scene.mouse.x = -9999;
    scene.mouse.y = -9999;
  });
  window.addEventListener('scroll', () => {
    if (scene.scrollRaf || scene.reduced) return;
    scene.scrollRaf = requestAnimationFrame(() => {
      scene.scrollRaf = 0;
      if (!scene.reduced) skyline.style.transform = 'translate3d(0,' + (window.scrollY * .5) + 'px,0)';
    });
  }, { passive: true });
  updateMotion();
}
