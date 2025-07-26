// Variables and constants
const memoryDisplay = document.getElementById("memory");
const signalDisplay = document.getElementById("signal");
const exponentialDisplay  = document.getElementById("exponential");

const textDisplay = document.getElementById("text__calculate__result");

const cache = {
    primarySlot: 0,
    signal: "",
    secondarySlot: 0,

    memory: 0,

    exponetial: false,
    decimal: false,

    clearValue: true,
    canCalculate: true
}

// Functions
function HasDot (value) {
    let string = value;

    for (let i = 0; i < string.length; i++) {
        if (string[i] == ".") {
            return i;
        }
    }
    return null;
}

function AddDot () {
    if (HasDot(cache.primarySlot.toString())) {return "";}

    if (cache.decimal) {return ".";}

    return "";
}

function TooBigValue (value) {
    let localValue = value;

    if (localValue < 0) {
        localValue = -localValue;
    }

    let string = localValue.toString();
    position = HasDot(string)
    if (position) {
        string = string.slice(0, position) + string.slice(position + 1);
    }

    return string.length > 8;
}

function ShowMainDisplay (value) {

    let localValue = value;
    let string = localValue.toString();

    let addDot = ".";
    if (HasDot(string)) {addDot = "";}

    if (localValue < 0) {
        textDisplay.innerText = (-localValue).toString() + addDot;
        signalDisplay.innerText = "-";
    } else {
        signalDisplay.innerText = "";
        textDisplay.innerText = localValue.toString() + addDot;
    }
}

function ShowItens () {

    if (cache.primarySlot > 99999999) {
        exponentialDisplay.innerText = "E";
        cache.exponetial = true;
    } else {
        exponentialDisplay.innerText = "";
    }

    if (TooBigValue(cache.primarySlot)) {
        character = 8
        if (cache.primarySlot < 0) {character = 9}
        if (HasDot(cache.primarySlot.toString())) {character = 9}
        ShowMainDisplay(cache.primarySlot.toString().slice(0, character));
    } else {
        ShowMainDisplay(cache.primarySlot);
    }

    if (cache.memory != 0) {
        memoryDisplay.innerText = "M";
    } else {
        memoryDisplay.innerText = "";
    }
}

signalFunctions = {
    minus: function (value1, value2) {
        return value1 - value2;
    },
    plus: function (value1, value2) {
        return value1 + value2;
    },
    division: function (value1, value2) {
        return value1 / value2;
    },
    multiplication: function (value1, value2) {
        return value1 * value2;
    }
}

function calculate () {
    if (cache.signal == "") {return;}

    if (cache.clearValue == false && cache.signal != "multiplication") {
        savedValue = cache.primarySlot
        cache.primarySlot = cache.secondarySlot
        cache.secondarySlot = savedValue
    }

    firstValue = cache.primarySlot
    secondValue = cache.secondarySlot

    const result = signalFunctions[cache.signal] (firstValue, secondValue)

    cache.primarySlot = result
    cache.clearValue = true;
}

const buttonFunctions = {
    sqrt: function () {cache.primarySlot =  Math.sqrt(cache.primarySlot);},
    percentage: function () {
        cache.primarySlot = (cache.secondarySlot * cache.primarySlot) / 100;
        
        if (cache.signal == "plus") {
            cache.primarySlot = cache.secondarySlot + cache.primarySlot
        } else if (cache.signal == "minus") {
            cache.primarySlot = cache.secondarySlot - cache.primarySlot
        }
    },
    clear: function () {
        cache.primarySlot = 0;
        cache.signal = "";
        cache.secondarySlot = 0;
        cache.exponetial = false;
        cache.decimal = false;
        cache.clearValue = true;
        cache.canCalculate = true;
    },
    MC: function () {cache.memory = 0;},
    MR: function () {
        cache.primarySlot = cache.memory;
        cache.clearValue = true;
    },
    M__plus: function () {
        cache.memory += cache.primarySlot;
        cache.clearValue = true;
    },
    M__minus: function () {
        cache.memory -= cache.primarySlot;
        cache.clearValue = true;
    },
    dot: function () {cache.decimal = true;},
    convert__signal: function () {cache.primarySlot = - cache.primarySlot},
    minus: function () {
        if (cache.canCalculate) {calculate();}
        cache.signal = "minus";
        cache.secondarySlot = cache.primarySlot;
        cache.clearValue = true;
    },
    plus: function () {
        if (cache.canCalculate) {calculate();}
        cache.signal = "plus";
        cache.secondarySlot = cache.primarySlot;
        cache.clearValue = true;
    },
    division: function () {
        if (cache.canCalculate) {calculate();}
        cache.signal = "division";
        cache.secondarySlot = cache.primarySlot;
        cache.clearValue = true;
    },
    multiplication: function () {
        if (cache.canCalculate) {calculate();}
        cache.signal = "multiplication";
        cache.secondarySlot = cache.primarySlot;
        cache.clearValue = true;
    },
    equal: function () {calculate();},
}


// Run
ShowItens()

for (buttonFunction in buttonFunctions) {
    const button = buttonFunction
    const element = document.getElementById(button)
    element.addEventListener("click", () => {
        if (cache.exponetial && button != "clear") {return;}

        buttonFunctions[button]()
        cache.canCalculate = false;

        ShowItens()
    })
}

for (let i = 0; i < 10; i++) {
    const button = i.toString()
    const element = document.getElementById(button)
    element.addEventListener("click", () => {
        if (cache.exponetial) {return;}
        if (cache.clearValue) {
            cache.primarySlot = 0;
            cache.decimal = false;
            cache.clearValue = false;
        }

        const addDot = AddDot();
        const finalValue = Number(cache.primarySlot.toString() + addDot + button);

        if (TooBigValue(finalValue)) {return;}

        cache.primarySlot = finalValue;
        cache.canCalculate = true;

        ShowItens()
    })
}