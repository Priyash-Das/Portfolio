import { isLowEnd } from "./perf.js";
const SHARD_COUNT = isLowEnd ? 6 : 12,
  DEBRIS_COUNT = isLowEnd ? 8 : 15,
  smallViewport = window.matchMedia("(max-width: 500px)");
let built = false;
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function build() {
  if (built) return;
  built = true;
  let container = document.getElementById("glass-void");
  if (!container) {
    container = document.createElement("div");
    container.id = "glass-void";
    document.body.prepend(container);
  }
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < SHARD_COUNT; i++) {
    const wrap = document.createElement("div");
    wrap.classList.add("shard-wrap");
    if (Math.random() > 0.8) wrap.classList.add("neon-shard");
    const shard = document.createElement("div");
    shard.classList.add("glass-shard");
    shard.style.setProperty("--p1", `${randomBetween(0, 40)}% 0%`);
    shard.style.setProperty("--p2", `100% ${randomBetween(0, 40)}%`);
    shard.style.setProperty("--p3", `${randomBetween(60, 100)}% 100%`);
    shard.style.setProperty("--p4", `0% ${randomBetween(60, 100)}%`);
    wrap.style.width = `${randomBetween(50, 200)}px`;
    wrap.style.height = `${randomBetween(50, 200)}px`;
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
    fragment.appendChild(wrap);
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
    const duration = randomBetween(6, 12);
    debris.style.animationDuration = `${duration}s`;
    debris.style.animationDelay = `-${randomBetween(0, duration)}s`;
    fragment.appendChild(debris);
  }
  container.appendChild(fragment);
}
function onViewportChange(e) {
  if (!e.matches && !built) {
    build();
    smallViewport.removeEventListener("change", onViewportChange);
  }
}
export function initGlassBackground() {
  if (built) return;
  if (smallViewport.matches) {
    smallViewport.addEventListener("change", onViewportChange);
    return;
  }
  build();
}
