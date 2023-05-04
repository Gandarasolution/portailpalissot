//#region Imports
import { useEffect, useState } from "react";
import dateFormat from "dateformat";

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Stack from "react-bootstrap/Stack";
//#endregion

//#region FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
//#endregion

//#region Components
import ContratPrestation from "./Components/ContratPrestations";
import ContratInfo from "./Components/ContratInformation";

//#endregion
import { loremIpsum } from "react-lorem-ipsum";
import { Breakpoint, BreakpointProvider } from "react-socks";

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
      mois: [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
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

  const MockupDataPrestation = async () => {
    console.log("Mockup data Prestations !");
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

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  //#endregion

  //#region Données

  const _dateContrat = new Date(
    dateFormat(new Date(Contrat.DateSouscrit), "dd/mm/yyyy")
  );

  const dateFinPeriode = () => {
    let _dateEndTmp = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
    return new Date(_dateEndTmp.setMonth(_dateEndTmp.getMonth() + 11));
  };

  //#endregion

  //#region States
  const [isLoadedContrat, setIsLoadedContrat] = useState(false);
  const [isLoadedPresta, setIsLoadedPresta] = useState(false);

  const [Prestations, SetPrestations] = useState(_Prestations);

  const [dateDebutPeriode, setDateDebutPeriode] = useState(
    GetDatePeriodeInitial()
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

  function GetNomMois(num, short = false) {
    // console.log(num)
    if (num > 12) {
      num = num - 12;
    }
    switch (num) {
      case 1:
        return short ? "Jan." : "Janvier";
      case 2:
        return short ? "Fév." : "Février";
      case 3:
        return "Mars";
      case 4:
        return short ? "Avr." : "Avril";
      case 5:
        return "Mai";
      case 6:
        return "Juin";
      case 7:
        return short ? "Juil." : "Juillet";
      case 8:
        return "Août";
      case 9:
        return short ? "Sept." : "Septembre";
      case 10:
        return short ? "Oct." : "Octobre";
      case 11:
        return short ? "Nov." : "Novembre";
      case 12:
        return short ? "Déc." : "Décembre";
      default:
        return null;
    }
  }

  /**
   * Construit la date de début des preriodes initial
   * @returns ([1] / [DateContratSouscrit.getMonth] / [Date.Now.getYear])
   */
  function GetDatePeriodeInitial() {
    let _day = 1;
    let _monthI = _dateContrat.getMonth();
    let _year = new Date().getFullYear();
    let _DateRetour = new Date(_year, _monthI, _day);

    return _DateRetour;
  }

  //#endregion

  //#region Evenement

  const AjouterUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = addOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);

    setIsLoadedPresta(false);
    await MockupDataPrestation();
    // setIsLoaded(true);
  };

  const SoustraireUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = subOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);
    setIsLoadedPresta(false);

    await MockupDataPrestation();
  };

  const HandleDropdownPeriodeSelect = async (dateStart) => {
    let _dateTemp = new Date(dateStart);

    setDateDebutPeriode(_dateTemp);
    setIsLoadedPresta(false);

    await MockupDataPrestation();
  };

  //#endregion

  const DropDownYears = (small) => {
    let _dateDebut = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
    let _dateEnd = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
    let _arrayPeriodes = [
      {
        dateStart: new Date(_dateDebut),
        dateEnd: new Date(_dateEnd.setMonth(_dateDebut.getMonth() + 11)),
      },
    ];

    for (let index = 0; index < 10; index++) {
      let _dateStart = addOneYear(new Date(_arrayPeriodes[index].dateStart));
      let _dateEnd = addOneYear(new Date(_arrayPeriodes[index].dateEnd));

      _arrayPeriodes.push({ dateStart: _dateStart, dateEnd: _dateEnd });
    }

    return (
      <DropdownButton
        variant=""
        className="border button-periode"
        drop="down-centered"
        style={{ borderRadius: "10px" }}
        id="dropdown-datePeriode"
        title={`Période : de ${GetNomMois(
          dateDebutPeriode.getMonth() + 1,
          small
        )}
              ${dateDebutPeriode.getFullYear()} à
              ${GetNomMois(dateFinPeriode().getMonth() + 1, small)}
              ${dateFinPeriode().getFullYear()}`}
        onSelect={(e) => {
          HandleDropdownPeriodeSelect(e);
        }}
      >
        {_arrayPeriodes.map((periode, index) => {
          return (
            <Dropdown.Item key={index} eventKey={periode.dateStart}>
              {`de ${GetNomMois(
                periode.dateStart.getMonth() + 1
              )} ${periode.dateStart.getFullYear()} à ${GetNomMois(
                periode.dateEnd.getMonth() + 1
              )} ${periode.dateEnd.getFullYear()}`}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );
  };

  useEffect(() => {
    async function makeRequest() {
      await delay(1);

      setIsLoadedContrat(true);
      setIsLoadedPresta(true);
    }
    makeRequest();
  }, [isLoadedPresta]);

  return (
    <Container fluid className="h-100" > 
      {/* <ContratInfo Contrat={Contrat} IsLoaded={isLoadedContrat} /> */}

      <ContratPrestation
        IsLoaded={isLoadedPresta}
        Prestations={Prestations}
        datePrestation={dateDebutPeriode}
        ParentComponentPeriodeSelect={
          <BreakpointProvider>
            <Breakpoint large up>
              <Stack direction="horizontal" className="centerStack " gap={1}>
                <Button
                  variant=""
                  className="border button-periode"
                  onClick={() => SoustraireUnAnPeriode()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>

                {DropDownYears(false)}

                <Button
                  variant=""
                  className="border button-periode"
                  onClick={() => AjouterUnAnPeriode()}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Stack>
            </Breakpoint>
            <Breakpoint medium down>
              {DropDownYears(true)}
              <Stack direction="horizontal" className="centerStack" gap={1}>
                <Button
                  variant=""
                  className="border button-periode"
                  onClick={() => SoustraireUnAnPeriode()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>
                <Button
                  variant=""
                  className="border button-periode"
                  onClick={() => AjouterUnAnPeriode()}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Stack>
            </Breakpoint>
          </BreakpointProvider>
        }
      />
    </Container>
  );
};

export default ContratPage;
