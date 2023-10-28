// --------------------------------------------------------------
//
// Creates a player object, with functions for managing state.
//
// --------------------------------------------------------------
MyGame.objects.Player = function (spec) {
    'use strict';

    let savedState;
    let particles = spec.particles;

    // initialize player's current piece and next piece
    let random;
    do {
        random = Math.round(Math.random() * 10);
    } while (random > 8 || random <= 1);
    random--;
    spec.currentTetrominoe = makeCopy(spec.shapes[random])
    do {
        random = Math.round(Math.random() * 10);
    } while (random > 8 || random <= 1);
    random--;
    spec.nextTetrominoe = makeCopy(spec.shapes[random])

    // returns a copy of a tetrominoe
    function makeCopy(shape) {
        return JSON.parse(JSON.stringify(shape));
    }

    // lowers the user controlled tetrominoe every interval milliseconds
    function update(time) {
        place(spec.currentTetrominoe);
        spec.dropCounter += time;
        spec.moveCounter += time;
        spec.rotationCounter += time;
        spec.hardDropCounter += time;
        if (spec.dropCounter > spec.dropInterval) {
            spec.dropCounter = spec.dropCounter - spec.dropInterval;
            remove(spec.currentTetrominoe);
            spec.location.y += 1;
            if (collide(spec.currentTetrominoe)) {
                spec.location.y -= 1;
                place(spec.currentTetrominoe);
                arenaSweep();
                reset();
            }
            place(spec.currentTetrominoe);
        }
    }

    // user controlled move left
    function moveLeft() {
        move(-1);
    }

    // user controlled move right
    function moveRight() {
        move(1);
    }

    // moves left or right and checks for collisions if it collides it won't move there
    function move(direction) {
        if (spec.moveCounter > spec.moveInterval) {
            spec.moveCounter = 0;
            remove(spec.currentTetrominoe);
            spec.location.x += direction;
            if (collide(spec.currentTetrominoe)) {
                // if collision detected move back to where tetrominoe was before move took place (as if it never happened)
                spec.location.x -= direction;
            } else {
                play(click);
            }
            place(spec.currentTetrominoe);
        }
    }

    function rotateLeft() {
        attemptRotate(-1);
    }

    function rotateRight() {
        attemptRotate(1)
    }

    function attemptRotate(direction) {
        // check if it's been long enough to move again
        if (spec.rotationCounter > spec.rotationInterval) {
            spec.rotationCounter = 0;
            // save current state before attempting rotation
            let restore = makeCopy(spec.currentTetrominoe);
            remove(spec.currentTetrominoe);
            rotate(direction);
            if (wallKick()) {
                // rotation was a success
                play(flip);
                spec.orientation += direction;
            } else {
                // rotation was a failure
                spec.currentTetrominoe = restore;
            }
            // display current tetrominoe
            place(spec.currentTetrominoe);
        }
    }

    function rotate(direction) {
        // invert axes of shape array trading data in xy to yx for each position
        for (let y = 0; y < spec.currentTetrominoe.length; y++) {
            for (let x = 0; x < y; x++) {
                [spec.currentTetrominoe[x][y], spec.currentTetrominoe[y][x]] = [spec.currentTetrominoe[y][x], spec.currentTetrominoe[x][y]];
            }
        }
        // if turning right (clockwise)
        if (direction > 0) {
            // reverse each col
            for (let row = 0; row < spec.currentTetrominoe.length; row++) {
                spec.currentTetrominoe[row].reverse();
            }
        } else {
            // reverse each row
            spec.currentTetrominoe.reverse();
        }
    }

    // moves piece away from wall after rotation so it doesn't go out of bounds
    function wallKick() {
        let originalPosition = spec.location.x;
        let offset = 1;
        while (collide(spec.currentTetrominoe)) {
            spec.location.x += offset;
            // move back and forth until free of collision
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset >= spec.currentTetrominoe.length + 2) {
                spec.location.x = originalPosition;
                return false;
            }
        }
        return true;
    }

    // moves the player controlled tetrominoe down one space upon request by user
    function softDrop() {
        if (spec.moveCounter > spec.moveInterval) {
            spec.moveCounter = 0;
            remove(spec.currentTetrominoe);
            spec.location.y += 1;
            if (collide(spec.currentTetrominoe)) {
                spec.location.y -= 1;
                place(spec.currentTetrominoe);
                arenaSweep();
                reset();
            } else {
                play(click);
                place(spec.currentTetrominoe);
                // add 1 to score for each space soft dropped
                spec.score += 1;
            }
        }
    }

    // drops the user controlled tetrominoe as far as it will go before having a collision
    function hardDrop() {
        if (spec.hardDropCounter > spec.hardDropInterval) {
            spec.hardDropCounter = 0;
            let clear = true;
            while (clear) {
                remove(spec.currentTetrominoe);
                spec.location.y += 1;
                spec.score += 2;
                if (collide(spec.currentTetrominoe)) {
                    clear = false;
                    spec.location.y -= 1;
                    spec.score -= 2
                    place(spec.currentTetrominoe);
                    arenaSweep();
                    reset();
                }
                place(spec.currentTetrominoe);
                play(thud);
                // add 2 to score for each space hard dropped
            }
        }
    }

    // places the user controlled tetrominoe into the arena
    function place() {
        for (let y = 0; y < spec.currentTetrominoe.length; y++) {
            for (let x = 0; x < spec.currentTetrominoe[0].length; x++) {
                if (spec.currentTetrominoe[y][x] !== 0) {
                    spec.arena[spec.location.y + y][spec.location.x + x] = spec.currentTetrominoe[y][x];
                }
            }
        }
    }

    // removes the user controlled tetrominoe from the arena
    function remove() {
        for (let y = 0; y < spec.currentTetrominoe.length; y++) {
            for (let x = 0; x < spec.currentTetrominoe[0].length; x++) {
                if (spec.currentTetrominoe[y][x] !== 0) {
                    spec.arena[spec.location.y + y][spec.location.x + x] = 0;
                }
            }
        }
    }

    // returns true if user controlled tetrominoe collides with edge or another tetrominoe
    function collide(shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[0].length; x++) {
                if (shape[y][x] !== 0) {
                    // check if row below each piece of the player controlled tetrominoe
                    if (spec.arena[y + spec.location.y]) {
                        // check if place is already occupied
                        if (spec.arena[y + spec.location.y][x + spec.location.x] !== 0) {
                            // something in my way
                            return true;
                        }
                    } else {
                        // nothing below
                        return true;
                    }
                }
            }
        }
        // no collisions found
        return false;
    }

    // player moves to top and gets new tetrominoe to play with
    function reset() {
        spec.orientation = 0;
        updateLevel();
        // move player to top
        spec.location.y = 3; // 3
        spec.location.x = 3;
        // reset drop counter
        spec.dropCounter = spec.startDrop;
        // player gets next piece
        spec.currentTetrominoe = spec.nextTetrominoe;
        let random;
        do {
            random = Math.round(Math.random() * 10);
        } while (random > 8 || random <= 1);
        random--;
        spec.nextTetrominoe = makeCopy(spec.shapes[random]);
        // check for collision after as piece is places into the arena (checks if game is over/ arena is full)
        if (collide(spec.currentTetrominoe)) {
            spec.location.y -= 1;
            play(fail);
            spec.alive = false;
        }
        place(spec.currentTetrominoe);
    }

    // check the arena for rows that need to be cleared and clear them (starting at the bottom and going up)
    function arenaSweep() {
        if (!spec.ai) {
            let rowsCleared = [];
            let rowCount = 0;
            let topRow = 0;
            outerLoop: for (let y = spec.arena.length - 1; y > 0; y--) {
                for (let x = 0; x < spec.arena[0].length; x++) {
                    if (spec.arena[y][x] === 0) {
                        continue outerLoop;
                    }
                }
                for (let i = 0; i < spec.arena[0].length; i++) {
                    spec.arena[y][i] = 0;
                    particles.shipThrust({ x: i * spec.unit, y: (y - 5) * spec.unit });
                }
                topRow = y;
                rowsCleared.push(y);
                y++;
                rowCount++;
            }
            updateScore(rowCount);
            for (let i = 0; i < rowsCleared.length; i++) {
                stickyGravity(rowsCleared[i] - 1);
            }
        }
    }

    // TODO: debug sticky gravity (or remove it)
    function stickyGravity(y) {
        if (y > 0) {
            let thingsAbove = [];
            let sameThing = false;
            for (let x = 0; x < spec.arena[0].length; x++) {
                if (spec.arena[y][x]) {
                    if (!sameThing) {
                        let shape = createMatrix(spec.arena[0].length, spec.arena.length);
                        floodFill(x, y, shape);
                        thingsAbove.push(shape);
                    }
                    sameThing = true;
                } else {
                    sameThing = false;
                }
            }
            thingsAbove = removeDuplicates(thingsAbove);

            for (let thing of thingsAbove) {
                hardShapeDrop(thing);
            }
        }
    }

    function floodFill(x, y, matrix) {
        if (spec.arena[y][x] === 0 || spec.arena[y][x] === undefined || matrix[y][x] > 0) {
            return;
        }

        matrix[y][x] = spec.arena[y][x];
        floodFill(x, y + 1, matrix);
        floodFill(x, y - 1, matrix);
        floodFill(x - 1, y, matrix);
        floodFill(x + 1, y, matrix);
    }

    // creates 2D array of 0s
    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    // internal function to drop stuff above cleared lines
    function hardShapeDrop(shape) {
        let clear = true;
        while (clear) {
            shapeRemove(shape);
            shape.unshift(new Array(shape[0].length).fill(0))
            if (shapeCollide(shape)) {
                shape.shift();
                shapePlace(shape);
                arenaSweep();
                clear = false;
            } else {
                shapePlace(shape);
            }
        }
    }

    // internal function to take stuff above cleared lines out of the arena before it gets moved
    function shapeRemove(shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[0].length; x++) {
                if (shape[y][x] !== 0) {
                    spec.arena[y][x] = 0;
                }
            }
        }
    }

    // internal function to place the stuff above a cleared line back into the arena after it's been moved
    function shapePlace(shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[0].length; x++) {
                if (shape[y][x] !== 0) {
                    spec.arena[y][x] = shape[y][x];
                }
            }
        }
    }

    // internal function to check for collisions with the stuff above a cleared line
    function shapeCollide(shape) {
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[0].length; x++) {
                if (shape[y][x] !== 0) {
                    // check if row below each piece of the player controlled tetrominoe
                    if (spec.arena[y]) {
                        // check if place is already occupied
                        if (spec.arena[y][x] !== 0) {
                            // something in my way
                            return true;
                        }
                    } else {
                        // nothing below
                        return true;
                    }
                }
            }
        }
        // no collisions found
        return false;
    }

    // removes duplicate stuff above the cleared liens from the array of stuff so it won't collide with it's self
    function removeDuplicates(list) {
        let listWithOutDuplicates = [];
        for (let i = 0; i < list.length; i++) {
            let duplicateFound = false;
            for (let j = i + 1; j < list.length; j++) {
                if (compareTwoMatrices(list[i], list[j])) {
                    duplicateFound = true;
                }
            }
            if (!duplicateFound) {
                listWithOutDuplicates.push(list[i]);
            }
        }
        return listWithOutDuplicates
    }

    // compares two 2D arrays and returns true if they have the same data
    function compareTwoMatrices(one, two) {
        for (let y = 0; y < one.length; y++) {
            for (let x = 0; x < one[0].length; x++) {
                if (one[y][x] !== two[y][x]) {
                    return false;
                }
            }
        }
        return true;
    }

    // function to update the score when lines have been cleared
    function updateScore(numberCleared) {
        if (numberCleared) {
            play(jingle);
            spec.lines += numberCleared;
            spec.currentLines += numberCleared;
            let add = 0;
            switch (numberCleared) {
                case 1:
                    add = 40 * (spec.level + 1);
                    break;
                case 2:
                    add = 100 * (spec.level + 1);
                    break;
                case 3:
                    add = 300 * (spec.level + 1);
                    break;
                case 4:
                    add = 1200 * (spec.level + 1);
                    break;
                default:
                // no lines cleared no change to score
            }
            spec.score += add;
        }
    }

    // updates the level, increases the speed of user controlled shape, controls where new piece is placed
    function updateLevel() {
        if (spec.currentLines >= 10) {
            play(twinkle);
            spec.level += 1;
            spec.startDrop -= 200;
            spec.dropInterval -= 50 // make shapes drop faster when level increases
            spec.currentLines -= 10;
        }
    }

    // if player has sound turned it on it will play the requested sound effect (softer than the music)
    function play(sound) {
        if (spec.sound) {
            sound.volume = .3;
            sound.play();
        }
    }

    // resets the player's info so the game can be restarted
    function restart() {
        for (let i = 0; i < spec.arena.length; i++) {
            for (let j = 0; j < spec.arena[0].length; j++) {
                spec.arena[i][j] = 0;
            }
        }
        spec.alive = true;
        spec.score = 0;
        spec.lines = 0;
        spec.level = 1;
        spec.dropInterval = 1000;
        spec.currentLines = 0;
        spec.startDrop = 1900;
        reset();
    }

    // returns a copy of the arena with the current piece removed
    function getBoard() {
        let copy = makeCopy(spec.arena);
        for (let y = 0; y < spec.currentTetrominoe.length; y++) {
            for (let x = 0; x < spec.currentTetrominoe[0].length; x++) {
                if (spec.currentTetrominoe[y][x] !== 0) {
                    copy[spec.location.y + y][spec.location.x + x] = 0;
                }
            }
        }
        return copy;
    }

    function saveSelf() {
        savedState = makeCopy(spec);
        return savedState;
    }

    function loadSelf() {
        spec = makeCopy(savedState);
    }

    function save(other) {
        return makeCopy(other);
    }

    function load(other) {
        spec = makeCopy(other);
    }

    return {
        save: save,
        load: load,
        saveSelf: saveSelf,
        loadSelf: loadSelf,
        restart: restart,
        getBoard: getBoard,
        update: update,
        moveLeft: moveLeft,
        moveRight: moveRight,
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        softDrop: softDrop,
        hardDrop: hardDrop,
        place: place,
        remove: remove,
        get score() {
            return spec.score;
        },
        get level() {
            return spec.level;
        },
        get lines() {
            return spec.lines;
        },
        get alive() {
            return spec.alive;
        },
        set alive(life) {
            spec.alive = life;
        },
        get sound() {
            return spec.sound;
        },
        set sound(bool) {
            spec.sound = bool;
        },
        get nextShape() {
            return spec.nextTetrominoe;
        },
        get arena() {
            return spec.arena;
        },
        set arena(a) {
            spec.arena = a;
        },
        get nextPiece() {
            return spec.nextTetrominoe;
        },
        set nextPiece(next) {
            spec.nextTetrominoe = next;
        },
        get currentPiece() {
            return spec.currentTetrominoe;
        },
        set currentPiece(cur) {
            spec.currentTetrominoe = cur;
        },
        get unit() {
            return spec.unit;
        },
        get shapes() {
            return spec.shapes;
        },
        get spec() {
            return spec;
        },
        set spec(s) {
            spec = s;
        },
        get savedState() {
            return spec.savedState
        },
        get particles() {
            return spec.particles;
        },
        set particles(p) {
            spec.particles = p;
        },
        get rotationInterval() {
            return spec.rotationInterval;
        },
        set rotationInterval(r) {
            spec.rotationInterval = r;
        },
        get rotationCounter() {
            return spec.rotationCounter;
        },
        set rotationCounter(r) {
            spec.rotationCounter = r;
        },
        get moveCounter() {
            return spec.moveCounter;
        },
        set moveCounter(m) {
            spec.moveCounter = m;
        },
        get moveInterval() {
            return spec.moveInterval;
        },
        set moveInterval(m) {
            spec.moveInterval = m;
        },
        get x() {
            return spec.location.x;
        },
        set x(newX) {
            spec.location.x = newX;
        },
        get hardDropCounter() {
            return spec.hardDropCounter;
        },
        set hardDropCounter(h) {
            spec.hardDropCounter = h;
        },
        get hardDropInterval() {
            return spec.hardDropInterval;
        },
        set hardDropInterval(h) {
            spec.hardDropInterval = h;
        },
        get orientation() {
            return spec.orientation;
        },
        set orientation(o) {
            spec.orientation = o;
        },
        get ai() {
            return spec.ai;
        },
        set ai(a) {
            spec.ai = a;
        },
        get name() {
            return spec.name;
        },
        set name(n) {
            spec.name = n;
        }
    };
}
