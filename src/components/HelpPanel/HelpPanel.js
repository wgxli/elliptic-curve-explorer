import React, {PureComponent} from 'react';
import Drawer from '@material-ui/core/Drawer';
import {withStyles} from '@material-ui/core/styles';


const styles = (theme) => ({
	helpPanelPaper: {
		backgroundColor: '#EEE'
	},
	toolbar: theme.mixins.toolbar
});

class HelpPanel extends PureComponent {
	render() {
		const classes = this.props.classes;

		return (
			<Drawer
				open={this.props.open}
				variant='persistent'
				anchor='right'
				className={classes.helpPanel}
				classes={{
					paper: classes.helpPanelPaper
				}}
			>
				<div className={classes.toolbar}/>
				Help text goes here
			</Drawer>
		);
	}
}

export default withStyles(styles, {withTheme: true})(HelpPanel);
