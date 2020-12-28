import React from 'react';

import DisplayEquation from 'components/DisplayEquation.js';


function getGroupName(order, orders) {
    const Z = '\\mathbb{Z}'
    const cyclic = (n) => Z + '_{' + n + '}';

    var group;
    if (order === 1) {
        group = Z + '^r';
    } else if ([2, 3, 5, 6, 7, 9].includes(order)) {
        group = cyclic(order);
    } else {
        group = orders.includes(order)
            ? cyclic(order)
            : '(' + cyclic(order/2) + '\\times' + cyclic(2) + ')';
    }
    if (order !== 1) {
        group += '\\times ' + Z + '^r';
    }
    return group;
}

function GroupStructure({curve}) {
    const {reduced} = curve;

    let group = '\\text{N/A}';

    if (!reduced.discriminant.eq(0)) {
        // Torsion subgroup
        const order = reduced.torsionPoints.length;
        const torsionPoints = reduced.torsionPoints.map(
            (p) => [p, p.order()]
        );
        torsionPoints.sort((a, b) => a[1] - b[1]);
        const orders = torsionPoints.map((x) => x[1]);
        group = `E(\\mathbb{Q}) \\cong ${getGroupName(order, orders)}`;
    }

    return <div className='group-structure'>
        <h2>Group Structure</h2>
        <DisplayEquation fontSize={window.innerWidth > 600 ? 20 : 16}>
            {group}
        </DisplayEquation>
    </div>;
}

export default GroupStructure;
