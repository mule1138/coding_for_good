import { mazeCellTypes } from '../maze.js';

export const PLAYER_SPEED = 5; // units the player can move per frame

export function updatePlayer(gameState) {
    // Calculate the new player position
    const playerCurPos = { x: gameState.player.position.x, y: gameState.player.position.y };
    const playerNewPos = calcPlayerPosition(gameState);
    gameState.player.position.x = playerNewPos.x;
    gameState.player.position.y = playerNewPos.y;

    // Calculate new player heading based on movement
    const newHeading = calcPlayerHeading(playerCurPos, gameState.player.heading, playerNewPos);
    gameState.player.heading = newHeading;
}

function calcPlayerPosition(gameState) {
    const playerBBox = calcPlayerBoundingBox(gameState);
    let cell1, cell2, currCell, cellBBox, delta;
    const playerCurPos = {x: gameState.player.position.x, y: gameState.player.position.y};
    const newPos = {x: playerCurPos.x, y: playerCurPos.y}

    // Move the player based on what arrow buttons are pressed
    if (gameState.buttons.up) {
        delta = PLAYER_SPEED;

        cell1 = gameState.maze.getCellFromXYUnits(playerBBox.left, playerBBox.top - PLAYER_SPEED);
        cell2 = gameState.maze.getCellFromXYUnits(playerBBox.right, playerBBox.top - PLAYER_SPEED);
        if (cell1 === null ||
            mazeCellTypes[gameState.maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[gameState.maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to top of current cell
            currCell = gameState.maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = gameState.maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = playerBBox.top - cellBBox.top - 1;
        }

        newPos.y -= delta;
    }
    if (gameState.buttons.down) {
        delta = PLAYER_SPEED;

        cell1 = gameState.maze.getCellFromXYUnits(playerBBox.left, playerBBox.bottom + PLAYER_SPEED);
        cell2 = gameState.maze.getCellFromXYUnits(playerBBox.right, playerBBox.bottom + PLAYER_SPEED);
        if (cell1 === null ||
            mazeCellTypes[gameState.maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[gameState.maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to bottom of current cell
            currCell = gameState.maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = gameState.maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = cellBBox.bottom - playerBBox.bottom - 1;
        }

        newPos.y += delta;
    }
    if (gameState.buttons.left) {
        delta = PLAYER_SPEED;

        cell1 = gameState.maze.getCellFromXYUnits(playerBBox.left - PLAYER_SPEED, playerBBox.top);
        cell2 = gameState.maze.getCellFromXYUnits(playerBBox.left - PLAYER_SPEED, playerBBox.bottom);
        if (cell1 === null ||
            mazeCellTypes[gameState.maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[gameState.maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to bottom of current cell
            currCell = gameState.maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = gameState.maze.getCellBoundingBox(currCell.row, currCell.col);
            delta = playerBBox.left - cellBBox.left - 1;
        }

        newPos.x -= delta;
    }
    if (gameState.buttons.right) {
        delta = PLAYER_SPEED;

        cell1 = gameState.maze.getCellFromXYUnits(playerBBox.right + PLAYER_SPEED, playerBBox.top);
        cell2 = gameState.maze.getCellFromXYUnits(playerBBox.right + PLAYER_SPEED, playerBBox.bottom);
        if (cell1 === null ||
            mazeCellTypes[gameState.maze.getCellType(cell1.row, cell1.col)].isPath === false ||
            mazeCellTypes[gameState.maze.getCellType(cell2.row, cell2.col)].isPath === false) {
            // Limmit movement to bottom of current cell
            currCell = gameState.maze.getCellFromXYUnits(playerCurPos.x, playerCurPos.y);
            cellBBox = gameState.maze.getCellBoundingBox(currCell.row, currCell.col);
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

function calcPlayerBoundingBox(gameState) {
    const bbHeight = gameState.player.size.height;
    const bbWidth = gameState.player.size.width;

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
