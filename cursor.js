function initNeonCursor() {
  const canvas = document.getElementById("cursor-line");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = window.innerWidth;
  let height = window.innerHeight;
  window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
  window.dispatchEvent(new Event("resize"));
  const target = { x: width / 2, y: height / 2 };
  const current = { x: width / 2, y: height / 2 };
  const trail = [];
  const TRAIL_LENGTH = 10;
  const SMOOTH_FACTOR = 0.4;
  window.addEventListener("mousemove", (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  });
  function animate() {
    current.x += (target.x - current.x) * SMOOTH_FACTOR;
    current.y += (target.y - current.y) * SMOOTH_FACTOR;
    trail.push({ x: current.x, y: current.y });
    if (trail.length > TRAIL_LENGTH) {
      trail.shift();
    }
    ctx.clearRect(0, 0, width, height);
    if (trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length - 1; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      const gradient = ctx.createLinearGradient(
        trail[0].x,
        trail[0].y,
        trail[trail.length - 1].x,
        trail[trail.length - 1].y
      );
      gradient.addColorStop(0, "rgba(56, 189, 248, 0)");
      gradient.addColorStop(1, "rgba(34, 211, 238, 1)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#22d3ee";
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(current.x, current.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#e0f2fe";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#38bdf8";
    ctx.fill();
    ctx.shadowBlur = 0;
    requestAnimationFrame(animate);
  }
  animate();
}
document.addEventListener("DOMContentLoaded", initNeonCursor);
