const overlay = document.getElementById("resume-overlay");
const glitchText = document.getElementById("glitch-text");
const progressBar = document.getElementById("progress-bar");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

const HACK_MESSAGES = [
  "---INITIATING CONNECTION---",
  "---ACCESSING SECURE FILES---",
  "---DECRYPTING RESUME.PDF---",
  "-----DOWNLOAD IMMINENT-----",
];
let isDownloadInProgress = false;

export function initResumeDownload() {
  if (!overlay || !glitchText || !progressBar) return;

  const triggerButtons = [
    document.getElementById("resume-download-btn"),
    document.getElementById("resume-download-btn-m"),
  ];

  triggerButtons.forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (isDownloadInProgress) return;
      startDownloadSequence(btn.href);
    });
  });
}

async function startDownloadSequence(downloadUrl) {
  if (isDownloadInProgress) return;
  isDownloadInProgress = true;
  let flickerInterval = null;
  try {
    overlay.classList.add("visible");
    overlay.classList.add("downloading");
    overlay.dataset.phase = "boot";
    setGlitchText(HACK_MESSAGES[0]);
    setProgress(0);

    if (!prefersReducedMotion.matches) {
      flickerInterval = startOverlayFlicker();
      triggerGlitchBurst();
    }

    await wait(260);

    for (let i = 0; i < HACK_MESSAGES.length; i++) {
      const text = HACK_MESSAGES[i];
      setGlitchText(text);

      const progress = ((i + 1) / HACK_MESSAGES.length) * 100;
      setProgress(progress);

      if (i >= HACK_MESSAGES.length - 2) {
        overlay.dataset.phase = "critical";
      } else {
        overlay.dataset.phase = "loading";
      }

      if (!prefersReducedMotion.matches) {
        triggerGlitchBurst();
      }

      await wait(620);
    }

    overlay.dataset.phase = "complete";
    setGlitchText("---SENT! CHECK YOUR DOWNLOADS, FAM---");

    if (!prefersReducedMotion.matches) {
      triggerGlitchBurst(210);
    }

    await wait(1000);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "Priyash-Resume.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    if (flickerInterval) {
      window.clearInterval(flickerInterval);
    }
    overlay.style.removeProperty("--overlay-flicker");
    overlay.style.removeProperty("--overlay-shift-x");
    overlay.style.removeProperty("--overlay-shift-y");
    overlay.classList.remove("downloading", "glitch-burst");
    overlay.dataset.phase = "";
    overlay.classList.remove("visible");
    setProgress(0);
    setGlitchText("");
    isDownloadInProgress = false;
  }
}

function setGlitchText(text) {
  glitchText.textContent = text;
  glitchText.dataset.text = text;
}

function setProgress(progress) {
  const clampedProgress = Math.max(0, Math.min(progress, 100));
  progressBar.style.setProperty("--progress-scale", clampedProgress / 100);
}

function startOverlayFlicker() {
  return window.setInterval(() => {
    const flicker = 0.78 + Math.random() * 0.22;
    const shiftX = (Math.random() - 0.5) * 4;
    const shiftY = (Math.random() - 0.5) * 3;

    overlay.style.setProperty("--overlay-flicker", flicker.toFixed(3));
    overlay.style.setProperty("--overlay-shift-x", `${shiftX.toFixed(2)}px`);
    overlay.style.setProperty("--overlay-shift-y", `${shiftY.toFixed(2)}px`);
  }, 90);
}

function triggerGlitchBurst(duration = 130) {
  overlay.classList.add("glitch-burst");
  window.setTimeout(() => {
    overlay.classList.remove("glitch-burst");
  }, duration);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
