import React, {PureComponent} from 'react';

import AppBar from '@material-ui/core/AppBar';
import {withStyles} from '@material-ui/core/styles';

import Equation from './Equation/Equation.js';
import './ControlBar.css';

const styles = {
	controlBar: {
		backgroundColor: 'white',
		color: 'black',
		flexDirection: 'row'
	}
}

class ControlBar extends PureComponent {
	render() {
		const classes = this.props.classes;
		return (
			<AppBar className={classes.controlBar}>
				<span>left menu</span>
				<Equation
					coefficients={this.props.curve}
					setCoefficient={this.props.setCoefficient}
				/>
				<span>2D-3D Slider</span>
			</AppBar>
		);
	}
}

export default withStyles(styles)(ControlBar);
