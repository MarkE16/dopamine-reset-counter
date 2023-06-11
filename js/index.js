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
var clickedStart = false;
var footerDate;
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
    configInputs = document.querySelector("#counter-config");
    counterContainer = document.querySelector("#counter");
    toggleBtn = document.querySelector("#toggle-btn");
    minutesInput = document.querySelector('#minutes');
    secondsInput = document.querySelector('#seconds');
    tip = document.querySelector('#tip');
    failiureMsg = document.querySelector('#failiureMsg');
    footerDate = document.querySelector('#footer-date');
    updateUIText();
    setInterval(updateUIText, 10000); // Then generate a tip every 10 seconds.
    updateFooterDate();
};
window.addEventListener('pointermove', resetTimer);
window.addEventListener('keydown', resetTimer);
window.addEventListener('click', resetTimer);
function updateFooterDate() {
    var year = new Date().getFullYear();
    var footerDate = document.querySelector('#footer-date');
    footerDate.innerText = "© " + year.toString();
}
function resetTimer() {
    if (failiureMsgID) {
        clearTimeout(failiureMsgID);
        setMsgOpacity("0");
    }
    if (isRunning) {
        updateMinutes();
        updateSeconds();
        if (clickedStart) {
            clickedStart = false;
            return;
        }
        setMsgOpacity("1");
        failiureMsgID = setTimeout(function () {
            setMsgOpacity("0");
            clearTimeout(failiureMsgID);
        }, 5000);
        clearInterval(intervalID);
        startTimer();
    }
}
function generateRandomFromArray(arr, textChecker) {
    while (true) {
        var selected = arr[Math.floor(Math.random() * arr.length)];
        if (selected !== textChecker) {
            return selected;
        }
    }
}
function updateUIText() {
    var tipSubstring = tip.innerText.substring(5);
    tip.innerText = tip.innerHTML.substring(0, 5) + generateRandomFromArray(tips, tipSubstring);
    failiureMsg.innerText = generateRandomFromArray(failiureMsgs, failiureMsg.innerText);
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
    minutesInput.value = minutes;
}
function updateSeconds() {
    if (+secondsInput.value > 59) {
        secondsInput.value = "59";
    }
    var seconds = secondsInput.value.padStart(2, '0');
    counterLbl.innerText = counterLbl.innerText.slice(0, 3) + seconds;
    secondsInput.value = seconds;
}
function toggleStart() {
    if (+minutesInput.value == 0 && +secondsInput.value == 0) {
        alert("Please enter a valid time.");
        return;
    }
    if (!isRunning) {
        // Start
        // Hide the inputs that configure the counter
        configInputs.style.display = "none";
        toggleBtn.innerText = "Stop";
        // Make the visual changes!!
        document.body.style.backgroundColor = "#000";
        document.body.style.color = "#fff";
        startTimer();
        clickedStart = true;
    }
    else {
        // Stop
        // Show the inputs that configure the counter
        clearInterval(intervalID);
        configInputs.style.display = "block";
        toggleBtn.innerText = "Begin";
        // Make the visual changes!!
        document.body.style.backgroundColor = "#fff";
        document.body.style.color = "#000";
    }
    isRunning = !isRunning; // After toggling, update the state.
    resetTimer();
}
function startTimer() {
    intervalID = setInterval(function () {
        var splitCounter = counterLbl.innerText.split(':');
        var minutes = splitCounter[0], seconds = splitCounter[1];
        var clockTick = new Audio("assets/clock-tick.mp3");
        clockTick.volume = 0.3;
        var secondsNum = +seconds;
        var minutesNum = +minutes;
        if (secondsNum === 0 && minutesNum === 0) {
            clearInterval(intervalID);
            toggleStart();
            alert("All Done!");
            // Reset properties.
            minutesInput.value = "00";
            secondsInput.value = "00";
            return;
        }
        if (secondsNum === 0) {
            minutesNum--;
            secondsNum = 60; // Reset seconds to 60, so that it can be decremented to 59 once `secondsNum--` is ran.
        }
        secondsNum--;
        updateCounterText(minutesNum, secondsNum);
        clockTick.play();
    }, 1000);
}
function updateCounterText(minutes, seconds) {
    var minutesStr = ("" + minutes).padStart(2, '0');
    var secondsStr = ("" + seconds).padStart(2, '0');
    counterLbl.innerText = minutesStr + ":" + secondsStr;
}
