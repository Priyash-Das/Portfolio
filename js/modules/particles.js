import { isLowEnd } from "./perf.js";
const canvas = document.getElementById("particle-canvas"),
  ctx = canvas?.getContext("2d");
const CONNECTION_DIST = 100,
  CONNECTION_DIST_SQ = CONNECTION_DIST * CONNECTION_DIST,
  MAX_PARTICLES = isLowEnd ? 35 : 60,
  TWO_PI = 2 * Math.PI,
  DOT_COLOR = "rgba(56,189,248,0.35)",
  LINE_COLOR = "rgb(34,211,238)",
  smallViewport = window.matchMedia("(max-width: 500px)");
let particles = [],
  width = 0,
  height = 0,
  rafId = 0,
  resizeTimer = 0,
  isInitialized = false;
function resize() {
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function createParticles() {
  const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / 12e3));
  particles = [];
  for (let i = 0; i < count; i++)
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: 0.8 * (Math.random() - 0.5),
      vy: 0.8 * (Math.random() - 0.5),
      radius: 2 * Math.random() + 1,
    });
}
function update() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = DOT_COLOR;
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) {
      p.x = 0;
      p.vx = -p.vx;
    } else if (p.x > width) {
      p.x = width;
      p.vx = -p.vx;
    }
    if (p.y < 0) {
      p.y = 0;
      p.vy = -p.vy;
    } else if (p.y > height) {
      p.y = height;
      p.vy = -p.vy;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, TWO_PI);
    ctx.fill();
  }
  ctx.strokeStyle = LINE_COLOR;
  ctx.lineWidth = 0.7;
  for (let i = 0; i < particles.length; i++) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j++) {
      const b = particles[j];
      const dx = a.x - b.x,
        dy = a.y - b.y,
        distSq = dx * dx + dy * dy;
      if (distSq >= CONNECTION_DIST_SQ) continue;
      ctx.globalAlpha = 1 - Math.sqrt(distSq) / CONNECTION_DIST;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
  rafId = requestAnimationFrame(update);
}
function start() {
  if (isInitialized && !rafId && !smallViewport.matches)
    rafId = requestAnimationFrame(update);
}
function stop() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = 0;
  }
}
function onResize() {
  resize();
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(createParticles, 150);
}
export function initParticles() {
  if (!canvas || !ctx || isInitialized) return;
  isInitialized = true;
  resize();
  createParticles();
  window.addEventListener("resize", onResize);
  smallViewport.addEventListener("change", (e) =>
    e.matches ? stop() : start(),
  );
  start();
}
