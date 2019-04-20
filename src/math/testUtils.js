import bigInt from 'big-integer';
import BigRational from './bigRational.js';

function randomBigInt() {
	const DIGITS = 20;
	const digits = [];

	if (Math.random() < 0.5) {
		digits.push('-');
	}
	for (var i = 0; i < DIGITS; i++) {
		digits.push(Math.floor(Math.random() * 9.9999));
	}
	return bigInt(digits.join(''));
}

function randomBigRational() {
	return new BigRational(randomBigInt(), randomBigInt().abs().plus(1));
}

export {
	randomBigInt,
	randomBigRational
};
