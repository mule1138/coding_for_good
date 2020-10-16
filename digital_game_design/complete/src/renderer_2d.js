import { mazeCellTypes } from './maze.js';

const playerSprite = {
    sizeScale: {
        height: 0.8,
        width: 0.8
    },
    color: 'royalblue'
}

export default class Renderer_2D {
    constructor(maze, canvasElement) {
        this.maze = maze;
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
    }

    render(gameState) {
        const canvasCenter = {
            x: Math.floor(this.canvas.clientWidth / 2),
            y: Math.floor(this.canvas.clientHeight / 2)
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Background
        this.drawBackground(canvasCenter);

        this.ctx.save();

        // Draw the maze
        this.drawMaze(gameState);

        // Draw the player
        this.drawPlayer(gameState);

        this.ctx.restore();
    }

    drawBackground(canvasCenter) {
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
        // this.ctx.scale(2, 2);

        // Draw a 2px border around the maze
        const cellDims = this.maze.getCellDimensions();
        const mazeWidthInUnits = cellDims.width * this.maze.width;
        const mazeHeightInUnits = cellDims.height * this.maze.height;
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, mazeWidthInUnits + 8, mazeHeightInUnits + 8);
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(2, 2, mazeWidthInUnits + 4, mazeHeightInUnits + 4);
        this.ctx.translate(4, 4);

        let cellType = null;
        let bbox = {
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
        };

        for(let row = 0; row < this.maze.height; ++row) {
            bbox.top = row * cellDims.height;
            bbox.bottom = bbox.top + cellDims.height;

            for(let col = 0; col < this.maze.width; ++col) {
                cellType = this.maze.getCellType(row, col);
                bbox.left = col * cellDims.width;
                bbox.right = bbox.left + cellDims.width;
                this.ctx.fillStyle = mazeCellTypes[cellType].bgColor;
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
        this.ctx.rotate(this.degToRad(gameState.player.heading));
        this.ctx.translate(-centerPt.x, -centerPt.y);

        // Create the sprite path
        this.ctx.beginPath();
        this.ctx.moveTo(centerPt.x, centerPt.y - (playerSize.width / 2));
        this.ctx.arc(centerPt.x, centerPt.y, playerSize.width / 2, this.degToRad(10), this.degToRad(170), false);
        this.ctx.closePath();

        // Fill it and outline it
        this.ctx.fillStyle = playerSprite.color;
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.stroke();

        this.ctx.restore();
    }

    degToRad(degrees) {
        return (Math.PI / 180) * degrees;
    }

    radToDeg(radians) {
        return (180 / Math.PI) * radians;
    }
};



