import { useParams, NavLink, useFetcher } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';


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






    const [lignesParPage, setLignesParPage] = useState(10);
    const [nbPremier, setNbPremier] = useState(1);
    const [nbDernier, setNbDernier] = useState(Prestations.length > lignesParPage ? lignesParPage : Prestations.length);
    const [pageActuel, setPageActuel] = useState(1);




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


    useEffect(() => {
    //    console.log(`nbPremier : ${nbPremier}`)
    //    console.log(`nbDernier : ${nbDernier}`)
    //    console.log(`pageActule : ${pageActuel}`)
    //    console.log(`ligneparpage : ${lignesParPage}`)
    //     console.log("--------------------------------------------")
    })


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



        </div>

    );
}


export default GridPrestation