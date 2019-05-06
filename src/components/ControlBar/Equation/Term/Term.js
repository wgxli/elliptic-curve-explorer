import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import {InlineMath} from 'react-katex';

import bigInt from 'big-integer';

import {renderCoefficient} from 'math/display.js';


class Term extends PureComponent {
	constructor() {
		super();
		this.pointerDown = false;
	}

	handleWheel(e) {
		const delta = (e.deltaY > 0) ? bigInt(-1) : bigInt(1);
		this.props.setCoefficient(this.props.coefficient.plus(delta));
	}

	/* Number Scrubbing */
	handlePointerDown(e) {
		e.preventDefault();
		const node = ReactDOM.findDOMNode(this);
		node.setPointerCapture(e.pointerId);
		this.pointerDown = true;

		this.startCoefficient = this.props.coefficient;
		this.startX = e.clientX;
	}

	handlePointerMove(e) {
		if (!this.pointerDown) {return;}
		e.preventDefault();
		const deltaX = e.clientX - this.startX;
		const delta = bigInt(Math.round(deltaX / 10));
		this.props.setCoefficient(this.startCoefficient.plus(delta));
	}

	handlePointerUp(e) {
		e.preventDefault();
		const node = ReactDOM.findDOMNode(this);
		node.releasePointerCapture(e.pointerId);
		this.pointerDown = false;

		if (this.startX === e.clientX) {this.handleClick(e);}
	}

	/* Manual Entry */
	handleClick(e) {
		console.log('click');
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
				onPointerDown={this.handlePointerDown.bind(this)}
				onPointerMove={this.handlePointerMove.bind(this)}
				onPointerUp={this.handlePointerUp.bind(this)}
			>
				<InlineMath>
					{sign + '~' + coefficient + this.props.monomial}
				</InlineMath>
			</span>);
	}
}

export default Term;
