// ---------------------------------------------------------------
// Config — point this at your running FastAPI backend.
// ---------------------------------------------------------------
const API_URL = "http://127.0.0.1:8000/predict";

// ---------------------------------------------------------------
// Elements
// ---------------------------------------------------------------
const form = document.getElementById("predict-form");
const submitBtn = document.getElementById("submit-btn");

const stateIdle = document.getElementById("state-idle");
const stateLoading = document.getElementById("state-loading");
const stateResult = document.getElementById("state-result");
const stateError = document.getElementById("state-error");

const gaugeFill = document.getElementById("gauge-fill");
const gaugeNeedle = document.getElementById("gauge-needle");
const scoreNumber = document.getElementById("score-number");
const scoreBand = document.getElementById("score-band");
const scoreContext = document.getElementById("score-context");
const errorCopy = document.getElementById("error-copy");

const resetBtn = document.getElementById("reset-btn");
const errorRetryBtn = document.getElementById("error-retry-btn");

const stressGroup = document.getElementById("stress_level_group");
const stressInput = document.getElementById("stress_level");

const GAUGE_CIRCUMFERENCE = 298; // matches the semicircle path length in style.css

// ---------------------------------------------------------------
// Segmented control (stress level)
// ---------------------------------------------------------------
stressGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  [...stressGroup.querySelectorAll(".seg-btn")].forEach((b) =>
    b.setAttribute("aria-checked", "false")
  );
  btn.setAttribute("aria-checked", "true");
  stressInput.value = btn.dataset.value;
  clearFieldError("stress_level");
});

// ---------------------------------------------------------------
// State switching
// ---------------------------------------------------------------
function showState(name) {
  [stateIdle, stateLoading, stateResult, stateError].forEach((el) => (el.hidden = true));
  ({ idle: stateIdle, loading: stateLoading, result: stateResult, error: stateError }[name]).hidden = false;
}

// ---------------------------------------------------------------
// Validation
// ---------------------------------------------------------------
function setFieldError(name, message) {
  const input = form.elements[name];
  const errEl = form.querySelector(`.error-msg[data-for="${name}"]`);
  if (input && input.closest(".field")) input.closest(".field").classList.add("has-error");
  if (errEl) errEl.textContent = message;
}

function clearFieldError(name) {
  const input = form.elements[name];
  const errEl = form.querySelector(`.error-msg[data-for="${name}"]`);
  if (input && input.closest(".field")) input.closest(".field").classList.remove("has-error");
  if (errEl) errEl.textContent = "";
}

function clearAllErrors() {
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("has-error"));
  form.querySelectorAll(".error-msg").forEach((e) => (e.textContent = ""));
}

function validate(data) {
  let firstInvalid = null;
  const fail = (name, msg) => {
    setFieldError(name, msg);
    if (!firstInvalid) firstInvalid = name;
  };

  if (!(data.age >= 10 && data.age <= 100)) fail("age", "Enter an age between 10 and 100.");
  if (!data.gender) fail("gender", "Select one.");
  if (!data.country) fail("country", "Enter a country.");
  if (!data.academic_level) fail("academic_level", "Select one.");
  if (!data.most_used_platform) fail("most_used_platform", "Select one.");
  if (!data.purpose_of_use) fail("purpose_of_use", "Select one.");
  if (!(data.avg_daily_usage_hours >= 0 && data.avg_daily_usage_hours <= 24))
    fail("avg_daily_usage_hours", "0–24 hours.");
  if (!(data.daily_unlocks >= 0)) fail("daily_unlocks", "0 or more.");
  if (!(data.study_hours >= 0 && data.study_hours <= 24)) fail("study_hours", "0–24 hours.");
  if (!(data.physical_activity_hours >= 0 && data.physical_activity_hours <= 24))
    fail("physical_activity_hours", "0–24 hours.");
  if (!(data.sleep_hours_per_night >= 0 && data.sleep_hours_per_night <= 24))
    fail("sleep_hours_per_night", "0–24 hours.");
  if (!data.stress_level) fail("stress_level", "Pick a stress level.");

  return firstInvalid;
}

// ---------------------------------------------------------------
// Reading the gauge + writing a plain-language context line
// ---------------------------------------------------------------
function band(score) {
  if (score >= 7) return { label: "Strong signal", color: getVar("--band-strong") };
  if (score >= 5) return { label: "Holding steady", color: getVar("--band-steady") };
  if (score >= 3) return { label: "Uneven signal", color: getVar("--band-mid") };
  return { label: "Running low", color: getVar("--band-low") };
}

function getVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function buildContext(data) {
  const notes = [];
  if (data.sleep_hours_per_night < 6) notes.push("shorter sleep");
  else if (data.sleep_hours_per_night >= 8) notes.push("solid sleep");

  if (data.stress_level === "High" || data.stress_level === "Very High") notes.push("elevated stress");
  else if (data.stress_level === "Low") notes.push("low stress");

  if (data.avg_daily_usage_hours >= 6) notes.push("heavy screen time");

  if (data.physical_activity_hours < 0.5) notes.push("little movement logged");
  else if (data.physical_activity_hours >= 1.5) notes.push("regular movement");

  if (notes.length === 0) {
    return "This lines up with a fairly balanced week across sleep, activity, and screen time.";
  }
  const shown = notes.slice(0, 2).join(" and ");
  return `This lines up with ${shown} this week.`;
}

function renderResult(score, data) {
  const clamped = Math.max(0, Math.min(10, score));
  const offset = GAUGE_CIRCUMFERENCE * (1 - clamped / 10);
  const angle = -90 + (clamped / 10) * 180;
  const { label, color } = band(clamped);

  // force reflow so the transition plays even on repeated submits
  gaugeFill.style.transition = "none";
  gaugeFill.style.strokeDashoffset = GAUGE_CIRCUMFERENCE;
  gaugeNeedle.style.transition = "none";
  gaugeNeedle.style.transform = "rotate(-90deg)";
  void gaugeFill.offsetWidth;

  gaugeFill.style.transition = "";
  gaugeNeedle.style.transition = "";
  gaugeFill.style.stroke = color;
  gaugeFill.style.strokeDashoffset = offset;
  gaugeNeedle.style.transform = `rotate(${angle}deg)`;

  scoreNumber.textContent = clamped.toFixed(1);
  scoreBand.textContent = label;
  scoreBand.style.color = color;
  scoreContext.textContent = buildContext(data);

  showState("result");
}

// ---------------------------------------------------------------
// Submit
// ---------------------------------------------------------------
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAllErrors();

  const raw = Object.fromEntries(new FormData(form).entries());
  const data = {
    age: parseInt(raw.age, 10),
    gender: raw.gender,
    country: raw.country?.trim(),
    academic_level: raw.academic_level,
    most_used_platform: raw.most_used_platform,
    purpose_of_use: raw.purpose_of_use,
    avg_daily_usage_hours: parseFloat(raw.avg_daily_usage_hours),
    daily_unlocks: parseInt(raw.daily_unlocks, 10),
    study_hours: parseFloat(raw.study_hours),
    physical_activity_hours: parseFloat(raw.physical_activity_hours),
    sleep_hours_per_night: parseFloat(raw.sleep_hours_per_night),
    stress_level: raw.stress_level,
  };

  const firstInvalid = validate(data);
  if (firstInvalid) {
    form.elements[firstInvalid]?.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.classList.add("is-loading");
  showState("loading");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.detail ? JSON.stringify(body.detail) : `Request failed (${res.status}).`);
    }

    const result = await res.json();
    renderResult(result.predicted_mental_health_score, data);
  } catch (err) {
    errorCopy.textContent =
      err.message === "Failed to fetch"
        ? "Couldn't reach the server. Check that the API is running and reachable, then try again."
        : err.message;
    showState("error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove("is-loading");
  }
});

// ---------------------------------------------------------------
// Reset
// ---------------------------------------------------------------
function resetForm() {
  form.reset();
  clearAllErrors();
  [...stressGroup.querySelectorAll(".seg-btn")].forEach((b) => b.setAttribute("aria-checked", "false"));
  stressInput.value = "";
  showState("idle");
  form.elements["age"]?.focus();
}

resetBtn.addEventListener("click", resetForm);
errorRetryBtn.addEventListener("click", () => showState("idle"));
