import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GridPrestation from './GridPrestation';



const ContratPrestation = ({Prestations}) => {

return (
    <div className='p-2'>
    <div className='mx-1 pb-4 bg-white rounded p-4 shadow-lg'>
        <div className="d-flex flex-wrap align-items-center">
            <div style={{ width: "50px", height: "50px", top: "-25px", left: "10px" }} className="shadow text-white bg-danger ps-2 d-flex justify-content-center align-items-center rounded position-relative ">
                <FontAwesomeIcon size="xl" icon="clock" />
            </div>

            <h5 className="ms-4">Prestations : </h5>
        </div>
            <GridPrestation />


    </div>
</div>

)

};

export default ContratPrestation;
