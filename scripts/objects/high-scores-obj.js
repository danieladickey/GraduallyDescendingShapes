// --------------------------------------------------------------
//
// Creates a High Score(s) object, with functions for managing state.
// Used to store multiple High Score objects and update the cloud.
//
// spec = {
//     "highScores": [HighScore],
// }
//
// --------------------------------------------------------------
MyGame.objects.HighScores = function (spec) {
    'use strict';

    const loadHSs = retreiveLocal;
    const saveHSs = saveLocal;

    spec.highScores = loadHSs();
    display();

    /**
     * If there are highScores stored in the browser then retrieve them otherwise make new
     * @param {string} item 
     * @returns {[highScore]}
     */
    function retreiveLocal(item = 'locallySavedHighScore') {
        return JSON.parse(localStorage.getItem(item)) ?? createNew();
    }

    /**
     * Saves the current game's HighScores list of HighScore objects to the browser 
     * @param {[highScore]} highScores 
     * @param {string} item 
     */
    function saveLocal(highScores = spec.highScores, item = 'locallySavedHighScore') {
        localStorage.setItem(item, JSON.stringify(highScores))
    }

    /**
     * Creates a new list of HighScore objects of size: capacity
     * @param {number} capacity 
     * @returns {[HighScore]}
     */
    function createNew(capacity = 5) {
        const newHS = []
        for (let i = capacity; i > 0; i--) {
            newHS.push({
                score: i ** i + i * 5 + i,
                level: 0,
                initials: "Y.2.K.",
                date: "DEC-31-99"
            });
        }
        return newHS;
    }

    function sort(highScores = spec.highScores) {
        highScores.sort((a, b) => {
            return b["score"] - a["score"]
        });
    }

    /**
     * Ensures new HighScore is still a high score then adds it, sorts the high scores, 
     * removes the lowest score, saves the high scores, and updates HTML
     * @param {HighScore} highScore 
     * @param {HighScores} highScores 
     * @returns success bool
     */
    function append(highScore, highScores = spec.highScores) {
        if (check(highScore.score)) {
            highScores.push(highScore); // in with the new
            sort();
            highScores.pop(); // out with the old
            saveHSs();
            display();
            return true;
        }
        return false;
    }

    /**
     * Checks the player's score against the score of the lowest HighScore in the HighScores
     * @param {number} score 
     * @param {HighScores} highScores 
     * @returns true if the player has a new high score
     */
    function check(score, highScores = spec.highScores) {
        loadHSs();
        return score > highScores[4].score ? true : false;
    }

    /**
     * Refreshes the DOM with the given HighScores
     * @param {HighScores} highScores 
     */
    function display(highScores = spec.highScores) {
        // Get list of HighScores from HTML
        const tbodyElement = document.getElementById("high-scores-list");
        // Delete old HighScore objects from HTML and replace table header 
        tbodyElement.innerHTML =
            `<tr>
                <th>Score</th>
                <th>Level</th>
                <th>Initials</th>
                <th>Date</th>
            </tr>`;

        // Append each new HighScore object to HTML
        highScores.forEach(highScore => {
            // add commas every three digits representing thousands place etc
            const score = highScore.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const level = highScore.level.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            const initials = highScore.initials;
            const date = highScore.date;
            tbodyElement.innerHTML +=
                `<tr>
                    <td>${score}</td>
                    <td>${level}</td>
                    <td>${initials}</td>
                    <td>${date}</td>
                </tr>`
        });
    }

    let api = {
        check: check,
        append: append,
    }

    return api;
}