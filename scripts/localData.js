'use strict';

// number of controls in this game
const NUMBER_OF_CONTROLS = 7;

// default controls:
let controls = {
    "key1": 'ArrowLeft',
    "key2": 'ArrowRight',
    "key3": 'z',
    "key4": 'ArrowUp',
    "key5": 'ArrowDown',
    "key6": ' ',
    "key7": 'Escape'
}

// default settings
let settings = {
    'sound': true,
    'music': true,
}

// fetch previously saved controls
let previousControls = localStorage.getItem('savedControlsTetris');

// fetch previously saved settings
let previousSettings = localStorage.getItem('savedSettingsTetris');

// if not null then parse it (take string turn it into code) ...this seems like a security risk...
if (previousControls !== null) {
    controls = JSON.parse(previousControls);
}

// if not null then parse it (take string turn it into code) ...this seems like a security risk...
if (previousSettings !== null) {
    settings = JSON.parse(previousSettings);
}

// set buttons to show controls when website loads this script
for (let i = 1; i <= NUMBER_OF_CONTROLS; i++) {
    let keyString = "key" + i;
    // special case for space bar (" ")
    if (controls[keyString] === " ") {
        document.getElementById(keyString).innerHTML = "Space";
    }
    else if (controls[keyString] === "ArrowLeft") {
        document.getElementById(keyString).innerHTML = '\u2190';
    }
    else if (controls[keyString] === "ArrowUp") {
        document.getElementById(keyString).innerHTML = '\u2191';
    }
    else if (controls[keyString] === "ArrowRight") {
        document.getElementById(keyString).innerHTML = '\u2192';
    }
    else if (controls[keyString] === "ArrowDown") {
        document.getElementById(keyString).innerHTML = '\u2193';
    }
    else { // default case
        document.getElementById(keyString).innerHTML = controls[keyString];
    }
}

// set buttons to show settings when website loads this script
setSettingButton('sound');
setSettingButton('music');

// function to add a key and save it on local machine
function saveControl(key, value) {
    controls[key] = value; // set for game
    localStorage['savedControlsTetris'] = JSON.stringify(controls); // save locally
}

// function to update settings and save it on local machine
function saveSetting(key, value) {
    settings[key] = value; // set for game
    localStorage['savedSettingsTetris'] = JSON.stringify(settings); // save locally
    setSettingButton(key);
}

// function to set text and color of settings button based on what is saved
function setSettingButton(key) {
    if (settings[key]) {
        document.getElementById("setting-" + key).className = 'btn btn-success settings';
        document.getElementById("setting-" + key).innerHTML = "ON"
    } else {
        document.getElementById("setting-" + key).className = 'btn btn-danger settings';
        document.getElementById("setting-" + key).innerHTML = "OFF";
    }
}
