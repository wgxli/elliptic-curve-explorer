import React, {PureComponent} from 'react';
import Drawer from '@material-ui/core/Drawer';
import {withStyles} from '@material-ui/core/styles';

import Reduction from './cards/Reduction.js';
import GroupStructure from './cards/GroupStructure.js';


const styles = (theme) => ({
	infoPanelPaper: {
		backgroundColor: '#EEE',
		width: 400,
		maxWidth: '100%'
	},
	toolbar: theme.mixins.toolbar
});

class InfoPanel extends PureComponent {
	render() {
		const classes = this.props.classes;
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
					curve={this.props.curve}
					homogeneous={this.props.view3D}
				/>
				<GroupStructure
					curve={this.props.curve}
					homogeneous={this.props.view3D}
				/>
			</Drawer>
		);
	}
}

export default withStyles(styles, {withTheme: true})(InfoPanel);