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
 * equation and the map (X, Y) -> (x, y).
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
 * equation and the map (X, Y) -> (x, y).
 */
function reduce_2(curve) {
	const [a, b, c, d, e] = curve;
	const coefficients = [
		4*b + a*a,
		8*(2*d + a*c),
		16*(4*e + c*c)
	];

	const map = function(X, Y) {
		return [
			X/4,
			(Y - a*X - 4*c)/8
		];
	};
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
 * and the map (X, Y) -> (x, y).
 */
function reduce_3(curve) {
	const [a, b, c] = curve;
	const coefficients = [
		27 * (3*b - a*a),
		27 * (a*(8*a*a - 27*b) + 27*c)
	]

	const map = function(X, Y) {
		return [
			(X - 3*a)/9,
			Y/27
		];
	};
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

	const map = function() {
		return 1;
	}
	return [curve, map];
}

/*
 * Composes the following functions:
 *     reduce_2
 *     reduce_3
 *     minimize
 */
function reduce_full(curve) {
	const functions = [reduce_2, reduce_3, minimize];
	var transformed = curve;

	for (var f of functions) {
		transformed = f(transformed)[0];
	}

	return transformed;
}

export {
	reduce_2,
	reduce_3
};
export default reduce_full;
