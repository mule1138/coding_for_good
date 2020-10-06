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

        const cellDims = maze.getCellDimensions();
        playerSprite.bbox.height = Math.floor(cellDims.height * 0.9);
        playerSprite.bbox.width = Math.floor(cellDims.width * 0.9);
    }

    render() {
        const canvasCenter = {
            x: Math.floor(this.canvas.clientWidth / 2),
            y: Math.floor(this.canvas.clientHeight / 2)
        }

        // Draw Background
        this.drawBackground(canvasCenter);
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
};



