import React, {PureComponent} from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import './InfoCard.css';


class InfoCard extends PureComponent {
	render() {
		return (
			<Card className='info-card'>
				<Typography variant='h5' component='h2'>
					{this.props.title}
				</Typography>
				<CardContent>
					{this.props.children}
				</CardContent>
			</Card>
		);
	}
}

export default InfoCard;
