const form = document.getElementById("confirmation-contact-form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  try {
    const response = await fetch("https://formspree.io/f/mldndknz", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      window.location.href = "confirmation.html";
    } else {
      alert("Oops! Something went wrong.");
    }
  } catch (error) {
    alert("Error sending form!");
  }
});
