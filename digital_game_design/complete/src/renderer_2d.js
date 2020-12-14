import * as MathLib from './libs/math_lib.js';
import Renderer from './renderer_base.js';

const playerSprite = {
    sizeScale: {
        height: 1.0,
        width: 1.0
    },
    color: 'royalblue'
}

export default class Renderer_2D extends Renderer {
    constructor(canvasElement) {
        super(canvasElement);
        this.ctx = this.canvas.getContext('2d');
    }

    render(gameState) {
        // Clear the canvas
        this.clearCanvas();

        // Save the current context state prior to drawing
        this.ctx.save();

        // Draw Background
        this.drawBackground();

        // Draw the maze
        this.drawMaze(gameState);

        // Draw the player
        this.drawPlayer(gameState);

        // Restore the context state
        this.ctx.restore();
    }

    clearCanvas() {
        // Wipe out everything in the entire canvas rect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        const canvasCenter = {
            x: Math.floor(this.canvas.clientWidth / 2),
            y: Math.floor(this.canvas.clientHeight / 2)
        }

        const r1 = Math.max(canvasCenter.x, canvasCenter.y)
        const r0 = 0.1 * r1;
        const bgRadialGradient = this.ctx.createRadialGradient(
            canvasCenter.x, canvasCenter.y, r0,
            canvasCenter.x, canvasCenter.y, r1);
        bgRadialGradient.addColorStop(0.0, 'royalblue');
        bgRadialGradient.addColorStop(1.0, 'lightblue');
        this.ctx.fillStyle = bgRadialGradient;
        this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }

    drawMaze(gameState) {
        // Draw a 2px border around the maze
        const cellDims = gameState.maze.getCellDimensions();
        const mazeWidthInUnits = cellDims.width * gameState.maze.width;
        const mazeHeightInUnits = cellDims.height * gameState.maze.height;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, mazeWidthInUnits + 8, mazeHeightInUnits + 8);
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(2, 2, mazeWidthInUnits + 4, mazeHeightInUnits + 4);
        // Offset the context so the maze and all contents draws within the border
        this.ctx.translate(4, 4);

        // Initialze loop variables
        let cellType = null;
        let row = 0
        let col = 0;
        let bbox = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };

        // Loop through all of the maze cells and draw them
        for (row = 0; row < gameState.maze.height; ++row) {
            bbox.top = row * cellDims.height;
            bbox.bottom = bbox.top + cellDims.height;

            for (col = 0; col < gameState.maze.width; ++col) {
                cellType = gameState.maze.getCellType(row, col);
                bbox.left = col * cellDims.width;
                bbox.right = bbox.left + cellDims.width;
                this.ctx.fillStyle = cellType.bgColor;
                this.ctx.fillRect(bbox.left, bbox.top, bbox.right - bbox.left, bbox.bottom - bbox.top);
            }
        }
    }

    drawPlayer(gameState) {
        const centerPt = gameState.player.position;
        const playerSize = {};
        playerSize['width'] = playerSprite.sizeScale.width * gameState.player.size.width;
        playerSize['height'] = playerSprite.sizeScale.width * gameState.player.size.width;

        this.ctx.save();

        // Rotate the context around the center of the player sprite
        this.ctx.translate(centerPt.x, centerPt.y);
        this.ctx.rotate(MathLib.degToRad(gameState.player.heading));
        this.ctx.translate(-centerPt.x, -centerPt.y);

        // Create the sprite path
        this.ctx.beginPath();
        this.ctx.moveTo(centerPt.x, centerPt.y - (playerSize.width / 2));
        this.ctx.arc(centerPt.x, centerPt.y, playerSize.width / 2, MathLib.degToRad(10), MathLib.degToRad(170), false);
        this.ctx.closePath();

        // Fill it and outline it
        this.ctx.fillStyle = playerSprite.color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        this.ctx.restore();
    }
};



