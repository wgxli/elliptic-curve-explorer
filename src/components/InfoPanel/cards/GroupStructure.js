import React, {PureComponent} from 'react';

import Typography from '@material-ui/core/Typography';

import DisplayEquation from 'components/DisplayEquation.js';

import InfoCard, {ExpansionPanel} from '../InfoCard.js';


function displayPoint(point, inverseMap, homogeneous) {
    if (point.isIdentity()) {
        return homogeneous ? '[0 : 1 : 0]' : '\\infty';
    }

    const [x, y] = inverseMap.transformBigRational(point.x, point.y);
    if (homogeneous) {
        return `[${x}:${y}:1]`;
    } else {
        return `(${x}, ${y})`;
    }
}

class GroupStructure extends PureComponent {
    renderTorsionPoints(torsionPoints) {

        // Render table
        const inverseMap = this.props.curve.reduced.map.inverse();
        const output = [];
        for (var [point, order] of torsionPoints) {
            output.push(
                displayPoint(point, inverseMap, this.props.homogeneous)
                + ' & ' + order
            );
        }

        const header = '\\begin{array}{ll} \\text{Point} & \\text{Order} \\\\{}';
        const footer = '\\end{array}';
        return header + output.join('\\\\{}') + footer;
    }

    render() {
        const {curve} = this.props;
        const reduced = curve.reduced;
        if (reduced.discriminant.eq(0)) {
            return (<div/>);
        }

        // Torsion subgroup
        const order = reduced.torsionPoints.length;
        const torsionPoints = reduced.torsionPoints.map(
            (p) => [p, p.order()]
        );
        torsionPoints.sort((a, b) => a[1] - b[1]);
        const orders = torsionPoints.map((x) => x[1]);

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


        return (
            <InfoCard title='Group Structure'>
                <DisplayEquation fontSize={28}>
                    {'E(\\mathbb{Q}) \\cong' + group}
                </DisplayEquation>
                <ExpansionPanel>
                    <Typography variant='caption'>Torsion Points</Typography>
                    <DisplayEquation fontSize={18}>
                        {this.renderTorsionPoints(torsionPoints)}
                    </DisplayEquation>
                </ExpansionPanel>
            </InfoCard>
        );
    }
}

export default GroupStructure;
