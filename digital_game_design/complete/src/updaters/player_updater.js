import { mazeCellTypes } from '../maze.js';
import * as MathLib from '../libs/math_lib.js';

export const PLAYER_SPEED = 5; // units the player can move per frame
export const PLAYER_ROTATION_SPEED = 8 // degrees the player can turn per frame

export function updatePlayer(gameState) {
    // Calculate the new player position
    const playerCurPos = { x: gameState.player.position.x, y: gameState.player.position.y };

    // Calculate new player heading based on left/right arrows
    const newHeading = calcPlayerHeading(gameState);
    gameState.player.heading = newHeading;

    // Move player based on new heading
    const playerNewPos = calcPlayerPosition(gameState);
    gameState.player.position.x = playerNewPos.x;
    gameState.player.position.y = playerNewPos.y;
}



function doStuffForPlayer(gameState) {
    let dx = 0;
    let dy = 0;
    const curCell = gameState.maze.getCellFromXYUnits(curPos.x, curPos.y);
    const cellBBox = gameState.maze.getCellBoundingBox(curCell.row, curCell.col);
    const curPos = { x: gameState.player.position.x, y: gameState.player.position.y };

    // Move the player based on what arrow buttons are pressed
    // Up arrow moves in the direction of heading, down arrow is reverse of heading
    // A heading of 0deg is point up on the board, or in the -y direction
    const headingRad = MathLib.degToRad(gameState.player.heading);
    if (gameState.buttons.up) {
        dy = -(Math.cos(headingRad) * PLAYER_SPEED); // Negating this since up is in the -y direction
        dx = Math.sin(headingRad) * PLAYER_SPEED;
    }
    if (gameState.buttons.down) {
        dy = Math.cos(headingRad) * PLAYER_SPEED;
        dx = -(Math.sin(headingRad) * PLAYER_SPEED);
    }

    let newPos = { x: curPos.x + dx, y: curPos.y + dy };
    let targetCell = maze.getCellFromXYUnits(newPos.x, newPos.y);

    let moveRestrictions = calculateMoveRestrictions(curCell, gameState.player.heading, gameState.maze);

    // Check horizontal cell movement

    if (targetCell.col != curCell.row && moveRestrictions.horizontal === false) {
        newPos.x = moveRestrictions.horizSide === 'left' ? curCellBBox.left : curCellBBox.right;
    }

    // Check vertical cell movement
    if (targetCell.row != curCell.row && moveRestrictions.vertical === false) {
        newPos.y = moveRestrictions.vertSide === 'top' ? curCellBBox.top : curCellBBox.bottom;
    }

    if (targetCell.row !== curCell.row && targetCell.col !== curCell.col) {
    }



    // const cellDeparturePt = MathLib.calculateDeparturePoint(curPos.x, curPos.y, gameState.player.heading, cellBBox, PLAYER_SPEED);
    // if (cellDeparturePt !== null) {
    //     const moveRestrictions = calculateMoveRestrictions(curCell, gameState.player.heading, gameState.maze);
    //     if (cellDeparturePt.side === 'top' && moveRestrictions.vertical === false) {
    //         newPos.y = curCellBBox.top;
    //     } else if (cellDeparturePt.side === 'right' && moveRestrictions.horizontal === false) {
    //         newPos.x = curCellBBox.right;
    //     } else if (cellDeparturePt.side === 'bottom' && moveRestrictions.vertical === false) {
    //         newPos.y = curCellBBox.bottom;
    //     } else if (cellDeparturePt.side === 'left' && moveRestrictions.horizontal === false) {
    //         newPos.x = curCellBBox.left;
    //     }
    // }


    return newPos;
}

function calculateMoveRestrictions(curCell, heading, maze) {
    const vertAdjCell = { row: curCell.row, col: curCell.col };
    const horzAdjCell = { row: curCell.row, col: curCell.col };
    const cornerAdjCell = { row: curCell.row, col: curCell.col };
    let vertSide, horizSide;

    const curCellBBox = maze.getCellBoundingBox(curCell.row, curCell.col);

    if (heading > 270 || heading < 90) {
        vertAdjCell.row -= 1;
        vertSide = 'top';
    } else {
        vertAdjCell.row += 1;
        vertSide = 'bottom';
    }

    if (heading < 180) {
        horzAdjCell.col += 1;
        horizSide = 'right';
    } else {
        horzAdjCell.col -= 1;
        horizSide = 'left';
    }

    cornerAdjCell.row = vertAdjCell.row;
    cornerAdjCell.col = horzAdjCell.col;

    const vertAdjCellType = maze.getCellType(vertAdjCell);
    const horzAdjCellType = maze.getCellType(horzAdjCell);
    const cornerAdjCellType = maze.getCellType(cornerAdjCell);

    const moveRestrictions = {
        vertSide: vertSide,
        horizSide: horizSide,
        vertical: (vertAdjCellType !== null) ? vertAdjCellType.isPath : false,
        horizontal: (horzAdjCellType !== null) ? horzAdjCellType.isPath : false,
        corner: (cornerAdjCellType !== null) ? cornerAdjCellType.isPath : false
    };

    return moveRestrictions;
}


function calcPlayerPosition(gameState) {
    const playerBBox = calcPlayerBoundingBox(gameState);
    let cell1, cell2;
    let dx = 0;
    let dy = 0;
    const curPos = { x: gameState.player.position.x, y: gameState.player.position.y };
    const newPos = { x: curPos.x, y: curPos.y }
    const headingRad = MathLib.degToRad(gameState.player.heading);
    const curCell = gameState.maze.getCellFromXYUnits(curPos.x, curPos.y);
    const cellBBox = gameState.maze.getCellBoundingBox(curCell.row, curCell.col);

    // Move the player based on what arrow buttons are pressed
    // Up arrow moves in the direction of heading, down arrow is reverse of heading
    // A heading of 0deg is point up on the board, or in the -y direction
    if (gameState.buttons.up) {
        dy = -(Math.cos(headingRad) * PLAYER_SPEED); // Negating this since up is in the -y direction
        dx = Math.sin(headingRad) * PLAYER_SPEED;
    }
    if (gameState.buttons.down) {
        dy = Math.cos(headingRad) * PLAYER_SPEED;
        dx = -(Math.sin(headingRad) * PLAYER_SPEED);
    }

    const slope = dy / dx;
    const yIntercept = MathLib.calcYIntercept(slope, curPos.x, curPos.y);

    // calc nearest x and y cell intercepts


    const newCell = gameState.maze.getCellFromXYUnits(curPos.x + dx, curPos.y + dy);
    const newCellType = gameState.maze.getCellType(newCell.row, newCell.col);

    /*
        if (newCell.row !== curCell.row && newCell.col !== curCell.col) {
            // Moved to a corner cell

            const slope = dy / dx;
            const yIntercept = MathLib.calcYIntercept(slope, curPos.x, curPos.y);

            // Find out where the line intercepts the cell


            // check if cell adjacent to that side is wall

            // if so, check if other cell is wall

        } else if (newCell.col !== curCell.col && newCell.row === curCell.row) {
            // lateral cell move
            if (newCellType.isPath === false) {
                if (dx > 0) {
                    dx = cellBBox.right - curPos.x;
                } else {
                    dx = curPos.x - cellBBox.left;
                }
            }
        } else if (newCell.row !== curCell.row && newCell.col === curCell.col) {
            // vertical cell move
            if (newCellType.isPath === false) {
                if (dy > 0) {
                    dy = cellBBox.bottom - curPos.y;
                } else {
                    dy = curPos.y - cellBBox.top;
                }
            } else {
                // didn't leave current cell
            }

        }
    */

    newPos.x += dx;
    newPos.y += dy;

    return newPos;
}

function calcPlayerHeading(gameState) {
    let heading = gameState.player.heading;

    if (gameState.buttons.left) {
        heading -= PLAYER_ROTATION_SPEED;
        if (heading < 0) {
            // Heading is negative. Adding it to 360 will subtract the value
            heading = 360 + heading;
        }
    }

    if (gameState.buttons.right) {
        heading += PLAYER_ROTATION_SPEED;
        if (heading > 360) {
            heading = heading - 360;
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

function calculateWallIntersectionPoint(gameState, x, y, heading, maxDist) {
    const curPos = {
        x: gameState.player.position.x,
        y: gameState.player.position.y
    }

    const cellDims = gameState.maze.getCellDimensions();

    let nextY = (heading > 270 || heading < 90) ? Math.floor(y / cellDims.height) - 1 : Math.ceil(y / cellDims.height) + 1;
    let nextX = heading < 180 ? Math.ceil(x / cellDims.width) + 1 : Math.floor(x / cellDims.width) - 1;

    const slope = MathLib.calcSlopeFromHeading(heading);

    let nextYIntCoord = { x: x + (nextY - y) / slope, y: nextY };
    let yIntDist = MathLib.calcDistance(nextYIntCoord.x, nextYIntCoord.y, x, y);
    let nextXIntCoord = { x: nextX, y: y + (slope * (nextX - x)) };
    let xIntDist = MathLib.calcDistance(nextXIntCoord.x, nextXIntCoord.y, x, y);

    let nearestCoord;
    let wallInterceptPt = { x: nearestCoord.x, y: nearestCoord.y };

    if (xIntDist < maxDist || yIntDist < maxDist) {

    } else if (xIntDist < yIntDist) {
        nearestCoord = nextXIntCoord;
    } else {
        nearestCoord = nextYIntCoord;
    }


    const nextCell = gameState.maze.getCellFromXYUnits(nearestCoord.x, nearestCoord.y);
    const isPath = gameState.maze.getCellType(nextCell.row, nextCell.col).isPath;

    if (isPath) {
        // recursive call
        wallInterceptPt = calculateWallIntersectionPoint(gameState, nextX, nextY, heading, yIntercept);
    }

    return wallInterceptPt
}