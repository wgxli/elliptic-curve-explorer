import {randomBigRational} from './testUtils.js';
import BigRational from './bigRational.js';

import Curve from './curve.js';
import RationalPoint, {
	getIdentity,
	substitute,
	syntheticDivide
} from './rationalPoint.js';


const curve = new Curve(0, 0, 0, 0, 1);
const a = new RationalPoint(curve, 2, 3);
const b = new RationalPoint(curve, 0, 1);
const c = new RationalPoint(curve, -1, 0);

function randomCurve() {
	return [curve, a, b, c];
}

/***** Group Axioms *****/
it('group law is commutative', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.plus(b)).toEqual(b.plus(a));
});

it('group law is associative', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.plus(b.plus(c))).toEqual(a.plus(b).plus(c));
});

it('additive inverse', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.minus(a)).toEqual(getIdentity(curve));
});

it('identity is identity', () => {
	const [curve, a, b, c] = randomCurve();
	expect(getIdentity(curve).isIdentity()).toBe(true);
});

/***** Addition *****/
it('explicit verification for simple curve', () => {
	const curve = new Curve(0, 0, 0, 0, 1);
	const a = new RationalPoint(curve, 2, 3);
	const b = new RationalPoint(curve, 0, 1);
	const c = new RationalPoint(curve, -1, 0);
	expect(a.plus(b)).toEqual(c);
});

/***** Multiplication *****/
it('zero property of multiplication', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.times(0)).toEqual(getIdentity(curve));
});

it('unit property of multiplication', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.times(1)).toEqual(a);
});

it('distributive property of multiplication', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.plus(b).times(7)).toEqual(a.times(7).plus(b.times(7)));
});

it('explicit verification of multiplication', () => {
	const [curve, a, b, c] = randomCurve();
	expect(a.times(5)).toEqual(a.plus(a).plus(a).plus(a).plus(a));
});

/***** Group Theory *****/
it('explicit verification for simple curve', () => {
	const curve = new Curve(0, 0, 0, 0, 1);
	const a = new RationalPoint(curve, 2, 3);
	const b = new RationalPoint(curve, 0, 1);
	const c = new RationalPoint(curve, -1, 0);
	expect(a.order()).toBe(6);
	expect(b.order()).toBe(3);
	expect(c.order()).toBe(2);
});

/***** Helper Functions *****/
it('explicit synthetic division test', () => {
	const coefficients = [3, 5, 2, 43, 6];
	const expected = [10, 75, 527, 3732].map((x) => new BigRational(x));

	const [answer, remainder] = syntheticDivide(coefficients, 7);
	expect(answer).toEqual(expected);
	expect(remainder).toEqual(new BigRational(26130));
});
