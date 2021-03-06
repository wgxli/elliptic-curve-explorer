import {findRoots} from './analysis.js';


const SEGMENTS = 64;
const DIVISIONS = 3;
const INFINITY = 1e5;

function norm(x, z) {
    return 1/Math.max(Math.abs(x), Math.abs(z), 1);
}

function affineCurvePoints(a, b) {
    const roots = findRoots(a, b);
    const f = (x) => Math.pow(x, 3) + a*x + b;
    var multiComponent = true;

    // Expand double root to three (non-unique) roots
    if (roots.length === 2) {
        multiComponent = false;
        const x = (roots[0] + roots[1]) / 2;
        if (f(x) > 0) {
            roots.push(roots[1]);
        } else {
            roots.shift();
        }
    }

    // Expand single root if curve has local extrema
    if (roots.length === 1 && a < 0) {
        const extremum = Math.sqrt(-a/3);
        if (f(extremum) > 0){
            multiComponent = false;
            roots.push(extremum, extremum);
        }
    }

    if (roots.length === 1) {
        // Single component
        const root = roots[0];
        const local_scale = Math.max(Math.abs(root), 1)/200;
        const multiplier = 15/SEGMENTS;

        const points = [];
        for (var i = 0; i < SEGMENTS-1; i++) {
            points.push(root + local_scale * Math.sinh(i * multiplier));
        }
        points.push(INFINITY);
        return [points];
    } else {
        // Choose array componentSizes for each component
        // Depending on whether curve itself is multi-component
        const componentSize = multiComponent ? SEGMENTS : SEGMENTS/2;

        // First component
        const pointsA = [roots[0]];
        const omegaA = Math.PI / (componentSize-2);
        const radiusA = (roots[1] - roots[0])/2;
        const centerA = (roots[0] + roots[1])/2;
        for (i = 0; i < componentSize-2; i++) {
            pointsA.push(
                centerA - radiusA * 
                Math.cos(i * omegaA)
            );
        }
        pointsA.push(roots[1]);

        // Second component
        const local_scale = Math.max(Math.abs(roots[2] - roots[0]), 1)/200;
        const multiplierB = 15/componentSize;

        const pointsB = [];
        for (i = 0; i < componentSize-1; i++) {
            pointsB.push(roots[2]
                + local_scale * Math.sinh(i * multiplierB));
        }
        pointsB.push(INFINITY);

        if (multiComponent) {
            return [pointsA, pointsB];
        } else {
            pointsA.push(...pointsB);
            return [pointsA];
        }
    }
}


/*
 * Returns a buffer array representing the graph of the given curve.
 * The array should be interpreted in groups of six,
 * each group representing the start and end coordinates
 * of a single line segment.
 *
 * Input is the 'reduced' attribute of a Curve.
 */
function affineCurveGeometry(reduced) {
    const output = [];

    if (typeof reduced === 'undefined') {
        reduced = {coefficients: undefined, map: undefined};
    }

    const curve = reduced.coefficients;
    const map = reduced.map;

    // Placeholder for empty curve
    if (typeof curve !== 'undefined') {
        // Reduce given curve
        const [a, b] = curve.map((x) => x.toJSNumber());
        const f = (function(x) {
            const y = Math.sqrt(Math.pow(x, 3) + a*x + b);
            return isNaN(y) ? 0 : y;
        });

        // Construct geometry
        const xLists = affineCurvePoints(a, b);
        for (var xList of xLists) {
            const yList = xList.map(f);
            const points = [];
            const reversePoints = [];

            // Construct appropriate points
            for (var i=0; i < xList.length; i++) {
                points.push(xList[i], 1, yList[i]);
                reversePoints.push(-yList[i], 1, xList[i]);
            }
            reversePoints.reverse();
            reversePoints.push(...points);
            output.push(reversePoints);
        }

        // Transform under affine map
        const inverseMap = map.inverse();
        for (var component of output) {
            for (i=0; i<component.length; i += 3) {
                const [X, Y] = [component[i], component[i+2]];
                const [x, y] = inverseMap.transformFloat(X, Y);
                component[i] = x;
                component[i+2] = y;
            }
        }
    } else {
        const array = [];
        while (array.length < SEGMENTS*6) {
            array.push(0, 0, 0);
        }
        output.push(array);
    }
    return output.map((x) => new Float32Array(x));
}


/*
 * Helper function for curveSurfaceGeometry.
 */
function pushPoints(array, x, z) {
    const alpha = norm(x, z);
    x *= alpha;
    z *= alpha;

    for (let i = -DIVISIONS; i <= DIVISIONS; i++) {
        const f = i / DIVISIONS;
        array.push(f*x, f*alpha, f*z);
    }
}


/*
 * Constructs the geometry for the curve surface
 * in projective space (3D view).
 *
 * Returns an index array and a Float32Array representing
 * the positions of the points.
 *
 * The position array should be read in groups of three,
 * each representing the xyz coordinates of a vertex in the geometry.
 *
 * If the curve contains two connected components,
 * the first half of the position array corresponds to the
 * "loop" component, while the second half corresponds to
 * the unbounded component.
 *
 * If the curve contains one connected component,
 * the second half of the position array will be padded with zeros.
 *
 * For performance reasons, the output of
 * affineCurveGeometry(curve) is passed as an argument.
 */
function curveSurfaceGeometry(affinePoints) {
    const output = [];
    const index = [];
    const step = 2 * DIVISIONS + 1;

    if (typeof affinePoints === 'undefined') {
        affinePoints = affineCurveGeometry();
    }

    let offset = 0;
    if (affinePoints.length === 2) {
        /*** Construct loop component ***/
        const loopPoints = affinePoints.shift();
        const nPoints = loopPoints.length/3;

        const total = step * nPoints;
        const getPoint = (a, b) => ((step * a) + b + DIVISIONS + total) % total;
        const makeTriangle = (a, b, c, d, e, f) => {
            index.push(getPoint(a, b), getPoint(c, d), getPoint(e, f));
            index.push(getPoint(a, -b), getPoint(c, -d), getPoint(e, -f));
        };

        for (var i = 0; i < nPoints; i++) {
            pushPoints(output, loopPoints[3*i], loopPoints[3*i+2]);

            for (let j = 1; j <= DIVISIONS; j++) {
                makeTriangle(i, j, i+1, j, i, j-1);
                if (j > 1) {
                    makeTriangle(i, j, i, j-1, i-1, j-1);
                }
            }
        }

        offset = total;
    }

    /*** Construct unbounded component ***/
    const mainPoints = affinePoints[0];

    // Add points to geometry
    for (i = 0; i < mainPoints.length; i += 3) {
        pushPoints(output, mainPoints[i], mainPoints[i+2]);
    }

    const nPoints = mainPoints.length/3;
    const total = nPoints * step;

    const getPoint = (a, b) => (((step * a) + b + DIVISIONS + total) % total) + offset;
    const makeTriangle = (a, b, c, d, e, f) => {
        index.push(getPoint(a, b), getPoint(c, d), getPoint(e, f));
        index.push(getPoint(a, -b), getPoint(c, -d), getPoint(e, -f));
    };


    // Add appropriate indexed triangles
    for (i = 1; i < nPoints - 1; i++) {
        for (let j = 1; j <= DIVISIONS; j++) {
            makeTriangle(i, j, i+1, j, i, j-1);
            if (j > 1) {
                makeTriangle(i, j, i, j-1, i-1, j-1);
            }
        }
    }

    // Connect triangles at infinity
    for (let j = 1; j <= DIVISIONS; j++) {
        makeTriangle(0, j, 1, j, 0, j-1);
        makeTriangle(nPoints-1, -j, 0, j, 0, j-1);
        if (j > 1) {
            makeTriangle(nPoints-1, j, nPoints-1, j-1, nPoints-2, j-1);
            makeTriangle(nPoints-1, j-1, nPoints-1, j, 0, -j+1);
        }
    }

    while (output.length < SEGMENTS * 12 * step) {
        output.push(0, 0, 0);
    }

    return [index, new Float32Array(output)];
}

export {affineCurveGeometry, curveSurfaceGeometry};
