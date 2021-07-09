let winW, winH;

// TODO: fix or remove dynamic css

function fitToScreen() {
    winW = window.innerWidth; // get width of window
    winH = window.innerHeight; // get height of window
    let gameDivStyle = document.getElementById("game").style;
    let canvasElement = document.getElementById("id-canvas");
    let percent = 1; // percentage of the screen to take up (1 = 100%, .15 = 15%)

    if (winW < 600 || winH < 600) {
        gameDivStyle.width = gameDivStyle.height = 600 + "px";
        canvasElement.width = canvasElement.height = 600;
    } else {
        if (winW < winH) {
            gameDivStyle.width = gameDivStyle.height = winW * percent + "px";
            canvasElement.width = canvasElement.height = winW * percent;
        } else {
            gameDivStyle.width = gameDivStyle.height = winH * percent + "px";
            canvasElement.width = canvasElement.height = winH * percent;
        }
    }
}

// if window changes size change dom elements sizes
window.onresize = fitToScreen;

// when this file loads change dom elements sizes
fitToScreen();