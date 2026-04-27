const canvas = document.getElementById("cursor-line");
const ctx = canvas?.getContext("2d");

let width = 0;
let height = 0;
let rafId = 0;
let isInitialized = false;

const SEGMENT_COUNT = 10;
const FOLLOW_TIGHTNESS = 0.32;
const DRAG = 0.5;
const HEAD_RADIUS = 2.5;

const target = { x: 0, y: 0 };
const velocity = { x: 0, y: 0 };
const segments = [];

function resize() {
  if (!canvas || !ctx) return;
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function initSegments(x, y) {
  segments.length = 0;
  for (let i = 0; i < SEGMENT_COUNT; i++) {
    segments.push({ x, y });
  }
}

function onMouseMove(e) {
  target.x = e.clientX;
  target.y = e.clientY;
}

function updateSegments() {
  const head = segments[0];
  if (!head) return;

  const dx = target.x - head.x;
  const dy = target.y - head.y;
  velocity.x = velocity.x * DRAG + dx * FOLLOW_TIGHTNESS;
  velocity.y = velocity.y * DRAG + dy * FOLLOW_TIGHTNESS;

  head.x += velocity.x;
  head.y += velocity.y;

  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1];
    const current = segments[i];
    current.x += (prev.x - current.x) * 0.46;
    current.y += (prev.y - current.y) * 0.46;
  }
}

function drawTrail() {
  if (!ctx || segments.length < 2) return;
  ctx.clearRect(0, 0, width, height);

  const head = segments[0];
  const tail = segments[segments.length - 1];
  const gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
  gradient.addColorStop(0, "rgba(224, 242, 254, 0.95)");
  gradient.addColorStop(0.35, "rgba(56, 189, 248, 0.8)");
  gradient.addColorStop(1, "rgba(34, 211, 238, 0)");

  ctx.beginPath();
  ctx.moveTo(segments[0].x, segments[0].y);

  for (let i = 1; i < segments.length - 1; i++) {
    const current = segments[i];
    const next = segments[i + 1];
    const cpx = (current.x + next.x) * 0.5;
    const cpy = (current.y + next.y) * 0.5;
    ctx.quadraticCurveTo(current.x, current.y, cpx, cpy);
  }
  ctx.lineTo(tail.x, tail.y);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5.5;
  ctx.strokeStyle = gradient;
  ctx.shadowBlur = 16;
  ctx.shadowColor = "#38bdf8";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(head.x, head.y, HEAD_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#e0f2fe";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#38bdf8";
  ctx.fill();

  ctx.shadowBlur = 0;
}

function loop() {
  updateSegments();
  drawTrail();
  rafId = requestAnimationFrame(loop);
}

export function initCursor() {
  if (!canvas || !ctx || isInitialized) return;
  isInitialized = true;

  resize();
  const startX = width * 0.5;
  const startY = height * 0.5;
  target.x = startX;
  target.y = startY;
  initSegments(startX, startY);

  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });

  if (rafId) cancelAnimationFrame(rafId);
  loop();
}
