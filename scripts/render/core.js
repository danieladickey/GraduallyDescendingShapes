MyGame.graphics = (function (objects, renderer) {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // --------------------------------------------------------------
    //
    // Draws a texture to the canvas with the following specification:
    //    image: Image
    //    center: {x: , y: }
    //    size: { width: , height: }
    //
    // --------------------------------------------------------------
    function drawTexture(image, center, rotation, size) {
        context.save();
        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);
        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);
        context.restore();
    }

    // draw arena
    function drawArena(spec) {

        // draw vertical lines across
        context.lineWidth = spec.lineWidth;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.beginPath();
        for (let row = 0; row < spec.arenaHeight; row++) {
            context.moveTo(1, row * spec.unit);

            for (let col = 0; col < spec.arenaWidth; col++) {
                context.lineTo((col + 1) * spec.unit, row * spec.unit);
            }
        }

        // draw horizontal lines down
        for (let col = 0; col < spec.arenaWidth; col++) {
            context.moveTo(col * spec.unit, 0);

            for (let row = 0; row < spec.arenaHeight; row++) {
                context.lineTo((col + 1) * spec.unit, row * spec.unit);
            }
        }

        // draw farthest most left line that gets cut off by edge of canvas
        context.moveTo(1, 0);
        context.lineTo(1, 25 * spec.unit);

        context.stroke();
    }

    function drawText(spec) {
        context.save();
        context.lineWidth = spec.strokeWidth;
        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';
        context.translate(spec.position.x, spec.position.y);
        context.rotate(spec.rotation);
        context.translate(-spec.position.x, -spec.position.y);
        context.fillText(spec.text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), spec.position.x, spec.position.y);
        context.strokeText(spec.text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), spec.position.x, spec.position.y);
        context.restore();
    }

    // Gets the width of a text / message / font
    function measureTextWidth(spec) {
        context.save();
        context.font = spec.font;
        let width = context.measureText(spec.text).width;
        context.restore();
        return width;
    }

    // Gets the height of a text / message / font
    function measureTextHeight(spec) {
        context.save();
        context.font = spec.font;
        let height = context.measureText('m').width;
        context.restore();
        return height;
    }

    let api = {
        get canvas() {
            return canvas;
        },
        clear: clear,
        drawTexture: drawTexture,
        drawText: drawText,
        measureTextWidth: measureTextWidth,
        measureTextHeight: measureTextHeight,
        drawArena: drawArena,
    };

    return api;
}(MyGame.objects, MyGame.render));
