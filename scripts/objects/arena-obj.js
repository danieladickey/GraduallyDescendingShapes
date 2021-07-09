MyGame.objects.Arena = function (spec) {
    'use strict';

    function createArena() {
        let arena = [];
        for (let row = 0; row < spec.arenaHeight; row++) {
            let newRow = [];
            for (let col = 0; col < spec.arenaWidth; col++) {
                // newRow.push(Math.round(Math.random() * 10));
                newRow.push(0);
            }
            arena.push(newRow);
        }
        return arena;
    }

    let arena = createArena();

    return {
        get arena() {
            return arena;
        },
        get unit() {
            return spec.unit;
        },
        get arenaWidth() {
            return spec.arenaWidth;
        },
        get arenaHeight() {
            return spec.arenaHeight;
        },
        get fillStyle() {
            return spec.fillStyle;
        },
        get strokeStyle() {
            return spec.strokeStyle;
        },
        get colors() {
            return spec.colors;
        },
        get lineWidth() {
            return spec.lineWidth;
        },
    };
}
