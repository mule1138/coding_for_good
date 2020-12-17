export default class Renderer {
    constructor(canvasElement) {
        this.canvas = canvasElement;
        this.lastFrameTime = new Date().valueOf();
    }

    render(gameState) {
        return;
    }

    calculateFPS(){
        const curTime = new Date().valueOf();
        const frameTime = (curTime - this.lastFrameTime) / 1000;
        const fps = Math.round(1 / frameTime);
        this.lastFrameTime = curTime;

        return fps;
    }
}