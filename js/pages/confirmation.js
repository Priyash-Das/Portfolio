import { initParticles } from "../modules/particles.js";
import { initCursor } from "../modules/cursor.js";
import { initGlassBackground } from "../modules/glassBackground.js";
import { initPreloader } from "../modules/preloader.js";
import { initContentProtection } from "../modules/contentProtection.js";
import { applyPerfMode } from "../modules/perf.js";
document.addEventListener("DOMContentLoaded", () => {
  applyPerfMode();
  initContentProtection();
  document.addEventListener(
    "preloader:reveal",
    () => {
      initParticles();
      initCursor();
      initGlassBackground();
    },
    { once: true },
  );
  initPreloader({
    contentSelector: ".confirmation-container",
    messages: [
      "SENDING SIGNAL",
      " ",
      "Wait a momment, we are confirming your delivery",
      "PLEASE WAIT...................",
      " ",
      " ",
      "ALMOST DONE",
      " ",
      " ",
      "DELIVERY CONFIRMED",
    ],
    messageDelayMs: 250,
    finalMessageDelayMs: 350,
    finishDelayMs: 1250,
    minDurationMs: 1800,
  });
});
