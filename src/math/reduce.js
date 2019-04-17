import bigInt from 'big-integer';

import AffineMap, {IdentityMap} from './affineMap.js';

/*
 * Reduces the given general elliptic curve
 * to the Weierstrass form
 *
 * Y^2 + a_1 XY + a_3 Y = X^3 + a_2 X^2 + a_4 X + a_6.
 *
 * Input is an array of ten BigInts,
 * interpreted as described in App.js.
 *
 * Returns the coefficients [a_i] of the transformed
 * equation and the map (x, y) -> (X, Y).
 */
function reduce_1(curve) {
	// NOT IMPLEMENTED
	return curve;
}


/*
 * Reduces the given Weierstrass form
 *
 * y^2 + axy + cy = x^3 + bx^2 + dx + e.
 *
 * to the reduced form
 *
 * Y^2 = X^3 + AX^2 + BX + C.
 *
 * Input is an array of five BigInts
 * representing the coefficients [a, b, c, d, e].
 *
 * Returns the coefficients [A, B, C] of the transformed
 * equation and the map (x, y) -> (X, Y).
 */
function reduce_2(curve) {
	const [a, b, c, d, e] = curve;
	const coefficients = [
		b.times(4).plus(a.times(a)),
		d.times(2).plus(a.times(c)).times(8),
		e.times(4).plus(c.times(c)).times(16)
	];

	const map = new AffineMap([
		4, 0, 0,
		a.times(4), 8, c.times(4)
	]);
	return [coefficients, map];
}

/*
 * Reduces the given curve
 *
 * y^2 = x^3 + ax^2 + bx + c
 *
 * to the form
 *
 * Y^2 = X^3 + AX + B.
 *
 * Returns the coefficients [A, B]
 * and the map (x, y) -> (X, Y).
 */
function reduce_3(curve) {
	const [a, b, c] = curve;
	const coefficients = [
		b.times(3).minus(a.times(a)).times(27),
		a.times(
			a.times(a.times(2)).minus(b.times(9))
		).plus(c.times(27)).times(27)
	]

	const map = new AffineMap([
		9, 0, a.times(3),
		0, 27, 0
	]);
	return [coefficients, map];
}

/*
 * Reduces the given curve
 *
 * y^2 = x^3 + ax + b
 *
 * to the form
 *
 * Y^2 = X^3 + AX + B
 *
 * with minimal discriminant.
 *
 * Returns the coefficients [A, B]
 * and the map (X, Y) -> (x, y).
 */
function minimize(curve) {
	const [a, b] = curve;

	var gcd = bigInt.gcd(a.pow(3), b.pow(2));
	var scale = bigInt.one;

	var p = bigInt(2);
	while (p.pow(12).leq(gcd)) {
		if (gcd.isDivisibleBy(p.pow(12))) {
			gcd = gcd.divide(p.pow(12));
			scale = scale.times(p);
		} else {
			p = p.plus(1);
		}
	}

	const coefficients = [
		a.divide(scale.pow(4)),
		b.divide(scale.pow(6))
	];

	const map = new AffineMap([
		scale.pow(4), 0, 0,
		0, scale.pow(3), 0
	], scale.pow(6));
	return [coefficients, map];
}


/*
 * Composes the given list of functions.
 */
function compose(functions) {
	return (function(curve) {
		var overall_map = IdentityMap;
		var map;

		for (var f of functions) {
			[curve, map] = f(curve);
			overall_map = map.compose(overall_map);
		}

		return [curve, overall_map];
	});
}

const reduce_full = compose([reduce_2, reduce_3, minimize]);

export {
	reduce_1,
	reduce_2,
	reduce_3,
	minimize
};
export default reduce_full;
