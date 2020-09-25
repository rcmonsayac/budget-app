"use strict";

const submitButton = document.querySelector('.input-submit');
const dropdown = document.querySelector('.input-dropdown');
const descInput = document.querySelector('.input-desc')
const valueInput = document.querySelector('.input-value')
const inputForm = document.querySelector(".budget-input");
const dateDisplay = document.querySelector(".current-month-year");

//display current month year in header
let currentDate = new Date();
dateDisplay.innerHTML = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

//Issue 2 - Dropdown expense and income toggle
function toggleButton(type) {
    let oppType = type === 'income' ? 'expense' : 'income';
    submitButton.classList.remove(`${oppType}-button`);
    submitButton.classList.add(`${type}-button`);
}
dropdown.addEventListener("focus", function (e) {
    let selected = dropdown.options[dropdown.selectedIndex];
    selected.innerHTML = selected.innerText + "&check;";
});

dropdown.addEventListener("blur", function (e) {
    let selected = dropdown.options[dropdown.selectedIndex];
    selected.innerHTML = selected.innerText[0];
});

dropdown.addEventListener("change", function (e) {
    let selected = dropdown.options[dropdown.selectedIndex];
    Array.from(dropdown.options).forEach((element, i) => {
        if (dropdown.selectedIndex !== i) {
            element.innerHTML = element.innerText[0];
        }
    });
    selected.innerHTML = selected.innerText + "&check;";
    toggleButton(selected.value);
});

document.querySelectorAll('.input').forEach(element => {
    element.addEventListener("focus", e => {
        let type = dropdown.value;
        element.classList.add(`${type}-input`);
    });
    element.addEventListener("blur", e => {
        element.classList.remove(`income-input`);
        element.classList.remove(`expense-input`);
    });
})

//utilities
function getPercent(value, totalIncome) {
    let percent = Math.round(value / totalIncome * 100);
    if(!isNaN(percent) && isFinite(percent)){
        return String(percent).length < 4 ? percent + '%' : "...";
    }
    return "...";
}
function formatValue(type, value) {
    return (type === "income" ? "+ " : "- ") + Number(value).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

//Issue 2 - List functionality and totals display
const budgetObj = {
    income: [],
    expense: [],
    budgetElement: document.querySelector(".total-budget"),
    totalExpenseElement: document.querySelector(".total-expense-container"),
    totalIncomeElement: document.querySelector(".total-income-container"),
    incomeList: document.querySelector('.income-items'),
    expenseList: document.querySelector('.expense-items'),
    update: function (type) {
        let totalIncome = this.getTotal("income");
        let totalExpense = this.getTotal("expense");
        let budget = totalIncome - totalExpense;
        if (type === "income") {
            this.totalIncomeElement.querySelector(".total-value").innerHTML = formatValue("income", totalIncome);
            this.expense.forEach((current) => {
                let percentElement = current.element.querySelector(".expense-percentage");
                current.percentage = getPercent(current.value, totalIncome);
                percentElement.innerHTML = current.percentage;
            });
        }
        else {
            this.totalExpenseElement.querySelector(".total-value").innerHTML = formatValue("expense", totalExpense);
        }   
        this.totalExpenseElement.querySelector(".percentage").innerHTML = getPercent(totalExpense, totalIncome);
        this.budgetElement.innerHTML = budget >= 0 ? formatValue("income", Math.abs(budget)) : formatValue("expense", Math.abs(budget));
    },
    getTotal: function (type) {
        let total = this[type].reduce((sum, current) => {
            sum = sum + Number(current.value);
            return sum;
        }, 0);
        return total;
    },
    addItem: function (item) {
        if (item.type === 'expense') {
            item.percentage = getPercent(item.value, this.getTotal("income"));
        }
        let list = this[`${item.type}List`];
        list.appendChild(item.generateItem());
        item.element = list.querySelector(`#${item.type + item.id}`);
        this[item.type].push(item);
        this.update(item.type);
    },
    removeItem: function(item) {
        return (e) => {
            let itemIndex = budgetObj[item.type].findIndex(current => current.id == item.id)
            item.element.remove();
            budgetObj[item.type].splice(itemIndex, 1);
            budgetObj.update(item.type);
        }
    }
}

function generateId() {
    let incomeCounter = 0;
    let expenseCounter = 0;
    return function (type) {
        return type === "income" ? ++incomeCounter : ++expenseCounter;
    }
}
let getItemId = generateId();
let Item = function (value, desc, type, itemId, remove) {
    this.id = itemId(type);
    this.value = value;
    this.desc = desc;
    this.type = type;
    this.generateItem = function () {
        let itemElement = document.createElement("div");
        let descElement = document.createElement("span");
        let valueElement = document.createElement("span");
        let delButton = document.createElement("button");

        itemElement.id = this.type + this.id;

        itemElement.classList.add(`${this.type}-item`);
        descElement.classList.add(`${this.type}-desc`);
        valueElement.classList.add(`${this.type}-value`);
        delButton.classList.add(`${this.type}-delete`);


        descElement.innerHTML = this.desc;
        valueElement.innerHTML = formatValue(this.type, this.value);
        delButton.innerHTML = "<i class=\"fa fa-times\"></i>";
        delButton.addEventListener("click", remove(this));

        itemElement.appendChild(descElement);
        itemElement.appendChild(valueElement);

        if (type === "expense") {
            let percentageElement = document.createElement("span");
            percentageElement.classList.add("expense-percentage");
            percentageElement.innerHTML = this.percentage;
            itemElement.appendChild(percentageElement);
        }
        itemElement.appendChild(delButton);
        return itemElement;
    }
}

//Add items to list
inputForm.addEventListener("submit", (e) => {
    let type = dropdown.value;
    let desc = descInput.value;
    let value = valueInput.value;
    let item = new Item(value, desc, type, getItemId, budgetObj.removeItem);
    budgetObj.addItem(item);

    descInput.value = "";
    valueInput.value = "";

    e.preventDefault();
});









