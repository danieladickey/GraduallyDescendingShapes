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
        document.getElementById("key1").addEventListener(
            'click',
            function () {
                getKey("key1");
            }
        );
        document.getElementById("key2").addEventListener(
            'click',
            function () {
                getKey("key2");
            }
        );
        document.getElementById("key3").addEventListener(
            'click',
            function () {
                getKey("key3");
            }
        );
        document.getElementById("key4").addEventListener(
            'click',
            function () {
                getKey("key4");
            }
        );
        document.getElementById("key5").addEventListener(
            'click',
            function () {
                getKey("key5");
            }
        );
        document.getElementById("key6").addEventListener(
            'click',
            function () {
                getKey("key6");
            }
        );
        document.getElementById("key7").addEventListener(
            'click',
            function () {
                getKey("key7");
            }
        );
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
