import React, {PureComponent} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import MenuIcon from '@material-ui/icons/Menu';

import {withStyles} from '@material-ui/core/styles';

import Equation from './Equation/Equation.js';
import './ControlBar.css';

const styles = {
	appBar: {
		zIndex: 5000
	},
	controlBar: {
		backgroundColor: 'white',
		color: 'black',
		flexDirection: 'row',
	}
}

class ControlBar extends PureComponent {
	render() {
		const classes = this.props.classes;
		return (
			<AppBar className={classes.appBar}>
				<Toolbar className={classes.controlBar}>
					<IconButton onClick={this.props.handleMenuButton}>
						<MenuIcon/>
					</IconButton>
					<Equation
						coefficients={this.props.curve}
						setCoefficient={this.props.setCoefficient}
					/>
					<span>2D-3D Slider</span>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withStyles(styles)(ControlBar);
