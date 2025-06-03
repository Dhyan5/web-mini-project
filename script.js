const form = document.getElementById("expense-form");
const tableBody = document.querySelector("#expense-table tbody");
const totalDisplay = document.getElementById("total");
const emptyMessage = document.getElementById("no-expenses");
const monthFilter = document.getElementById("month-filter");
const darkToggle = document.getElementById("dark-toggle");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function populateMonthFilter() {
  const months = [...new Set(expenses.map(e => e.date.slice(0, 7)))];
  monthFilter.innerHTML = '<option value="">Filter by Month</option>';
  months.forEach(month => {
    monthFilter.innerHTML += `<option value="${month}">${month}</option>`;
  });
}

function renderExpenses() {
  tableBody.innerHTML = "";
  let total = 0;
  const selectedMonth = monthFilter.value;

  const filtered = selectedMonth
    ? expenses.filter(e => e.date.startsWith(selectedMonth))
    : expenses;

  if (filtered.length === 0) {
    emptyMessage.style.display = "block";
  } else {
    emptyMessage.style.display = "none";
  }

  filtered.forEach((expense, index) => {
    total += parseFloat(expense.amount);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>₹${parseFloat(expense.amount).toFixed(2)}</td>
      <td>${expense.category}</td>
      <td>${expense.description}</td>
      <td>${expense.date}</td>
      <td><button class="delete-btn" onclick="deleteExpense(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });

  totalDisplay.textContent = total.toFixed(2);
  populateMonthFilter();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const expense = {
    amount: document.getElementById("amount").value,
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    date: document.getElementById("date").value
  };

  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
  form.reset();
});

monthFilter.addEventListener("change", renderExpenses);

document.getElementById("export-csv").addEventListener("click", function () {
  const rows = [["Amount", "Category", "Description", "Date"]];
  expenses.forEach(e => {
    rows.push([e.amount, e.category, e.description, e.date]);
  });

  let csv = rows.map(row => row.join(",")).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  let url = window.URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", "expenses.csv");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Dark mode
if (localStorage.getItem("darkMode") === "enabled") {
  document.body.classList.add("dark");
  darkToggle.checked = true;
}
darkToggle.addEventListener("change", () => {
  if (darkToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "disabled");
  }
});

window.onload = renderExpenses;
