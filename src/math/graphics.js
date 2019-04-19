import reduce_full from './reduce.js';
import {find_roots} from './analysis.js';
import * as CURVE from './curve.js';


const SEGMENTS = 128;
const INFINITY = 1e5;

function norm(x, z) {
	return 1/Math.max(Math.abs(x), Math.abs(z), 1);
}

function affineCurvePoints(a, b) {
	const roots = find_roots(a, b);
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
		const local_scale = Math.max(Math.abs(root), 1);
		const multiplier = 2/SEGMENTS;

		const points = [];
		for (var i = 0; i < SEGMENTS-1; i++) {
			points.push(root + local_scale * Math.pow(i * multiplier, 5));
		}
		points.push(INFINITY);
		return [points];
	} else {
		// Choose array componentSizes for each component
		// Depending on whether curve itself is multi-component
		const componentSize = multiComponent ? SEGMENTS : SEGMENTS/2;

		// First component
		const pointsA = [roots[0]];
		const omegaA = Math.PI / componentSize;
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
		const local_scale = Math.max(Math.abs(roots[2] - roots[0]), 1);
		const multiplierB = 2/componentSize;

		const pointsB = [];
		for (i = 0; i < componentSize-1; i++) {
			pointsB.push(roots[2]
				+ local_scale * Math.pow(i * multiplierB, 5));
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
 */
function affineCurveGeometry() {
	const output = [];

	const curve = CURVE.reduced.curve;
	const map = CURVE.reduced.map;

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

function pushPoints(array, x, z) {
	const alpha = norm(x, z);

	x *= alpha;
	z *= alpha;

	array.push(0, 0, 0, x, alpha, z);
	array.push(0, 0, 0, -x, -alpha, -z);
}

function curveSurfaceGeometry() {
	const affinePoints = affineCurveGeometry();
	const output = [];
	const index = [];

	if (affinePoints.length == 2) {
		/*** Construct loop component ***/
		const loopPoints = affinePoints.shift();
		const nPoints = loopPoints.length/3;

		for (var i = 0; i < nPoints; i++) {
			pushPoints(output,
				loopPoints[3*i],
				loopPoints[3*i+2]);
			index.push(4*i, 4*i+1, (4*i+5) % (4*nPoints));
			index.push(4*i+2, 4*i+3, 4*i+7 % (4*nPoints));
		}
	}

	/*** Construct unbounded component ***/
	const mainPoints = affinePoints[0];
	for (var i = 0; i < mainPoints.length; i += 3) {
		pushPoints(output, mainPoints[i], mainPoints[i+2]);
	}

	while (output.length < SEGMENTS * 72) {
		output.push(0, 0, 0);
	}
	return [index, new Float32Array(output)];
}

export {affineCurveGeometry, curveSurfaceGeometry};
