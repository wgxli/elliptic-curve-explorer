import React, {PureComponent} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';


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
				<Toolbar className={classes.controlBar + ' control-bar'}>
					<IconButton onClick={this.props.handleMenuButton}>
						<MenuIcon/>
					</IconButton>
					<div className='spacer'/>
					<div className='equation-container'>
						<Equation
							coefficients={this.props.curve}
							setCoefficient={this.props.setCoefficient}
							homogenous={this.props.view3D}
						/>
					</div>
					<span className='options'>
						2D
						<Switch
							checked={this.props.view3D}
							onChange={this.props.handle3DSwitch}
							color='primary'
						/>
						3D
					</span>
					<Button onClick={this.props.handleHelpButton}>
						Help
					</Button>
				</Toolbar>
			</AppBar>
		);
	}
}

export default withStyles(styles)(ControlBar);
