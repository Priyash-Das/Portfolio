const FACES = {
  home: { rx: 0, ry: 0 },
  about: { rx: 0, ry: -90 },
  skills: { rx: 0, ry: -180 },
  experience: { rx: 0, ry: -270 },
  projects: { rx: -90, ry: 0 },
  contact: { rx: 90, ry: 0 },
};

let isTransitioning = false;
let currentFace = "home";

const cube = document.getElementById("cube");
const navButtons = document.querySelectorAll(".nav-btn[data-face]");

export const CubeController = {
  init() {
    if (!cube || navButtons.length === 0) return;

    rotateTo(currentFace, false);

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const face = btn.dataset.face;
        if (face && face !== currentFace) {
          rotateTo(face, true);
        }
      });
    });

    cube.addEventListener("transitionend", () => {
      cube.classList.remove("rotating");
      isTransitioning = false;
    });
  },
};

function rotateTo(face, animate = true) {
  if (!FACES[face]) return;
  if (isTransitioning) return;
  isTransitioning = animate;

  navButtons.forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.nav-btn[data-face="${face}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  document
    .querySelectorAll(".cube-face")
    .forEach((f) => f.classList.remove("active-face"));
  const faceEl = document.getElementById(`face-${face}`);
  if (faceEl) faceEl.classList.add("active-face");

  const { rx, ry } = FACES[face];
  if (animate) {
    cube.classList.add("rotating");
  } else {
    cube.classList.remove("rotating");
  }
  cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

  currentFace = face;
}
