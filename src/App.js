import React, {PureComponent} from 'react';

import bigInt from 'big-integer';

import ControlBar from './components/ControlBar/ControlBar.js';
import InfoPanel from './components/InfoPanel/InfoPanel.js';
import HelpPanel from './components/HelpPanel/HelpPanel.js';
import MainView from './components/MainView/MainView.js';

import './App.css';

/*
 * curve: An array of six BigInts representing the currently shown elliptic curve.
 *        The array [a_1, a_2, a_3, a_4, a_6] represent
 *        coefficients in the Weierstrass equation
 *        y^2 + a_1 xy + a_3 y = x^3 + a_2 x^2 + a_4 x + a_6.
 */

class App extends PureComponent {
	constructor(props) {
		super(props);

		// y^2 = x^3 - x
		const initialCurve = [0, 0, 0, -1, 0];

		this.state = {
			curve: initialCurve.map((x) => bigInt(x)),
			infoPanelOpen: true,
			view3D: false,
			helpPanelOpen: false
		}
	}

	toggleInfoPanel() {
		this.setState({infoPanelOpen: !this.state.infoPanelOpen});
	}

	setCoefficient(i, v) {
		const curve = this.state.curve;
		curve[i] = v;
		this.setState({curve: [...curve]});
	}

	render() {
		return (
			<div className='app'>
				<ControlBar
					curve={this.state.curve}
					setCoefficient={this.setCoefficient.bind(this)}
					handleMenuButton={this.toggleInfoPanel.bind(this)}
				/>
				<div className='content'>
					<InfoPanel
						open={this.state.infoPanelOpen}
						curve={this.state.curve}
					/>
					<MainView/>
					<HelpPanel
						open={this.state.helpPanelOpen}
					/>
				</div>
			</div>
		);
	}
}

export default App;
