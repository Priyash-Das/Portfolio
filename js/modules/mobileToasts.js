const TOAST_DELAY_1 = 5050;
const TOAST_DURATION = 3000;

let toastTimer1, toastTimer2;

export function showMobileToasts() {
  if (window.innerWidth > 500) return;

  const toast1 = document.getElementById("toast-1");
  const toast2 = document.getElementById("toast-2");

  if (!toast1 || !toast2) return;

  if (sessionStorage.getItem("contactToastShown")) return;

  clearTimeout(toastTimer1);
  clearTimeout(toastTimer2);

  toastTimer1 = setTimeout(() => {
    toast1.classList.add("show");
    setTimeout(() => toast1.classList.remove("show"), TOAST_DURATION);
  }, TOAST_DELAY_1);

  toastTimer2 = setTimeout(() => {
    toast2.classList.add("show");
    setTimeout(() => toast2.classList.remove("show"), TOAST_DURATION);
  }, TOAST_DELAY_1 + 3500);

  sessionStorage.setItem("contactToastShown", "true");
}
