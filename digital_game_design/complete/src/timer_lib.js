export function updateTimer(gameState, timerElement) {
    let timerString = '00:00.000';
    if (gameState.playState === 'playing') {
        if (gameState.startTime) {
            const curTime = new Date();
            const timeDif = curTime.valueOf() - gameState.startTime.valueOf();
            timerString = formatTimeDif(timeDif);
        } else {
            gameState.startTime = new Date();
        }

        timerElement.innerHTML = timerString;
    }
}

function formatTimeDif(timeDif) {
    const minutes = Math.floor(timeDif / 60000);
    const seconds = (timeDif - (minutes * 60000)) / 1000;

    let minStr;
    if (minutes === 0) {
        minStr = '00';
    } else if (minutes < 10) {
        minStr = `0${minutes}`;
    } else {
        minStr = `${minutes}`;
    }

    let secStr;
    if (seconds === 0) {
        secStr = '00';
    } else if (seconds < 10) {
        secStr = `0${seconds}`;
    } else {
        secStr = `${seconds}`;
    }

    const timerString = `${minStr}:${secStr}`;
    return timerString;
}