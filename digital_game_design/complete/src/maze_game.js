import { mazeCellTypes } from './maze.js';
import FileManager from './file_manager.js';
import Renderer_2D from './renderer_2d.js';


const FRAMES_PER_SECOND = 30;
const PLAYER_SPEED = 5; // units per frame

let maze = null;
let gameLoopInterval = null;

const gameState = {
    buttons: {
        up: false,
        down: false,
        left: false,
        right: false
    },
    player: {
        position: { x: 0, y: 0 },
        heading: 0,
        size: { width: 1, height: 1 }
    }
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
        initPlayerState();

        // Start the game loop (30fps)
        gameLoopInterval = setInterval(gameLoop, 1000 / FRAMES_PER_SECOND);
    }

    console.log("Maze game initialized");
}

function initPlayerState() {
    const startCell = maze.getStartCell();
    const startCellBBox = maze.getCellBoundingBox(startCell.row, startCell.col);
    gameState.player.position.x = startCellBBox.left + Math.floor((startCellBBox.right - startCellBBox.left) / 2);
    gameState.player.position.y = startCellBBox.top + Math.floor((startCellBBox.bottom - startCellBBox.top) / 2);
    gameState.player.heading = 0;

    const cellDims = maze.getCellDimensions();
    gameState.player.size.width = cellDims.width;
    gameState.player.size.height = cellDims.height;
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
        handleButtonEvent (evt.key, false);
    });
}

function handleButtonEvent(key, isDown) {
    // console.log(`${key} is ${isDown ? 'down' : 'up'}`);
    switch (key) {
        case 'Up':
        case 'ArrowUp':
            gameState.buttons.up = isDown;
            break;
        case 'Down':
        case 'ArrowDown':
            gameState.buttons.down = isDown;
            break;
        case 'Left':
        case 'ArrowLeft':
            gameState.buttons.left = isDown;
            break;
        case 'Right':
        case 'ArrowRight':
            gameState.buttons.right = isDown;
            break;
        default:
            break;
    }
}

function gameLoop() {
    updatePlayer();
    // Update other state as it comes up

    renderer.render(gameState);
}

function updatePlayer() {
    // Move the player based on what arrow buttons are pressed
    if (gameState.buttons.up) {
        gameState.player.position.y - PLAYER_SPEED;
    }
    if (gameState.buttons.down) {
        gameState.player.position.y + PLAYER_SPEED;
    }
    if (gameState.buttons.left) {
        gameState.player.position.x - PLAYER_SPEED;
    }
    if (gameState.buttons.right) {
        gameState.player.position.x + PLAYER_SPEED;
    }

    // Check to make sure the new position is possible

}