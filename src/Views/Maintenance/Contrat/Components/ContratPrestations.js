//#region Imports

//#region Bootstrap

//#endregion

//#region Components
import GridPrestation from './GridPrestation';
import WhiteShadowCard from '../../../../components/commun/WhiteShadowCard';
//#endregion

import React from 'react';

//#endregion


const ContratPrestation = ({ Prestations }) => {

    return (

        <WhiteShadowCard icon="clock" title="Prestations :" >

            <GridPrestation Prestations={Prestations} />

        </WhiteShadowCard>

    )

};

export default ContratPrestation;
