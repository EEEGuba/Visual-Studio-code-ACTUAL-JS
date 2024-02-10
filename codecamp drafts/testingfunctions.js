const symbols = {
    1000: "M",
    900: "DM",
    500: "D",
    400: "CD",
    100: "C",
    90: "XC",
    50: "L",
    40: "XD",
    10: "X",
    9: "IX",
    5: "V",
    4: "IV",
    1: "I"
};

function inputFunction() {
    let input = document.getElementById("number").value;

    if (input == "") { document.getElementById("output").innerHTML = ("Please enter a valid number") }
    else if (input < 1) { document.getElementById("output").innerHTML = ("Please enter a number greater than or equal to 1") }
    else if (input > 3999) { document.getElementById("output").innerHTML = ("Please enter a number less than or equal to 3999") }
    else { document.getElementById("output").innerHTML = romanSwitchboard(input) }
}

function romanSwitchboard(input) {
    let result = ""
    let arabicNumber = input
    while (arabicNumber > 0) {
        let nextNumber = romanTicker(arabicNumber)
        result.push(nextNumber)
        arabicNumber -= nextNumber
    }
}
function romanTicker(input) {
    for (let i = input; i < 0; i--) {
        if (input > symbols[i]) {
            return (symbols[i])
        }
    }
}

/*function romanSwitchboard(input) {
    let result = "";

    for (let i = 1000; i > 5; i /= 5) {
        let tmp = romanNumeralMaker(input, i, i / 10);
        result += tmp[1];
        i /= 2;
        tmp = romanNumeralMaker(tmp[0], i, i / 5);
        input = tmp[0];
        result += tmp[1];
    }

    const fin = romanNumeralMaker(input, 1, undefined);
    return result + fin[1];
}

function romanNumeralMaker(input, max, min) {
    let result = "";
    while (input >= max) {
        input -= max;
        result += symbols[max];
    }

    if (min !== undefined) {
        const diff = max - min;

        if (input >= diff) {
            input -= diff;
            result += `${symbols[min]}${symbols[max]}`;
        }
    }

    return [input, result];
};*/















function clean() {
    document.getElementById("results-div").innerHTML = ""
    console.log("cleared!")
}
function inputFunction() {
    const input = document.getElementById("user-input").value
    const numericInput = (input.replace(/[^0-9]/gi, ''))
    const numericLength = numericInput.length
    if (input == "") { alert("Please provide a phone number") }
    else if (numericLength > 11 || numericLength < 10) {
        failState(input)
    }
    else if (numericLength == 11 && (numericInput[0] < 1 || numericInput[0] > 1) || input[0] === "-") { failState(input) }
    else if (input.includes('(')) {
        if (input.index) { }
        else {
            failsTate(input)
        }
    }
    else { document.getElementById("results-div").innerHTML = "Valid US number: " + input; }
}
function failState(input) {
    document.getElementById("results-div").innerHTML = "Invalid US number: " + input;
}








function clean() {
    document.getElementById("results-div").innerHTML = ""
    console.log("cleared!")
}
function inputFunction() {
    /** @type {string}*/
    const input = document.getElementById("user-input").value
    if (input.replace(/(1 ?)?([0-9]{3}|\([0-9]{3}\))[ -]?[0-9]{3}[ -]?[0-9]{4})/g, "") !== "") { document.getElementById("results-div").innerHTML = "Invalid US number: " + input; }
    else { document.getElementById("results-div").innerHTML = "Valid US number: " + input; }
}
function failState(input) {
    document.getElementById("results-div").innerHTML = "Invalid US number: " + input;
}