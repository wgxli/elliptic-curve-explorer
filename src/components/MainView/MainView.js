import React, {PureComponent} from 'react';
import renderScene, {updateCurve, set3D} from './render.js';
import './MainView.css';

class MainView extends PureComponent {
	componentDidMount() {
		renderScene();
		this.update();
	}

	update() {
		set3D(this.props.view3D);
		updateCurve(this.props.curve);
	}

	render() {
		this.update();
		return <canvas id='main-view'/>;
	}
}

export default MainView;
