/*
 * Represents a rational point on an elliptic curve.
 */
class RationalPoint {
	constructor(curve, x, y) {
		this.curve = curve;
		this.x = x;
		this.y = y;
	}
}

export default RationalPoint;
