import * as MathLib from './math_lib.js';

export function calculateEndpoint(x0, y0, heading, xMax, yMax, dist) {
    let endpoint = null;
    const headingRad = MathLib.degToRad(heading);

    if (dist) {
        y1 = y0 + (dist * Math.cos(headingRad));
        x1 = x0 + (dist * Math.sin(headingRad));

        // Check if we are within the extents
        if ((y1 >= 0 && y1 < yMax) && (x1 >= 0 && x1 < xMax)) {
            // We are good. Record the endpoint
            endpoint = { x: x1, y: y1 };
        }
    }

    // If no endpoint yet, calculate the enpoint at the edge of the extent
    if (endpoint === null) {
        let x1, y1, dist;

        switch (heading) {
            case 0:
                endpoint = { x: x0, y: 0 };
                break;
            case 90:
                endpoint = { x: xMax, y: y0 };
                break;
            case 180:
                endpoint = { x: x0, y: yMax };
                break;
            case 270:
                endpoint = { x: 0, y: y0 };
                break;
            default:
                // Try the x extent first
                x1 = (heading < 180) ? xMax : 0;
                dist = Math.abs(x1 - x0) / Math.sin(headingRad);
                y1 = y0 + (dist * Math.cos(headingRad));
                if (y1 < 0 || y1 > yMax) {
                    // Overshot the y extent. Recalculate with y extent.
                    y1 = (heading < 90 || heading > 270) ? 0 : yMax;
                    dist = Math.abs(y1 - y0) / Math.cos(headingRad);
                    x1 = x0 + (dist * Math.sin(headingRad));
                }

                endpoint = { x: x1, y: y1 };
                break;
        }
    }

    return endpoint;
}

export function traverseLine(x0, y0, heading, maze, maxDist) {
    let intersection = { x: x0, y: y0 };
    if (heading < 45 || heading > 315 || (heading > 135 && heading < 225)) {
        intersection = traverseSteepLine(x0, y0, heading, maze, maxDist);
    } else {
        intersection = traverseShallowLine(x0, y0, heading, maze, maxDist);
    }

    return intersection;
}

function traverseSteepLine(x0, y0, heading, maze, maxDist) {
    let x = x0;
    let y = y0;
    let nextY = y;
    let nextX = x;
    let dx = 0;
    let keepGoing = true;
    const headingRad = MathLib.degToRad(heading);
    let newCell, cellType, yDir, yExtent, xFraction, invSlope;

    // Direction of incrementing (up is neg, down is pos)
    yDir = (heading < 90 || heading > 270) ? -1 : 1;

    // If there is a maxDist provided, find out where we should stop calculating
    if (maxDist) {
        yExtent = y - Math.floor(maxDist * Math.cos(headingRad));
    }

    // Calculate the x increment for each integer y step
    invSlope = Math.abs(1 / MathLib.calcSlopeFromHeading(heading));
    if (isNaN(invSlope)) {
        invSlope = 0;
    }
    xFraction = (heading < 180) ? invSlope : -invSlope;

    // Iterate until we reach the end of the line, a wall, or the edge of the maze
    while (keepGoing) {
        nextY = y + yDir;
        dx += xFraction;
        nextX = x0 + dx;

        newCell = maze.getCellFromXYUnits(nextX, nextY);
        if (newCell) {
            cellType = maze.getCellType(newCell.row, newCell.col);
            if (cellType.isPath === true) {
                y = nextY;
                x = nextX;
            } else {
                keepGoing = false;
            }
        } else {
            // We've gone past the maze extents. Take a step back and exit the loop.
            keepGoing = false;
        }

        if (y === yExtent) {
            keepGoing = false;
        }
    }

    const endpoint = { x: x, y: y };
    return endpoint;
}

function traverseShallowLine(x0, y0, heading, maze, maxDist) {
    let x = x0;
    let y = y0;
    let nextY = y;
    let nextX = x;
    let dy = 0;
    let keepGoing = true;
    const headingRad = MathLib.degToRad(heading);
    let newCell, cellType, xDir, xExtent, yFraction, slope;

    xDir = (heading < 180) ? 1 : -1;
    if (maxDist) {
        xExtent = x + Math.floor(maxDist * Math.sin(headingRad));
    }

    slope = Math.abs(MathLib.calcSlopeFromHeading(heading));
    yFraction = (heading > 90 && heading < 270) ? slope : -slope;

    while (keepGoing) {
        nextX = x + xDir;
        dy += yFraction;
        nextY = y0 + dy;

        newCell = maze.getCellFromXYUnits(nextX, nextY);
        if (newCell) {
            cellType = maze.getCellType(newCell.row, newCell.col);
            if (cellType.isPath === true) {
                x = nextX;
                y = nextY;
            } else {
                keepGoing = false;
            }
        } else {
            // We've gone past the maze extents
            keepGoing = false;
        }

        if (x === xExtent) {
            keepGoing = false;
        }
    }

    const endpoint = { x: x, y: y };
    return endpoint;
}
