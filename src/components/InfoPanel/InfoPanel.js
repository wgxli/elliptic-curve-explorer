import React, {PureComponent} from 'react';
import Drawer from '@material-ui/core/Drawer';
import {withStyles} from '@material-ui/core/styles';

import Reduction from './cards/Reduction.js';

import './InfoPanel.css';

import reduce_full from 'math/reduce.js';


const styles = (theme) => ({
	infoPanelPaper: {
		backgroundColor: '#EEE'
	},
	toolbar: theme.mixins.toolbar
});

class InfoPanel extends PureComponent {
	render() {
		const classes = this.props.classes;
		const [reducedCurve, map] = reduce_full(this.props.curve);

		return (
			<Drawer
				open={this.props.open}
				variant='persistent'
				className={classes.infoPanel}
				classes={{
					paper: classes.infoPanelPaper
				}}
			>
				<div className={classes.toolbar}/>
				<Reduction
					reducedCurve={reducedCurve}
					map={map}
					homogenous={this.props.view3D}
				/>
			</Drawer>
		);
	}
}

export default withStyles(styles, {withTheme: true})(InfoPanel);
