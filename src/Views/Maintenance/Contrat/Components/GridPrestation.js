import { useParams, NavLink } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';


const GridPrestation = () => {

    const Prestations = [
        {
            id: 1, libelle: "	Entretien annuel de la ventilation", secteur: "toiture", mois: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            id: 2, libelle: "Contrôle mensuel des températures par échantillonage", secteur: "Ensemble", mois: [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0]
        }, {
            id: 3, libelle: "Entretien annuel de la sous Station N°2", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 4, libelle: "Entretien annuel de la sous Station N°1", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 5, libelle: "eeeee", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 6, libelle: "fgb", secteur: "Batiment 2", mois: [0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 7, libelle: "Eefefef", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0]
        }, {
            id: 8, libelle: "Eneffff", secteur: "Batiment 2", mois: [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 9, libelle: "Ezzzz2", secteur: "Batiment 2", mois: [0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 10, libelle: "efzefzef", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0]
        }, {
            id: 11, libelle: "Entretien zefzf", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1]
        }, {
            id: 12, libelle: "Entresdsddfdff", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0]
        }

    ]


    let { idContrat } = useParams();
    const [numRow, setNumRow] = useState(10);
    const [nbAfficher, setNbAfficher] = useState((Prestations.length < 10 ? Prestations.length : 10));
    const [pageActuel, setPageActuel] = useState(1);









    const DropdownNumRowChanged = (e) => {
        setNumRow(e);
        setPageActuel(1)
        setNbAfficher((Prestations.length < e ? Prestations.length : e))
    }

    const PageGoBack = () => {
        if (pageActuel > 1) {
            setPageActuel(pageActuel - 1)
        }

    }

    const PageGoForth = () => {
        if (pageActuel * numRow < Prestations.length) {
            setPageActuel(pageActuel + 1)

        }

    }


    function MoisIcone(_parametre) {
        switch (_parametre) {
            case 1:
                return <FontAwesomeIcon color='red' icon="file-alt" />
            case 2:
                return <FontAwesomeIcon color='orange' icon="clock" />
            default:
                return null

        }
    }


    return (
        <div>

            <Table striped hover responsive>
                <thead>
                    <tr>
                        <th></th>
                        <th>Secteur</th>
                        <th>Libellé prestation</th>
                        <th>Jan.</th>
                        <th>Fév.</th>
                        <th>Mar.</th>
                        <th>Avr.</th>
                        <th>Mai.</th>
                        <th>Juin.</th>
                        <th>Juil.</th>
                        <th>Aout.</th>
                        <th>Sept.</th>
                        <th>Oct.</th>
                        <th>Nov.</th>
                        <th>Déc.</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        Prestations.slice(0, numRow).map((presta) => {
                            return (<tr key={presta.id}>
                                <td><NavLink style={{ textDecoration: 'none' }} to={`/maintenance/contrat/${idContrat}/${presta.id}`}>
                                    <FontAwesomeIcon icon="search" />
                                </NavLink></td>
                                <td>{presta.secteur}</td>
                                <td>{presta.libelle}</td>

                                {
                                    presta.mois.map((month, index) => {
                                        return (<td key={index}>{MoisIcone(month)}</td>)
                                    })
                                }


                            </tr>)
                        })
                    }

                </tbody>
            </Table>


            <div className='w-100 d-flex justify-content-end  '>
                <div className='d-flex'>
                    <div className='d-flex me-4'>
                        <p className='me-1 h-100 text-center m-2'>
                            Lignes par page :
                        </p>
                        <DropdownButton
                            variant=''
                            title={numRow}
                            onSelect={(e) => DropdownNumRowChanged(e)}
                            id="dropdown-NumRow"

                        >
                            <Dropdown.Item eventKey="10">10</Dropdown.Item>
                            <Dropdown.Item eventKey="20">20</Dropdown.Item>
                            <Dropdown.Item eventKey="30">30</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div className="d-flex  me-4">
                        <p className=" m-2">1-{nbAfficher} sur {Prestations.length}</p>
                    </div>


                    <div className="d-flex  me-2  mx-auto ">

                        <Button variant='' className="mx-auto mb-3" onClick={() => PageGoBack()} >&lt;</Button>
                        <p className='mx-auto mt-1'>
                            {pageActuel}
                        </p>
                        <Button variant='' className="mx-auto mb-3" onClick={() => PageGoForth()}>&gt;</Button>

                    </div>

                </div>
            </div>



        </div>

    );
}


export default GridPrestation