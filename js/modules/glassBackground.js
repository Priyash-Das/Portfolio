const SHARD_COUNT = 12;
const DEBRIS_COUNT = 15;
let container = null;

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function initGlassBackground() {
  container = document.getElementById("glass-void");
  if (!container) {
    container = document.createElement("div");
    container.id = "glass-void";
    document.body.prepend(container);
  }

  for (let i = 0; i < SHARD_COUNT; i++) {
    const wrap = document.createElement("div");
    wrap.classList.add("shard-wrap");
    if (Math.random() > 0.8) wrap.classList.add("neon-shard");

    const shard = document.createElement("div");
    shard.classList.add("glass-shard");

    const p1 = `${randomBetween(0, 40)}% 0%`;
    const p2 = `100% ${randomBetween(0, 40)}%`;
    const p3 = `${randomBetween(60, 100)}% 100%`;
    const p4 = `0% ${randomBetween(60, 100)}%`;
    shard.style.setProperty("--p1", p1);
    shard.style.setProperty("--p2", p2);
    shard.style.setProperty("--p3", p3);
    shard.style.setProperty("--p4", p4);

    const w = randomBetween(50, 200);
    const h = randomBetween(50, 200);
    wrap.style.width = `${w}px`;
    wrap.style.height = `${h}px`;
    wrap.style.left = `${randomBetween(-10, 100)}%`;
    wrap.style.top = `${randomBetween(-10, 100)}%`;

    wrap.style.setProperty("--x", "0px");
    wrap.style.setProperty("--y", "0px");
    wrap.style.setProperty("--z-start", `${randomBetween(-500, -100)}px`);
    wrap.style.setProperty("--x-end", `${randomBetween(-50, 50)}px`);
    wrap.style.setProperty("--y-end", `${randomBetween(-50, 50)}px`);
    wrap.style.setProperty("--z-end", `${randomBetween(-50, 50)}px`);

    const duration = randomBetween(25, 40);
    wrap.style.animationDuration = `${duration}s`;
    wrap.style.animationDelay = `-${randomBetween(0, duration)}s`;

    wrap.appendChild(shard);
    container.appendChild(wrap);
  }

  for (let i = 0; i < DEBRIS_COUNT; i++) {
    const debris = document.createElement("div");
    debris.classList.add("debris");
    const size = randomBetween(1, 3);
    debris.style.width = `${size}px`;
    debris.style.height = `${size}px`;
    debris.style.left = `${randomBetween(0, 100)}%`;
    debris.style.top = `${randomBetween(0, 100)}%`;
    debris.style.setProperty("--mx", `${randomBetween(-20, 20)}px`);
    debris.style.setProperty("--my", `${randomBetween(-20, 20)}px`);

    const dur = randomBetween(6, 12);
    debris.style.animationDuration = `${dur}s`;
    debris.style.animationDelay = `-${randomBetween(0, dur)}s`;

    container.appendChild(debris);
  }
}
