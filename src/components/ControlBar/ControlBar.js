import React, {PureComponent} from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Switch from '@material-ui/core/Switch';

import {withStyles} from '@material-ui/core/styles';

import Equation from './Equation/Equation.js';
import './ControlBar.css';

const styles = theme => ({
    appBar: {
        zIndex: 5000
    },
    controlBar: {
        backgroundColor: 'white',
        color: 'black',
        flexDirection: 'row',
    }
});

class ControlBar extends PureComponent {
    render() {
        const {
            view3D, handle3DSwitch,
            curve, setCoefficient,
            classes
        } = this.props;

        return (
            <AppBar className={classes.appBar}>
                <Toolbar
                    className={classes.controlBar + ' control-bar'}
                    disableGutters
                >
                    <div className='equation-container'>
                        <Equation
                            coefficients={curve.coefficients}
                            setCoefficient={setCoefficient}
                            homogeneous={view3D}
                        />
                    </div>
                    <span className='options'>
                        2D
                        <Switch
                            checked={view3D}
                            onChange={handle3DSwitch}
                            color='primary'
                        />
                        3D
                    </span>
                    <div className='mobile-view-switcher'>
                        <div onClick={handle3DSwitch} className={
                            'entry' + (view3D ? '' : ' selected')
                        }>2D</div>
                        <div onClick={handle3DSwitch} className={
                            'entry' + (view3D ? ' selected' : '')
                        }>3D</div>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

export default withStyles(styles)(ControlBar);
