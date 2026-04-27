export function initExperienceAccordion() {
  const accordion = document.getElementById("experience-accordion");
  if (!accordion) return;

  const items = accordion.querySelectorAll(".experience-item");
  items.forEach((item) => {
    const trigger = item.querySelector(".experience-trigger");
    const points = item.querySelector(".experience-points");
    if (!trigger || !points) return;

    trigger.addEventListener("click", () => {
      const shouldOpen = !item.classList.contains("open");

      items.forEach((other) => {
        const otherTrigger = other.querySelector(".experience-trigger");
        const otherPoints = other.querySelector(".experience-points");
        if (!otherTrigger || !otherPoints) return;
        other.classList.remove("open");
        otherTrigger.setAttribute("aria-expanded", "false");
        otherPoints.hidden = true;
      });

      if (shouldOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
        points.hidden = false;
      }
    });
  });
}
