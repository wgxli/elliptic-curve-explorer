import React, {PureComponent} from 'react';

import katex from 'katex';

import './Term.css';

class Term extends PureComponent {
	render() {
		var coefficient = this.props.coefficient;

		var sign = coefficient < 0 ? '-' : '+';
		if (this.props.first) {
			sign = '';
		}

		coefficient = Math.abs(coefficient);
		if (coefficient === 1) {
			coefficient = '';
		}

		var classes = 'equation-term';
		if (this.props.coefficient === 0) {
			classes += ' faded';
		}
		return (<span className={classes}>
			{sign}
			{coefficient}
			{this.props.monomial}
		</span>);
	}
}

export default Term;
