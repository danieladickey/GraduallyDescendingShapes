// --------------------------------------------------------------
//
// Creates a Tetrominoe object, with limited functions for managing state.
//
// spec = {
//    imageSrc: ,   game object location
//    center: { x: , y: },
//    size: { width: , height: }
// }
//
// --------------------------------------------------------------
MyGame.objects.Texture = function (spec) {
    'use strict';

    let imageReady = false;
    let image = new Image();
    image.onload = function () {
        imageReady = true;
    };
    image.src = spec.imageAsset;

    function setLocation(row, col, unit) {
        spec.center = { x: 1 * unit / 2 + row * unit, y: 1 * unit / 2 + col * unit };
    }

    let api = {
        get imageReady() {
            return imageReady;
        },
        get image() {
            return image;
        },
        get center() {
            return spec.center;
        },
        get size() {
            return spec.size;
        },
        set image(imageAsset) {
            spec.imageAsset = imageAsset;
        },
        setLocation: setLocation,

    };

    return api;
}
