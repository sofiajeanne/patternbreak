const form = document.querySelector("#signup-form");
const statusEl = document.querySelector("#form-status");
const endpoint = window.PATTERNBREAK_SIGNUP_ENDPOINT;

function setStatus(message, type = "info") {
  statusEl.textContent = message;
  statusEl.dataset.type = type;
}

function getPayload(formElement) {
  const data = new FormData(formElement);
  data.append("submittedAt", new Date().toISOString());
  data.append("page", window.location.href);
  return data;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const honeypot = form.querySelector("#website");
  if (honeypot?.value) {
    form.reset();
    setStatus("Thank you. You’re on the list.", "success");
    return;
  }

  if (!endpoint || endpoint.includes("PASTE_GOOGLE_APPS_SCRIPT") || endpoint.includes("YOUR_DEPLOYMENT_ID")) {
    setStatus("This form needs its Google Apps Script URL before it can receive signups.", "error");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  setStatus("Sending your note through the little wires…");

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      body: getPayload(form),
    });

    form.reset();
    setStatus("Thank you. You’re on the list.", "success");
  } catch (error) {
    console.error("Signup failed", error);
    setStatus("Something hiccuped. Please try again in a moment.", "error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sign me up";
  }
});
