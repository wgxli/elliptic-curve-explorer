import React from 'react';

import DisplayEquation from 'components/DisplayEquation.js';

import {renderFactorization} from 'math/display.js';

function Discriminant({curve}) {
    const {reduced} = curve;
    const {discriminant, discriminantFactorization} = reduced;

    var factorization = renderFactorization(
        reduced.discriminantFactorization);
    if (discriminant.lt(0)) {
        factorization = '-' + factorization;
    }

    return <div className='discriminant'>
    <h2>Discriminant</h2>
        <DisplayEquation fontSize={window.innerWidth > 600 ? 20 : 16}>
        \Delta =
        {discriminant}
        {discriminant.eq(0) ? ''
        : ('=' + factorization)}
    </DisplayEquation>
    </div>
}

export default Discriminant;
