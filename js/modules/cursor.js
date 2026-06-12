const canvas = document.getElementById("cursor-line"),
  ctx = canvas?.getContext("2d");
let width = 0,
  height = 0,
  rafId = 0,
  isInitialized = false;
const SEGMENT_COUNT = 10,
  FOLLOW_TIGHTNESS = 0.32,
  DRAG = 0.5,
  TRAIL_EASE = 0.46,
  HEAD_RADIUS = 2.5,
  IDLE_EPSILON = 0.02,
  TRAIL_GLOW = 16,
  HEAD_GLOW = 20,
  smallViewport = window.matchMedia("(max-width: 500px)"),
  target = { x: 0, y: 0 },
  velocity = { x: 0, y: 0 },
  segments = [];
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
  if (isInitialized && !rafId) drawTrail();
}
function initSegments(x, y) {
  segments.length = 0;
  for (let i = 0; i < SEGMENT_COUNT; i++) segments.push({ x, y });
}
function onMouseMove(e) {
  target.x = e.clientX;
  target.y = e.clientY;
  wake();
}
function updateSegments() {
  const head = segments[0];
  if (!head) return 0;
  velocity.x = DRAG * velocity.x + FOLLOW_TIGHTNESS * (target.x - head.x);
  velocity.y = DRAG * velocity.y + FOLLOW_TIGHTNESS * (target.y - head.y);
  head.x += velocity.x;
  head.y += velocity.y;
  let moved = Math.max(Math.abs(velocity.x), Math.abs(velocity.y));
  for (let i = 1; i < segments.length; i++) {
    const prev = segments[i - 1],
      seg = segments[i],
      dx = TRAIL_EASE * (prev.x - seg.x),
      dy = TRAIL_EASE * (prev.y - seg.y);
    seg.x += dx;
    seg.y += dy;
    const d = Math.max(Math.abs(dx), Math.abs(dy));
    if (d > moved) moved = d;
  }
  return moved;
}
function drawTrail() {
  if (!ctx || segments.length < 2) return;
  ctx.clearRect(0, 0, width, height);
  const head = segments[0],
    tail = segments[segments.length - 1],
    gradient = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
  gradient.addColorStop(0, "rgba(224, 242, 254, 0.95)");
  gradient.addColorStop(0.35, "rgba(56, 189, 248, 0.8)");
  gradient.addColorStop(1, "rgba(34, 211, 238, 0)");
  ctx.beginPath();
  ctx.moveTo(segments[0].x, segments[0].y);
  for (let i = 1; i < segments.length - 1; i++) {
    const seg = segments[i],
      next = segments[i + 1],
      mx = 0.5 * (seg.x + next.x),
      my = 0.5 * (seg.y + next.y);
    ctx.quadraticCurveTo(seg.x, seg.y, mx, my);
  }
  ctx.lineTo(tail.x, tail.y);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 5.5;
  ctx.strokeStyle = gradient;
  ctx.shadowBlur = TRAIL_GLOW;
  ctx.shadowColor = "#38bdf8";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(head.x, head.y, HEAD_RADIUS, 0, 2 * Math.PI);
  ctx.fillStyle = "#e0f2fe";
  ctx.shadowBlur = HEAD_GLOW;
  ctx.shadowColor = "#38bdf8";
  ctx.fill();
  ctx.shadowBlur = 0;
}
function loop() {
  const moved = updateSegments();
  drawTrail();
  if (moved < IDLE_EPSILON) {
    rafId = 0;
    return;
  }
  rafId = requestAnimationFrame(loop);
}
function wake() {
  if (isInitialized && !rafId && !smallViewport.matches)
    rafId = requestAnimationFrame(loop);
}
export function initCursor() {
  if (!canvas || !ctx || isInitialized) return;
  isInitialized = true;
  resize();
  const cx = 0.5 * width,
    cy = 0.5 * height;
  target.x = cx;
  target.y = cy;
  initSegments(cx, cy);
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", onMouseMove, { passive: true });
  smallViewport.addEventListener("change", (e) => {
    if (e.matches) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    } else wake();
  });
  wake();
}
