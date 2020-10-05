import { Maze } from './maze.js'

export default class FileManager {
    constructor() { }

    static loadMaze() {
        let tmpMaze = null;
        const mazeJSON = localStorage.getItem('maze');
        if (mazeJSON) {
            tmpMaze = Maze.fromJSON(mazeJSON);
        }

        return tmpMaze;
    }

    static saveMaze(maze) {
        try {
            const mazeJSON = maze.toJSON();
            localStorage.setItem('maze', mazeJSON);
            alert('Maze saved.');
        } catch (exception) {
            if (exception instanceof TypeError) {
                alert('Could not convert Maze to JSON.');
            } else {
                alert('Could not save maze to local storage.');
            }

            console.log(exception);
        }
    }
}