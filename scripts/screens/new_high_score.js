MyGame.screens['new-high-score'] = (function (game, screens) {
    'use strict';

    function initialize() {
        // Go back to main screens...
        document.getElementById('id-new-highscore-submit').addEventListener(
            'click',
            function () {
                console.log(document.getElementById('id-initials-inpu').innerHTML);
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
