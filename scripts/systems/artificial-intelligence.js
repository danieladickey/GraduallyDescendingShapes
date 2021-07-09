MyGame.systems.ArtificialIntelligence = (function (objects) {
    'use strict';
    let player;
    let ai;

    let watchAI = false; // shows AI trying all possible moves
    let interval = 0; // maximize AI speed by lowering interval to 0
    let previousScore = -1;

    let moveFound = false;
    let best = {
        score: 0,
        orientation: 0,
        x: 0,
        nextOrientation: 0,
        nextX: 0,
    };
    let movePrev = 10;
    let previousX = 10;
    let x = -2; // x position (start placing current piece at farthest left location
    let o = 0; // orientation (rotation)
    let playerState;
    let playerSaved = false;
    let moves = [];

    let attempt = {
        orientation: 0,
        x: 0,
    };

    // TODO: change how AI calculates what to do (remove ai player version and replace with faster calculator version)

    function control() {
        if (!moveFound) {
            if (!playerSaved) {
                playerState = player.saveSelf();
                playerSaved = true;
            }
            attempt.x = x;
            attempt.orientation = o;
            if (watchAI) {
                tryAllMoves(player, attempt);
            } else {
                tryAllMoves(ai, attempt);
            }
        } else {
            movePlayer(best);
        }
    }

    function tryAllMoves(playerObject, target) {
        playerObject.rotationInterval = interval;
        playerObject.moveInterval = interval;
        playerObject.hardDropInterval = interval;
        playerObject.ai = true; // prevents from clearing rows so they can be added to score during calculations
        playerObject.sound = false;
        if (playerObject.moveCounter >= playerObject.moveInterval) {
            if (playerObject.orientation < target.orientation) {
                playerObject.rotateRight();
            }
            if (playerObject.orientation > target.orientation) {
                playerObject.rotateLeft();
            }
            if (playerObject.x > target.x) {
                previousX = playerObject.x;
                playerObject.moveLeft();
            }
            if (playerObject.x < target.x) {
                previousX = playerObject.x;
                playerObject.moveRight();
            }
            if (playerObject.x === target.x && playerObject.orientation === target.orientation || previousX === playerObject.x) {
                playerObject.hardDrop();
                let thisScore = computeScore(playerObject.getBoard());
                moves.push({
                    score: thisScore,
                    orientation: o,
                    x: x,
                });
                playerObject.load(playerState);
                x++;
                previousX = 10;
                if (x > 8) {
                    x = -2;
                    o++;
                }
                if (o > 3) {
                    best = getBestMove();
                    moves = [];
                    moveFound = true; // will cause AI to move actual game piece into best location
                    x = -2;
                    o = 0;
                }
            }
        }
        playerObject.ai = false;
    }

    function movePlayer(best) {
        if (player.moveCounter >= player.moveInterval) {
            if (player.orientation < best.orientation) {
                player.rotateRight();
            }
            if (player.orientation > best.orientation) {
                player.rotateLeft();
            }
            if (player.x > best.x) {
                movePrev = player.x;
                player.moveLeft();
            }
            if (player.x < best.x) {
                movePrev = player.x;
                player.moveRight();
            }
            if ((player.x === best.x && player.orientation === best.orientation) || movePrev === player.x) {
                previousScore = player.score;
                player.hardDrop();
                if (previousScore !== player.score) { // piece successfully dropped
                    movePrev = 10; // reset previous move
                    moveFound = false; // will cause AI to find next best move
                    playerSaved = false; // will cause current game state to be saved
                    ai.arena = makeCopy(player.arena)
                }
            }
        }
    }

    function getBestMove() {
        let bestMove = {
            score: -999,
            orientation: -6,
            x: -2,
            nextOrientation: 0,
            nextX: 0,
        }
        for (let move of moves) {
            if (move.score > bestMove.score) {
                bestMove = makeCopy(move);
            }
        }
        return bestMove;
    }

    function initiateAI(newPlayer, newAi) {
        player = newPlayer;
        ai = newAi;
    }

    function makeCopy(x) {
        return JSON.parse(JSON.stringify(x));
    }

    function aggregateHeight(arena) {
        let aggregateHeight = 0;
        for (let col = 0; col < arena[0].length; col++) {
            for (let row = 0; row < arena.length; row++) {
                if (arena[row][col] > 0) {
                    aggregateHeight += arena.length - row;
                    break;
                }
            }
        }
        return aggregateHeight;
    }

    function completeLines(arena) {
        let completeLines = 0;
        for (let row = 0; row < arena.length; row++) {
            let count = 0;
            for (let col = 0; col < arena[0].length; col++) {
                if (arena[row][col]) {
                    count++;
                }
            }
            if (count === arena[0].length) {
                completeLines++;
            }
        }
        return completeLines;
    }

    function holesFound(arena) {
        let holesFound = 0;
        for (let row = 0; row < arena.length - 1; row++) {
            for (let col = 0; col < arena[0].length; col++) {
                if (arena[row][col] && !arena[row + 1][col]) {
                    holesFound++;
                }
            }
        }
        return holesFound;
    }

    function bumpiness(arena) {
        let bumpiness = 0;
        let heights = [0];
        outerLoop: for (let col = 0; col < arena[0].length; col++) {
            for (let row = 0; row < arena.length; row++) {
                if (arena[row][col] > 0) {
                    heights.push(arena.length - row);
                    continue outerLoop;
                }
            }
            heights.push(0);
        }
        heights.push(0);
        for (let height = 0; height < heights.length - 1; height++) {
            bumpiness += Math.abs(heights[height] - heights[height + 1]);
        }
        return bumpiness;
    }

    function computeScore(arena) {
        let a = -0.510066;
        let b = 0.760666;
        let c = -0.35663;
        let d = -0.184483;
        let height = aggregateHeight(arena);
        let lines = completeLines(arena);
        let holes = holesFound(arena);
        let bumps = bumpiness(arena);
        return a * height + b * lines + c * holes + d * bumps;
    }

    return {
        control: control,
        initiateAI: initiateAI,
        get ai() {
            return ai;
        },
        get arena() {
            return player.arena;
        },
        get player() {
            return player;
        },
    };
}(MyGame.objects));
