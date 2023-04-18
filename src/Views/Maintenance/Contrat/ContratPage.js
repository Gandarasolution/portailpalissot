//#region Imports
import { useEffect, useState } from "react";
import dateFormat from "dateformat";

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";


//#endregion

//#region Components
import ContratPrestation from "./Components/ContratPrestations";
import ContratInfo from "./Components/ContratInformation";

//#endregion
import { loremIpsum } from "react-lorem-ipsum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
//#endregion

const ContratPage = () => {
  //#region Mockup

  const Contrat = {
    IdContrat: 2557,
    DateSouscrit: "12/04/2018",
    TypeContrat: "Classique : Du Lundi au Vendredi aux horaires de bureau",
    Indice: "Taux fixe",
    TypeFacturation: "A date d'anniversaire du contrat",
    Delai: "12h",
    LibelleContrat: "Entretien annuel",
  };

  let _Prestations = [
    {
      id: 1,
      libelle: "	Entretien annuel de la ventilation",
      secteur: "toiture",
      mois: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    {
      id: 2,
      libelle: "Contrôle mensuel des températures par échantillonage",
      secteur: "Ensemble",
      mois: [1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0],
    },
    {
      id: 3,
      libelle: "Entretien annuel de la sous Station N°2",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    },
    {
      id: 4,
      libelle: "Entretien annuel de la sous Station N°1",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 3, 0, 0, 4, 0, 2, 0, 0, 0],
    },
    {
      id: 5,
      libelle: "eeeee",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    },
    {
      id: 6,
      libelle: "fgb",
      secteur: "Batiment 2",
      mois: [0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    },
    {
      id: 7,
      libelle: "Eefefef",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 0, 0, 1, 0, 1, 2, 0, 0, 0],
    },
    {
      id: 8,
      libelle: "Eneffff",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0],
    },
    {
      id: 9,
      libelle: "Ezzzz2",
      secteur: "Batiment 2",
      mois: [0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0],
    },
    {
      id: 10,
      libelle: "efzefzef",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0],
    },
    {
      id: 11,
      libelle: "Entretien zefzf",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
    },
    {
      id: 12,
      libelle: "Entresdsddfdff",
      secteur: "Batiment 2",
      mois: [0, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    },
  ];

  const [Prestations, SetPrestations] = useState(_Prestations);

  const MockupDataPrestation = () => {
    let _prestas = [];
    for (let index = 0; index < 12; index++) {
      let _presta = {
        id: index + 1,
        libelle: loremIpsum({
          avgSentencesPerParagraph: 1,
          startWithLoremIpsum: false,
          random: "false",
        }).join(),
        secteur: loremIpsum({
          avgSentencesPerParagraph: 1,
          startWithLoremIpsum: false,
          random: "false",
          avgWordsPerSentence: 2,
        }).join(),
        mois: [
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
          getRandomInt(0, 4),
        ],
      };
      _prestas.push(_presta);
    }

    SetPrestations(_prestas);
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);

    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //#endregion

  //#region States

  const _dateContrat = new Date(
    dateFormat(new Date(Contrat.DateSouscrit), "dd/mm/yyyy")
  );

  const [datePrestation, SetDatePrestation] = useState(
    new Date(new Date().getFullYear(), _dateContrat.getMonth(), 1)
  );

  //#endregion

  //#region Fonctions
  function addOneYear(date) {
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }

  function subOneYear(date) {
    date.setFullYear(date.getFullYear() - 1);
    return date;
  }

  //#endregion

  //#region Evenement

  const AjouterUnAnPeriode = () => {
    let _dateTmp = datePrestation;
    _dateTmp = addOneYear(_dateTmp);
    let _datePrestation = new Date(_dateTmp);
    SetDatePrestation(_datePrestation);
    MockupDataPrestation();
  };

  const SoustraireUnAnPeriode = () => {
    let _dateTmp = datePrestation;
    _dateTmp = subOneYear(_dateTmp);
    let _datePrestation = new Date(_dateTmp);
    SetDatePrestation(_datePrestation);
    MockupDataPrestation();
  };

  useEffect(() => {}, [datePrestation]);

  //#endregion

  return (
    <Container fluid>
      <ContratInfo Contrat={Contrat} />

      <Button variant="primary" onClick={() => SoustraireUnAnPeriode()}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
      {`Période : ${datePrestation.getFullYear()}  / ${
        datePrestation.getFullYear() + 1
      }`}

      <Button variant="primary" onClick={() => AjouterUnAnPeriode()}>
        {" "}
        <FontAwesomeIcon icon={faArrowRight} />{" "}
      </Button>
      <ContratPrestation
        Prestations={Prestations}
        datePrestation={datePrestation}
      />
    </Container>
  );
};

export default ContratPage;
