const cores = navigator.hardwareConcurrency || 8,
  memory = navigator.deviceMemory || 8;
export const isLowEnd = cores <= 4 || memory <= 4;
export function applyPerfMode() {
  if (isLowEnd) document.documentElement.classList.add("perf-lite");
}
