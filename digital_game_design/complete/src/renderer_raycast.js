import Renderer from './renderer_base.js';
import * as LineLib from './libs/line_lib.js';

export default class Renderer_Raycast extends Renderer {
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

        // Draw the raycast maze
        this.drawMaze(gameState);

        // Restore the context state
        this.ctx.restore();
    }

    clearCanvas() {
        // Wipe out everything in the entire canvas rect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {

    }

    drawMaze(gameState) {

    }
}