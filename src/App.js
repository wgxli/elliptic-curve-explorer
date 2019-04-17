import React, {PureComponent} from 'react';

import MainView from './components/MainView/MainView.js';
import ControlBar from './components/ControlBar/ControlBar.js';

import './App.css';

/*
 * curve: An array of ten ints representing the currently shown elliptic curve.
 *        Each integer a_i is a coefficient in the equation
 *        a_0
 *        + a_1 x + a_2 y
 *        + a_3 x^2 + a_4 xy + a_5 y^2
 *        + a_6 x^3 + a_7 x^2 y + a_8 x y^2 + a_9 y^3 = 0.
 */

class App extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			curve: [0, 1, 0, 0, 0, 1, -1, 0, 0, 0, 0] // y^2 = x^3 - x
		}
	}

	render() {
		return (
			<div className='app'>
				<ControlBar curve={this.state.curve}/>
				<MainView/>
			</div>
		);
	}
}

export default App;
