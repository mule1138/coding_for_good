import { mazeCellTypes } from './maze.js';

const playerSprite = {
    bbox: {
        height: 0,
        width: 0
    },
    color: 'royalblue'
}

export default class Renderer_2D {
    constructor(maze, canvasElement) {
        this.maze = maze;
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');

        // Calculate the size of the character sprite
        const cellDims = maze.getCellDimensions();
        playerSprite.bbox.height = Math.floor(cellDims.height * 0.9);
        playerSprite.bbox.width = Math.floor(cellDims.width * 0.9);
    }

    render(playerState) {
        const canvasCenter = {
            x: Math.floor(this.canvas.clientWidth / 2),
            y: Math.floor(this.canvas.clientHeight / 2)
        }

        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Background
        this.drawBackground(canvasCenter);

        // Draw the maze
        this.ctx.save();
        this.drawMaze();

        // Draw the player
        this.drawPlayer(playerState);
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

    drawMaze() {
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
        let bbox = null;

        for(let row = 0; row < this.maze.height; ++row) {
            for(let col = 0; col < this.maze.width; ++col) {
                cellType = this.maze.getCellType(row, col);
                bbox = this.maze.getCellBoundingBox(row, col);
                this.ctx.fillStyle = mazeCellTypes[cellType].bgColor;
                this.ctx.fillRect(bbox.left, bbox.top, bbox.right - bbox.left, bbox.bottom - bbox.top);
            }
        }
    }

    drawPlayer(playerState) {
        // this.ctx.fillthis.playerSprite
    }
};



