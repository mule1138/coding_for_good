/**
 * Class used to define a maze. A maze is defined by its height, width and
 * an array of cells. The value of the cells is the type of cell found at
 * that index. The cell types are defined by the mazeCellTypes object.
 */


/**
 * The default dimensions of each cell in non-descript units.
 */
const DEFAULT_CELL_WIDTH_UNITS = 32;
const DEFAULT_CELL_HEIGHT_UNITS = 32;

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
    constructor(width, height, cells, cellWidth, cellHeight) {
        if (!width || !height) {
            throw new Error(`width and height must have values`);
        }

        this.width = width;
        this.height = height;
        this.cells = cells;

        // Cell dimensions in units. Can be used for player position, and as
        // pixel count durning rendering.
        this.cellDimensions = {
            width: cellWidth || DEFAULT_CELL_WIDTH_UNITS,
            height: cellHeight || DEFAULT_CELL_HEIGHT_UNITS
        }

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

        return new Maze(mazeObj.width, mazeObj.height, mazeObj.cells, mazeObj.cellDimensions.width, mazeObj.cellDimensions.height);
    }

    toJSON() {
        let mazeObj = {
            width: this.width,
            height: this.height,
            cellDimensions: this.cellDimensions,
            cells: this.cells
        }

        return JSON.stringify(mazeObj);
    }

    getCellType(row, col) {
        const rowStartIdx = row * this.width;
        const cellIdx = rowStartIdx + col;
        return this.cells[cellIdx];
    }

    setCellType(row, col, cellType) {
        if (cellType === 'start') {
            this.setStartCell(row, col);
        } else if (cellType === 'end') {
            this.setEndCell(row, col);
        } else {
            const rowStartIdx = row * this.width;
            const cellIdx = rowStartIdx + col;
            this.cells[cellIdx] = cellType;
        }
    }

    getStartCell() {
        let startCell = null;
        this.cells.some((cell, idx) => {
            if (cell === 'start') {
                const row = Math.floor(idx / this.width);
                const col = idx - (row * this.width);
                startCell = { row: row, col: col };
                return true;
            }

            return false;
        });

        return startCell;
    }

    setStartCell(row, col) {
        // First find and clear the exising start cell
        this.cells.some((cell, idx) => {
            if (cell === 'start') {
                this.cells[idx] = 'path';
                return true;
            }

            return false;
        });

        // Then set the start cell to the new cell
        const rowStartIdx = row * this.width;
        const cellIdx = rowStartIdx + col;
        this.cells[cellIdx] = 'start';
    }

    getEndCell() {
        let endCell = null;
        this.cells.some((cell, idx) => {
            if (cell === 'end') {
                const row = Math.floor(idx / this.width);
                const col = idx - (row * this.width);
                endCell = { row: row, col: col };
                return true;
            }

            return false;
        });

        return endCell;
    }

    setEndCell(row, col) {
        // First find and clear the exising end cell
        this.cells.some((cell, idx) => {
            if (cell === 'end') {
                this.cells[idx] = 'path';
                return true;
            }

            return false;
        });

        // Then set the end cell to the new cell
        const rowStartIdx = row * this.width;
        const cellIdx = rowStartIdx + col;
        this.cells[cellIdx] = 'end';
    }

    getCellDimensions() {
        return this.cellDimensions;
    }

    setCellDimensions(width, height) {
        this.cellDimensions.width = width;
        this.cellDimensions.height = height;
    }
}

