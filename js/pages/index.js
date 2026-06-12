import { initPreloader } from "../modules/preloader.js";
import { CubeController } from "../modules/cubeController.js";
import { initParticles } from "../modules/particles.js";
import { initCursor } from "../modules/cursor.js";
import { initResumeDownload } from "../modules/resumeDownload.js";
import { initContactForm } from "../modules/contactForm.js";
import { showMobileToasts } from "../modules/mobileToasts.js";
import { initGlassBackground } from "../modules/glassBackground.js";
import { initExperienceAccordion } from "../modules/experienceAccordion.js";
import { initContentProtection } from "../modules/contentProtection.js";
document.addEventListener("DOMContentLoaded", () => {
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
  initPreloader();
  if (document.getElementById("cube")) CubeController.init();
  initResumeDownload();
  const form = document.getElementById("confirmation-contact-form");
  if (form) initContactForm(form);
  showMobileToasts();
  initExperienceAccordion();
});
