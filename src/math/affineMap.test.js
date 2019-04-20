import {randomBigInt} from './testUtils.js';
import AffineMap, {IdentityMap} from './affineMap.js';


function randomMap() {
	const coefficients = [];
	for (var i=0; i<6; i++) {
		coefficients.push(randomBigInt());
	}
	return new AffineMap(coefficients, randomBigInt().abs().plus(1));
}


it('reduced upon construction', () => {
	const a = new AffineMap([6, 12, 18, 24, 30, 36], 9);
	const b = new AffineMap([2, 4, 6, 8, 10, 12], 3);
	expect(a).toEqual(b);
});

it('negative denominator flipped upon construction', () => {
	const a = new AffineMap([1, 2, 3, 4, 5, 6], -12);
	const b = new AffineMap([-1, -2, -3, -4, -5, -6], 12);
	expect(a).toEqual(b);
});

it('identity behaves correctly under composition', () => {
	expect(IdentityMap.compose(IdentityMap)).toEqual(IdentityMap);

	const map = randomMap();
	expect(map.compose(IdentityMap)).toEqual(map);
	expect(IdentityMap.compose(map)).toEqual(map);
});

it('composition is associative', () => {
	const a = randomMap();
	const b = randomMap();
	const c = randomMap();
	expect(a.compose(b.compose(c))).toEqual(a.compose(b).compose(c));
});

it('identity is self-inverse', () => {
	expect(IdentityMap.inverse()).toEqual(IdentityMap);
});

it('inverse is the inverse', () => {
	const map = randomMap();
	const inverse = map.inverse();
	expect(map.compose(inverse)).toEqual(IdentityMap);
	expect(inverse.compose(map)).toEqual(IdentityMap);
});

it('inverse is an involution', () => {
	const map = randomMap();
	expect(map.inverse().inverse()).toEqual(map);
});

it('inverse of composition', () => {
	const a = randomMap();
	const b = randomMap();
	expect(a.compose(b).inverse()).toEqual(b.inverse().compose(a.inverse()));
});

it('transformFloat transforms correctly', () => {
	const a = Math.random();
	const b = Math.random();
	const map = new AffineMap([1, 2, 3, 4, 5, 6], 7);

	const [c, d] = map.transformFloat(a, b);

	expect(c).toBeCloseTo((a + 2*b + 3)/7);
	expect(d).toBeCloseTo((4*a + 5*b + 6)/7);
});

it('composition and transformFloat commute', () => {
	const a = Math.random();
	const b = Math.random();
	const A = randomMap();
	const B = randomMap();

	const [x0, y0] = B.transformFloat(...A.transformFloat(a, b));
	const [x1, y1] = B.compose(A).transformFloat(a, b);

	expect(x0).toBeCloseTo(x1);
	expect(y0).toBeCloseTo(y1);
});
