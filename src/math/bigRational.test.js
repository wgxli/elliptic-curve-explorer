import {randomBigInt, randomBigRational} from './testUtils.js';
import BigRational from './bigRational.js';



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
