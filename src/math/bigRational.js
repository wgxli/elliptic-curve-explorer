import bigInt from 'big-integer';


class BigRational {
	constructor(numerator, denominator=1) {
		if (numerator instanceof BigRational) {
			this.n = numerator.n;
			this.d = numerator.d;
		} else {
			this.n = bigInt(numerator);
			this.d = bigInt(denominator);
			if (this.d.lt(0)) {
				this.d = this.d.abs();
				this.n = bigInt.zero.minus(this.n);
			}
			this.reduce();
		}
	}

	reduce() {
		if (this.d.eq(1)) {return;}
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
		other = new BigRational(other);
		return new BigRational(this.n.times(other.n), this.d.times(other.d));
	}

	divide(other) {
		return this.times(other.reciprocal());
	}

	pow(other) {
		if (other === 0) {return new BigRational(1)};
		if (other < 0) {return this.reciprocal().pow(Math.abs(other))};

		// Construct powers of two for efficiency
		var exponent = 0;
		var curr = this;
		const powers = [curr];

		while (other > Math.pow(2, exponent)) {
			exponent++;
			curr = curr.times(curr);
			powers.push(curr);
		}

		// Compute answer
		var answer = new BigRational(1);
		for (var i=0; i <= exponent; i++) {
			if ((other >> i) % 2 === 1) {
				answer = answer.times(powers[i]);
			}
		}

		return answer;
	}


	/***** Comparison Operators *****/
	eq(other) {
		other = new BigRational(other);
		return this.n.eq(other.n) && this.d.eq(other.d);
	}

	gt(other) {
		other = new BigRational(other);
		return this.n.times(other.d).gt(other.n.times(this.d));
	}

	lt(other) {
		return other.gt(this);
	}

	gte(other) {return this.gt(other) || this.eq(other);}
	lte(other) {return this.lt(other) || this.eq(other);}


	/***** Utility Functions *****/
	toString() {
		if (this.d.eq(1)) {
			return this.n.toString();
		} else {
			return this.n.toString() + '/' + this.d.toString();
		}
	}
}

export default BigRational;
