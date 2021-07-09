// --------------------------------------------------------------
//
// Renders an Arena object.
//
//
// --------------------------------------------------------------
MyGame.render.Arena = (function (graphics) {
    'use strict';

    function render(spec) {
        graphics.drawArena(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));
