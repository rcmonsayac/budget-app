"use strict";

const submitButton = document.querySelector('.input-submit');
const dropdown = document.querySelector('.input-dropdown');
const descInput = document.querySelector('.input-desc')
const valueInput = document.querySelector('.input-value')
const inputForm = document.querySelector(".budget-input");

//Issue 2 - Dropdown expense and income toggle
//toggler of submit button color
function toggleButton(type) {
    let oppType = type === 'income' ? 'expense' : 'income';
    submitButton.classList.remove(`${oppType}-button`);
    submitButton.classList.add(`${type}-button`);
}

//Event listner when dropdown becomess active, adds check symbol to selected option
dropdown.addEventListener("focus", function (e) {
    let selected = dropdown.options[dropdown.selectedIndex];
    selected.innerHTML = selected.innerText + "&check;";
});

//Removes check symbol to selected option when dropdown becomes inactive
dropdown.addEventListener("blur", function (e) {
    let selected = dropdown.options[dropdown.selectedIndex];
    selected.innerHTML = selected.innerText[0];
});

//Moves the check symbol when selected option changes
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

//Add or remove active effect on all input fields depending on current dropdown value
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
    let percent = Number(value / totalIncome * 100);
    return !isNaN(percent) && isFinite(percent) ?
        percent.toFixed(0) + '%' : "...";
}

function formatValue(type, value) {
    return (type === "income" ? "+ " : "- ") + Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 });
}


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
        let totalExpense = this.getTotal("expense")
        if (type === "income") {
            this.expense.forEach((current) => {
                let percentElement = current.element.querySelector(".expense-percentage");
                current.percentage = getPercent(current.value, totalIncome);
                percentElement.innerHTML = current.percentage;
            });
        }
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
    removeItem: function (item) {
        return e => {
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









