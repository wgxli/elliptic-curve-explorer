import React, {PureComponent} from 'react';

import {BlockMath} from 'react-katex';
import {renderTerm} from 'math/display.js';

import InfoCard from '../InfoCard.js';


class Reduction extends PureComponent {
	render() {
		const [a, b] = this.props.reducedCurve;

		return (
			<InfoCard title='Reduced Form'>
				<div className='display-equation'>
					<BlockMath>
					{
						'y^2 = x^3'
						+ renderTerm(a, 'x')
						+ renderTerm(b, '')
					}
					</BlockMath>
				</div>
			</InfoCard>
		);
	}
}

export default Reduction;
