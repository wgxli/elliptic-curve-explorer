import bigInt from 'big-integer';

// Precompute small primes
const MAX = 300000;
const sieve = new Array(MAX).fill(true);

sieve[0] = false;
sieve[1] = false;
for (let i=2; i < Math.sqrt(MAX); i++) {
	if (sieve[i]) {
		for (let j = i*i; j < MAX; j+= i) {
			sieve[j] = false;
		}
	}
}

const small_primes = [];
for (let i=2; i < MAX; i++) {
	if (sieve[i]) {small_primes.push(bigInt(i));}
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
	if (n.lt(2)) {
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
