const calculator = document.querySelector(".calculator");
const calculKeys = document.querySelector(".calcul-buttons");
const calculDisplay = document.querySelector(".screen-text")
let equation = "";
let decimals = "";
let isEqualsPressed = false;

calculKeys.addEventListener("click", (e) => {

    if (!e.target.closest("button")) return;

    if (isEqualsPressed) {
        isEqualsPressed = false;
        calculDisplay.textContent = "0";
    }

    
    const key = e.target;
    const keyValue = key.textContent;
    const { type } = key.dataset;
    const { previousKeyType } = calculator.dataset;

    if (equation.length >= 15 && !(type === "delete" || type === "clear")) return;
    
    if (type === "number") {
        
        if (calculDisplay.textContent === "0") {
            calculDisplay.textContent = (previousKeyType === "operator") ? calculDisplay.textContent + keyValue : keyValue;
            equation = (previousKeyType === "operator") ? equation + keyValue : keyValue;
            decimals = decimals + keyValue;
        } else {
            calculDisplay.textContent = calculDisplay.textContent.includes("N") ? "NaN" :
                calculDisplay.textContent.includes("I") ? "Infinity" : calculDisplay.textContent + keyValue;

            equation = equation + keyValue;
            decimals = decimals + keyValue;

        }

    }

    if (type === "operator" && previousKeyType !== "operator"
        && !isEqualsPressed && !calculDisplay.textContent.includes("Infinity")) {
        decimals = "";
        calculDisplay.textContent = calculDisplay.textContent + " " + keyValue + " ";
        equation = equation + " " + keyValue + " ";
    }

    if (type === "dot" && (previousKeyType === "number" || calculDisplay.textContent === "0")
        && !isEqualsPressed && !calculDisplay.textContent.includes("Infinity")) {
        if (!decimals.includes(".")) {
            calculDisplay.textContent = calculDisplay.textContent + keyValue;
            equation = equation + keyValue;
            decimals = decimals + keyValue;
        }
    }

    if ((type === "clear" || type === "delete") && calculDisplay.textContent !== "0") {
        if (type === "delete" && !isEqualsPressed) {
            calculDisplay.textContent = calculDisplay.textContent.substring(0, calculDisplay.textContent.length - 1);
            decimals = decimals.substring(0, decimals.length - 1);

            if (calculDisplay.textContent.length === 0) {
                calculDisplay.textContent = "0";
            }
        } else {
            calculDisplay.textContent = "0";
            isEqualsPressed = false;
            equation = "";
            decimals = "";
        }
    }

    if (type === "equal") {
        isEqualsPressed = true;
        console.log(equation);
        const finalResult = handleEquation(equation);

        if (finalResult || finalResult === 0) {
            calculDisplay.textContent = (!Number.isInteger(finalResult)) ? finalResult.toFixed(2) :
                (finalResult.toString().length >= 16) ? finalResult.toExponential(2) : finalResult;
        } else {
            calculDisplay.textContent = "Math Error";
        }
    }

    calculator.dataset.previousKeyType = type;
});

function calculate(firstNumber, operator, secondNumber) {

	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

    if (operator === 'plus' || operator === '+') return firstNumber + secondNumber;
    if (operator === 'minus' || operator === '-') return firstNumber - secondNumber;
    if (operator === 'multiply' || operator === 'x') return firstNumber * secondNumber;
    if (operator === 'divide' || operator === '/') return firstNumber / secondNumber;
    if (operator === 'remainder' || operator === '%') return firstNumber % secondNumber;
}

function handleEquation(equation) {

	equation = equation.split(" ");
	const operators = ['/', 'x', '%', '+', '-'];
	let firstNumber;
	let secondNumber;
	let operator;
	let operatorIndex;
	let result;

	/*
		1. Perform calculations as per BODMAS Method
		2. For that use operators array
		3. after calculation of 1st numbers replace them with result
		4. use splice method

	*/
	for (var i = 0; i < operators.length; i++) {
		while (equation.includes(operators[i])) {
			operatorIndex = equation.findIndex(item => item === operators[i]);
			firstNumber = equation[operatorIndex-1];
			operator = equation[operatorIndex];
			secondNumber = equation[operatorIndex+1];
			result = calculate(firstNumber, operator, secondNumber);
			equation.splice(operatorIndex - 1, 3, result);
		}
	}

	return result;
}


