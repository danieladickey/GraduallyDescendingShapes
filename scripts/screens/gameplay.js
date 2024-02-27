MyGame.screens['game-play'] = (function (game, objects, renderer, graphics, input, systems, assets,) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = false;
    let cancelNextInput = false;
    let myKeyboard = input.Keyboard();
    let fullSize = 20;
    let unit = getUnitSize(fullSize);
    let arenaWidth = 10;
    let arenaHeight = 25;
    let yOffset = -0.6;
    let endGameTimer = 0;
    let newHighScore = false;
    let attractMode = true;
    let highScores;

    const fontStyle = 'monospace';
    const fontLarge = 70 * unit / 100;
    const fontMedium = 40 * unit / 80;
    const fontSmall = 22 * unit / 60;

    let theParticles = systems.ParticleSystem({
        center: { x: 300, y: 300 },
        size: { mean: 25, stdev: 20 },
        speed: { mean: 200, stdev: 25 },
        lifetime: { mean: .1, stdev: .1 }
    },
        graphics);

    let renderTheParticles = renderer.ParticleSystem(theParticles, graphics, 'assets/images/particle.png');

    let shapeI = [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    let shapeL = [
        [0, 0, 2],
        [2, 2, 2],
        [0, 0, 0],
    ];

    let shapeJ = [
        [3, 0, 0],
        [3, 3, 3],
        [0, 0, 0],
    ];

    let shapeO = [
        [4, 4],
        [4, 4],
    ];

    let shapeZ = [
        [5, 5, 0],
        [0, 5, 5],
        [0, 0, 0],
    ];

    let shapeS = [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
    ];

    let shapeT = [
        [0, 7, 0],
        [7, 7, 7],
        [0, 0, 0],
    ];

    let shapes = [null,
        shapeI,
        shapeL,
        shapeJ,
        shapeO,
        shapeZ,
        shapeS,
        shapeT,
    ];

    let colors = [null,
        objects.Texture({
            imageAsset: 'assets/images/teal.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
        objects.Texture({
            imageAsset: 'assets/images/orange.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
        objects.Texture({
            imageAsset: 'assets/images/blue.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
        objects.Texture({
            imageAsset: 'assets/images/yellow.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
        objects.Texture({
            imageAsset: 'assets/images/red.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
        objects.Texture({
            imageAsset: 'assets/images/green.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
        objects.Texture({
            imageAsset: 'assets/images/purple.png',
            center: { x: 1 * unit / 2, y: 1 * unit / 2 },
            size: { width: 1 * unit, height: 1 * unit }
        }),
    ];

    const arenaObject = objects.Arena({
        unit: unit,
        colors: colors,
        arenaHeight: arenaHeight,
        arenaWidth: arenaWidth,
        lineWidth: 1,
        fillStyle: 'rgba(255, 255, 255, .5)',
        strokeStyle: 'rgba(255, 255, 255, .5)',
    });

    const player = objects.Player({
        name: "Player",
        arena: arenaObject.arena,
        location: { x: 3, y: 3 },
        currentTetrominoe: shapes[4],
        nextShape: shapes[7],
        shapes: shapes,
        dropInterval: 1000,
        dropCounter: 1900,
        moveInterval: 90,
        moveCounter: 0,
        rotationInterval: 180,
        rotationCounter: 0,
        hardDropCounter: 0,
        hardDropInterval: 250,
        sound: true,
        alive: true,
        score: 0,
        lines: 0,
        level: 1,
        particles: theParticles,
        unit: unit,
        startDrop: 1900,
        currentLines: 0,
        orientation: 0,
        ai: false,
    });

    const aiPlayer = objects.Player({
        name: "AI",
        arena: arenaObject.arena,
        location: { x: 3, y: 3 },
        currentTetrominoe: shapes[4],
        nextShape: shapes[7],
        shapes: shapes,
        dropInterval: 1000,
        dropCounter: 1900,
        moveInterval: 90,
        moveCounter: 0,
        rotationInterval: 180,
        rotationCounter: 0,
        hardDropCounter: 0,
        hardDropInterval: 250,
        sound: false,
        alive: true,
        score: 0,
        lines: 0,
        level: 1,
        particles: theParticles,
        unit: unit,
        startDrop: 1900,
        currentLines: 0,
        orientation: 0,
        ai: false,
    });

    systems.ArtificialIntelligence.initiateAI(player, aiPlayer);

    const arenaTexture = objects.Texture({
        imageAsset: 'assets/images/bg_gray.jpg',
        center: { x: arenaWidth / 2 * unit - 1, y: arenaHeight / 2 * unit },
        size: { width: arenaWidth * unit, height: arenaHeight * unit },
    });

    const displayNext = objects.Text({
        text: "NEXT",
        font: `${fontSmall}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (1 + yOffset) * unit }, // 16
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const nextMetal = objects.Texture({
        imageAsset: 'assets/images/bg_metal.jpg',
        center: { x: 15 * unit, y: (3.5 + yOffset) * unit }, // 3.5
        size: { width: 6 * unit, height: 3.5 * unit }
    });

    const displayScore = objects.Text({
        text: "SCORE",
        font: `${fontSmall}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (6 + yOffset) * unit }, // 1
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const scoreMetal = objects.Texture({
        imageAsset: 'assets/images/bg_metal.jpg',
        center: { x: 15 * unit, y: (8.5 + yOffset) * unit }, // 3.5
        size: { width: 6 * unit, height: 3.5 * unit }
    });

    const showScore = objects.Text({
        text: "0",
        font: `${fontLarge}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (8.25 + yOffset) * unit }, // 1
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const displayLevel = objects.Text({
        text: "LEVEL",
        font: `${fontSmall}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (11 + yOffset) * unit }, // 6
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const levelMetal = objects.Texture({
        imageAsset: 'assets/images/bg_metal.jpg',
        center: { x: 15 * unit, y: (13.5 + yOffset) * unit }, // 3.5
        size: { width: 6 * unit, height: 3.5 * unit }
    });

    const showLevel = objects.Text({
        text: "0",
        font: `${fontLarge}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (13.25 + yOffset) * unit }, // 1
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const displayLines = objects.Text({
        text: "LINES CLEARED",
        font: `${fontSmall}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (16 + yOffset) * unit }, // 11
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const linesMetal = objects.Texture({
        imageAsset: 'assets/images/bg_metal.jpg',
        center: { x: 15 * unit, y: (18.5 + yOffset) * unit }, // 3.5
        size: { width: 6 * unit, height: 3.5 * unit }
    });

    const showLines = objects.Text({
        text: "0",
        font: `${fontLarge}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 15 * unit, y: (18.25 + yOffset) * unit }, // 1
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const displayHighScore = objects.Text({
        text: "NEW HIGH SCORE",
        font: `${fontMedium}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 5 * unit, y: 9 * unit },
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const showHighScore = objects.Text({
        text: "0",
        font: `${fontLarge}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 5 * unit, y: 11 * unit },
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    const showGameOver = objects.Text({
        text: "GAME OVER",
        font: `${fontLarge}pt ${fontStyle}`,
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 255, 255, 1)',
        position: { x: 5 * unit, y: 9 * unit },
        strokeWidth: 1,
        timeSinceLastUpdated: 0,
        center: true,
    });

    // if player has sound enabled sound will begin to play / or stop playing
    function setSound(on) {
        player.sound = settings.sound;
        let song = music1
        if (settings.music && on) {
            song.loop = true;
            song.play();
        } else {
            song.pause();
        }
    }

    // centers a text object (in case it's width changes)
    function reCenter(textObject, xCenter) {
        let scoreWidth = graphics.measureTextWidth(textObject);
        textObject.position = { x: xCenter - (scoreWidth / 2), y: textObject.position.y }
    }

    // function to get unitSize; returns a fraction of the entire size of the canvas
    function getUnitSize(whole) {
        return document.getElementById("id-canvas").width / whole;
    }

    // function to turn on / off AI (demo aka attract Mode)
    function setAttract(bool) {
        attractMode = bool;
    }

    // reset game (if user died or beat game)
    function resetGame() {
        setSound(false);
        cancelNextRequest = true;
        newHighScore = false;
    }

    // end the game when arena is full of bricks and user can't play any more
    function endGame() {
        cancelNextInput = true;
        if (endGameTimer === 0) {
            if (!attractMode && highScores.check(player.score)) {
                newHighScore = true;
                showHighScore.updateMessage(player.score);
                reCenter(showHighScore, 5 * unit);
                if (player.sound) {
                    clap.volume = .3;
                    clap.play();
                }
            }
        }
        // if player made a record score: after 3 seconds exit game and let player enter their initials
        else if (endGameTimer > 3000 && newHighScore) {
            game.showScreen('new-high-score');
            // highlight and select initial input and any remaining initials for quicker entry by user
            document.getElementById("id-initials-input").select();
            resetGame();
        }
        // if player failed to break any records: after 3 seconds exit game and go to main score menu screen
        else if (endGameTimer > 3000 && !newHighScore) {
            game.showScreen('main-menu');
            resetGame();
        }
    }

    // restart game after user has paused the game
    function resumeGame() {
        cancelNextRequest = false;
        cancelNextInput = false;
        setSound(true);
    }

    // start a new game
    function startGame() {
        player.restart();
        setSound(true);
        let saved = player.saveSelf();
        aiPlayer.load(saved);
        endGameTimer = 0;
        cancelNextRequest = false;
        cancelNextInput = false;
    }

    // pause gameplay upon user request
    function pauseGame() {
        cancelNextRequest = true;
        setSound(false);
        if (attractMode) {
            game.showScreen('main-menu');
        } else {
            game.showScreen('pause');
        }
    }

    // function to register controls (allows user to change controls any time)
    function registerControls() {
        // reset controls
        myKeyboard = input.Keyboard();
        // set controls
        myKeyboard.register(controls.key1, player.moveLeft); // move left
        myKeyboard.register(controls.key2, player.moveRight); // move right
        myKeyboard.register(controls.key3, player.rotateLeft); // rotate left
        myKeyboard.register(controls.key4, player.rotateRight); // rotate right
        myKeyboard.register(controls.key5, player.softDrop); // soft drop
        myKeyboard.register(controls.key6, player.hardDrop); // hard drop
        myKeyboard.register(controls.key7, pauseGame); // pause game
    }

    // GET INPUT FROM USER ----------------------------------------------- GET INPUT FROM USER
    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    // UPDATE GAME STATUS ----------------------------------------------- UPDATE GAME STATUS
    function update(elapsedTime) {
        if (player.alive) {
            player.update(elapsedTime);
            if (attractMode) {
                aiPlayer.update(elapsedTime);
            }
        } else {
            endGame();
            endGameTimer += elapsedTime;
        }

        if (attractMode) {
            systems.ArtificialIntelligence.control();
        }

        showScore.updateMessage(player.score);
        reCenter(showScore, 15 * unit);
        showLevel.updateMessage(player.level);
        reCenter(showLevel, 15 * unit);
        showLines.updateMessage(player.lines);
        reCenter(showLines, 15 * unit);
        theParticles.update(elapsedTime);

    }

    // RENDER OBJECTS TO SCREEN ---------------------------------------------- RENDER OBJECTS TO SCREEN
    function render() {
        graphics.clear();
        // render background
        renderer.Texture.render(arenaTexture);

        // render user/game data
        renderer.Texture.render(nextMetal);
        renderer.Texture.render(scoreMetal);
        renderer.Texture.render(levelMetal);
        renderer.Texture.render(linesMetal);
        renderer.Text.render(displayNext);
        renderer.Text.render(displayScore);
        renderer.Text.render(displayLevel);
        renderer.Text.render(displayLines);
        renderer.Text.render(showScore);
        renderer.Text.render(showLevel);
        renderer.Text.render(showLines);

        // render arena
        renderer.Arena.render(arenaObject);

        for (let row = 0; row < arenaObject.arenaHeight; row++) {
            for (let col = 0; col < arenaObject.arenaWidth; col++) {
                if (player.arena[row][col] > 0 && player.arena[row][col] < 8) {
                    let cur = colors[player.arena[row][col]];
                    cur.setLocation(col, row - 5, unit); // change this to offset arena height (row -2)
                    renderer.Texture.render(cur);
                }
            }
        }

        // render particles
        renderTheParticles.render();

        // render next tetrominoe
        let wOffset = 13.5; // 13.5
        let hOffset = 1.9; // 17.5
        let color = 1;
        for (let block of player.nextShape[1]) {
            if (block) {
                color = block;
                break;
            }
        }
        if (color === 1) {
            wOffset -= .5;
            hOffset -= .5;
        } else if (color === 4) {
            wOffset += .5;
        }
        for (let row = 0; row < player.nextShape.length; row++) {
            for (let col = 0; col < player.nextShape[0].length; col++) {
                if (player.nextShape[row][col] > 0 && player.arena[row][col] < 8) {
                    let nextTetrominoe = colors[player.nextShape[row][col]];
                    nextTetrominoe.setLocation(col + wOffset, row + hOffset, unit); // change this to offset arena height change (row -2)
                    renderer.Texture.render(nextTetrominoe);
                }
            }
        }
        if (endGameTimer && newHighScore) {
            renderer.Text.render(displayHighScore);
            renderer.Text.render(showHighScore);
        } else if (endGameTimer) {
            renderer.Text.render(showGameOver);
        }
    }

    // THE GAME LOOP ------------------------------------------------ THE GAME LOOP
    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;
        if (!cancelNextInput) {
            processInput(elapsedTime);
        }
        update(elapsedTime);
        render();
        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        unit = getUnitSize(fullSize);
        registerControls();
        highScores = objects.HighScores({});
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize: initialize,
        run: run,
        resetGame: resetGame,
        startGame: startGame,
        resumeGame: resumeGame,
        registerControls: registerControls,
        setAttract: setAttract,
        get highScores() {
            return highScores;
        },
        get newHighScore() {
            let newHScore = MyGame.objects.HighScore({
                score: player.score,
                level: player.level
            });
            return newHScore;
        },
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.systems, MyGame.assets, MyGame.ai));
