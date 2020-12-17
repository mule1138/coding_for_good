import * as LineLib from '../libs/line_lib.js';

export const PLAYER_SPEED = 5; // units the player can move per frame
export const PLAYER_ROTATION_SPEED = 5 // degrees the player can turn per frame

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
        if (heading > 359) {
            heading = heading - 360;
        }
    }

    return heading;
}

function calcPlayerPosition(gameState) {
    let newPos = gameState.player.position;
    // let playerBBox = calcPlayerBoundingBox(gameState);

    if (gameState.buttons.up || gameState.buttons.down) {
        let heading = gameState.player.heading;
        if (gameState.buttons.down) {
            // Going backwards. Flip heading 180 deg.
            if (gameState.player.heading > 180) {
                heading = gameState.player.heading - 180;
            } else {
                heading = gameState.player.heading + 180;
            }
        }

        newPos = LineLib.traverseLine(
            gameState.player.position.x,
            gameState.player.position.y,
            heading,
            gameState.maze,
            PLAYER_SPEED);
    }

    return newPos;
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
