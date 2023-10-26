MyGame.screens['new-high-score'] = (function (game, screens) {
    'use strict';

    function initialize() {
        // Submit user's initials to the high score
        document.getElementById('id-new-highscore-submit').addEventListener(
            'click',
            () => {
                // Add periods between initials
                let input = document.getElementById('id-initials-input').value;
                let initials = "";
                for (const initial of input) {
                    initials += initial + "."
                }
                // TODO: add function call to save high score
                
                // Show updated high-score 
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
