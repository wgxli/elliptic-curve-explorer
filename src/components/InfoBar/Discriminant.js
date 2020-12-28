import React from 'react';

import DisplayEquation from 'components/DisplayEquation.js';

import {renderFactorization} from 'math/display.js';

function Discriminant({curve}) {
    const {reduced} = curve;
    const {discriminant, discriminantFactorization} = reduced;

    let factorization = renderFactorization(discriminantFactorization);
    if (discriminant.lt(0)) {
        factorization = '-' + factorization;
    }
    if (discriminant.eq(0)) {
        factorization = '0';
    }

    return <div className='discriminant'>
    <h2>Discriminant</h2>
        <DisplayEquation fontSize={window.innerWidth > 600 ? 20 : 16}>
        \Delta =
        {discriminant}
    </DisplayEquation>
    <div className='faded'>
        <DisplayEquation fontSize={12}>
            ({factorization})
        </DisplayEquation>
    </div>
    </div>
}

export default Discriminant;
