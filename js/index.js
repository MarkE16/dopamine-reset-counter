var counterLbl;
var configInputs;
var counterContainer;
var toggleBtn;
var minutesInput;
var secondsInput;
var tip;
var failiureMsg;
var intervalID;
var failiureMsgID;
var isRunning = false;
var oldIsRunning = isRunning;
var tips = [
    "Practice makes perfect.",
    "Practice meditation or exercise whenever stressed.",
    "Put your phone in grayscale mode to reduce the amount of dopamine released.",
    "Exercise and a good diet are excellent methods to getting out of additions or improving yourself.",
];
var failiureMsgs = [
    "Ops, you failed.",
    "You failed, try again.",
    "Keep trying.",
    "Stop moving!!!",
    "Don't press the keys either!!!",
    "If I could do it (with other people as well), you can too.",
    "You got this, keep trying.",
];
window.onload = function () {
    // Get all the elements once they load.
    counterLbl = document.querySelector('#display');
    configInputs = document.getElementById("counter-config");
    counterContainer = document.getElementById("counter");
    toggleBtn = document.getElementById("toggle-btn");
    minutesInput = document.querySelector('#minutes');
    secondsInput = document.querySelector('#seconds');
    tip = document.querySelector('#tip');
    failiureMsg = document.querySelector('#failiureMsg');
    generateTip(); // Generate a tip on load.
    generateFailiureMsg(); // Generate a failiure message on load.
    setInterval(generateTip, 10000); // Then generate a tip every 10 seconds.
};
window.addEventListener('pointermove', resetTimer);
window.addEventListener('keydown', resetTimer);
function resetTimer() {
    if (failiureMsgID) {
        clearTimeout(failiureMsgID);
    }
    if (isRunning) {
        setMsgOpacity("1");
        failiureMsgID = setTimeout(function () {
            setMsgOpacity("0");
            setTimeout(generateFailiureMsg, 1000); // Delay the new message so the text can fade out.
            clearTimeout(failiureMsgID);
        }, 5000);
        clearInterval(intervalID);
        updateMinutes();
        updateSeconds();
        startTimer();
    }
}
function generateTip() {
    var selected = tips[Math.floor(Math.random() * tips.length)];
    tip.innerText = tip.innerHTML.substring(0, 5) + selected;
}
function generateFailiureMsg() {
    var selected = failiureMsgs[Math.floor(Math.random() * failiureMsgs.length)];
    failiureMsg.innerText = selected;
}
function setMsgOpacity(opacity) {
    failiureMsg.style.opacity = opacity;
}
function configTimer(type) {
    if (minutesInput.value.length > 2 || secondsInput.value.length > 2) {
        alert("Please enter less than 2 digits.");
        minutesInput.value = minutesInput.value.slice(0, 2);
        secondsInput.value = secondsInput.value.slice(0, 2);
        return;
    }
    switch (type) {
        case "min":
            updateMinutes();
            break;
        case "sec":
            updateSeconds();
            break;
        default:
            alert("Invalid type.");
    }
}
function updateMinutes() {
    if (+minutesInput.value > 59) {
        minutesInput.value = "59";
    }
    var minutes = minutesInput.value.padStart(2, '0');
    counterLbl.innerText = minutes + counterLbl.innerText.slice(2);
}
function updateSeconds() {
    if (+secondsInput.value > 59) {
        secondsInput.value = "59";
    }
    var seconds = secondsInput.value.padStart(2, '0');
    counterLbl.innerText = counterLbl.innerText.slice(0, 3) + seconds;
}
function toggleStart() {
    if (+minutesInput.value == 0 && +secondsInput.value == 0) {
        alert("Please enter a valid time.");
        return;
    }
    if (!isRunning) {
        // Start
        // Hide the inputs that configure the counter
        configInputs.style.opacity = "0";
        toggleBtn.innerText = "Stop";
        // Make the visual changes!!
        document.body.style.backgroundColor = "#000";
        document.body.style.color = "#fff";
        startTimer();
    }
    else {
        // Stop
        // Show the inputs that configure the counter
        clearInterval(intervalID);
        configInputs.style.opacity = "1";
        toggleBtn.innerText = "Begin";
        // Make the visual changes!!
        document.body.style.backgroundColor = "#fff";
        document.body.style.color = "#000";
    }
    isRunning = !isRunning; // After toggling, update the state.
    toggleCounterPosition();
    resetTimer();
}
function toggleCounterPosition() {
    if (isRunning) {
        counterContainer.style.position = "fixed";
        counterContainer.style.top = "50%";
        counterContainer.style.left = "50%";
        counterContainer.style.transform = "translate(-50%, -50%)";
    }
    else {
        counterContainer.style.position = "relative";
        counterContainer.style.top = "0";
        counterContainer.style.left = "0";
        counterContainer.style.transform = "translate(0, 0)";
    }
}
function startTimer() {
    intervalID = setInterval(function () {
        var splitCounter = counterLbl.innerText.split(':');
        var minutes = splitCounter[0], seconds = splitCounter[1];
        var secondsNum = +seconds;
        var minutesNum = +minutes;
        if (secondsNum === 0 && minutesNum === 0) {
            clearInterval(intervalID);
            toggleStart();
            alert("All Done!");
            // Reset properties.
            minutesInput.value = "0";
            secondsInput.value = "0";
            return;
        }
        if (secondsNum === 0) {
            minutesNum--;
            secondsNum = 60; // Reset seconds to 60, so that it can be decremented to 59 once `secondsNum--` is ran.
        }
        secondsNum--;
        updateCounterText(minutesNum, secondsNum);
    }, 1000);
}
function updateCounterText(minutes, seconds) {
    var minutesStr = ("" + minutes).padStart(2, '0');
    var secondsStr = ("" + seconds).padStart(2, '0');
    counterLbl.innerText = minutesStr + ":" + secondsStr;
}
