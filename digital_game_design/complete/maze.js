/**
 * Class used to define a maze. A maze is defined by its height, width and
 * an array of cells. The value of the cells is the type of cell found at
 * that index. The cell types are defined by the mazeCellTypes object.
 */


/**
 * This object defines the types of cells the maze can be composed of.
 */
export const mazeCellTypes = {
    wall: {
        value: 0,
        label: 'Wall',
        class: 'mazeWall',
        isPath: false
    },
    path: {
        value: 1,
        label: 'Path',
        class: 'mazePath',
        isPath: true
    },
    start: {
        value: 2,
        label: 'Start',
        class: 'mazeStart',
        isPath: true
    },
    end: {
        value: 3,
        label: 'End',
        class: 'mazeEnd',
        isPath: true
    }
}

/**
 * This class defines the Maze data structure and interface. The properites of
 * the maze should never be directly set. Use accessor the functions to
 * manipulate the Maze state.
 */
export class Maze {
    constructor(width, height, startCell, endCell, cells) {
        if (!width || !height) {
            throw new Error(`width and height must have values`);
        }

        this.width = width;
        this.height = height;
        this.cells = cells;

        if (!this.cells) {
            this.cells = new Array();
            const arrayLength = this.width * this.height;
            for (let i = 0; i < arrayLength; ++i) {
                this.cells.push('wall');
            }
        }
    }

    static fromJSON(mazeJSON) {
        let mazeObj = null;
        if (typeof (mazeJSON) === 'string') {
            mazeObj = JSON.parse(mazeJSON);
        } else {
            mazeObj = mazeJSON;
        }

        return new Maze(mazeObj.width, mazeObj.height, mazeObj.cells);
    }

    toJSON() {
        let mazeObj = {
            width: this.width,
            height: this.height,
            cells: this.cells
        }

        return JSON.stringify(mazeObj);
    }

    getCellType(x, y) {
        const rowStartIdx = x * this.width;
        const cellIdx = rowStartIdx + y;
        return this.cells[cellIdx];
    }

    setCellType(x, y, cellType) {
        if (cellType === 'start') {
            this.setStartCell(x, y);
        } else if (cellType === 'end') {
            this.setEndCell(x, y);
        } else {
            const rowStartIdx = x * this.width;
            const cellIdx = rowStartIdx + y;
            this.cells[cellIdx] = cellType;
        }
    }

    getStartCell() {
        let startCell = null;
        this.cells.some((cell, idx) => {
            if (cell === 'start') {
                const y = Math.floor(idx / this.width);
                const x = idx - (y * this.width);
                startCell = { x: x, y: y };
                return true;
            }

            return false;
        });

        return startCell;
    }

    setStartCell(x, y) {
        // First find and clear the exising start cell
        this.cells.some(cell => {
            if (cell === 'start') {
                cell = 'path';
                return true;
            }

            return false;
        });

        // Then set the start cell to the new cell
        const cellIdx = y * this.width + x;
        this.cells[cellIdx] = 'start';
    }

    getEndCell() {
        let endCell = null;
        this.cells.some((cell, idx) => {
            if (cell === 'end') {
                const y = Math.floor(idx / this.width);
                const x = idx - (y * this.width);
                endCell = { x: x, y: y };
                return true;
            }

            return false;
        });

        return endCell;
    }

    setEndCell(x, y) {
        // First find and clear the exising end cell
        this.cells.some(cell => {
            if (cell === 'end') {
                cell = 'path';
                return true;
            }

            return false;
        });

        // Then set the end cell to the new cell
        const cellIdx = y * this.width + x;
        this.cells[cellIdx] = 'end';
    }
}

