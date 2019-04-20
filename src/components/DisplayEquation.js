import React, {PureComponent} from 'react';

import {InlineMath} from 'react-katex';


class DisplayEquation extends PureComponent {
	render() {
		var latex;
		if (typeof this.props.children.map === 'undefined') {
			latex = this.props.children.toString();
		} else {
			latex = this.props.children.map((x) => x.toString()).join('');
		}

		return (
			<div
				className='display-equation'
				style={{
					fontSize: this.props.fontSize,
					overflowX: 'auto',
					overflowY: 'hidden',
					width: '100%',
					whiteSpace: 'nowrap'
				}}
			>
				<InlineMath math={latex}/>
			</div>
		);
	}
}

export default DisplayEquation;
