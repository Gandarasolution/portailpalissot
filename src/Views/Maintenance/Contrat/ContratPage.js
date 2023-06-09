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
// import ContratInfo from "./Components/ContratInformation";

//#endregion
import { Breakpoint, BreakpointProvider } from "react-socks";
// import ContratInfo from "./Components/ContratInformation";
import { GetPrestationContrat } from "../../../axios/WSGandara";
import { TokenContext } from "../../../App";
import { useContext } from "react";
//#endregion

const ContratPage = () => {
  //#region Data

  const Contrat = {
    IdContrat: 2557,
    DateSouscrit: "12/04/2018",
    TypeContrat: "Classique : Du Lundi au Vendredi aux horaires de bureau",
    Indice: "Taux fixe",
    TypeFacturation: "A date d'anniversaire du contrat",
    Delai: "12h",
    LibelleContrat: "Entretien annuel",
  };





  const tokenCt = useContext(TokenContext);

  const FetchDataPrestation = async () => {
    let _ddebut = `${dateDebutPeriode.getFullYear()}-${dateDebutPeriode.getMonth() + 1}-1`
    let _dfint = `${dateFinPeriode().getFullYear()}-${dateFinPeriode().getMonth() + 1}-1`
    await GetPrestationContrat(tokenCt,DateSOAP(dateDebutPeriode), DateSOAP(dateFinPeriode()), 6663  ,SetPrestations).then(()=> setIsLoadedPresta(true) )
  };


  function DateSOAP(date) {
    // Get year, month, and day part from the date
    var year = date.toLocaleString("default", { year: "numeric" });
    // var month = date.toLocaleString("default", { month: "2-digit" });
    var month = "01"
    var day = date.toLocaleString("default", { day: "2-digit" });

    return year + "-" + month + "-" + day;
  }
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
  // const [isLoadedContrat, setIsLoadedContrat] = useState(false);
  const [isLoadedPresta, setIsLoadedPresta] = useState(false);

  const [Prestations, SetPrestations] = useState([]);

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
    await FetchDataPrestation();
  };

  const SoustraireUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = subOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);
    setIsLoadedPresta(false);

    await FetchDataPrestation();
  };

  const HandleDropdownPeriodeSelect = async (dateStart) => {
    let _dateTemp = new Date(dateStart);

    setDateDebutPeriode(_dateTemp);
    setIsLoadedPresta(false);

    await FetchDataPrestation();
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
        className="button-periode"
        drop="down-centered"
        style={{ borderRadius: "10px" }}
        id="dropdown-datePeriode"
        title={`Période : ${GetNomMois(
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
              {` ${GetNomMois(
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

  // useEffect(()  => {
  //   console.log("effect");
  //   FetchDataPrestation();
  // }, [isLoadedPresta]);


  // useEffect(async () => {
  //   const result = await FetchDataPrestation();

  //   // setData(result.data);
  // });


  useEffect(() => {
  async function fetchData() {
    // You can await here
    
    await FetchDataPrestation();
  }
  fetchData();
  // setIsLoadedPresta(true);

}, [isLoadedPresta]); // Or [] if effect doesn't need props or state

  return (
    <Container fluid className="h-100" > 
      {/* <ContratInfo Contrat={Contrat} IsLoaded={isLoadedContrat} /> */}

      <ContratPrestation
        IsLoaded={isLoadedPresta}
        Prestations={Prestations}
        datePrestation={new Date(Contrat.DateSouscrit)}
        ParentComponentPeriodeSelect={
          <BreakpointProvider>
            <Breakpoint large up>
              <Stack direction="horizontal" className="centerStack " gap={1}>
                <Button
                  variant=""
                  className=" button-periode"
                  onClick={() => SoustraireUnAnPeriode()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>

                {DropDownYears(false)}

                <Button
                  variant=""
                  className="button-periode "
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
