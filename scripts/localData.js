'use strict';

// TODO: add ability to save username upon new high score (type username screen etc)

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
    "key7": 'Escape',
}

// default high scores
let highScore = {
    "1st": 0,
    "2nd": 0,
    "3rd": 0,
    "4th": 0,
    "5th": 0,
}

// default settings
let settings = {
    'sound': true,
    'music': true,
}

// fetch previously saved controls
let previousControls = localStorage.getItem('savedControls');

// fetch previously saved scores
let previousHighScores = localStorage.getItem('savedScores');

// fetch previously saved settings
let previousSettings = localStorage.getItem('savedSettings');

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousControls !== null) {
    controls = JSON.parse(previousControls);
}

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousHighScores !== null) {
    highScore = JSON.parse(previousHighScores);
}

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousSettings !== null) {
    settings = JSON.parse(previousSettings);
}

// set buttons to show controls when website loads this script
for (let i = 1; i <= NUMBER_OF_CONTROLS; i++) {
    let keyString = "key" + i;

    // special case for space bar (" ")
    if (controls[keyString] === " ") {
        document.getElementById(keyString).innerHTML = "Space";
    } else {
        document.getElementById(keyString).innerHTML = controls[keyString];
    }
}

// set high scores when website loads this script
addSortSaveHighScores();

// set buttons to show settings when website loads this script
setSettingButton('sound');
setSettingButton('music');

// function to add a key and save it on local machine
function saveControl(key, value) {
    controls[key] = value; // set for game
    localStorage['savedControls'] = JSON.stringify(controls); // save locally
}

// function to add/sort/save high scores on local machine
function addSortSaveHighScores(newScore = 0) {
    // take high scores and put into a list for sorting
    let list = [];
    list.push(highScore["1st"]);
    list.push(highScore["2nd"]);
    list.push(highScore["3rd"]);
    list.push(highScore["4th"]);
    list.push(highScore["5th"]);
    // add a new score if given one, else add 0 to list
    list.push(newScore);
    // sort list by largest to smallest
    list.sort(function (a, b) {
        return b - a
    });

    // update high score object with sorted scores
    highScore["1st"] = list[0];
    highScore["2nd"] = list[1];
    highScore["3rd"] = list[2];
    highScore["4th"] = list[3];
    highScore["5th"] = list[4];

    // save scores to local machine
    localStorage['savedScores'] = JSON.stringify(highScore);

    // show high scores on high score page
    document.getElementById("1st").innerHTML = highScore["1st"];
    document.getElementById("2nd").innerHTML = highScore["2nd"];
    document.getElementById("3rd").innerHTML = highScore["3rd"];
    document.getElementById("4th").innerHTML = highScore["4th"];
    document.getElementById("5th").innerHTML = highScore["5th"];

    return list[list.length - 1] !== newScore;
}

// function to update settings and save it on local machine
function saveSetting(key, value) {
    settings[key] = value; // set for game
    localStorage['savedSettings'] = JSON.stringify(settings); // save locally
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

