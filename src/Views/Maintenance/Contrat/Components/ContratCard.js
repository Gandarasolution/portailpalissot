//#region Imports
import React, { useState } from 'react';


//#region Bootstrap
 import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ContratInfo from './ContratInformation';
import ContratPrestation from './ContratPrestations';
//#endregion

//#region Components

//#endregion


//#endregion



const ContratCard = (props) => {



    //#region States
    const [key, setKey] = useState('contrat');
    //#endregion


    //#region Fonctions

    //#endregion


    //#region Evenements

    //#endregion


    return (

        <Card className='m-2 shadow'>
            <Card.Body>
                <Card.Title>{`Contrat N° ${props.Contrat.IdContrat} - ${props.Contrat.LibelleContrat}`}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Chaufferie</Card.Subtitle>



                <Tabs
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="contrat" title="Contrat" >
                        <ContratInfo Contrat={props.Contrat} />


                    </Tab>
                    <Tab eventKey="prestations" title="Prestations">

                        <ContratPrestation Prestations={props.Contrat.Prestations} Contrat={props.Contrat} />
                    </Tab>
                    <Tab eventKey="appareils" title="Appareils">


                    </Tab>
                    <Tab eventKey="tache" title="Liste des tâches">

                    </Tab>

                </Tabs>


            </Card.Body>
        </Card>


    );
};


export default ContratCard;