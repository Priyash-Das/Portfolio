const FACES = {
  home: { rx: 0, ry: 0 },
  about: { rx: 0, ry: -90 },
  skills: { rx: 0, ry: -180 },
  experience: { rx: 0, ry: -270 },
  projects: { rx: -90, ry: 0 },
  contact: { rx: 90, ry: 0 },
};
let isTransitioning = !1,
  currentFace = "home",
  unlockTimer = 0;
const cube = document.getElementById("cube"),
  navButtons = document.querySelectorAll(".nav-btn[data-face]"),
  UNLOCK_FALLBACK_MS = 700;
function unlock() {
  clearTimeout(unlockTimer);
  cube.classList.remove("rotating");
  isTransitioning = !1;
}
export const CubeController = {
  init() {
    cube &&
      0 !== navButtons.length &&
      (rotateTo(currentFace, !1),
        navButtons.forEach((t) => {
          t.addEventListener("click", () => {
            const e = t.dataset.face;
            e && e !== currentFace && rotateTo(e, !0);
          });
        }),
        cube.addEventListener("transitionend", (t) => {
          t.target === cube && "transform" === t.propertyName && unlock();
        }));
  },
};
function rotateTo(t, e = !0) {
  if (!FACES[t]) return;
  if (isTransitioning) return;
  ((isTransitioning = e),
    navButtons.forEach((t) => t.classList.remove("active")));
  const n = document.querySelector(`.nav-btn[data-face="${t}"]`);
  (n && n.classList.add("active"),
    document
      .querySelectorAll(".cube-face")
      .forEach((t) => t.classList.remove("active-face")));
  const r = document.getElementById(`face-${t}`);
  r && r.classList.add("active-face");
  const { rx: c, ry: a } = FACES[t];
  (e ? cube.classList.add("rotating") : cube.classList.remove("rotating"),
    (cube.style.transform = `rotateX(${c}deg) rotateY(${a}deg)`),
    (currentFace = t));
  if (e) {
    clearTimeout(unlockTimer);
    unlockTimer = setTimeout(unlock, UNLOCK_FALLBACK_MS);
  }
}
