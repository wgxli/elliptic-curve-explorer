import bigInt from 'big-integer';

// Precompute small primes
const small_primes = [];
for (var i=2; i < 300000; i++) {
	if (bigInt(i).isProbablePrime()) {
		small_primes.push(bigInt(i));
	}
}

/*
 * Factors an integer n.
 *
 * Returns an array of tuples (p_i, e_i),
 * so that n = product(p_i ^ e_i),
 * the p_i are prime,
 * and all e_i > 0.
 *
 * For performance reasons,
 * factorization may be inaccurate
 * if n contains prime divisors
 * with more than 12 digits.
 */
function factor(n) {
	n = bigInt(n);
	if (n.lt(1)) {
		return [];
	}

	const factorization = [];

	for (var prime of small_primes) {
		var exponent = 0;
		while (n.isDivisibleBy(prime)) {
			exponent++;
			n = n.divide(prime);
		}

		if (exponent > 0) {
			factorization.push([prime, exponent]);
		}

		if (prime.pow(2).gt(n)) {
			break;
		}
	}
	if (n.gt(1)) {
		factorization.push([n, 1]);
	}
	return factorization;
}

export {factor};
