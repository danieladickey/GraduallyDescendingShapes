// --------------------------------------------------------------
//
// Creates a High Score object, with functions for managing state.
// Requires spec object to have score and level when created
//
// spec = {
//     "score": number,
//     "level": number,
//     "initials": string,
//     "date": string
// }
//
// --------------------------------------------------------------
MyGame.objects.HighScore = function (spec) {
    'use strict';

    // If it wasn't passed in then set the date of the high score when the high score is created
    // Convert: Thu Oct 26 2023 17:55:31 GMT-0500 (Central Daylight Time)
    // To: Oct-26-23
    if (!('date' in spec)) {
        const date = Date().toUpperCase();
        const mmm = date.slice(4, 7);
        const dd = date.slice(8, 10);
        const yy = date.slice(13, 15);
        spec.date = `${mmm}-${dd}-${yy}`;
    }


    // The user interacts with this object through the API
    let api = {
        get score() { return spec.score; },
        get level() { return spec.level; },
        get initials() { return spec.initials; },
        get date() { return spec.date; },

        /**
         * Places a period after each initial
         * @param {string} initials
         */
        set initials(initials) {
            spec.initials = "";
            for (const initial of initials) {
                spec.initials += initial + "."
            }
        }
    }

    return api;
}