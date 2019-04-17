import React, {PureComponent} from 'react';

import Typography from '@material-ui/core/Typography';

import {BlockMath} from 'react-katex';
import {renderPolynomial} from 'math/display.js';

import InfoCard, {ExpansionPanel} from '../InfoCard.js';


class Reduction extends PureComponent {
	render() {
		const homogenous = this.props.homogenous;

		const map = this.props.map.coefficients;
		const map_basis = homogenous ? ['x', 'y', 'z'] : ['x', 'y', ''];
		const multiplier = (this.props.map.denominator.eq(1)) ? '' : `\\frac{1}{${this.props.map.denominator}}`;

		const curve_basis = homogenous ? ['X^3', 'XZ^2', 'Z^3'] : ['X^3', 'X', ''];

		return (
			<InfoCard title='Reduced Form'>
				<div className='display-equation' style={{fontSize: 28}}>
					<BlockMath>
					{
						(homogenous ? 'Y^2 Z' : 'Y^2')
						+ ' = '
						+ renderPolynomial([1, ...this.props.reducedCurve], curve_basis)
					}
					</BlockMath>
				</div>
				<hr/>
				<div className='display-equation' style={{fontSize: 20}}>
				<BlockMath>
					{
						(homogenous ? '[X, Y, Z]' : '(X, Y)')
						+ ' = '
						+ multiplier + (homogenous ? '[' : '(')
						+ renderPolynomial(map.slice(0, 3), map_basis)
						+ ', '
						+ renderPolynomial(map.slice(3, 6), map_basis)
						+ (homogenous ? ', z]' : ')')
					}
				</BlockMath>
				</div>
			</InfoCard>
		);
	}
}

export default Reduction;
