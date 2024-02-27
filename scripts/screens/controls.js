MyGame.screens['controls'] = (function (game, screens) {
    'use strict';

    function initialize() {
        // Go back to main screens...
        document.getElementById('id-controls-back').addEventListener(
            'click',
            function () {
                game.showScreen('settings');
                screens["game-play"].registerControls();
            }
        );

        // set game control keys
        for (let i = 1; i < 8; i++) {
            document.getElementById("key" + i.toString()).addEventListener(
                'click',
                function () {
                    getKey("key" + i.toString());
                }
            );
        }
    }

    // get which key to set
    function getKey(buttonID) {
        document.getElementById(buttonID).className = "btn btn-warning controls";
        document.getElementById(buttonID).innerHTML = "Press Any Key";
        setIt = true; // allows event listener to set the key
    }

    // if a setting button was clicked it takes next input and sets the key
    function setKey(e) {
        if (setIt) {
            // special case for space bar (" ")
            if (e.key === " ") {
                e.target.innerHTML = "Space"
            }
            else if (e.key === "ArrowLeft") {
                e.target.innerHTML = '\u2190';
            }
            else if (e.key === "ArrowUp") {
                e.target.innerHTML = '\u2191';
            }
            else if (e.key === "ArrowRight") {
                e.target.innerHTML = '\u2192';
            }
            else if (e.key === "ArrowDown") {
                e.target.innerHTML = '\u2193';
            }
            else {
                e.target.innerHTML = e.key;
            }
            saveControl(e.target.id, e.key);
            e.target.className = "btn btn-success controls";
            setIt = false; // deactivate even listener
            setTimeout(function () {
                e.target.className = "btn btn-primary controls";

            }, 600)
        }
    }

    let setIt = false; // should the event listener set the key
    addEventListener("keydown", setKey); // event listener for setting keys

    function run() {
        //
        // I know this is empty, there isn't anything to do.
    }

    return {
        initialize: initialize,
        run: run
    };
}(MyGame.game, MyGame.screens));
