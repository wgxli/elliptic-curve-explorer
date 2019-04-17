import bigInt from 'big-integer';


function renderCoefficient(n, hideUnit=true, first=false) {
	var sign = n.lt(0) ? '-' : '+';

	if (first && sign === '+') {
		sign = '';
	}

	if (n.lt(0)) {
		n = bigInt.zero.minus(n);
	}

	if (n.eq(1) && hideUnit) {
		n = '';
	}

	return [sign, n];
}


function renderTerm(n, monomial='', first=false) {
	n = bigInt(n);
	const [sign, coefficient] = renderCoefficient(
		n, (monomial !== ''), first);

	if (n.eq(0)) {
		return '';
	} else {
		return [sign, coefficient, monomial].join('');
	}
}

function renderPolynomial(coefficients, monomials, first=true) {
	const terms = []

	for (var i=0; i < coefficients.length; i++) {
		const term = renderTerm(coefficients[i], monomials[i], first);
		if (term !== '') {
			terms.push(term);
			first = false;
		}
	}
	return terms.join('');
}


export {
	renderCoefficient,
	renderTerm,
	renderPolynomial
};
