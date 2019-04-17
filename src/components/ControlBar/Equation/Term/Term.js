import React, {PureComponent} from 'react';
import {InlineMath} from 'react-katex';

import bigInt from 'big-integer';

import {renderCoefficient} from 'math/display.js';

import './Term.css';


class Term extends PureComponent {
	handleWheel(e) {
		const delta = (e.deltaY > 0) ? bigInt(-1) : bigInt(1);
		this.props.setCoefficient(this.props.coefficient.add(delta));
	}

	render() {
		const [sign, coefficient] = renderCoefficient(
			this.props.coefficient,
			this.props.monomial !== '',
			this.props.first
		);


		var classes = 'equation-term';
		if (this.props.coefficient.eq(0)) {
			classes += ' faded';
		}
		return (
			<span
				className={classes}
				onWheel={this.handleWheel.bind(this)}
			>
				<InlineMath>
					{sign + '\\,' + coefficient + this.props.monomial}
				</InlineMath>
			</span>);
	}
}

export default Term;
