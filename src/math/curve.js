/***** This file acts as a cache for computationally-intensive elliptic curve properties. *****/
import reduce_full from './reduce.js';
import {factor} from './numberTheory.js';



/***** Cached Properties *****/
var curve = [];
var reduced = {};


/***** Update Methods *****/

/* 
 * Update the current elliptic curve
 * and recompute all its derived properties.
 */
function update(newCurve) {
	curve = newCurve;

	[reduced.curve, reduced.map] = reduce_full(curve);
	const [a, b] = reduced.curve
	reduced.discriminant = a.pow(3).times(4).plus(
		b.pow(2).times(27)).times(-16);
	reduced.discriminantFactorization = factor(reduced.discriminant.abs());
}

export {
	update,
	curve, reduced,
};
