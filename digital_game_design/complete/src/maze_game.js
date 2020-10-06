import { mazeCellTypes } from './maze.js';
import FileManager from './file_manager.js';
import Renderer_2D from './renderer_2d.js';


const FRAMES_PER_SECOND = 30;

let maze = null;
let gameLoopInterval = null;

const buttonState = {
    up: false,
    down: false,
    left: false,
    right: false
}

const playerState = {
    position: {x: 0, y: 0},
    heading: 0
}

let renderer = null;

init();

function init() {
    maze = FileManager.loadMaze();
    if (!maze) {
        alert('No maze to play. Go to the editor and create a maze.');
    } else {
        const canvas = document.getElementById('maze-canvas')
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        // Set up button state recording events
        initEvents();

        // create the renderer
        renderer = new Renderer_2D(maze, canvas);

        // Start the player in the starting cell
        // playerState.position = maze.getStartCell();

        // Start the game loop (30fps)
        gameLoopInterval = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
    }

    console.log("Maze game initialized");
}

function initEvents() {
    const canvas = document.getElementById('maze-canvas')
    window.onresize = (evt) => {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    };

    document.addEventListener('keydown', (evt) => {
        handleButtonEvent (evt.key, true);
    });

    document.addEventListener('keyup', (evt) => {
        evt.buttonState
        handleButtonEvent (evt.key, false);
    });
}

function handleButtonEvent(key, isDown) {
    // console.log(`${key} is ${isDown ? 'down' : 'up'}`);

    switch (key) {
        case 'Up':
        case 'ArrowUp':
            buttonState.up = isDown;
            break;
        case 'Down':
        case 'ArrowDown':
            buttonState.down = isDown;
            break;
        case 'Left':
        case 'ArrowLeft':
            buttonState.left = isDown;
            break;
        case 'Right':
        case 'ArrowRight':
            buttonState.right = isDown;
            break;
        default:
            break;
    }
}

function gameLoop() {
    // updatePlayer();
    // updateMaze();

    renderer.render();
}