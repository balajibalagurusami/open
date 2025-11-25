// ---- Defaults ----
const DEFAULTS = {
  ctc: 2400000,
  hike: 30,
  rent: 16000,
  food: 10000,
  air: 600,
  commute: 2000,
  electricity: 2000,
  internet: 0,
  emi: 0
};

const LS_KEY_VALUES = "ctc_calc_values_v1";
const LS_KEY_THEME = "ctc_calc_theme_v1";

// ---- Tax - New Regime 2025 (approx slabs) ----
function taxNewRegime2025(income) {
  let tax = 0;
  const slabs = [
    [0, 400000, 0],
    [400000, 800000, 0.05],
    [800000, 1200000, 0.10],
    [1200000, 1600000, 0.15],
    [1600000, 2000000, 0.20],
    [2000000, Infinity, 0.30]
  ];

  for (const [low, high, rate] of slabs) {
    if (income > low) {
      const taxable = Math.min(income, high) - low;
      tax += taxable * rate;
    }
  }
  return tax;
}

// ---- Load / Save values ----
function loadValues() {
  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(LS_KEY_VALUES) || "null");
  } catch (e) {
    stored = null;
  }

  const vals = stored || DEFAULTS;

  for (const key of Object.keys(DEFAULTS)) {
    const el = document.getElementById(key);
    if (el) el.value = vals[key];
  }
}

function saveValues() {
  const vals = {};
  for (const key of Object.keys(DEFAULTS)) {
    const el = document.getElementById(key);
    vals[key] = el ? Number(el.value || 0) : 0;
  }
  localStorage.setItem(LS_KEY_VALUES, JSON.stringify(vals));
}

// ---- Theme handling ----
function initTheme() {
  const saved = localStorage.getItem(LS_KEY_THEME);
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = saved === "dark" || (!saved && prefersDark);

  document.body.classList.toggle("dark", useDark);

  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = useDark ? "☀️ Light" : "🌙 Dark";
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem(LS_KEY_THEME, isDark ? "dark" : "light");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
}

// ---- Chart ----
function drawChart(takeHomeMonthly, expenses, savings) {
  const canvas = document.getElementById("chart");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const labels = ["Take-home", "Expenses", "Savings"];
  const values = [takeHomeMonthly, expenses, savings];

  const maxVal = Math.max(1, ...values.map(v => Math.abs(v)));
  const padding = 20;
  const barWidth = (w - padding * 2) / (labels.length * 1.5);
  const baseline = h - 30;

  // Axis
  ctx.strokeStyle = "#9ca3af";
  ctx.beginPath();
  ctx.moveTo(padding, baseline);
  ctx.lineTo(w - padding, baseline);
  ctx.stroke();

  // Bars
  labels.forEach((label, idx) => {
    const val = values[idx];
    const ratio = val / maxVal;
    const barHeight = ratio * (h - 70);
    const x = padding + idx * (barWidth * 1.5) + barWidth * 0.25;
    const y = baseline - barHeight;

    ctx.fillStyle = idx === 0 ? "#22c55e" : idx === 1 ? "#ef4444" : "#3b82f6";
    ctx.fillRect(x, y, barWidth, barHeight);

    ctx.fillStyle = "#6b7280";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(label, x + barWidth / 2, baseline + 12);

    ctx.fillText(
      "₹" + Math.round(val).toLocaleString(),
      x + barWidth / 2,
      y - 4
    );
  });
}

// ---- Main calc ----
function calc() {
  const currentCTC = Number(document.getElementById("ctc").value || 0);
  const hikePct = Number(document.getElementById("hike").value || 0);

  if (!currentCTC || currentCTC <= 0) {
    document.getElementById("result").innerHTML =
      "<b>Enter a valid Current CTC.</b>";
    return;
  }

  const newCTC = currentCTC * (1 + hikePct / 100);
  const gainAnnual = newCTC - currentCTC;
  const gainMonthly = gainAnnual / 12;

  // Basic = 40 percent of CTC
  const basic = newCTC * 0.40;

  // PF contributions
  const pfEmployeeAnnual = basic * 0.12;  // leave your salary
  const pfEmployerAnnual = basic * 0.12;  // still part of CTC
  const pfTotal = pfEmployeeAnnual + pfEmployerAnnual;

  // Tax on (CTC - employer PF)
  const taxableIncome = newCTC - pfEmployerAnnual;
  const tax = taxNewRegime2025(taxableIncome);

  const takeHomeAnnual = newCTC - tax - pfEmployeeAnnual;
  const takeHomeMonthly = takeHomeAnnual / 12;

  // Monthly expenses
  const rent = Number(document.getElementById("rent").value || 0);
  const food = Number(document.getElementById("food").value || 0);
  const air = Number(document.getElementById("air").value || 0);
  const commute = Number(document.getElementById("commute").value || 0);
  const electricity = Number(document.getElementById("electricity").value || 0);
  const internet = Number(document.getElementById("internet").value || 0);
  const emi = Number(document.getElementById("emi").value || 0);

  const expenses = rent + food + air + commute + electricity + internet + emi;
  const savings = takeHomeMonthly - expenses;

  document.getElementById("result").innerHTML = `
    <h2>Results</h2>
    <b>Current CTC:</b> ₹${currentCTC.toLocaleString()} <br>
    <b>New CTC:</b> ₹${newCTC.toLocaleString()} <br><br>

    <b>Annual Gain:</b> ₹${gainAnnual.toLocaleString()} <br>
    <b>Monthly Gain:</b> ₹${gainMonthly.toLocaleString()} <br><br>

    <b>Basic (40 percent):</b> ₹${basic.toLocaleString()} <br>
    <b>PF Employee (12 percent):</b> ₹${pfEmployeeAnnual.toLocaleString()} <br>
    <b>PF Employer (12 percent):</b> ₹${pfEmployerAnnual.toLocaleString()} <br>
    <b>Total PF (24 percent):</b> ₹${pfTotal.toLocaleString()} <br><br>

    <b>Taxable Income:</b> ₹${taxableIncome.toLocaleString()} <br>
    <b>Income Tax (Annual):</b> ₹${tax.toLocaleString()} <br>
    <b>Take-Home (Annual):</b> ₹${takeHomeAnnual.toLocaleString()} <br>
    <b>Take-Home (Monthly):</b> ₹${takeHomeMonthly.toLocaleString()} <br><br>

    <b>Total Monthly Expenses:</b> ₹${expenses.toLocaleString()} <br>
    <b>Monthly Savings:</b>
    <span style="color:${savings >= 0 ? "green" : "red"}">
      ₹${savings.toLocaleString()}
    </span>
  `;

  // chart + save values
  drawChart(takeHomeMonthly, expenses, savings);
  saveValues();
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  loadValues();
  initTheme();

  const btn = document.getElementById("calcBtn");
  if (btn) btn.addEventListener("click", calc);

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", toggleTheme);

  // Auto-calc once on load with defaults
  calc();
});