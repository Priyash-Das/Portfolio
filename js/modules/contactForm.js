const FORMSPREE_ENDPOINT = "https://formspree.io/f/mldndknz";

export function initContactForm(form) {
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Formspree returned ${response.status}`);
      }

      window.location.href = "confirmation.html";
    } catch (error) {
      console.error("Form submission failed:", error);
      alert(
        "Oops! The message could not be sent. Please try again or email me directly.",
      );
    }
  });
}
