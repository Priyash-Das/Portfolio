let glowX = window.innerWidth / 2;
let glowY = window.innerHeight / 2;
let targetX = glowX;
let targetY = glowY;
let glowScale = 1;

const faces = {
  home: { x: 0, y: 0 },
  about: { x: 0, y: -90 },
  skills: { x: 0, y: -180 },
  experience: { x: 0, y: -270 },
  projects: { x: -90, y: 0 },
  contact: { x: 90, y: 0 },
};

let currentFace = "home";
let isRotating = false;
const cube = document.getElementById("cube");
const buttons = document.querySelectorAll(".nav-btn");

function initPreloader() {
  const preloader = document.getElementById("preloader");
  const statusText = document.getElementById("status-text");
  const mainContent = document.querySelector(".portfolio-container");

  if (!preloader || !statusText || !mainContent) return;

  const statusPhrases = [
    "INITIATING CORE SYSTEMS...",
    "COMPILING PIXEL SHADERS...",
    "DECRYPTING VIBE MATRIX...",
    "AUTHENTICATION COMPLETE",
    "SYSTEM ALMOST READY",
    "Let's Guuu!!",
  ];

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function runPreloaderSequence() {
    for (let i = 0; i < statusPhrases.length; i++) {
      if (i === statusPhrases.length - 1) {
        await wait(1200);
        statusText.classList.remove("typing");
        statusText.textContent = statusPhrases[i];
        statusText.style.borderRight = "none";
        return;
      }

      statusText.textContent = statusPhrases[i];
      statusText.classList.add("typing");
      await wait(1000);
      statusText.classList.remove("typing");
      await wait(200);
    }
  }

  function endPreloader() {
    preloader.classList.add("hidden");
    setTimeout(() => {
      mainContent.style.opacity = "1";
      const resumeOverlay = document.getElementById("resume-overlay");
      if (resumeOverlay) {
        resumeOverlay.classList.remove("visible");
      }
    }, 50);
  }

  setTimeout(runPreloaderSequence, 2200);
  window.addEventListener("load", () => setTimeout(endPreloader, 12000));
  setTimeout(endPreloader, 10000);
}

function rotateCube(face) {
  if (isRotating) return;
  isRotating = true;
  currentFace = face;

  document.querySelectorAll(".cube-face").forEach((el) => {
    el.classList.remove("active-face");
  });
  document.querySelector(`.face-${face}`).classList.add("active-face");

  cube.style.transform = `rotateX(${faces[face].x}deg) rotateY(${faces[face].y}deg) scale(1.02)`;
  buttons.forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`[onclick="rotateCube('${face}')"]`)
    .classList.add("active");

  setTimeout(() => {
    cube.style.transform = `rotateX(${faces[face].x}deg) rotateY(${faces[face].y}deg) scale(1)`;
    isRotating = false;
  }, 600);
}

function initParticles() {
  const bgCanvas = document.getElementById("particles");
  const bgCtx = bgCanvas.getContext("2d");
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;

  const bgParticles = Array.from({ length: 50 }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    size: Math.random() * 5 + 2,
    speedX: Math.random() * 2 - 1,
    speedY: Math.random() * 2 - 1,
    color: `rgba(110, 245, 232, ${Math.random() * 0.5 + 0.2})`,
  }));

  const trailCanvas = document.getElementById("particles-trail");
  const trailCtx = trailCanvas.getContext("2d");
  trailCanvas.width = window.innerWidth;
  trailCanvas.height = window.innerHeight;

  const trailParticles = [];
  let mouseX = 0,
    mouseY = 0,
    lastMouseX = 0,
    lastMouseY = 0;
  let hue = 0;

  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.5 - 0.75;
      this.accel = 0.98;
      this.life = 80;
      const hues = [213, 174, 215];
      this.hue = hues[Math.floor(Math.random() * hues.length)];
      this.color = `hsla(${this.hue}, 80%, 75%, ${Math.random() * 0.5 + 0.5})`;
      this.glow = Math.random() * 0.3 + 0.2;
      this.twist = Math.random() * 0.1 - 0.05;
    }

    update() {
      this.speedX *= this.accel;
      this.speedY *= this.accel;
      this.x += this.speedX + Math.sin(this.life * this.twist);
      this.y += this.speedY + Math.cos(this.life * this.twist);
      this.life--;
      this.size *= 0.97;
      this.color = `hsla(${this.hue}, 80%, 75%, ${this.life / 80})`;
    }

    draw() {
      trailCtx.beginPath();
      trailCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      trailCtx.fillStyle = this.color;
      trailCtx.shadowBlur = 15;
      trailCtx.shadowColor = this.color;
      trailCtx.fill();
    }
  }

  function animateBackground() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgParticles.forEach((p) => {
      bgCtx.beginPath();
      bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bgCtx.fillStyle = p.color;
      bgCtx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0 || p.x > bgCanvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > bgCanvas.height) p.speedY *= -1;
    });
    requestAnimationFrame(animateBackground);
  }

  function animateTrail() {
    trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    trailCtx.shadowBlur = 0;

    for (let i = trailParticles.length - 1; i >= 0; i--) {
      trailParticles[i].update();
      trailParticles[i].draw();
      if (trailParticles[i].life <= 0 || trailParticles[i].size < 0.3) {
        trailParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateTrail);
  }

  function addTrailParticle(x, y) {
    const speed = Math.sqrt(
      Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2)
    );
    const particleCount = Math.min(5 + speed / 10, 15);

    for (let i = 0; i < particleCount; i++) {
      trailParticles.push(
        new TrailParticle(
          x + Math.random() * 10 - 5,
          y + Math.random() * 10 - 5
        )
      );
    }
    lastMouseX = x;
    lastMouseY = y;
    hue = (hue + 3) % 360;
  }

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    mouseX = targetX;
    mouseY = targetY;
    addTrailParticle(mouseX, mouseY);
  });

  document.addEventListener("click", (e) => {
    for (let i = 0; i < 30; i++) {
      const p = new TrailParticle(e.clientX, e.clientY);
      p.speedX = Math.random() * 4 - 2;
      p.speedY = Math.random() * 4 - 2;
      p.size = Math.random() * 8 + 3;
      trailParticles.push(p);
    }
  });

  function handleResize() {
    bgCanvas.width = trailCanvas.width = window.innerWidth;
    bgCanvas.height = trailCanvas.height = window.innerHeight;
  }

  window.addEventListener("resize", handleResize);
  window.addEventListener("load", () => {
    rotateCube("home");
    animateBackground();
    animateTrail();
    lastMouseX = window.innerWidth / 2;
    lastMouseY = window.innerHeight / 2;
  });
}

function animateCursorGlow() {
  const cursor = document.getElementById("custom-cursor");
  const dx = targetX - glowX;
  const dy = targetY - glowY;
  const speed = Math.sqrt(dx * dx + dy * dy);

  glowX += dx * 0.1;
  glowY += dy * 0.1;
  const desiredScale = 1 + Math.min(0.4, speed / 120);
  glowScale += (desiredScale - glowScale) * 0.1;

  cursor.style.left = `${glowX}px`;
  cursor.style.top = `${glowY}px`;
  cursor.style.transform = `translate(-50%, -50%) scale(${glowScale})`;

  requestAnimationFrame(animateCursorGlow);
}

function initResumeDownload() {
  const configs = [
    {
      btnId: "resume-download-btn",
      overlayId: "resume-overlay",
      glitchId: "glitch-text",
      barId: "progress-bar",
    },
    {
      btnId: "resume-download-btn-m",
      overlayId: "resume-overlay-m",
      glitchId: "glitch-text-m",
      barId: "progress-bar-m",
    },
  ];

  const textSequence = [
    "INITIATING CONNECTION...",
    "ACCESSING SECURE FILES...",
    "DECRYPTING RESUME.PDF...",
    "DOWNLOAD IMMINENT...",
  ];

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function triggerDownloadSequence({
    overlay,
    glitchText,
    progressBar,
    href,
  }) {
    overlay.classList.add("visible", "visible-m");
    await wait(100);

    for (let i = 0; i < textSequence.length; i++) {
      glitchText.textContent = textSequence[i];
      glitchText.dataset.text = textSequence[i];
      const progress = ((i + 1) / textSequence.length) * 100;
      progressBar.style.width = `${progress}%`;
      await wait(750);
    }

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "Priyash-Resume.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    glitchText.textContent = "SENT! CHECK YOUR DOWNLOADS, FAM.";
    glitchText.dataset.text = "SENT! CHECK YOUR DOWNLOADS, FAM.";

    await wait(2000);
    overlay.classList.remove("visible", "visible-m");
    await wait(500);
    progressBar.style.width = "0%";
    glitchText.textContent = "";
    glitchText.dataset.text = "";
  }

  configs.forEach(({ btnId, overlayId, glitchId, barId }) => {
    const btn = document.getElementById(btnId);
    const overlay = document.getElementById(overlayId);
    const glitchText = document.getElementById(glitchId);
    const progressBar = document.getElementById(barId);

    if (btn && overlay && glitchText && progressBar) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        triggerDownloadSequence({
          overlay,
          glitchText,
          progressBar,
          href: btn.href,
        });
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initPreloader();
  initResumeDownload();
});

initParticles();
animateCursorGlow();
