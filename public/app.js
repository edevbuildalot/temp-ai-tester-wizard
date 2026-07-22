import { analytics } from "@launchfury/analytics";

const WRITE_KEY = "lf_landing_tatw";
const HOST = window.location.origin;

analytics.init({
  writeKey: WRITE_KEY,
  host: HOST,
  autocapturePageviews: false,
  debug: false,
});

analytics.page();

const form = document.getElementById("signup-form");
const statusEl = document.getElementById("form-status");
const submitBtn = form.querySelector(".signup-form__submit");
const submitText = form.querySelector(".signup-form__submit-text");
const spinner = form.querySelector(".signup-form__spinner");
const countEl = document.getElementById("signup-count");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (form.dataset.submitting === "true") return;

  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();

  if (!email) {
    statusEl.textContent = "Please enter your email address.";
    statusEl.className = "signup-form__status signup-form__status--error";
    return;
  }

  form.dataset.submitting = "true";
  submitText.textContent = "Submitting…";
  submitBtn.disabled = true;
  spinner.classList.remove("hidden");

  analytics.capture("signup_started", { source: "landing" });

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Server error" }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();

    analytics.capture("signup_completed", {
      source: "landing",
      signup_id: data.id,
    });

    statusEl.textContent = "You're on the list! We'll be in touch soon.";
    statusEl.className = "signup-form__status signup-form__status--success";

    form.querySelector("#name").value = "";
    form.querySelector("#email").value = "";

    if (data.total_count !== undefined) {
      countEl.textContent = data.total_count;
    } else {
      const current = parseInt(countEl.textContent, 10);
      countEl.textContent = current + 1;
    }
  } catch (err) {
    analytics.capture("signup_error", {
      source: "landing",
      error: err.message,
    });

    statusEl.textContent = err.message === "Already signed up"
      ? "You're already on the list!"
      : "Something went wrong. Try again or email us directly.";
    statusEl.className = "signup-form__status signup-form__status--error";
  } finally {
    form.dataset.submitting = "false";
    submitText.textContent = "Get Early Access";
    submitBtn.disabled = false;
    spinner.classList.add("hidden");
  }
});

async function loadSignupCount() {
  try {
    const res = await fetch("/api/signup");
    if (res.ok) {
      const data = await res.json();
      countEl.textContent = data.count ?? 0;
    }
  } catch {
    // silent
  }
}
loadSignupCount();
