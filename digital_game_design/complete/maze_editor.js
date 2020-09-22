import Maze from './maze.js';

const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 20;
let maze = null;

init();

function init() {
    console.log("ran init()");
    maze = loadMaze();
    if (!maze) {
        maze = new Maze(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    // const editorTable = buildEditorTable(maze);
    // document.getElementById('editor_container').appendChild(editorTable);

    buildEditorGrid(maze, document.getElementById('editor_container'));

    document.getElementById('width_input').value = maze.width;
    document.getElementById('height_input').value = maze.height;
}

export function loadMaze() {
    let maze = null;
    const mazeJSON = localStorage.getItem('maze');
    if (mazeJSON) {
        maze = Maze.fromJSON(mazeJSON);
    }

    return maze;
}

export function saveMaze(editorTable) {
    const maze = createMazeFromEditorTable(editor);
    const mazeJSON = maze.toJSON();
    localStorage.setItem('maze', mazeJSON);
}


function buildEditorTable(maze) {
    const width = maze.width;
    const height = maze.height;
    const cells = maze.cells;
    const cellPctWidth = 1 / maze.width * 100;

    console.log(cellPctWidth);

    // Create the table
    const tableElement = document.createElement("table");
    tableElement.setAttribute('class', 'editorTable');

    // Add the rows and cells
    let row, col;
    let rowElement, cellElement, cellInput;
    for (row = 0; row < maze.height; ++row) {
        rowElement = tableElement.insertRow(row);

        for (col = 0; col < maze.width; ++col) {
            cellElement = rowElement.insertCell(col);
            cellElement.setAttribute('class', 'wall');
            // cellElement.setAttribute('style', `width: ${cellPctWidth}%; padding-bottom: ${cellPctWidth}; display: inline-block;`);
            cellInput = document.createElement("input");
            cellInput.setAttribute('type', 'hidden');
            cellInput.setAttribute('id', `${row}-${col}`);
            cellInput.value = maze.getCellValue(col, row);
            cellElement.appendChild(cellInput);
        }
    }

    return tableElement;
}

function buildEditorGrid(maze, container) {
    const gridContainer = document.createElement('div');
    gridContainer.setAttribute('class', 'gridContainer');
    gridContainer.setAttribute('style', `display: grid; grid-template-columns: repeat(${maze.width}, 1fr); grid-template-rows: repeat(${maze.height}, 1fr);`);
    container.appendChild(gridContainer);

    let cellDiv = null;
    let row, col;

    for (row = 0; row < maze.height; ++row) {
        for (col = 0; col < maze.width; ++col) {
            cellDiv = document.createElement('div');
            cellDiv.setAttribute('id', `${row}-${col}`);
            cellDiv.setAttribute('class', 'editorCell wall');
            gridContainer.appendChild(cellDiv);
        }
    }
}

function createMazeFromEditorTable() {
    const width = document.getElementById('width_input').value;
    const height = document.getElementById('height_input').value;
    const cells = new Array();

    let row = 0;
    let col = 0;
    let cellId = '0-0';
    let value = false;
    for (let i = 0; i < width * height; ++i) {
        row = Math.floor(i / width);
        col = i % width;
        cellId = `${row}-${col}`;
        value = (document.getElementById('cellId').value === 'true') ? true : false;
        cells.push(value);
    }

    return new Maze(width, height, cells);
}
