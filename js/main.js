import Timer from './Timer.js';
import Player from './Player.js';
import Arena from './Arena.js';
import Keyboard from './Keyboard.js';

const canvas = document.getElementById('screen');
const context = canvas.getContext("2d");

const holdContext = document.getElementById('hold-screen').getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const width = 10;
const height = 21;

const cellWidth = canvas.width / width;
const cellHeight = canvas.height / height;

const arena = new Arena(10, 21);
const player = new Player(3, 0, arena);

function colorFromValue(value) {
    switch (value) {
        case 1: return "purple";
        case 2: return "green";
        case 3: return "red";
        case 4: return "yellow";
        case 5: return "orange";
        case 6: return "blue";
        case 7: return "cyan";
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    holdContext.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(arena.matrix, {x: 0, y: 0}, false, context);
    drawGrid(player.ghostMatrix, player.ghostPos, true, context);
    drawGrid(player.matrix, player.pos, false, context);

    let next = player.next;
    holdContext.save();
    holdContext.translate((100 / 2) - (next.length * cellWidth) / 2, (100/2) - (next.length * cellWidth) / 2);
    drawGrid(next, {x: 0, y: 0}, false, holdContext);
    holdContext.restore();
}

function drawGrid(matrix, offset, outline, context) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                if (outline) {
                    context.save();
                    context.fillStyle = "white";
                    context.fillRect(((x * cellWidth) + (offset.x * cellWidth)) + 1,
                                ((y * cellHeight) + (offset.y * cellHeight)) + 1,
                                cellWidth - 1, cellHeight - 1);
                    context.restore();
                }
                else {
                    context.fillStyle = colorFromValue(value);
                    context.fillRect((x * cellWidth) + (offset.x * cellWidth),
                            (y * cellHeight) + (offset.y * cellHeight),
                            cellWidth, cellHeight);
                }
            }
        });
    });
}

window.arena = arena;
window.player = player;
const timer = new Timer(1/60);
window.timer = timer;

timer.update = function update(deltaTime) {
    player.update(deltaTime);
    draw();
}

timer.start();

const input = new Keyboard();

input.addMapping(32, function(keyState) {
    if (keyState) {
        player.hardDrop();
    }
});

input.addMapping(81, function(keyState) {
    if (keyState) {
        player.rotate(-1);
    }
});

input.addMapping(69, function(keyState) {
    if (keyState) {
        player.rotate(1);
    }
});

input.addMapping(37, function(keyState) {
    if (keyState) {
        player.move(-1);
        player.movement.start(-1);
    }
    else {
        player.movement.cancel();
    }
});

input.addMapping(39, function(keyState) {
    if (keyState) {
        player.move(1);
        player.movement.start(1);
    }
    else {
        player.movement.cancel();
    }
});

input.addMapping(40, function(keyState) {
    if (keyState) {
        player.drop();
    }
});

input.listenTo(window);