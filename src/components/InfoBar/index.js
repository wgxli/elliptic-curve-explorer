import React from 'react';
import './index.css';

import Discriminant from './Discriminant';
import ReducedForm from './ReducedForm';
import GroupStructure from './GroupStructure';

function InfoBar({curve, view3D}) {
    return <div className='info-bar'>
        <Discriminant curve={curve}/>
        <ReducedForm curve={curve} homogeneous={view3D}/>
        <GroupStructure curve={curve}/>
    </div>;
}

export default InfoBar;
