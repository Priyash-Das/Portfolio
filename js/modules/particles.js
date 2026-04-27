const canvas = document.getElementById("particle-canvas");
const ctx = canvas?.getContext("2d");

let particles = [];
const CONNECTION_DIST = 100;
const MAX_PARTICLES = 60;
const grid = new Map();

let width, height;

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
  const count = Math.min(MAX_PARTICLES, Math.floor((width * height) / 12000));
  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      idx: i,
    });
  }
}

function spatialHash(x, y) {
  const cell = CONNECTION_DIST;
  return `${Math.floor(x / cell)},${Math.floor(y / cell)}`;
}

function update() {
  ctx.clearRect(0, 0, width, height);
  grid.clear();

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    const key = spatialHash(p.x, p.y);
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(p);

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(56,189,248,0.35)";
    ctx.fill();
  });

  const drawn = new Set();
  for (const [key, cell] of grid) {
    for (let i = 0; i < cell.length; i++) {
      const a = cell[i];
      const [cx, cy] = key.split(",").map(Number);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const nKey = `${cx + dx},${cy + dy}`;
          const neighbors = grid.get(nKey) || [];
          for (let j = 0; j < neighbors.length; j++) {
            const b = neighbors[j];
            if (a === b) continue;
            const pairId =
              a.idx < b.idx ? `${a.idx}_${b.idx}` : `${b.idx}_${a.idx}`;
            if (drawn.has(pairId)) continue;
            const dxp = a.x - b.x,
              dyp = a.y - b.y;
            const dist = Math.sqrt(dxp * dxp + dyp * dyp);
            if (dist < CONNECTION_DIST) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(34,211,238,${1 - dist / CONNECTION_DIST})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
              drawn.add(pairId);
            }
          }
        }
      }
    }
  }

  requestAnimationFrame(update);
}

export function initParticles() {
  if (!canvas || !ctx) return;
  resize();
  createParticles();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
  update();
}
