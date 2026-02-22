function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatCurrencyLike(value) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function setResult(id, label, value) {
  document.getElementById(id).textContent = `${label}: ${formatCurrencyLike(value)}`;
}

function updateComparison() {
  const expText = document.getElementById("result-expenditure").textContent;
  const incText = document.getElementById("result-income").textContent;
  const prodText = document.getElementById("result-product").textContent;
  const comparison = document.getElementById("comparison-text");

  const hasValue = [expText, incText, prodText].some((text) => !text.endsWith("-"));
  if (!hasValue) {
    comparison.textContent = "Calculate at least one method to see results.";
    return;
  }

  comparison.textContent = `${expText} | ${incText} | ${prodText}`;
}

document.getElementById("btn-expenditure").addEventListener("click", () => {
  const c = toNumber(document.getElementById("exp-c").value);
  const i = toNumber(document.getElementById("exp-i").value);
  const g = toNumber(document.getElementById("exp-g").value);
  const x = toNumber(document.getElementById("exp-x").value);
  const m = toNumber(document.getElementById("exp-m").value);
  const gdp = c + i + g + (x - m);

  setResult("result-expenditure", "Expenditure GDP", gdp);
  updateComparison();
});

document.getElementById("btn-income").addEventListener("click", () => {
  const wages = toNumber(document.getElementById("inc-wages").value);
  const rent = toNumber(document.getElementById("inc-rent").value);
  const interest = toNumber(document.getElementById("inc-interest").value);
  const profits = toNumber(document.getElementById("inc-profits").value);
  const taxes = toNumber(document.getElementById("inc-taxes").value);
  const subsidies = toNumber(document.getElementById("inc-subsidies").value);
  const depreciation = toNumber(document.getElementById("inc-depreciation").value);
  const gdp = wages + rent + interest + profits + (taxes - subsidies) + depreciation;

  setResult("result-income", "Income GDP", gdp);
  updateComparison();
});

function createSectorRow(index) {
  const row = document.createElement("div");
  row.className = "sector-row";

  row.innerHTML = `
    <label>Sector Name
      <input type="text" class="sector-name" placeholder="Sector ${index + 1}">
    </label>
    <label>Total Output
      <input type="number" step="any" class="sector-output" placeholder="0">
    </label>
    <label>Intermediate Consumption
      <input type="number" step="any" class="sector-intermediate" placeholder="0">
    </label>
    <button type="button" class="btn-remove">Remove</button>
  `;

  row.querySelector(".btn-remove").addEventListener("click", () => {
    row.remove();
  });

  return row;
}

const sectorRowsEl = document.getElementById("sector-rows");

function addSectorRow() {
  const index = sectorRowsEl.querySelectorAll(".sector-row").length;
  sectorRowsEl.appendChild(createSectorRow(index));
}

document.getElementById("btn-add-sector").addEventListener("click", addSectorRow);

document.getElementById("btn-product").addEventListener("click", () => {
  const rows = Array.from(sectorRowsEl.querySelectorAll(".sector-row"));
  const totalValueAdded = rows.reduce((sum, row) => {
    const output = toNumber(row.querySelector(".sector-output").value);
    const intermediate = toNumber(row.querySelector(".sector-intermediate").value);
    return sum + (output - intermediate);
  }, 0);

  setResult("result-product", "Product GDP", totalValueAdded);
  updateComparison();
});

addSectorRow();
