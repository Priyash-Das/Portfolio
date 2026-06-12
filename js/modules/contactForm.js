const FORMSPREE_ENDPOINT = "https://formspree.io/f/mldndknz";
export function initContactForm(t) {
  if (!t) return;
  let isSubmitting = !1;
  const submitBtn = t.querySelector('button[type="submit"]');
  t.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    isSubmitting = !0;
    if (submitBtn) submitBtn.disabled = !0;
    try {
      const e = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(t),
        headers: { Accept: "application/json" },
      });
      if (!e.ok) throw new Error(`Formspree returned ${e.status}`);
      window.location.href = "confirmation.html";
    } catch (t) {
      alert(
        "Oops! The message could not be sent. Please try again or email me directly.",
      );
      isSubmitting = !1;
      if (submitBtn) submitBtn.disabled = !1;
    }
  });
}
