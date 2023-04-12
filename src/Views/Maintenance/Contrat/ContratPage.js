//#region Imports

//#region Bootstrap
import { Container } from "react-bootstrap";
//#endregion

//#region Components
import ContratInfo from "./Components/ContratInformation";
import ContratPrestation from "./Components/ContratPrestations";
//#endregion


//#endregion





const ContratPage = () => {

    //#region Mockup
    let idContrat = "2557";

    const contrat = { IdContrat: idContrat, DateSouscrit: "12/04/2018", TypeContrat: "Classique : Du Lundi au Vendredi aux horaires de bureau", Indice: "Taux fixe", TypeFacturation: "A date d'anniversaire du contrat", Delai: "12h" }

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

    //#endregion
    return (
        <Container fluid>
            <ContratInfo Contrat={contrat} />
            <ContratPrestation Prestations={Prestations} />
        </Container>

    )
};

export default ContratPage;