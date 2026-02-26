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

function setError(id, message) {
  document.getElementById(id).textContent = message;
}

function anyNegative(elements) {
  return elements.some((element) => {
    const value = element.value.trim();
    return value !== "" && toNumber(value) < 0;
  });
}

function validateSection(errorId, elements) {
  if (anyNegative(elements)) {
    setError(errorId, "Negative values are not allowed.");
    return false;
  }
  setError(errorId, "");
  return true;
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
  const fields = [
    document.getElementById("exp-c"),
    document.getElementById("exp-i"),
    document.getElementById("exp-g"),
    document.getElementById("exp-x"),
    document.getElementById("exp-m")
  ];
  if (!validateSection("error-expenditure", fields)) {
    return;
  }

  const c = toNumber(fields[0].value);
  const i = toNumber(fields[1].value);
  const g = toNumber(fields[2].value);
  const x = toNumber(fields[3].value);
  const m = toNumber(fields[4].value);
  const gdp = c + i + g + (x - m);

  setResult("result-expenditure", "Expenditure GDP", gdp);
  updateComparison();
});

document.getElementById("btn-income").addEventListener("click", () => {
  const fields = [
    document.getElementById("inc-wages"),
    document.getElementById("inc-rent"),
    document.getElementById("inc-interest"),
    document.getElementById("inc-profits"),
    document.getElementById("inc-taxes"),
    document.getElementById("inc-subsidies"),
    document.getElementById("inc-depreciation")
  ];
  if (!validateSection("error-income", fields)) {
    return;
  }

  const wages = toNumber(fields[0].value);
  const rent = toNumber(fields[1].value);
  const interest = toNumber(fields[2].value);
  const profits = toNumber(fields[3].value);
  const taxes = toNumber(fields[4].value);
  const subsidies = toNumber(fields[5].value);
  const depreciation = toNumber(fields[6].value);
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
  const productFields = rows.flatMap((row) => [
    row.querySelector(".sector-output"),
    row.querySelector(".sector-intermediate")
  ]);
  if (!validateSection("error-product", productFields)) {
    return;
  }

  const totalValueAdded = rows.reduce((sum, row) => {
    const output = toNumber(row.querySelector(".sector-output").value);
    const intermediate = toNumber(row.querySelector(".sector-intermediate").value);
    return sum + (output - intermediate);
  }, 0);

  setResult("result-product", "Product GDP", totalValueAdded);
  updateComparison();
});

addSectorRow();

const expenditureFields = ["exp-c", "exp-i", "exp-g", "exp-x", "exp-m"].map((id) =>
  document.getElementById(id)
);
expenditureFields.forEach((field) => {
  field.addEventListener("input", () => validateSection("error-expenditure", expenditureFields));
});

const incomeFields = [
  "inc-wages",
  "inc-rent",
  "inc-interest",
  "inc-profits",
  "inc-taxes",
  "inc-subsidies",
  "inc-depreciation"
].map((id) => document.getElementById(id));
incomeFields.forEach((field) => {
  field.addEventListener("input", () => validateSection("error-income", incomeFields));
});

sectorRowsEl.addEventListener("input", () => {
  const productFields = Array.from(sectorRowsEl.querySelectorAll(".sector-output, .sector-intermediate"));
  validateSection("error-product", productFields);
});
