import React, {PureComponent} from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import {withStyles} from '@material-ui/core/styles';

import './InfoCard.css';

const styles = (theme) => ({
	expandButton: {
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.short
		})
	},
	expandClosed: {
		transform: 'rotate(0deg)',
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},

	buttonContainer: {
		display: 'flex'
	},
	spacer: {
		flexGrow: 1
	}
});


class InfoCard extends PureComponent {
	render() {
		return (
			<Card className='info-card'>
				<CardContent>
					<Typography variant='h5' component='h2' gutterBottom>
						{this.props.title}
					</Typography>
					{this.props.children}
				</CardContent>
			</Card>
		);
	}
}

class ExpansionPanel extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {expanded: false};
	}

	toggleOpen() {
		this.setState({expanded: !this.state.expanded});
	}

	render() {
		const classes = this.props.classes;

		return (
			<div>
				<div className={classes.buttonContainer}>
					<div className={classes.spacer}/>
					<IconButton
						className={
							classes.expandButton
							+ ' ' + (this.state.expanded ?
							classes.expandOpen : classes.expandClosed)
						}
						onClick={this.toggleOpen.bind(this)}
					>
						<ExpandMoreIcon/>
					</IconButton>
				</div>
				<Collapse in={this.state.expanded}>
					{this.props.children}
				</Collapse>
			</div>
		);
	}
}

const S_ExpansionPanel = withStyles(styles)(ExpansionPanel);

export default InfoCard;
export {S_ExpansionPanel as ExpansionPanel};
