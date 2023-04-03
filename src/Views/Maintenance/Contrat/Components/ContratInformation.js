import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';




const ContratInfo = ({ Contrat }) => {




    return (

        <div className='p-2'>
            <div className='mx-1 pb-4 bg-white rounded p-4 shadow-lg'>
                <div className="d-flex flex-wrap align-items-center">
                    <div style={{ width: "50px", height: "50px", top: "-25px", left: "10px" }} className="shadow text-white bg-danger ps-2 d-flex justify-content-center align-items-center rounded position-relative ">
                        <FontAwesomeIcon size="xl" icon="file-alt" />
                    </div>

                    <h5 className="ms-4">Contrat n° {Contrat.IdContrat}</h5>
                </div>

                <div className='d-flex flex-wrap'>


                    <div className='w-25 px-3 mb-3'>
                        <div className='border-bottom '>
                            <p style={{ fontSize: "12px" }} className="m-0 p-0"> Souscrit le</p>
                            <p className="m-0 my-1 p-0">{Contrat.DateSouscrit}</p>
                        </div>
                    </div>


                    <div className="w-50 px-3 mb-3">
                        <div className="border-bottom ">
                            <p style={{ fontSize: "12px" }} className="m-0 p-0">Type</p>
                            <p className="m-0 my-1 p-0">{Contrat.TypeContrat}</p>
                        </div>
                    </div>

                    <div className="w-25 px-3 mb-3">
                        <div className="border-bottom " >
                            <p style={{ fontSize: "12px" }} className="m-0 p-0">Délai d'intervention</p>
                            <p className="m-0 my-1 p-0">{Contrat.Delai}</p>
                        </div>
                    </div>

                    <div className="w-25 px-3 mb-3">
                        <div className="border-bottom ">
                            <p style={{ fontSize: "12px" }} className="m-0 p-0">Indice d'actualisation</p>
                            <p className="m-0 my-1 p-0">{Contrat.Indice}</p>
                        </div>
                    </div>


                    <div className="w-25 px-3 mb-3">
                        <div className="border-bottom ">
                            <p style={{ fontSize: "12px" }} className="m-0 p-0">Type de facturation</p>
                            <p className="m-0 my-1 p-0">{Contrat.TypeFacturation}</p>
                        </div>
                    </div>



                </div>
            </div>
        </div>

    )

}


export default ContratInfo;