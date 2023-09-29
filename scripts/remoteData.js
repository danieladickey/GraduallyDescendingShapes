'use strict';

// TODO: add ability to save username upon new high score (type username screen etc)

// divder used to seperate columns when displaying highscores
const COL_DIVIDER = "   ";

// default high scores
let highScore = {
    "1st": {
        "score": 0,
        "level": 99,
        "initials": "DAD",
        "date": new Date("1987-1-3").toString().slice(3, 15)
    },
    "2nd": {
        "score": 0,
        "level": 99,
        "initials": "DAD",
        "date": new Date("1987-1-3").toString().slice(3, 15)
    },
    "3rd": {
        "score": 0,
        "level": 99,
        "initials": "DAD",
        "date": new Date("1987-1-3").toString().slice(3, 15)
    },
    "4th": {
        "score": 0,
        "level": 99,
        "initials": "DAD",
        "date": new Date("1987-1-3").toString().slice(3, 15)
    },
    "5th": {
        "score": 0,
        "level": 99,
        "initials": "DAD",
        "date": new Date("1987-1-3").toString().slice(3, 15)
    }
}

console.log(highScore["1st"].date + " is today's date")

// fetch previously saved scores
let previousHighScores = localStorage.getItem('savedScoresTetris');

// if not null parse it (take string turn it into code) ...this seems like a security risk...
if (previousHighScores !== null) {
    highScore = JSON.parse(previousHighScores);
}

// set high scores when website loads this script
addSortSaveHighScores();

// function to add, sort, and save high scores on local machine
function addSortSaveHighScores(newScore = 0) {
    // take new high scores and put into a list for sorting
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
    document.getElementById("1st").innerHTML = highScore["1st"].score.toString().padStart(6, '0') + COL_DIVIDER + highScore["1st"].level.toString().padStart(2, '0') + COL_DIVIDER + highScore["1st"].initials + COL_DIVIDER + highScore["1st"].date;
    document.getElementById("2nd").innerHTML = highScore["2nd"].score.toString().padStart(6, '0') + COL_DIVIDER + highScore["2nd"].level.toString().padStart(2, '0') + COL_DIVIDER + highScore["2nd"].initials + COL_DIVIDER + highScore["2nd"].date;
    document.getElementById("3rd").innerHTML = highScore["3rd"].score.toString().padStart(6, '0') + COL_DIVIDER + highScore["3rd"].level.toString().padStart(2, '0') + COL_DIVIDER + highScore["3rd"].initials + COL_DIVIDER + highScore["3rd"].date;
    document.getElementById("4th").innerHTML = highScore["4th"].score.toString().padStart(6, '0') + COL_DIVIDER + highScore["4th"].level.toString().padStart(2, '0') + COL_DIVIDER + highScore["4th"].initials + COL_DIVIDER + highScore["4th"].date;
    document.getElementById("5th").innerHTML = highScore["5th"].score.toString().padStart(6, '0') + COL_DIVIDER + highScore["5th"].level.toString().padStart(2, '0') + COL_DIVIDER + highScore["5th"].initials + COL_DIVIDER + highScore["5th"].date;

    // return true if the newscore isn't last (6th) place because high score only shows top 5
    return list[list.length - 1] !== newScore;
}
