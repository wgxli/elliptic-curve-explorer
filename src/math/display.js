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


function renderTerm(n, monomial, first=false) {
	const [sign, coefficient] = renderCoefficient(
		n, (monomial !== ''), first);

	if (n.eq(0)) {
		return '';
	} else {
		return [sign, coefficient, monomial].join('');
	}
}


export {
	renderCoefficient,
	renderTerm
};
