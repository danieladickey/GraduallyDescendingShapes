MyGame.screens['new-high-score'] = (function (game) {
    'use strict';

    function initialize() {
        // Submit user's initials to the high score
        document.getElementById('id-new-highscore-submit').addEventListener(
            'click',
            () => {
                // Get user's initials from input
                let initialsFromPlayerInput = document.getElementById('id-initials-input').value;
                // Ensure user entered at least 2 initials for first and last names
                if (initialsFromPlayerInput.length < 2) {
                    // Change congratulations message to alert user to enter their initials
                    document.getElementById("id-new-high-score-message").innerHTML = "Please enter 2-3 initials."
                    // Change congratulations message text color to red instead of white
                    document.getElementById("id-new-high-score-message").classList.add("text-danger");
                    // Focus / select the input field again so user can start typing right away (remove focus from button)
                    document.getElementById("id-initials-input").select();
                } else { // If the user has entered 2-3 initials 
                    // Get the new HighScore from the game-play API
                    let newHS = MyGame.screens["game-play"].newHighScore;
                    // Add the user inputted initials to the new HighScore
                    newHS.initials = initialsFromPlayerInput;
                    // Add the new HighScore to the HighScores
                    MyGame.screens["game-play"].highScores.append(newHS);
                    // Display the recently updated HighScores to the user
                    game.showScreen('high-scores');
                    // Reset congratulations message text
                    document.getElementById("id-new-high-score-message").innerHTML = "Congratulations!"
                    // Reset congratulations message color
                    document.getElementById("id-new-high-score-message").classList.add("text-white");
                }
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
