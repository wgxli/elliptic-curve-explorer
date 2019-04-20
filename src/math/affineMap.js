import bigInt from 'big-integer';
import BigRational from './bigRational.js';

/*
 * Represents the affine map
 *
 * (x, y) -> (
 *     a_x * x + b_x * y + c_x,
 *     a_y * x + b_y * y + c_y
 * ).
 */
class AffineMap {
	/*
	 * Coefficients are [a_x, b_x, c_x, a_y, b_y, c_y],
	 * in that order.
	 *
	 * All coefficients are implicitly divided by 'denominator'.
	 * This allows the use of bigInt arithmetic.
	 *
	 * Precondition: denominator is nonzero
	 */
	constructor(coefficients, denominator=1) {
		this.coefficients = coefficients.map((x) => bigInt(x));
		this.denominator = bigInt(denominator);
		if (this.denominator.lt(0)) {
			this.denominator = this.denominator.abs();
			this.coefficients = this.coefficients.map((x) => bigInt.zero.minus(x));
		}
		this.reduce();
	}
	
	reduce() {
		var gcd = this.denominator;

		for (var coefficient of this.coefficients) {
			gcd = bigInt.gcd(gcd, coefficient);
		}

		this.denominator = this.denominator.divide(gcd);
		for (var i = 0; i < 6; i++) {
			this.coefficients[i] = this.coefficients[i].divide(gcd);
		}
	}

	compose(other) {
		const [a, b, c, d, e, f] = this.coefficients;
		const [A, B, C, D, E, F] = other.coefficients

		return new AffineMap([
			a.times(A).plus(b.times(D)),
			a.times(B).plus(b.times(E)),
			a.times(C).plus(b.times(F)).plus(c.times(other.denominator)),
			d.times(A).plus(e.times(D)),
			d.times(B).plus(e.times(E)),
			d.times(C).plus(e.times(F)).plus(f.times(other.denominator))
		], this.denominator.times(other.denominator));
	}

	inverse() {
		const [a, b, c, d, e, f] = this.coefficients;
		const determinant = a.times(e).minus(b.times(d));
		const den = this.denominator;

		const coefficients = [
			e.times(den),
			bigInt.zero.minus(b).times(den),
			b.times(f).minus(c.times(e)),
			bigInt.zero.minus(d).times(den),
			a.times(den),
			c.times(d).minus(a.times(f)),
		];

		return new AffineMap(coefficients, determinant);
	}

	transformFloat(x, y) {
		const [a, b, c, d, e, f] = this.coefficients.map(
			(x) => x.toJSNumber()
		);
		const den = this.denominator.toJSNumber();
		return [
			(a*x + b*y + c)/den,
			(d*x + e*y + f)/den
		];
	}

	transformBigRational(x, y) {
		const [a, b, c, d, e, f] = this.coefficients.map(
			(x) => new BigRational(x)
		);
		const den = new BigRational(this.denominator);
		return [
			a.times(x).plus(b.times(y)).plus(c).divide(den),
			d.times(x).plus(e.times(y)).plus(f).divide(den),
		];
	}

	toString() {
		const [a, b, c, d, e, f] = this.coefficients;
		const D = this.denominator;

		const mapString = `(x, y) -> (${a}x + ${b}y + ${c}, ${d}x + ${e}y + ${f})`;
		if (D.eq(1)) {
			return mapString;
		} else {
			return mapString + ' / ' + D.toString();
		}
	}
}

const IdentityMap = new AffineMap([1, 0, 0, 0, 1, 0]);

export default AffineMap;
export {IdentityMap};
