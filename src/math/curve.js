import bigInt from 'big-integer';

import reduceFull from './reduce.js';
import {factor} from './numberTheory.js';


/*
 * Represents an elliptic curve with equation
 * y^2 + axy + cy = x^3 + bx^2 + dx + e.
 */
class Curve {
	constructor(...coefficients) {
		this.coefficients = coefficients.map((x) => bigInt(x));
		this.computeReduction();
	}

	computeReduction() {
		const [curve, map] = reduceFull(this.coefficients);
		this.reduced = new ReducedCurve(curve, map);
	}

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

		this.computeDiscriminant();
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

	toString() {
		const [a, b] = this.coefficients;
		return 'y\u00B2 = x\u00B3 + ' + a.toString() + 'x + ' + b.toString();
	}
}

export default Curve;
export {ReducedCurve};
