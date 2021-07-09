MyGame.screens['settings'] = (function (game) {
    'use strict';
    let previousScreen;

    function initialize() {
        // Go back to main screens...
        document.getElementById('id-settings-back').addEventListener(
            'click',
            function () {
                game.showScreen(previousScreen);
            }
        );

        // update settings
        document.getElementById("setting-sound").onclick = () => setSetting("sound");
        document.getElementById("setting-music").onclick = () => setSetting("music");
    }

    // function takes name of the setting to set, and toggles the bool to what ever it wasn't before ei: on -> off
    function setSetting(setting) {
        saveSetting(setting, !settings[setting]);
    }

    function setPreviousScreen(previous) {
        previousScreen = previous;
    }

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run,
        setPreviousScreen: setPreviousScreen,
    };
}(MyGame.game));
