import React, {PureComponent} from 'react';

import Term from './Term/Term.js';
import './Equation.css';


const monomials = [
	'',
	'x', 'y',
	'x^2', 'xy', 'y^2',
	'x^3', 'x^2y', 'xy^2', 'y^3'
]

class Equation extends PureComponent {
	renderTerms() {
		const terms = [];
		for (var i=0; i<10; i++) {
			terms.push(
				<Term
					key={i}
					coefficient={this.props.coefficients[i]}
					monomial={monomials[i]}
					first={i === 0}
				/>);
		}
		return terms;
	}

	render() {
		return (
			<div className='main-equation'>
				{this.renderTerms()}
				=0
			</div>
		);
	}
}

export default Equation;
