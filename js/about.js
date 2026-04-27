import { initParticles } from "./modules/particles.js";
import { initCursor } from "./modules/cursor.js";
import { initGlassBackground } from "./modules/glassBackground.js";
import { initPreloader } from "./modules/preloader.js";

document.addEventListener("DOMContentLoaded", () => {
  initPreloader({
    contentSelector: ".about-page .container",
    messages: [
      "LOADING PROFILE DATA",
      " ",
      " ",
      "PLEASE WAIT....................",
      " ",
      " ",
      " ",
      "ALMOST THERE",
      "JUST A SECOND....................",
      " ",
      " ",
      "PAGE IS LOADED",
    ],
    messageDelayMs: 250,
    finalMessageDelayMs: 350,
    finishDelayMs: 850,
    minDurationMs: 1800,
  });

  initParticles();
  initCursor();

  const sections = document.querySelectorAll(".content-section");
  if (sections.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    sections.forEach((section) => observer.observe(section));
  }

  initGlassBackground();
});
