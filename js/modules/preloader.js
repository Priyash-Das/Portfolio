const STATUS_MESSAGES = [
  "INITIATING CORE SYSTEMS",
  "COMPILING PIXEL SHADERS",
  "DECRYPTING VIBE MATRIX",
  "AUTHENTICATION COMPLETED... SYSTEM ALMOST READY...",
  " ",
  " ",
  "PROCESSING....................",
  "EVERYTHING IS DONE",
  " ",
  " ",
  "Let's Guuu !!",
];
const TYPING_SPEED_MS = 0.5;

export function initPreloader({
  contentSelector = ".portfolio-container",
  messages = STATUS_MESSAGES,
  startDelayMs = 300,
  messageDelayMs = 300,
  finalMessageDelayMs = 1000,
  finishDelayMs = 800,
  minDurationMs = 0,
} = {}) {
  const preloader = document.getElementById("preloader");
  const statusText = document.getElementById("status-text");
  const mainContent = document.querySelector(contentSelector);

  if (!preloader || !statusText || !mainContent) return;

  const startedAt = performance.now();

  async function showNext() {
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      await typeMessage(message);

      const delay =
        i === messages.length - 1 ? finalMessageDelayMs : messageDelayMs;
      await wait(delay);
    }

    const elapsed = performance.now() - startedAt;
    if (elapsed < minDurationMs) {
      await wait(minDurationMs - elapsed);
    }

    finishPreloader();
  }

  function finishPreloader() {
    statusText.classList.remove("typewriter");
    statusText.style.color = "var(--color-primary-hi)";

    setTimeout(() => {
      preloader.classList.add("hidden");
      mainContent.classList.add("visible");
      mainContent.style.opacity = "1";

      const resumeOverlay = document.getElementById("resume-overlay");
      if (resumeOverlay) resumeOverlay.classList.remove("visible");
    }, finishDelayMs);
  }

  setTimeout(showNext, startDelayMs);

  async function typeMessage(message) {
    statusText.textContent = "";

    for (let i = 0; i < message.length; i++) {
      statusText.textContent += message[i];
      await wait(TYPING_SPEED_MS);
    }
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
