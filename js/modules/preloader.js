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
],
  TYPING_SPEED_MS = 0.5;
function dispatchReveal() {
  document.dispatchEvent(new CustomEvent("preloader:reveal"));
}
export function initPreloader({
  contentSelector: contentSel = ".portfolio-container",
  messages = STATUS_MESSAGES,
  startDelayMs = 300,
  messageDelayMs = 300,
  finalMessageDelayMs = 1e3,
  finishDelayMs = 800,
  minDurationMs = 0,
} = {}) {
  const preloader = document.getElementById("preloader"),
    statusText = document.getElementById("status-text"),
    content = document.querySelector(contentSel);
  if (!preloader || !statusText || !content) {
    dispatchReveal();
    return;
  }
  const startedAt = performance.now();
  async function typeMessage(msg) {
    statusText.textContent = "";
    for (let i = 0; i < msg.length; i++) {
      statusText.textContent += msg[i];
      await wait(TYPING_SPEED_MS);
    }
  }
  setTimeout(async function () {
    for (let i = 0; i < messages.length; i++) {
      await typeMessage(messages[i]);
      await wait(i === messages.length - 1 ? finalMessageDelayMs : messageDelayMs);
    }
    const elapsed = performance.now() - startedAt;
    if (elapsed < minDurationMs) await wait(minDurationMs - elapsed);
    statusText.classList.remove("typewriter");
    statusText.style.color = "var(--color-primary-hi)";
    setTimeout(() => {
      preloader.classList.add("hidden");
      content.classList.add("visible");
      content.style.opacity = "1";
      const overlay = document.getElementById("resume-overlay");
      if (overlay) overlay.classList.remove("visible");
      dispatchReveal();
    }, finishDelayMs);
  }, startDelayMs);
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
