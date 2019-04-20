import React, {PureComponent} from 'react';

import Typography from '@material-ui/core/Typography';

import DisplayEquation from 'components/DisplayEquation.js';
import {renderPolynomial, renderFactorization} from 'math/display.js';
import {factor} from 'math/numberTheory.js';

import InfoCard, {ExpansionPanel} from '../InfoCard.js';


class Reduction extends PureComponent {
	render() {
		const reduced = this.props.curve.reduced;

		/***** Render Curve *****/
		const homogeneous = this.props.homogeneous;
		const curve_basis = homogeneous ? ['X^3', 'XZ^2', 'Z^3'] : ['X^3', 'X', ''];
		const [a, b] = reduced.coefficients;

		/***** Render Mapping *****/
		const map = reduced.map;
		const map_basis = homogeneous ? ['x', 'y', 'z'] : ['x', 'y', ''];
		const multiplier = (map.denominator.eq(1))
			? '' : `\\frac{1}{${map.denominator}}`;

		/***** Render Discriminant *****/
		const discriminant = reduced.discriminant;
		var factorization = renderFactorization(
			reduced.discriminantFactorization);
		if (discriminant.lt(0)) {
			factorization = '-' + factorization;
		}

		return (
			<InfoCard title='Reduced Form'>
				<DisplayEquation fontSize={28}>
						{homogeneous ? 'Y^2 Z' : 'Y^2'}
						=
						{renderPolynomial([1, a, b], curve_basis)}
				</DisplayEquation>
				<hr/>
				<Typography variant='caption'>Mapping</Typography>
				<DisplayEquation fontSize={20}>
					{homogeneous ? '[X, Y, Z]' : '(X, Y)'}
					=
					{multiplier + (homogeneous ? '[' : '(')}
					{renderPolynomial(
						map.coefficients.slice(0, 3), map_basis)}
					,
					{renderPolynomial(
						map.coefficients.slice(3, 6), map_basis)}
					{homogeneous ? ', z]' : ')'}
				</DisplayEquation>

				<Typography variant='caption'>Discriminant</Typography>
				<DisplayEquation fontSize={20}>
					{'\\begin{aligned}'}
						\Delta &=
						{discriminant}
						{discriminant.eq(0) ? ''
								: ('\\\\ &=' + factorization)}
					{'\\end{aligned}'}
				</DisplayEquation>
			</InfoCard>
		);
	}
}

export default Reduction;
