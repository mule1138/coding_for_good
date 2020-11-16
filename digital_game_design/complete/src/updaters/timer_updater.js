export function updateTimer(gameState) {
    let timeDif = gameState.elapsedTime;
    if (gameState.playState === 'playing') {
        if (gameState.startTime) {
            const curTime = new Date();
            timeDif = curTime.valueOf() - gameState.startTime.valueOf();
        } else {
            gameState.startTime = new Date();
        }
    }

    gameState.elapsedTime = timeDif;
}
