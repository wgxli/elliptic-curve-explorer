import React, {PureComponent} from 'react';
import {InlineMath} from 'react-katex';

import Term from './Term/Term.js';
import './Equation.css';


const affine_monomials = [
	'y^2', 'xy', 'y',
	'x^3', 'x^2', 'x', ''];
const homogeneous_monomials = [
	'y^2z', 'xyz', 'yz^2',
	'x^3', 'x^2z', 'xz^2', 'z^3'];

class Equation extends PureComponent {
	getCoefficientSetter(i) {
		return (function(v) {
			this.props.setCoefficient(i, v);
		}).bind(this);
	}

	renderTerm(i, monomial) {
		return (
			<Term
				key={i}
				coefficient={this.props.coefficients[i]}
				monomial={monomial}
				setCoefficient={this.getCoefficientSetter(i)}
			/>);
	}

	renderTerms() {
		const monomials = this.props.homogeneous ? homogeneous_monomials : affine_monomials;
		const mobileBreak = <span key='mobileBreak' className='mobile-break'/>;

		const terms = [
			<InlineMath key={-1}>{monomials[0]}</InlineMath>,
			this.renderTerm(0, monomials[1]),
			this.renderTerm(2, monomials[2]),
			mobileBreak,
			<InlineMath key={-2}>{`~= ${monomials[3]}`}</InlineMath>,
			this.renderTerm(1, monomials[4]),
			this.renderTerm(3, monomials[5]),
			this.renderTerm(4, monomials[6]),
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
