import bigInt from 'big-integer';


class BigRational {
	constructor(numerator, denominator=1) {
		if (numerator instanceof BigRational) {
			this.n = other.n;
			this.d = other.d;
		} else {
			this.n = bigInt(numerator);
			this.d = bigInt(denominator);
			if (this.d.lt(0)) {
				this.d = this.d.abs();
				this.n = bigInt.zero.minus(n);
			}
			this.reduce();
		}
	}

	reduce() {
		const gcd = bigInt.gcd(this.d, this.n);
		this.n = this.n.divide(gcd);
		this.d = this.d.divide(gcd);
	}


	/***** Unary Arithmetic Operators *****/
	negate() {
		return new BigRational(bigInt.zero.minus(this.n), this.d);
	}

	reciprocal() {
		return new BigRational(this.d, this.n);
	}


	/***** Binary Arithmetic Operators *****/
	plus(other) {
		return new BigRational(
			this.n.times(other.d).plus(this.d.times(other.n)),
			this.d.times(other.d)
		);
	}

	minus(other) {
		return this.plus(other.negate());
	}

	times(other) {
		return new BigRational(this.n.times(other.n), this.d.times(other.d));
	}

	divide(other) {
		return this.times(other.reciprocal());
	}


	/***** Comparison Operators *****/
	eq(other) {
		// Assume this and other are reduced
		return this.n.eq(other.n) && this.d.eq(other.d);
	}

	gt(other) {
		return this.n.times(other.d).gt(other.n.times(this.d));
	}

	lt(other) {
		return other.gt(this);
	}

	gte(other) {return this.gt(other) || this.eq(other);}
	lte(other) {return this.lt(other) || this.eq(other);}


	/***** Utility Functions *****/
	toString() {
		return this.n.toString() + '/' + this.d.toString();
	}
}

export default BigRational;
