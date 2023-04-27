'use strict';

// TODO: add ability to save username upon new high score (type username screen etc)

// default high scores
let highScore = {
    "1st": {
        "score": 0,
        "level": 0,
        "initials": "---",
        "date": null
    },
    "2nd": {
        "score": 0,
        "level": 0,
        "initials": "---",
        "date": null
    },
    "3rd": {
        "score": 0,
        "level": 0,
        "initials": "---",
        "date": null
    },
    "4th": {
        "score": 0,
        "level": 0,
        "initials": "---",
        "date": null
    },
    "5th": {
        "score": 0,
        "level": 0,
        "initials": "---",
        "date": null
    },
}

// fetch previously saved scores
let previousHighScores = localStorage.getItem('savedScoresTetris');

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousHighScores !== null) {
    highScore = JSON.parse(previousHighScores);
}

// set high scores when website loads this script
addSortSaveHighScores();

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
        return b["score"] - a["score"]
    });

    // update high score object with sorted scores
    highScore["1st"] = list[0];
    highScore["2nd"] = list[1];
    highScore["3rd"] = list[2];
    highScore["4th"] = list[3];
    highScore["5th"] = list[4];

    // save scores to local machine
    localStorage['savedScoresTetris'] = JSON.stringify(highScore);

    // show high scores on high score page
    document.getElementById("1st").innerHTML = highScore["1st"];
    document.getElementById("2nd").innerHTML = highScore["2nd"];
    document.getElementById("3rd").innerHTML = highScore["3rd"];
    document.getElementById("4th").innerHTML = highScore["4th"];
    document.getElementById("5th").innerHTML = highScore["5th"];

    return list[list.length - 1] !== newScore;
}
