import React, {PureComponent} from 'react';
import {InlineMath} from 'react-katex';

import Term from './Term/Term.js';
import './Equation.css';


const monomials = ['xy', 'y', 'x^2', 'x', ''];

class Equation extends PureComponent {
	getCoefficientSetter(i) {
		return (function(v) {
			this.props.setCoefficient(i, v);
		}).bind(this);
	}

	renderTerm(i) {
		return (
			<Term
				key={i}
				coefficient={this.props.coefficients[i]}
				monomial={monomials[i]}
				setCoefficient={this.getCoefficientSetter(i)}
			/>);
	}

	renderTerms() {
		const terms = [
			<InlineMath key={-1}>y^2</InlineMath>,
			this.renderTerm(0),
			this.renderTerm(1),
			<InlineMath key={-2}>= x^3</InlineMath>,
			this.renderTerm(2),
			this.renderTerm(3),
			this.renderTerm(4),
		];
		return terms;
	}

	render() {
		return (
			<div className='main-equation'>
					{this.renderTerms()}
			</div>
		);
	}
}

export default Equation;
