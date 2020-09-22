export default class Maze {
    constructor(width, height, cells) {
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
                this.cells.push(false);
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

    getCellValue(x, y) {
        const rowStartIdx = x * this.width;
        const cellIdx = rowStartIdx + y;
        return this.cells[cellIdx];
    }
}

