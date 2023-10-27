// --------------------------------------------------------------
//
// Creates a High Score object, with functions for managing state.
//
// spec = {
//     "score": number,
//     "level": number,
//     "initials": string,
//     "date": Date
// }
//
// --------------------------------------------------------------
MyGame.objects.HighScore = function (spec) {
    'use strict';

    let api = {
        get score() { spec.score; },
        get level() { spec.level; },
        get initials() { spec.initials; },
        get date() { spec.date; },

        /**
         * Places a period after each initial
         * @param {string} initials
         */
        set initials(initials) {
            spec.initials = "";
            for (const initial of initials) {
                spec.initials += initial + "."
            }
        },

        /**
         * Converts: Thu Oct 26 2023 17:55:31 GMT-0500 (Central Daylight Time)
         * To: Oct-26-23
         * @param {Date} date
         */
        set date(date = Date()) {
            const MMM = date.slice(4, 7);
            const DD = date.slice(8, 10);
            const YY = date.slice(13, 15);
            spec.date = `${MMM}-${DD}-${YY}`;
        }
    }

    return api;
}