import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const WhiteShadowCard = (props) => {



return (
    <div className='pt-4 mt-2'>
    <div className='pb-4 bg-white rounded shadow-lg'>
        <div className="d-flex flex-wrap align-items-center">
            <div style={{ width: "50px", height: "50px", top: "-25px", left: "10px",  }} className="shadow text-white bg-danger d-flex justify-content-center align-items-center rounded position-relative ">
                <FontAwesomeIcon size="xl" icon={props.icon} />
            </div>

            <h5 className="ms-4">{props.title}</h5>
        </div>

        <div className='d-flex flex-wrap'>


           {props.children}


        </div>
    </div>
</div>
)

}


export default WhiteShadowCard;