import { Maze, mazeCellTypes } from './maze.js';
import {loadMaze, saveMaze} from './libs/file_lib.js';

const DEFAULT_WIDTH = 20;
const DEFAULT_HEIGHT = 20;
let maze = null;
let currentCellType; // Types specified in mazeCellTypes

init();

function init() {
    console.log("ran init()");
    maze = loadMaze();
    if (!maze) {
        maze = new Maze(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    }

    // Fill in the height and width number boxes
    document.getElementById('width_input').value = maze.width;
    document.getElementById('height_input').value = maze.height;

    // Create the cell type radio buttons
    buildCellTypeSelector();

    // Draw the editor grid
    refreshEditorGrid();

    // Set events on the buttons
    document.getElementById('new_button').addEventListener('click', () => {
        const confirmed = confirm('Do you want to delete the current maze and make a new one?');
        if (confirmed) {
            maze = newMaze();
            refreshEditorGrid();
        }
    });
    document.getElementById('load_button').addEventListener('click', () => {
        const confirmed = confirm('Do you want load the saved maze? Unsaved changes will be lost.');
        if (confirmed) {
            const tmpMaze = loadMaze()
            if (tmpMaze) {
                maze = tmpMaze;
                refreshEditorGrid();
            } else {
                alert('There is no saved maze to load.');
            }
        }
    });
    document.getElementById('save_button').addEventListener('click', () => {
        saveMaze(maze);
    });

    // Set flag for when a mouse button is down
    window.mouseDown = false
    document.onmousedown = function () {
        window.mouseDown = true;
    }
    document.onmouseup = function () {
        window.mouseDown = false;
    }
}

function newMaze() {
    const width = document.getElementById('width_input').value;
    const height = document.getElementById('height_input').value;
    return new Maze(width, height);
}


function refreshEditorGrid() {
    // Clear the container
    const container = document.getElementById('editor_container');
    container.innerHTML = '';

    const gridContainer = document.createElement('div');
    gridContainer.setAttribute('class', 'gridContainer');
    gridContainer.setAttribute('style', `grid-template-columns: repeat(${maze.width}, 1fr); grid-template-rows: repeat(${maze.height}, 1fr);`);
    container.appendChild(gridContainer);

    let cellDiv = null;
    let row, col, cellType;
    const startCell = maze.getStartCell();
    const endCell = maze.getEndCell();

    for (row = 0; row < maze.height; ++row) {
        for (col = 0; col < maze.width; ++col) {
            // Set the common stuff for each cell
            cellDiv = document.createElement('div');
            cellDiv.setAttribute('id', `${row}-${col}`);
            cellDiv.setAttribute('class', 'editorCell');
            attachCellEvents(cellDiv);

            // Set the cell specifics
            cellType = mazeCellTypes[maze.getCellType(row, col)];
            cellDiv.classList.add(cellType.class);
            cellDiv.setAttribute('data-is-path', cellType.isPath);

            // Append the cell to the grid container
            gridContainer.appendChild(cellDiv);
        }
    }
}

function attachCellEvents(cellDiv) {
    const cellCoords = getCellCoords(cellDiv);

    cellDiv.addEventListener('mousedown', (evt) => {
        // console.log(`cell clicked: ${cellCoords.row}, ${cellCoords.col}`);

        maze.setCellType(cellCoords.row, cellCoords.col, currentCellType);
        refreshEditorGrid();
    });

    cellDiv.addEventListener('mouseenter', (evt) => {
        cellDiv.classList.add('cellHover');
        if (window.mouseDown && evt.button === 0) {
            maze.setCellType(cellCoords.row, cellCoords.col, currentCellType);
            refreshEditorGrid();
        }
    });

    cellDiv.addEventListener('mouseout', (evt) => {
        cellDiv.classList.remove('cellHover');
    });
}

function buildCellTypeSelector() {
    const containerDiv = document.getElementById('cell_type_selector_container');
    let divElement, inputElement, labelElement;
    Object.keys(mazeCellTypes).forEach((cellType, idx) => {
        divElement = document.createElement('div');
        containerDiv.appendChild(divElement);

        // Create the input for this cell type
        inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'radio');
        inputElement.setAttribute('name', 'cell_type');
        inputElement.setAttribute('id', cellType);
        inputElement.setAttribute('value', cellType);
        inputElement.addEventListener('change', (evt) => {
            currentCellType = cellType;
            // console.log(`currentCellType changed to ${currentCellType}`);
        });

        if (idx === 0) {
            // Set the default checked value
            inputElement.setAttribute('checked', 'true');
            currentCellType = cellType;
        }
        divElement.appendChild(inputElement);

        // Create the label for this cell type
        labelElement = document.createElement('label');
        labelElement.setAttribute('for', cellType);
        labelElement.innerHTML = mazeCellTypes[cellType].label;
        divElement.appendChild(labelElement);
    });
}

function getCellCoords(cellDiv) {
    // The cellId is in the form of "row-column"
    const idStr = cellDiv.getAttribute('id');
    const values = idStr.split('-');

    const row = Number(values[0]);
    const col = Number(values[1]);

    return { row: row, col: col };
}