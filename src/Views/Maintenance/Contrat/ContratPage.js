//#region Imports

//#region Bootstrap
import { Container, Row, Col, Table, Button, Collapse } from "react-bootstrap";
import ContratCard from "./Components/ContratCard";
import ContratInfo from "./Components/ContratInformation";
import { useEffect, useState } from "react";
//#endregion

//#region Components
// import ContratInfo from "./Components/ContratInformation";
// import ContratPrestation from "./Components/ContratPrestations";
//#endregion


//#endregion





const ContratPage = () => {



    //#region Mockup


    const Contrat = {
        IdContrat: 2557
        , DateSouscrit: "12/04/2018"
        , TypeContrat: "Classique : Du Lundi au Vendredi aux horaires de bureau"
        , Indice: "Taux fixe"
        , TypeFacturation: "A date d'anniversaire du contrat", Delai: "12h"
        , LibelleContrat: "Entretien annuel"
    }


    let Prestations = [
        {
            id: 1, libelle: "	Entretien annuel de la ventilation", secteur: "toiture", mois: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }, {
            id: 2, libelle: "Contrôle mensuel des températures par échantillonage", secteur: "Ensemble", mois: [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0]
        }, {
            id: 3, libelle: "Entretien annuel de la sous Station N°2", secteur: "Batiment 2", mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0]
        }, {
            id: 4, libelle: "Entretien annuel de la sous Station N°1", secteur: "Batiment 2", mois: [0, 0, 0, 3, 0, 0, 0, 0, 2, 0, 0, 0]
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
    ];
    //#endregion


    //#region States


    const [datePrestation, SetDatePrestation] = useState(new Date("04/12/2018"))

    const [open1, setOpen1] = useState(true);
    const [open2, setOpen2] = useState(true);
    const [open3, setOpen3] = useState(true);
    const [open4, setOpen4] = useState(true);
    const [open5, setOpen5] = useState(true);
    const [open6, setOpen6] = useState(true);
    const [open7, setOpen7] = useState(true);
    const [open8, setOpen8] = useState(true);
    const [open9, setOpen9] = useState(true);
    const [open10, setOpen10] = useState(true);
    const [open11, setOpen11] = useState(true);
    const [open12, setOpen12] = useState(true);

    //#endregion


    useEffect(() => {
    });

    function GetNomMois(num) {
        // console.log(num)
        if (num > 12) {
            num = num - 12;
        }
        switch (num) {
            case 1:
                return "Janvier";
            case 2:
                return "Février";
            case 3:
                return "Mars";
            case 4:
                return "Avril";
            case 5:
                return "Mai";
            case 6:
                return "Juin";
            case 7:
                return "Juillet";
            case 8:
                return "Août";
            case 9:
                return "Septembre";
            case 10:
                return "Octobre";
            case 11:
                return "Novembre";
            case 12:
                return "Décembre";
            default: return null;
        }
    }

    function GetStateOpen(e) {
        switch (e) {
            case 1:
                return open1;
            case 2:
                return open2;
            case 3:
                return open3;
            case 4:
                return open4;
            case 5:
                return open5;
            case 6:
                return open6;
            case 7:
                return open7;
            case 8:
                return open8;
            case 9:
                return open9;
            case 10:
                return open10;
            case 11:
                return open11;
            case 12:
                return open12;

            default: return null;
        }
    }

    function GetLibEtat(e) {
        switch (e) {
            case 1: return "Non plannifiée";
            case 2: return "Planifiée";
            case 3: return "En cours";
            case 4: return "Terminée"
            default: return "Non planifiée";
        }
    }



    const RowsGroupedMonth = () => {
        const _numMoisDebutPrestation = Number(datePrestation.getMonth() + 1);
        const _anneDebutPrestation = 2022;

        return (

            <Table>
                <thead>
                    <tr>
                        <th>Secteur</th>
                        <th>N° de prestation</th>
                        <th>Libellé</th>
                        <th>Etat</th>
                    </tr>
                </thead>


                {RowGroupMois(_numMoisDebutPrestation)}
                {RowGroupMois(_numMoisDebutPrestation + 1 > 12 ? _numMoisDebutPrestation + 1 - 12 : _numMoisDebutPrestation + 1)}
                {RowGroupMois(_numMoisDebutPrestation + 2 > 12 ? _numMoisDebutPrestation + 2 - 12 : _numMoisDebutPrestation + 2)}
                {RowGroupMois(_numMoisDebutPrestation + 3 > 12 ? _numMoisDebutPrestation + 3 - 12 : _numMoisDebutPrestation + 3)}
                {RowGroupMois(_numMoisDebutPrestation + 4 > 12 ? _numMoisDebutPrestation + 4 - 12 : _numMoisDebutPrestation + 4)}
                {RowGroupMois(_numMoisDebutPrestation + 5 > 12 ? _numMoisDebutPrestation + 5 - 12 : _numMoisDebutPrestation + 5)}
                {RowGroupMois(_numMoisDebutPrestation + 6 > 12 ? _numMoisDebutPrestation + 6 - 12 : _numMoisDebutPrestation + 6)}
                {RowGroupMois(_numMoisDebutPrestation + 7 > 12 ? _numMoisDebutPrestation + 7 - 12 : _numMoisDebutPrestation + 7)}
                {RowGroupMois(_numMoisDebutPrestation + 8 > 12 ? _numMoisDebutPrestation + 8 - 12 : _numMoisDebutPrestation + 8)}
                {RowGroupMois(_numMoisDebutPrestation + 9 > 12 ? _numMoisDebutPrestation + 9 - 12 : _numMoisDebutPrestation + 9)}
                {RowGroupMois(_numMoisDebutPrestation + 10 > 12 ? _numMoisDebutPrestation + 10 - 12 : _numMoisDebutPrestation + 10)}
                {RowGroupMois(_numMoisDebutPrestation + 11 > 12 ? _numMoisDebutPrestation + 11 - 12 : _numMoisDebutPrestation + 11)}



            </Table>



        )

    }



    const ButtonAreaControl = (e) => {
        switch (Number(e)) {
            case 1:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open1} onClick={() => setOpen1(!open1)} >{open1 ? "^" : "v"}</Button>)
            case 2:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open2} onClick={() => setOpen2(!open2)} >{open2 ? "^" : "v"}</Button>)
            case 3:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open3} onClick={() => setOpen3(!open3)} >{open3 ? "^" : "v"}</Button>)
            case 4:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open4} onClick={() => setOpen4(!open4)} >{open4 ? "^" : "v"}</Button>)
            case 5:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open5} onClick={() => setOpen5(!open5)} >{open5 ? "^" : "v"}</Button>)
            case 6:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open6} onClick={() => setOpen6(!open6)} >{open6 ? "^" : "v"}</Button>)
            case 7:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open7} onClick={() => setOpen7(!open7)} >{open7 ? "^" : "v"}</Button>)
            case 8:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open8} onClick={() => setOpen8(!open8)} >{open8 ? "^" : "v"}</Button>)
            case 9:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open9} onClick={() => setOpen9(!open9)} >{open9 ? "^" : "v"}</Button>)
            case 10:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open10} onClick={() => setOpen10(!open10)} >{open10 ? "^" : "v"}</Button>)
            case 11:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open12} onClick={() => setOpen11(!open11)} >{open11 ? "^" : "v"}</Button>)
            case 12:
                return (<Button aria-controls={`collapse-row-${e}`} aria-expanded={open12} onClick={() => setOpen12(!open12)} >{open12 ? "^" : "v"}</Button>)
            default: return null;
        }

    }


    const RowGroupMois = (e) => {
        let _numMois = Number(e)
        let _lPrestation = Prestations.filter(item => item.mois.at(_numMois - 1) > 0);

        return (
            <tbody>

                <tr >
                    <td colSpan={4}>
                        <div className="shadow border">
                            {GetNomMois(_numMois)}  ({_lPrestation.length})  : {ButtonAreaControl(_numMois)}
                        </div>
                    </td>
                </tr>

                {

                    _lPrestation.map((presta) => {
                        return (


                            <Collapse in={GetStateOpen(_numMois)} key={presta.id} >
                                <tr>
                                    <td>{presta.secteur}</td>
                                    <td>{presta.id}</td>
                                    <td>{presta.libelle}</td>
                                    <td>{GetLibEtat(presta.mois.at(_numMois - 1))}</td>
                                </tr>
                            </Collapse>
                        )
                    })
                }
            </tbody>




        )
    }


    return (
        <Container fluid>

            <ContratInfo Contrat={Contrat} />

            {RowsGroupedMonth()}
            {/* <Table>
                <thead>
                    <tr>
                        <th>Secteur</th>
                        <th>N° de prestation</th>
                        <th>Libellé</th>
                        <th>Etat</th>
                    </tr>
                </thead>


                {RowGroupMois(1)}
                {RowGroupMois(2)}
                {RowGroupMois(3)}
                {RowGroupMois(4)}
                {RowGroupMois(5)}
                {RowGroupMois(6)}
                {RowGroupMois(7)}
                {RowGroupMois(8)}
                {RowGroupMois(9)}
                {RowGroupMois(10)}
                {RowGroupMois(11)}
                {RowGroupMois(12)}


            </Table> */}

        </Container>

    )
};

export default ContratPage;