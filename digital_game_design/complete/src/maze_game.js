import { updatePlayer } from './player_lib.js';
import { loadMaze } from './file_lib.js';
import Renderer_2D from './renderer_2d.js';


const FRAMES_PER_SECOND = 30;

// The Maze
let maze = null;

// The handle to the game loop interval function. Need this if we want to
// stop the loop
let gameLoopInterval = null;

// The game state.
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
    },
    startTime: null,
    playState: 'start'
}

// The renderer object
let renderer = null;

// Initialze the game!
init();

/**
 * Function that initializes the game state and kicks off the game loop.
 */
function init() {
    maze = loadMaze();
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

        // Set up the initial player state
        initPlayerState();

        // Start the game loop (30fps)
        gameLoopInterval = setInterval(drawFrame, 1000 / FRAMES_PER_SECOND);
    }

    console.log("Maze game initialized");
}

/**
 * Function that sets the player's size and initial position
 */
function initPlayerState() {
    const startCell = maze.getStartCell();
    const startCellBBox = maze.getCellBoundingBox(startCell.row, startCell.col);
    gameState.player.position.x = startCellBBox.left + Math.floor((startCellBBox.right - startCellBBox.left) / 2);
    gameState.player.position.y = startCellBBox.top + Math.floor((startCellBBox.bottom - startCellBBox.top) / 2);
    gameState.player.heading = 0;

    const cellDims = maze.getCellDimensions();
    gameState.player.size.width = Math.floor(cellDims.width * 0.8);
    gameState.player.size.height = Math.floor(cellDims.height * 0.8);
}

/**
 * Funciton that sets up all the event handlers
 */
function initEvents() {
    const canvas = document.getElementById('maze-canvas')
    window.onresize = (evt) => {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
    };

    document.addEventListener('keydown', (evt) => {
        handleButtonEvent(evt.key, true);
    });

    document.addEventListener('keyup', (evt) => {
        handleButtonEvent(evt.key, false);
    });
}

/**
 * This is the function that handles a keydown or keyup event.
 *
 * @param {string} key
 * @param {boolean} isDown
 */
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

/**
 * This is the heart of the game. This function is called every iteration to
 * calculate the current state of the game and re-render the screen.
 */
function drawFrame() {
    // Update the state of the game (start, playing, done);
    updatePlayState(gameState);

    // Update the Timer
    updateTimer(gameState);

    // Update player state
    updatePlayer(gameState, maze);

    // Send the updated state to the renderer
    renderer.render(gameState);
}

function updatePlayState(gameState) {
    const currentCell = maze.getCellFromXYUnits(gameState.player.position.x, gameState.player.position.y);
    const cellType = maze.getCellType(currentCell.row, currentCell.col);

    switch (gameState.playState) {
        case 'start':
            // If the player has left the start cell, the game is afoot
            if (cellType !== 'start') {
                gameState.playState = 'playing';
            }
            break;
        case 'playing':
            // If the player has entered the end cell, the game is done
            if (cellType === 'end') {
                gameState.playState = 'done';
            }
            break;
        case 'done':
            break;
        default:
            break;
    }
}

function updateTimer(gameState) {
    let timerString = '00:00.000';
    if (gameState.playState === 'playing') {
        if (gameState.startTime) {
            const curTime = new Date();
            const timeDif = curTime.valueOf() - gameState.startTime.valueOf();
            const minutes = Math.floor(timeDif / 60000);
            const seconds = (timeDif - (minutes * 60000)) / 1000;

            let minStr;
            if (minutes === 0) {
                minStr = '00';
            } else if (minutes < 10) {
                minStr = `0${minutes}`;
            } else {
                minStr = `${minutes}`;
            }

            let secStr;
            if (seconds === 0) {
                secStr = '00';
            } else if (seconds < 10) {
                secStr = `0${seconds}`;
            } else {
                secStr = `${seconds}`;
            }

            timerString = `${minStr}:${secStr}`;
        } else {
            gameState.startTime = new Date();
        }

        document.getElementById('timer').innerHTML = timerString;
    }

}