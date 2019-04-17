import React, {PureComponent} from 'react';
import {InlineMath} from 'react-katex';

import bigInt from 'big-integer';

import './Term.css';

class Term extends PureComponent {
	handleWheel(e) {
		const coefficient = this.props.coefficient;
		const absCoefficient = coefficient.abs();

		var delta;
		if ((e.deltaY > 0) === coefficient.gt(0)) {
			delta = absCoefficient.divide(11);
		} else {
			delta = absCoefficient.divide(10);
		}

		delta = delta.add(1);

		if (e.deltaY > 0) {
			delta = bigInt.zero.minus(delta);
		}

		this.props.setCoefficient(coefficient.add(delta));
	}

	render() {
		var coefficient = this.props.coefficient;

		var sign = coefficient.lt(0) ? '-' : '+';
		if (this.props.first && sign === '+') {
			sign = '';
		}

		if (coefficient.lt(0)) {
			coefficient = bigInt.zero.minus(coefficient);
		}

		if (coefficient.eq(1) && this.props.monomial !== '') {
			coefficient = '';
		}

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
