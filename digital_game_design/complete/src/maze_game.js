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
        handleButtonEvent(evt.key, true);
    });

    document.addEventListener('keyup', (evt) => {
        handleButtonEvent(evt.key, false);
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
    // Calculate the new player position
    const playerCurPos = { x: gameState.player.position.x, y: gameState.player.position.y };
    const playerNewPos = calcPlayerPosition(playerCurPos, gameState.buttons);
    gameState.player.position.x = playerNewPos.x;
    gameState.player.position.y = playerNewPos.y;

    // Calculate new player heading based on movement
    const newHeading = calcPlayerHeading(playerCurPos, gameState.player.heading, playerNewPos);
    gameState.player.heading = newHeading;
}

function calcPlayerPosition(playerCurPos, buttonStates) {
    const playerBBox = calcPlayerBoundingBox();
    let cell1, cell2, currCell, cellBBox, delta;
    const newPos = {x: playerCurPos.x, y: playerCurPos.y};

    // Move the player based on what arrow buttons are pressed
    if (buttonStates.up) {
        delta = PLAYER_SPEED;

        cell1 = maze.getCellFromXYUnits(playerBBox.left, playerBBox.top - PLAYER_SPEED);
        cell2 = maze.getCellFromXYUnits(playerBBox.right, playerBBox.top - PLAYER_SPEED);
        if (cell1 === null ||
            mazeCellTypes[maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to top of current cell
            currCell = maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = playerBBox.top - cellBBox.top - 1;
        }

        newPos.y -= delta;
    }
    if (buttonStates.down) {
        delta = PLAYER_SPEED;

        cell1 = maze.getCellFromXYUnits(playerBBox.left, playerBBox.bottom + PLAYER_SPEED);
        cell2 = maze.getCellFromXYUnits(playerBBox.right, playerBBox.bottom + PLAYER_SPEED);
        if (cell1 === null ||
            mazeCellTypes[maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to bottom of current cell
            currCell = maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = cellBBox.bottom - playerBBox.bottom - 1;
        }

        newPos.y += delta;
    }
    if (buttonStates.left) {
        delta = PLAYER_SPEED;

        cell1 = maze.getCellFromXYUnits(playerBBox.left - PLAYER_SPEED, playerBBox.top);
        cell2 = maze.getCellFromXYUnits(playerBBox.left - PLAYER_SPEED, playerBBox.bottom);
        if (cell1 === null ||
            mazeCellTypes[maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to bottom of current cell
            currCell = maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = playerBBox.left - cellBBox.left - 1;
        }

        newPos.x -= delta;
    }
    if (buttonStates.right) {
        delta = PLAYER_SPEED;

        cell1 = maze.getCellFromXYUnits(playerBBox.right + PLAYER_SPEED, playerBBox.top);
        cell2 = maze.getCellFromXYUnits(playerBBox.right + PLAYER_SPEED, playerBBox.bottom);
        if (cell1 === null ||
            mazeCellTypes[maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to bottom of current cell
            currCell = maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = cellBBox.right - playerBBox.right - 1;
        }

        newPos.x += delta;
    }

    return newPos;
}

function calcPlayerHeading(currentPos, currentHeading, newPos) {
    const dx = newPos.x - currentPos.x;
    const dy = currentPos.y - newPos.y;
    let heading = currentHeading;

    if (dx === 0) {
        if (dy > 0) {
            heading = 0;
        }
        else if (dy < 0) {
            heading = 180;
        } else {
            // We don't do anything if both dx and dy are 0
            // This will keep the heading the same as the last movement
        }
    } else if (dx > 0) {
        if (dy > 0) {
            heading = 45;
        } else if (dy < 0) {
            heading = 135;
        } else {
            heading = 90;
        }
    } else if (dx < 0) {
        if (dy > 0) {
            heading = 315;
        } else if (dy < 0) {
            heading = 225;
        } else {
            heading = 270;
        }
    }

    return heading;
}

function calcPlayerBoundingBox() {
    const bbHeight = Math.floor(gameState.player.size.height * 0.8);
    const bbWidth = Math.floor(gameState.player.size.width * 0.8);


    const top = gameState.player.position.y - Math.floor(bbHeight / 2);
    const left = gameState.player.position.x - Math.floor(bbWidth / 2);
    const bbox = {
        top: top,
        left: left,
        bottom: top + bbHeight,
        right: left + bbWidth
    };

    return bbox;
}
