/*
 * Finds the real roots of f(x) = x^3 + ax + b.
 */
function findRoots(a, b) {
	if (a === 0) {
		return [-Math.cbrt(b)];
	}

	const discriminant = -16 * (4*Math.pow(a, 3) + 27*Math.pow(b, 2));

	if (discriminant === 0) {
		// Multiple root
		const roots = [3*b/a, -3*b/(2*a)];
		roots.sort((a, b) => a-b);
		return roots;
	} else if (discriminant > 0) {
		// Three real roots
		// Viete's solution to the cubic
		const alpha = Math.sqrt(-3/a);
		const beta = Math.acos(3*b/(2*a) * alpha);
		const roots = []

		for (var k=0; k<3; k++) {
			roots.push(2 * Math.cos(
				(beta - 2*Math.PI*k)/3
			) / alpha);
		}
		roots.sort((a, b) => a-b);
		return roots;
	} else {
		// One real root
		// Cardano's formula
		const alpha = Math.sqrt(discriminant / (-16 * 4 * 27));
		const root = Math.cbrt(-b/2 + alpha) + Math.cbrt(-b/2 - alpha);
		return [root];
	}
}

export {findRoots};
