MyGame.screens['main-menu'] = (function (game) {
    'use strict';

    let userBusy = false;
    let attractModeDelay = 5000 // ms

    function initialize() {
        // Setup each of screens events for the screens
        document.getElementById('id-new-game').addEventListener(
            'click',
            function () {
                // user is busy: playing the game
                userBusy = true;
                game.showScreen('game-play');
                MyGame.screens["game-play"].startGame();
                MyGame.screens['game-play'].setAttract(false);
            });

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function () {
                // user is busy: viewing high scores
                userBusy = true;
                game.showScreen('high-scores');
            });

        document.getElementById('id-instructions').addEventListener(
            'click',
            function () {
                // user is busy: reading instructions
                userBusy = true;
                game.showScreen('instructions');
            });

        document.getElementById('id-controls').addEventListener(
            'click',
            function () {
                // user is busy: adjusting the controls
                userBusy = true;
                game.showScreen('controls');
            });

        document.getElementById('id-settings').addEventListener(
            'click',
            function () {
                // user is busy: adjusting the settings
                userBusy = true;
                MyGame.screens['settings'].setPreviousScreen("main-menu");
                game.showScreen('settings');
            });

        document.getElementById('id-credits').addEventListener(
            'click',
            function () {
                // user is busy: viewing the credits
                userBusy = true;
                game.showScreen('credits');
            });
    }

    // this function is run each time the main menu is displayed to the user
    function run() {
        // user is not busy when main menu is displayed
        userBusy = false;
        waitForUser(startAttractMode); // calls callback after delay
    }

    // waits for delay milliseconds then attempts to start attract mode / AI / demo mode
    function waitForUser(callback) {
        setTimeout(function () {
            // after delay do this asynchronously so not to block buttons etc
            callback(userBusy);
        }, attractModeDelay);
    }

    // this function causes the AI to begin demonstrating game play
    function startAttractMode(userBusy) {
        // if user is not busy demo the game
        if (!userBusy) {
            game.showScreen('game-play');
            MyGame.screens["game-play"].startGame();
            MyGame.screens['game-play'].setAttract(true);
        }
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game));
