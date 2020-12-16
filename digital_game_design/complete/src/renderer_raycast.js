import Renderer from './renderer_base.js';
import * as LineLib from './libs/line_lib.js';

const HORIZONTAL_AOV = 68;
const VERTICAL_AOV = HORIZONTAL_AOV / 4 * 3;
const GAME_WIDTH = 640;
const GAME_HEIGHT = GAME_WIDTH / 4 * 3;
const EYE_LEVEL = 64;

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

        this.drawDebugText(gameState);

        // Restore the context state
        this.ctx.restore();
    }

    clearCanvas() {
        // Wipe out everything in the entire canvas rect
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Clear out the path
        this.ctx.beginPath();
    }

    drawBackground() {
        // Draw frame border
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'black';
        this.ctx.strokeRect(1, 1, GAME_WIDTH + 2, GAME_HEIGHT + 2);

        // Offset the context to fit within frame border
        this.ctx.translate(1, 1);

        // Draw background gradients
        const bgGradient = this.ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT + 1);
        bgGradient.addColorStop(0, 'deepskyblue');
        bgGradient.addColorStop(0.5, 'white');
        bgGradient.addColorStop(0.5, 'white');
        bgGradient.addColorStop(1.0, 'forestgreen');

        this.ctx.fillStyle = bgGradient;
        this.ctx.fillRect(1, 1, GAME_WIDTH, GAME_HEIGHT);
    }

    drawMaze(gameState) {

    }

    drawDebugText(gameState) {
        const fps = this.calculateFPS();

        const infoLines = [
            `fps: ${fps}`,
            'Player info:',
            `    pos: (${gameState.player.position.x.toFixed(4)}, ${gameState.player.position.y.toFixed(4)})`,
            `    heading: ${gameState.player.heading}`
        ];

        this.ctx.save();

        let txtPos;
        infoLines.forEach((line, i) => {
            txtPos = { x: this.canvas.clientWidth - 200, y: 15 * (i + 1) };

            this.ctx.fillStyle = 'red';
            this.ctx.font = '15px serif';
            this.ctx.fillText(line, txtPos.x, txtPos.y);
        });

        this.ctx.restore();
    }
}