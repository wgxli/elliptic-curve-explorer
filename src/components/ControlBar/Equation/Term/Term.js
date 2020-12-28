import React, {PureComponent} from 'react';
import {InlineMath} from 'react-katex';

import bigInt from 'big-integer';

import {renderCoefficient} from 'math/display.js';


class Term extends PureComponent {
    constructor() {
        super();
        this.pointerDown = false;
    }

    handleWheel(e) {
        this.changeCoefficient((e.deltaY > 0) ? -1 : 1);
    }

    changeCoefficient(delta) {
        this.props.setCoefficient(this.props.coefficient.plus(bigInt(delta)));
    }

    render() {
        const [sign, coefficient] = renderCoefficient(
            this.props.coefficient,
            this.props.monomial !== '',
            this.props.first
        );


        var classes = 'equation-term';
        const faded = this.props.coefficient.eq(0);
        if (faded) {classes += ' faded';}
        return <span className={'term-wrapper' + (faded ? ' faded' : '')}>
            <InlineMath>{sign + '~'}</InlineMath>
            <span
                className={classes}
                onWheel={this.handleWheel.bind(this)}
            >
                <div
                  className='arrow-container up'
                    onClick={() => this.changeCoefficient(1)}><span className='arrow'/></div>
                <InlineMath>
                    {coefficient + this.props.monomial}
                </InlineMath>
                <div
                  className='arrow-container down'
                    onClick={() => this.changeCoefficient(-1)}><span className='arrow'/></div>
            </span>
        </span>;
    }
}

export default Term;
