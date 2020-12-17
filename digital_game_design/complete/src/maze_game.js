import { loadMaze } from './libs/file_lib.js';
import { updatePlayer } from './updaters/player_updater.js';
import { updateTimer } from './updaters/timer_updater.js';
import { updatePlayState } from './updaters/play_state_updater.js';
// import Renderer from './renderer_2d.js';
import Renderer from './renderer_raycast.js';

// The target number of game iterations per second
const FRAMES_PER_SECOND = 30;

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
    maze: null,
    startTime: null,
    elapsedTime: 0,
    playState: 'start',
    gameLoopInterval: null
}

// The renderer object
let renderer = null;


// Initialze the game!
init();

/**
 * Function that initializes the game state and kicks off the game loop.
 */
function init() {
    gameState.maze = loadMaze();
    if (!gameState.maze) {
        alert('No maze to play. Go to the editor and create a maze.');
    } else {
        const canvas = document.getElementById('maze-canvas');

        // Resize the canvas to properly fit in the space available
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

        // create the renderer
        renderer = new Renderer(canvas);

        // Set up button state recording events
        initEvents();

        // Set up the initial player state
        initPlayerState();

        // Start the game loop
        gameState.gameLoopInterval = setInterval(drawFrame, 1000 / FRAMES_PER_SECOND);
    }

    console.log("Maze game initialized");
}

/**
 * Function that sets the player's initial state
 */
function initPlayerState() {
    const startCell = gameState.maze.getStartCell();
    const startCellBBox = gameState.maze.getCellBoundingBox(startCell.row, startCell.col);
    gameState.player.position.x = startCellBBox.left + Math.floor((startCellBBox.right - startCellBBox.left) / 2);
    gameState.player.position.y = startCellBBox.top + Math.floor((startCellBBox.bottom - startCellBBox.top) / 2);
    gameState.player.heading = 0;

    const cellDims = gameState.maze.getCellDimensions();
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
 * This function handles a keydown or keyup event. This will update the key
 * states of the keys that affect the game
 *
 * @param {string} key
 * @param {boolean} isDown
 */
function handleButtonEvent(key, isDown) {
    // console.log(`${key} is ${isDown ? 'down' : 'up'}`);

    // Different browsers call the arrow keys by different names (of course)
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
    updatePlayer(gameState);

    // Update the UI and render the scene
    updateTimerDisplay(gameState);
    renderer.render(gameState);
}

function updateTimerDisplay(gameState) {
    const timeDif = gameState.elapsedTime;
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

    const timerString = `${minStr}:${secStr}`;
    document.getElementById('timer').innerHTML = timerString;
}