import React, {PureComponent} from 'react';

import AppBar from '@material-ui/core/AppBar';
import {withStyles} from '@material-ui/core/styles';

import Equation from './Equation/Equation.js';
import './ControlBar.css';

const styles = {
	controlBar: {
		backgroundColor: 'white'
	}
}

class ControlBar extends PureComponent {
	render() {
		const classes = this.props.classes;
		return (
			<AppBar className={classes.controlBar}>
				<Equation coefficients={this.props.curve}/>
			</AppBar>
		);
	}
}

export default withStyles(styles)(ControlBar);
