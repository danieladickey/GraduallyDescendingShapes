Random = (function () {
    'use strict';
    // Produces a randomly generated normal/Gaussian number with mean of 0 and variation of 1
    // Of my own creation, works well enough for the uses of this assignment
    function randomGaussianNumber(mu = 0, sigma = 1) {
        let v = 5; // "variance"; larger v means more normal; smaller v = faster computation
        let r = 0;
        for (let i = 0; i < v; i++) {
            r += Math.random();
        }
        let posNeg = Math.random() < .5 ? 1 : -1; // 50% of being negative
        sigma *= posNeg;
        sigma /= 5;
        return (((r / v) - .5) * 2 + mu) + sigma;
    }

    // returns a random vector pointing in 360 degrees
    function randomCircleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    //
    // This is used to give a small performance optimization in generating gaussian random numbers.
    let usePrevious = false;
    let y2;

    //
    // Generate a normally distributed random number.
    //
    // NOTE: This code is adapted from a wiki reference I found a long time ago.  I originally
    // wrote the code in C# and am now converting it over to JavaScript.
    //
    function nextGaussian(mean, stdDev) {
        let x1 = 0;
        let x2 = 0;
        let y1 = 0;
        let z = 0;

        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);

        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        y2 = x2 * z;

        return mean + y1 * stdDev;
    }

    return {
        randomCircleVector : randomCircleVector,
        nextGaussian : nextGaussian,
    }

})();
