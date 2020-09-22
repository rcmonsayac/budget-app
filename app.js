"use strict";

let submitButton = document.querySelector('.input-submit');
let dropdown = document.querySelector('.input-dropdown');
let desc = document.querySelector('.input-desc')
let value = document.querySelector('.input-value')
let incomeList = document.querySelector('.income-items');
let expenseList = document.querySelector('.expense-items');
let incomeArray = [];
let expenseArray = [];


let getId = function() {
    let incomeCounter = 0;
    let expenseCounter = 0;
    return function(type){
        return type === "income" ? incomeCounter++ : expenseCounter++;
    }
}

let Item = function(value, desc, type){
    this.id = this.getItemId(type);
    this.value = value;
    this.desc = desc;
    this.type = type;
    this.generateElement = function(){
        let itemElement = document.createElement("div");
        let descElement = document.createElement("span");
        let valueElement = document.createElement("span");
        let delButton = document.createElement("button");

       
        itemElement.classList.add(`${this.type}-item`);
        descElement.classList.add(`${this.type}-desc`);
        valueElement.classList.add(`${this.type}-value`);
        delButton.classList.add(`${this.type}-value`);
        if(type === "expense"){
            let percentageElement = document.createElement("span")
        }



    }
    this.removeSelf = function(e){
        e.currentTarget.parentElement.remove();
    }
    this.getItemId = getId;
}



function getOppType(type) {
    return type === 'income' ? 'expense' : 'income';
}

function toggleButton(type) {
    let oppType = getOppType(type);
    submitButton.classList.remove(`${oppType}-button`);
    submitButton.classList.add(`${type}-button`);
}

//Issue 2 - Dropdown expense and income toggle
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





