// Particle Background Logic
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let particles = [];
  const mouse = { x: null, y: null, radius: 100 };
  let lastFrameTime = 0;
  const frameInterval = 1000 / 60; // Target 60 FPS

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  class Particle {
    constructor(x, y, dirX, dirY, size, color) {
      this.x = x;
      this.y = y;
      this.dirX = dirX;
      this.dirY = dirY;
      this.size = size;
      this.color = color;
      this.glow = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = this.glow;
      ctx.fill();
    }
    update() {
      if (this.x > canvas.width || this.x < 0) this.dirX = -this.dirX;
      if (this.y > canvas.height || this.y < 0) this.dirY = -this.dirY;

      if (mouse.x && mouse.y) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
          this.glow = 10;
          if (mouse.x < this.x && this.x < canvas.width - this.size * 5) {
            this.x += 3;
          }
          if (mouse.x > this.x && this.x > this.size * 5) {
            this.x -= 3;
          }
          if (mouse.y < this.y && this.y < canvas.height - this.size * 5) {
            this.y += 3;
          }
          if (mouse.y > this.y && this.y > this.size * 5) {
            this.y -= 3;
          }
        } else {
          this.glow = 5;
        }
      }

      this.x += this.dirX;
      this.y += this.dirY;
      this.draw();
    }
  }

  function initParticles() {
    particles = [];
    let numberOfParticles = Math.min(
      (canvas.height * canvas.width) / 12000,
      100
    );
    if (window.innerWidth <= 500) {
      numberOfParticles = Math.min(numberOfParticles * 0.5, 50);
    } else if (window.innerWidth <= 768) {
      numberOfParticles = Math.min(numberOfParticles * 0.75, 75);
    }
    for (let i = 0; i < numberOfParticles; i++) {
      let size = Math.random() * 2 + 1;
      let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
      let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
      let dirX = Math.random() * 0.3 - 0.15;
      let dirY = Math.random() * 0.3 - 0.15;
      let colorOptions = [
        "rgba(56, 189, 248, 0.6)",
        "rgba(34, 211, 238, 0.6)",
        "rgba(255, 0, 193, 0.6)",
      ];
      let color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      particles.push(new Particle(x, y, dirX, dirY, size, color));
    }
  }

  function connectParticles() {
    const maxDistance = (canvas.width / 8) * (canvas.height / 8);
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let distance = dx * dx + dy * dy;
        if (distance < maxDistance) {
          let opacity = 1 - distance / maxDistance;
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity * 0.7})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles(timestamp) {
    if (timestamp - lastFrameTime < frameInterval) {
      requestAnimationFrame(animateParticles);
      return;
    }
    lastFrameTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectParticles();
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles(performance.now());
});
