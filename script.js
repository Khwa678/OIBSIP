```javascript
// Get display elements
const display = document.getElementById("display");
const previousDisplay = document.getElementById("previous-display");

// Calculator variables
let currentInput = "";
let firstNumber = null;
let currentOperator = null;
let shouldResetDisplay = false;


// --------------------------------------------------
// NUMBER BUTTONS
// --------------------------------------------------

const numberButtons = document.querySelectorAll("[data-number]");

numberButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const number = button.dataset.number;

        // If display needs to be reset after an operation
        if (shouldResetDisplay) {
            currentInput = "";
            shouldResetDisplay = false;
        }

        // Prevent unnecessary leading zeros
        if (currentInput === "0") {
            currentInput = number;
        } else {
            currentInput += number;
        }

        updateDisplay();
    });

});


// --------------------------------------------------
// DECIMAL BUTTON
// --------------------------------------------------

const decimalButton = document.querySelector("[data-action='decimal']");

decimalButton.addEventListener("click", function () {

    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    // Only allow one decimal point
    if (!currentInput.includes(".")) {

        if (currentInput === "") {
            currentInput = "0.";
        } else {
            currentInput += ".";
        }

    }

    updateDisplay();

});


// --------------------------------------------------
// OPERATOR BUTTONS
// --------------------------------------------------

const operatorButtons = document.querySelectorAll("[data-operator]");

operatorButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const operator = button.dataset.operator;

        handleOperator(operator);

    });

});


// --------------------------------------------------
// HANDLE OPERATOR
// --------------------------------------------------

function handleOperator(operator) {

    // Don't allow operator without a number
    if (currentInput === "" && firstNumber === null) {
        return;
    }

    // If user presses another operator after entering one
    // number, change the operator instead
    if (currentInput === "" && firstNumber !== null) {

        currentOperator = operator;

        previousDisplay.textContent =
            formatNumber(firstNumber) + " " + currentOperator;

        return;
    }


    const inputNumber = parseFloat(currentInput);

    if (isNaN(inputNumber)) {
        return;
    }


    // First number
    if (firstNumber === null) {

        firstNumber = inputNumber;

    } 
    
    // Operator chaining
    else if (currentOperator !== null) {

        const result = calculate(
            firstNumber,
            inputNumber,
            currentOperator
        );

        if (result === "Error") {

            showError();
            return;

        }

        firstNumber = result;

        currentInput = formatNumber(result);
    }


    currentOperator = operator;

    currentInput = "";

    shouldResetDisplay = false;

    previousDisplay.textContent =
        formatNumber(firstNumber) + " " + currentOperator;

    updateDisplay();

}


// --------------------------------------------------
// EQUALS BUTTON
// --------------------------------------------------

const equalsButton = document.querySelector("[data-action='equals']");

equalsButton.addEventListener("click", function () {

    if (
        firstNumber === null ||
        currentOperator === null ||
        currentInput === ""
    ) {
        return;
    }

    const secondNumber = parseFloat(currentInput);

    if (isNaN(secondNumber)) {
        return;
    }

    const result = calculate(
        firstNumber,
        secondNumber,
        currentOperator
    );


    // Division by zero
    if (result === "Error") {

        showError();

        return;
    }


    previousDisplay.textContent =
        formatNumber(firstNumber) +
        " " +
        currentOperator +
        " " +
        formatNumber(secondNumber) +
        " =";


    currentInput = formatNumber(result);

    firstNumber = null;
    currentOperator = null;

    shouldResetDisplay = true;

    updateDisplay();

});


// --------------------------------------------------
// CALCULATION LOGIC
// --------------------------------------------------

function calculate(number1, number2, operator) {

    switch (operator) {

        case "+":

            return number1 + number2;


        case "−":

            return number1 - number2;


        case "×":

            return number1 * number2;


        case "÷":

            // Prevent division by zero
            if (number2 === 0) {
                return "Error";
            }

            return number1 / number2;


        default:

            return number2;
    }

}


// --------------------------------------------------
// CLEAR BUTTON
// --------------------------------------------------

const clearButton = document.querySelector("[data-action='clear']");

clearButton.addEventListener("click", function () {

    currentInput = "";

    firstNumber = null;

    currentOperator = null;

    shouldResetDisplay = false;

    display.textContent = "0";

    previousDisplay.textContent = "";

});


// --------------------------------------------------
// DELETE / BACKSPACE BUTTON
// --------------------------------------------------

const deleteButton = document.querySelector("[data-action='delete']");

deleteButton.addEventListener("click", function () {

    if (shouldResetDisplay) {
        return;
    }

    if (currentInput.length > 0) {

        currentInput = currentInput.slice(0, -1);

    }

    updateDisplay();

});


// --------------------------------------------------
// UPDATE DISPLAY
// --------------------------------------------------

function updateDisplay() {

    if (currentInput === "") {

        display.textContent = "0";

    } else {

        display.textContent = currentInput;

    }

}


// --------------------------------------------------
// SHOW ERROR
// --------------------------------------------------

function showError() {

    display.textContent = "Error";

    previousDisplay.textContent = "Cannot divide by zero";

    currentInput = "";

    firstNumber = null;

    currentOperator = null;

    shouldResetDisplay = true;

}


// --------------------------------------------------
// FORMAT NUMBER
// --------------------------------------------------

function formatNumber(number) {

    // Avoid very long floating point results
    if (!Number.isFinite(number)) {
        return "Error";
    }

    const roundedNumber =
        Math.round((number + Number.EPSILON) * 100000000) /
        100000000;

    return String(roundedNumber);

}
```
