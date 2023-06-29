//#region Imports
import { useEffect, useState, useContext } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";


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
import { GetPrestationContrat } from "../../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../../App";
import { DateSOAP } from "../../../functions";

//#endregion

//#endregion

const ContratPage = () => {
  const tokenCt = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  //#region Données
  

  const dateFinPeriode = () => {
    let _dateEndTmp = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));

    _dateEndTmp = addOneYear(_dateEndTmp);

    var day = _dateEndTmp.getDate() - 1;
    _dateEndTmp.setDate(day);

    return new Date(_dateEndTmp);
  };

  //#endregion

  //#region States
  const [isLoadedPresta, setIsLoadedPresta] = useState(false);
  const [Prestations, SetPrestations] = useState([]);
  const [dateDebutPeriode, setDateDebutPeriode] = useState(
    GetDatePeriodeInitial()
  );
  const [lastPeriode, setLastPeriode] = useState(null);

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

  // /**
  //  * Construit la date de début des preriodes initial
  //  * @returns ([1] / [DateContratSouscrit.getMonth] / [Date.Now.getYear])
  //  */
  // function GetDatePeriodeInitial() {
  //   let _day = 1;
  //   let _monthI = _dateContrat.getMonth();
  //   let _year = new Date().getFullYear();
  //   let _DateRetour = new Date(_year, _monthI, _day);
  //   return _DateRetour;
  // }


  function GetDatePeriodeInitial() {
    let _day = 1;
    // let _monthI = _dateContrat.getMonth();
    let _monthI = 0;
    let _year = new Date().getFullYear();
    let _DateRetour = new Date(_year, _monthI, _day);
    return _DateRetour;
  }


  const FetchDataPrestation = async () => {
   
    SetPrestations([]);
    setLastPeriode(DateSOAP(dateDebutPeriode));
    
    GetPrestationContrat(
      tokenCt,
      DateSOAP(dateDebutPeriode),
      DateSOAP(dateFinPeriode()),
      ClientSiteContratCtx.storedClientSite.IdClientSite,
      PrestationLoad
    )
  };



  const PrestationLoad = (data) => {
    SetPrestations(data);

    if (lastPeriode === DateSOAP(dateDebutPeriode)) setIsLoadedPresta(true);
  };

 
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
        title={`Période : ${GetNomMois(dateDebutPeriode.getMonth() + 1, small)}
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

  useEffect(() => {
    async function makeRequest() {
      setIsLoadedPresta(false);
      await FetchDataPrestation();
    }
    makeRequest();
    // eslint-disable-next-line
  }, [ClientSiteContratCtx.storedClientSite.IdClientSite, lastPeriode]);

  return (
    <Container fluid className="h-100">
      <ContratPrestation
        IsLoaded={isLoadedPresta}
        Prestations={Prestations}
        datePrestation={
          new Date(
            ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat
          )
        }
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
