import React from 'react';

import DisplayEquation from 'components/DisplayEquation.js';

import {renderPolynomial} from 'math/display.js';


function ReducedForm({curve, homogeneous}) {
    const {reduced} = curve;
    const curve_basis = homogeneous ? ['X^3', 'XZ^2', 'Z^3'] : ['X^3', 'X', ''];
    const [a, b] = reduced.coefficients;

    const map = reduced.map;
    const map_basis = homogeneous ? ['x', 'y', 'z'] : ['x', 'y', ''];
    const multiplier = (map.denominator.eq(1))
        ? '' : `\\frac{1}{${map.denominator}}`;

    return <div>
        <h2>Reduced Form</h2>
        <DisplayEquation fontSize={window.innerWidth > 600 ? 18 : 14}>
            {homogeneous ? 'Y^2 Z' : 'Y^2'}
            =
            {renderPolynomial([1, a, b], curve_basis)}
        </DisplayEquation>
        <div className='faded'>
        <DisplayEquation fontSize={window.innerWidth > 600 ? 12 : 11}>
            {homogeneous ? '[X:Y:Z]' : '(X, Y)'}
            :=
            {multiplier + (homogeneous ? '[' : '(')}
            {renderPolynomial(
                map.coefficients.slice(0, 3), map_basis)}
            {homogeneous ? ':' : ','}
            {renderPolynomial(
                map.coefficients.slice(3, 6), map_basis)}
            {homogeneous ? ':z]' : ')'}
        </DisplayEquation>
        </div>
    </div>;
}

export default ReducedForm;
