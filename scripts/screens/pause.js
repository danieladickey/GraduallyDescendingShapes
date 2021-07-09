MyGame.screens['pause'] = (function (game) {
    'use strict';

    function initialize() {
        // Setup each of screens events for the screens
        document.getElementById('id-pause-resume').addEventListener(
            'click',
            function () {
                MyGame.screens["game-play"].resumeGame();
                game.showScreen('game-play');
            });

        document.getElementById('id-pause-quit').addEventListener(
            'click',
            function () {
                MyGame.screens["game-play"].resetGame();
                game.showScreen('main-menu');
            });

        document.getElementById('id-pause-settings').addEventListener(
            'click',
            function () {
                MyGame.screens['settings'].setPreviousScreen("pause");
                game.showScreen('settings');
            });
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
