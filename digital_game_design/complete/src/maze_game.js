import { updatePlayer } from './player_lib.js';
import FileManager from './file_manager.js';
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
    }
}

// The renderer object
let renderer = null;

// Initialze the game!
init();

/**
 * Function that initializes the game state and kicks off the game loop.
 */
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

        // Set up the initial player state
        initPlayerState();

        // Start the game loop (30fps)
        gameLoopInterval = setInterval(composeFrame, 1000 / FRAMES_PER_SECOND);
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
function composeFrame() {
    // Update stuff in the game
    updatePlayer(gameState, maze);

    // Send the updated state to the renderer
    renderer.render(gameState);
}
