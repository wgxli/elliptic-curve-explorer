import React, {PureComponent} from 'react';

import bigInt from 'big-integer';

import ControlBar from './components/ControlBar/ControlBar.js';
import InfoPanel from './components/InfoPanel/InfoPanel.js';
//import HelpPanel from './components/HelpPanel/HelpPanel.js';
import MainView from './components/MainView/MainView.js';

import Curve from './math/curve.js';

import 'katex/dist/katex.min.css';

import {MuiThemeProvider} from '@material-ui/core/styles';
import theme from './theme.js';
import './App.css';


/*
 * curve: An array of six BigInts representing the currently shown elliptic curve.
 *        The array [a_1, a_2, a_3, a_4, a_6] represents
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
			infoPanelOpen: window.innerWidth > 800,
			view3D: false,
			helpPanelOpen: false
		}
	}

	toggleInfoPanel() {
		this.setState({infoPanelOpen: !this.state.infoPanelOpen});
	}

	toggleHelpPanel() {
		this.setState({helpPanelOpen: !this.state.helpPanelOpen});
	}

	toggle3DView() {
		this.setState({view3D: !this.state.view3D});
	}

	setCoefficient(i, v) {
		const curve = this.state.curve;
		curve[i] = v;
		this.setState({curve: [...curve]});
	}

	render() {
		const curve = new Curve(...this.state.curve);
		return (
			<MuiThemeProvider theme={theme}>
				<ControlBar
					curve={curve}
					setCoefficient={this.setCoefficient.bind(this)}

					handleMenuButton={this.toggleInfoPanel.bind(this)}
					handleHelpButton={this.toggleHelpPanel.bind(this)}

					view3D={this.state.view3D}
					handle3DSwitch={this.toggle3DView.bind(this)}
				/>
				<div className='content'>
					<InfoPanel
						curve={curve}
						open={this.state.infoPanelOpen}
						view3D={this.state.view3D}
					/>
					<MainView
						curve={curve}
						view3D={this.state.view3D}
					/>
				</div>
			</MuiThemeProvider>
		);
	}
}

export default App;
