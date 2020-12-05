export function degToRad(degrees) {
    return (Math.PI / 180) * degrees;
}

export function radToDeg(radians) {
    return (180 / Math.PI) * radians;
}

export function calcYIntercept(m, x, y) {
    // line eq. is "y = mx + b". Solve for b.
    const b = y - (m * x);
    return b;
}

export function calcSlopeFromHeading(heading) {
    let slope = 0;
    switch (heading) {
        case 0:
        case 180:
            slope = NaN;
            break;
        case 90:
        case 180:
            slope = 0;
        case 45:
        case 225:
            slope = 1;
            break;
        case 135:
        case 315:
            slope = -1;
            break;
        default:
            const headingRad = degToRad(heading);
            slope = 1 / Math.tan(headingRad);
            break;
    }

    return slope;
}

export function calculateDeparturePoint(x0, y0, heading, bbox, maxDist) {
    const slope = calcSlopeFromHeading(heading);

    let xDif, yDif;

    if (heading < 180) {
        xDif = bbox.right - x0;
    } else {
        xDif = bbox.left - x0;
    }

    if (heading > 270 || heading < 90) {
        yDif = bbox.top - y0;
    } else {
        yDif = bbox.bottom - y0;
    }

    let y1, x1, side;

    x1 = x0 + yDif / slope;
    if (x1 > bbox.right || x1 < bbox.left) {
        // we went out the left or right
        if (xDif < 0) {
            x1 = bbox.left;
            side = 'left';
        } else {
            x1 = bbox.right;
            side = 'right'
        }

        y1 = y0 + (slope * xDif);
    } else {
        // we went out the top or bottom
        x1 = x0 + yDif / slope;

        if (yDif < 0) {
            y1 = bbox.top;
            side = 'top';
        } else {
            y1 = bbox.bottom;
            side = 'bottom';
        }
    }

    let departurePt = { x: x1, y: y1, side: side };
    if (calcDistance(x0, y0, x1, y1) > maxDist) {
        departurePt = null;
    }

    return departurePt;
}

export function calcDistance(x0, y0, x1, y1) {
    return Math.hypot((x1 - x0), (y1 - y0));
}