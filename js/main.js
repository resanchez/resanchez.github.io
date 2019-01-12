const WIDTH = 800;
const HEIGHT = 600;
const SIDE = 15;
const DEPTH = 20;
const STEP = 150;

let mouseI, mouseJ;
let currentMouseI, currentMouseJ;
let cursor = 0;

mainCanvas.width = WIDTH;
mainCanvas.height = HEIGHT;
const mainCtx = mainCanvas.getContext('2d');

const indexes = [];
for (let i = 0; i < (WIDTH / SIDE); i++) {
    for (let j = 0; j < (WIDTH / SIDE); j++) {
        indexes.push([i, j]);
    }
}

mainCtx.fillStyle = 'black';
mainCtx.fillRect(0, 0, WIDTH, HEIGHT);

mainCanvas.addEventListener('mousemove', e => {
    [mouseI, mouseJ] = getRectIndexes(e.layerX, e.layerY);
})

function getRectIndexes(x, y) {
    return [Math.floor(x / SIDE), Math.floor(y / SIDE)];
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function drawRect(ctx, i, j, mouseI, mouseJ) {
    const dist = Math.abs(mouseI - i) + Math.abs(mouseJ - j);
    ctx.fillStyle = `rgb(${255 - (dist * (255 / DEPTH))}, 0, 0)`;
    ctx.fillRect(i * SIDE, j * SIDE, SIDE, SIDE);
}

function drawRectList(ctx, indexes, cursor, mouseI, mouseJ) {
    for(let idx = cursor; (idx < cursor + STEP) && (idx < indexes.length); idx++) {
        drawRect(ctx, ...indexes[idx], mouseI, mouseJ);
    }
}

function draw() {
    if (mouseI !== currentMouseI || mouseJ !== currentMouseJ) {
        cursor = 0;
        shuffleArray(indexes);
        currentMouseI = mouseI;
        currentMouseJ = mouseJ;
        drawRectList(mainCtx, indexes, cursor, currentMouseI, currentMouseJ);
        cursor += STEP;
    } else if (cursor > 0) {
        drawRectList(mainCtx, indexes, cursor, currentMouseI, currentMouseJ);
        cursor += STEP;
    }
    cursor = cursor >= indexes.length ? 0 : cursor;
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);