MyGame.screens['new-high-score'] = (function (game) {
    'use strict';

    function initialize() {
        // Submit user's initials to the high score
        document.getElementById('id-new-highscore-submit').addEventListener(
            'click',
            () => {
                // Get user's initials from input
                let initialsFromPlayerInput = document.getElementById('id-initials-input').value;
                // Get the new HighScore from the game-play API
                let newHS = MyGame.screens["game-play"].newHighScore;
                // Add the user inputed initials to the new HighScore
                newHS.initials = initialsFromPlayerInput;
                // Add the new HighScore to the HighScores
                MyGame.screens["game-play"].highScores.append(newHS);
                // Display the recently updated HighScores to the user
                game.showScreen('high-scores');
            }
        );
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
