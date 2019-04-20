import bigInt from 'big-integer';

import reduceFull from './reduce.js';
import {factor} from './numberTheory.js';
import {findRoots} from './analysis.js';
import RationalPoint from './rationalPoint.js';


/*
 * Represents an elliptic curve with equation
 * y^2 + axy + cy = x^3 + bx^2 + dx + e.
 */
class Curve {
	constructor(...coefficients) {
		this.coefficients = coefficients.map((x) => bigInt(x));
		this.computeReduction();
		this.computeTorsionPoints();
	}

	computeReduction() {
		const [curve, map] = reduceFull(this.coefficients);
		this.reduced = new ReducedCurve(curve, map);
	}

	computeTorsionPoints() {}

	toString() {
		const [a, b, c, d, e] = this.coefficients;
		return 'y\u00B2 + '
			+ a.toString() + 'xy + '
			+ c.toString() + 'y = x\u00B3 + '
			+ b.toString() + 'x\u00B2 + '
			+ d.toString() + 'x + '
			+ e.toString();
	}
}


/*
 * Represents an elliptic curve with equation
 * y^2 = x^3 + ax + b.
 */
class ReducedCurve extends Curve {
	constructor(coefficients, map) {
		super(...coefficients);
		this.map = map;
	}

	computeReduction() {
		this.reduced = this;
	}

	computeDiscriminant() {
		const [a, b] = this.coefficients;
		this.discriminant = a.pow(3).times(4).plus(
			b.pow(2).times(27)
		).times(-16);
		this.discriminantFactorization = factor(this.discriminant.abs());
	}

	computeTorsionPoints() {
		this.computeDiscriminant();

		const candidates = this.getCandidateTorsionPoints().map(
			(p) => new RationalPoint(this, ...p)
		);

		this.torsionPoints = [];
		for (var p of candidates) {
			if (isFinite(p.order())) {this.torsionPoints.push(p)};
		}
	}

	getCandidateTorsionPoints() {
		const yCandidates = [bigInt.one];

		// Nagell-Lutz theorem
		for (var [prime, exponent] of this.discriminantFactorization) {
			if (prime.eq(2)) {exponent -= 4}; // Reduced discriminant
			if (exponent < 2) {continue;}

			const currentCandidates = [...yCandidates];
			for (var i=1; 2*i <= exponent; i++) {
				const multiplier = prime.pow(i);
				yCandidates.push(...currentCandidates.map(
					(x) => x.times(multiplier)
				));
			}
		}

		yCandidates.push(bigInt.zero);

		// Compute possible corresponding x-values
		const candidates = [];
		const [a, b] = this.coefficients;
		for (var y of yCandidates) {
			// Find roots of corresponding cubic
			const roots = findRoots(
				a.toJSNumber(),
				b.minus(y.pow(2)).toJSNumber());

			// Check if roots are integral solutions
			for (var x of roots) {
				if (Math.abs(x - Math.round(x)) > 1e-5) {continue;}
				x = bigInt(Math.round(x));
				if (x.pow(3).plus(a.times(x)).plus(b).eq(y.pow(2))) {
					candidates.push([x, y]);
					if (!y.eq(0)) {candidates.push([x, bigInt.zero.minus(y)])};
				}
			}
		}

		// Point at infinity
		candidates.push([NaN, NaN]);
		return candidates;
	}

	toString() {
		const [a, b] = this.coefficients;
		return 'y\u00B2 = x\u00B3 + ' + a.toString() + 'x + ' + b.toString();
	}
}

export default Curve;
export {ReducedCurve};
