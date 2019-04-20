import Curve from './curve.js';

it('check torsion points for small curve', () => {
	const curve = new Curve(0, 0, 0, 0, 1);
	expect(curve.reduced.torsionPoints.length).toBe(6);
});
