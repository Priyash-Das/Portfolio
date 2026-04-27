import { initPreloader } from "./modules/preloader.js";
import { CubeController } from "./modules/cubeController.js";
import { initParticles } from "./modules/particles.js";
import { initCursor } from "./modules/cursor.js";
import { initResumeDownload } from "./modules/resumeDownload.js";
import { initContactForm } from "./modules/contactForm.js";
import { showMobileToasts } from "./modules/mobileToasts.js";
import { initGlassBackground } from "./modules/glassBackground.js";
import { initExperienceAccordion } from "./modules/experienceAccordion.js";

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();

  if (document.getElementById("cube")) {
    CubeController.init();
  }

  initParticles();
  initCursor();
  initResumeDownload();

  const contactForm = document.getElementById("confirmation-contact-form");
  if (contactForm) {
    initContactForm(contactForm);
  }

  showMobileToasts();
  initGlassBackground();
  initExperienceAccordion();
});
