export function updatePlayState(gameState) {
    const currentCell = gameState.maze.getCellFromXYUnits(gameState.player.position.x, gameState.player.position.y);
    const cellType = gameState.maze.getCellType(currentCell.row, currentCell.col);

    switch (gameState.playState) {
        case 'start':
            // If the player has left the start cell, the game is afoot
            if (cellType !== 'start') {
                gameState.playState = 'playing';
            }
            break;
        case 'playing':
            // If the player has entered the end cell, the game is done
            if (cellType === 'end') {
                gameState.playState = 'done';
            }
            break;
        case 'done':
            clearInterval(gameState.gameLoopInterval);
            break;
        default:
            break;
    }
}
