import BigRational from './bigRational.js';

/*
 * Represents a rational point on a reduced elliptic curve.
 *
 * The attributes x and y are BigRationals representing
 * the x and y coordinates of the curve.
 *
 * The point at infinity is represented by setting
 * x, y = NaN.
 */
class RationalPoint {
    constructor(reducedCurve, x, y) {
        this.curve = reducedCurve.reduced;
        if (Number.isNaN(x)) {
            this.x = NaN;
            this.y = NaN;
        } else {
            this.x = new BigRational(x);
            this.y = new BigRational(y);
        }
    }

    isIdentity() {
        return Number.isNaN(this.x);
    }

    /***** Group Operations *****/
    // All group operations assume that 'this'
    // and 'other' share the same elliptic curve!
    eq(other) {
        if (this.isIdentity()) {return other.isIdentity();}
        if (other.isIdentity()) {return this.isIdentity();}
        return this.x.eq(other.x) && this.y.eq(other.y);
    }

    plus(other) {
        // Check if either argument is identity
        if (this.isIdentity()) {return other;};
        if (other.isIdentity()) {return this;};

        // Check if other point is additive inverse
        if (this.x.eq(other.x) && this.y.negate().eq(other.y)) {
            return getIdentity(this.curve);
        }

        // Perform point addition
        const [a, b] = this.curve.coefficients.map((x) => new BigRational(x));

        // Construct line through points
        var slope;
        if (this.eq(other)) {
            // Construct tangent line
            // We don't need to worry about 2-torsion points since
            // we already checked for other = this.inverse()
            slope = this.x.pow(2).times(3).plus(a).divide(this.y.times(2));
        } else {
            // Construct secant line
            slope = other.y.minus(this.y).divide(other.x.minus(this.x));
        }
        const intercept = this.y.minus(slope.times(this.x));

        // Synthetic division to locate third point
        const cubic = substitute(a, b, slope, intercept);
        const quadratic = syntheticDivide(cubic, this.x)[0];
        const linear = syntheticDivide(quadratic, other.x)[0];
        const X = linear[0].negate();
        const Y = slope.times(X).plus(intercept).negate();
        return new RationalPoint(this.curve, X, Y);
    }

    inverse() {
        return new RationalPoint(this.curve, this.x, this.y.negate());
    }

    minus(other) {
        return this.plus(other.inverse());
    }

    // Integer multiplication (repeated addition)
    times(other) {
        if (other === 0) {return getIdentity(this.curve);}
        if (other < 0) {return this.inverse().times(Math.abs(other));}

        // Construct powers of two for efficiency
        var exponent = 0;
        var curr = this;
        const powers = [curr];

        while (other > Math.pow(2, exponent)) {
            exponent++;
            curr = curr.plus(curr);
            powers.push(curr);
        }

        // Compute answer
        var answer = getIdentity(this.curve);
        for (var i=0; i<=exponent; i++) {
            if ((other >> i) % 2 === 1) {
                answer = answer.plus(powers[i]);
            }
        }

        return answer;
    }

    /***** Group Theory *****/
    order() {
        var curr = this;
        for (let i = 1; i <= 12; i++) {
            if (curr.isIdentity()) {
                this.order = () => i;
                return i;
            }
            curr = curr.plus(this);
        }

        // By Mazur's theorem
        this.order = () => Infinity;
        return Infinity;
    }


    /***** Utility Functions *****/
    toString() {
        if (this.isIdentity()) {
            return '\u221E @ ' + this.curve.toString();
        } else {
            return '('
                + this.x.toString() + ', '
                + this.y.toString() + ') @ ' + this.curve.toString();
        }
    }
}

function getIdentity(curve) {
    return new RationalPoint(curve, NaN, NaN);
}

/*
 * Substitutes y = cx + d
 * into the curve y^2 = x^3 + ax + b.
 *
 * Returns [e, f, g] so that the
 * new equation can be written as
 * x^3 + ex^2 + fx + g = 0.
 *
 * All inputs and outputs are BigRationals.
 */
function substitute(a, b, c, d) {
    return [
        c.pow(2).negate(),
        a.minus(c.times(d).times(2)),
        b.minus(d.pow(2))
    ];
}

/*
 * Divides the monic polynomial
 * x^{n+1} + a_0 x^n + a_1 x^{n-1} + ... + a_n
 * by x-a.
 *
 * The 'coefficients' array should be an array of BigRationals
 * representing [a_0, ..., a_n].
 * The 'a' argument is a BigRational representing a.
 *
 * Outputs the coefficients of the quotient,
 * and the remainder.
 */
function syntheticDivide(coefficients, a) {
    coefficients = coefficients.map((x) => new BigRational(x));
    a = new BigRational(a);
    const output = [];
    var curr = new BigRational(1);

    for (var coefficient of coefficients) {
        curr = curr.times(a).plus(coefficient);
        output.push(curr);
    }
    const remainder = output.pop();
    return [output, remainder];
}


export default RationalPoint;
export {getIdentity, substitute, syntheticDivide};
