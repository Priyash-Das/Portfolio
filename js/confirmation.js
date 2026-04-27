import { initParticles } from "./modules/particles.js";
import { initCursor } from "./modules/cursor.js";
import { initGlassBackground } from "./modules/glassBackground.js";
import { initPreloader } from "./modules/preloader.js";

document.addEventListener("DOMContentLoaded", () => {
  initPreloader({
    contentSelector: ".confirmation-container",
    messages: [
      "SENDING SIGNAL",
      " ",
      " ",
      "PLEASE WAIT...................",
      " ",
      " ",
      "ALMOST DONE",
      " ",
      " ",
      "CONFIRMING DELIVERY",
    ],
    messageDelayMs: 250,
    finalMessageDelayMs: 350,
    finishDelayMs: 1250,
    minDurationMs: 1800,
  });

  initParticles();
  initCursor();
  initGlassBackground();
});
