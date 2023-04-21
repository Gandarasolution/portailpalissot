//#region Imports

//#region Bootstrap
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
//#endregion

//#region Components

//#endregion
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

//#endregion


const GridPrestation = ({ Prestations }) => {


    //#region Fonctions

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

    //#endregion


    //#region States
    const [lignesParPage, setLignesParPage] = useState(10);
    const [nbPremier, setNbPremier] = useState(1);
    const [nbDernier, setNbDernier] = useState(Prestations.length > lignesParPage ? lignesParPage : Prestations.length);
    const [pageActuel, setPageActuel] = useState(1);

    //#endregion


    //#region Evenements
    const DropdownLignesParPageChanged = (e) => {

        setLignesParPage(e);
        setPageActuel(1);
        setNbPremier(1);
        setNbDernier(Prestations.length > e ? e : Prestations.length);
    }

    const PageActuelGoForth = (e) => {
        if (nbDernier !== Prestations.length) {
            let _pageActuel = pageActuel + 1
            setPageActuel(_pageActuel);
            let _nbPremier = Number(nbPremier) + Number(lignesParPage)
            setNbPremier(_nbPremier);
            let _nbDernier = Prestations.length > nbDernier + lignesParPage ? nbDernier + lignesParPage : Prestations.length
            setNbDernier(_nbDernier);
        }
    }

    const PageActuelGoBack = (e) => {
        if (pageActuel > 1) {
            setPageActuel(pageActuel - 1);
            setNbPremier(nbPremier - lignesParPage);
            setNbDernier((pageActuel - 1) * lignesParPage);
        }
    }
    //#endregion

    useEffect(() => {
        //    console.log(`nbPremier : ${nbPremier}`)
        //    console.log(`nbDernier : ${nbDernier}`)
        //    console.log(`pageActule : ${pageActuel}`)
        //    console.log(`ligneparpage : ${lignesParPage}`)
        //     console.log("--------------------------------------------")
    })


    return (
        <Container fluid>

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
                        // Prestations.slice(((nbPremier - 1)), (lignesParPage)).map((presta) => {
                        Prestations.slice(((nbPremier - 1)), (nbDernier)).map((presta) => {



                            return (<tr key={presta.id}>
                                <td><NavLink style={{ textDecoration: 'none' }} to={`/maintenance/contrat/prestation/${presta.id}`}>
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
                            title={lignesParPage}
                            onSelect={(e) => DropdownLignesParPageChanged(e)}
                            id="dropdown-NumRow"

                        >
                            <Dropdown.Item eventKey="10">10</Dropdown.Item>
                            <Dropdown.Item eventKey="20">20</Dropdown.Item>
                            <Dropdown.Item eventKey="30">30</Dropdown.Item>
                        </DropdownButton>
                    </div>
                    <div className="d-flex  me-4">
                        <p className=" m-2">{nbPremier} - {nbDernier} sur {Prestations.length}</p>
                    </div>


                    <div className="d-flex  me-2  mx-auto ">

                        <Button variant='' className="mx-auto mb-3" onClick={(e) => PageActuelGoBack(e)} >&lt;</Button>
                        <p className='mx-auto mt-1'>
                            {pageActuel}
                        </p>
                        <Button variant='' className="mx-auto mb-3" onClick={(e) => PageActuelGoForth(e)}>&gt;</Button>

                    </div>

                </div>
            </div>

        </Container>

    );
}


export default GridPrestation