import {randomBigRational} from './testUtils.js';
import BigRational from './bigRational.js';


/***** Field Axioms *****/
it('additive inverse', () => {
	const a = randomBigRational();
	const zero = new BigRational(0);
	expect(a.minus(a)).toEqual(zero);
});

it('multiplicative inverse', () => {
	const a = randomBigRational();
	const one = new BigRational(1);
	expect(a.divide(a)).toEqual(one);
});

it('zero property of multiplication', () => {
	const a = randomBigRational();
	const zero = new BigRational(0);
	expect(a.times(zero)).toEqual(zero);
});

it('unit property of multiplication', () => {
	const a = randomBigRational();
	const one = new BigRational(1);
	expect(a.times(one)).toEqual(a);
});

it('multiplication distributes over addition', () => {
	const a = randomBigRational();
	const b = randomBigRational();
	const c = randomBigRational();
	expect(a.times(b.plus(c))).toEqual(a.times(b).plus(a.times(c)));
});

/***** Exponentiation *****/
it('zero exponent', () => {
	const a = randomBigRational();
	expect(a.pow(0)).toEqual(new BigRational(1));
});

it('negative exponents behave as expected', () => {
	const a = randomBigRational();
	expect(a.pow(-7).reciprocal()).toEqual(a.pow(7));
});

it('explicitly check small exponent', () => {
	const a = randomBigRational();
	expect(a.pow(-1)).toEqual(a.reciprocal());
	expect(a.pow(1)).toEqual(a);
	expect(a.pow(2)).toEqual(a.times(a));
	expect(a.pow(5)).toEqual(a.times(a).times(a).times(a).times(a));
});
