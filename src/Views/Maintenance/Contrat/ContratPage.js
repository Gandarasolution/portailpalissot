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
import {
  GetContratPrestationPeriodes,
  GetPrestationContrat,
} from "../../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../../App";
import {
  DateSOAP,
  GetDateFromStringDDMMYYY,
  addOneYear,
} from "../../../functions";

//#endregion

//#endregion

const ContratPage = () => {
  const tokenCt = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  //#region Données

  //#endregion

  //#region States
  const [isLoadedPresta, setIsLoadedPresta] = useState(false);
  const [Prestations, SetPrestations] = useState([]);

  const [periodeEnCours, setPeriodeEnCours] = useState({
    k: DateSOAP(GetDatePeriodeInitial()),
    v: DateSOAP(addOneYear(GetDatePeriodeInitial())),
  });

  const [listePeriodes, setListePeriodes] = useState([]);

  //#endregion

  //#region Fonctions

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

  function GetDatePeriodeInitial() {
    let _day = 1;
    // let _monthI = _dateContrat.getMonth();
    let _monthI = 0;
    let _year = new Date().getFullYear();
    let _DateRetour = new Date(_year, _monthI, _day);
    return _DateRetour;
  }

  const GetPeriodes = async () => {
    const FetchSetDataPeriode = (data) => {
      if(data.length > 1)
      {

        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          element.k = `01-01-${element.k}`;
          element.v = `31-12-${element.v}`;
        }
      }else{
        let _lData = [];
        data.k = `01-01-${data.k}`;
        data.v = `31-12-${data.v}`;
        _lData[0] = data;
        data = _lData;

      }
        
      setListePeriodes(data);
      const PeriodeInitial = GetDatePeriodeInitial();
      const _indexPeriode = data.findIndex((p) => {
        return (
          GetDateFromStringDDMMYYY(p.k).getTime() <= PeriodeInitial.getTime() &&
          GetDateFromStringDDMMYYY(p.v).getTime() >= PeriodeInitial.getTime()
        );
      });
      setPeriodeEnCours(data[_indexPeriode]);
    };

    await GetContratPrestationPeriodes(
      tokenCt,
      ClientSiteContratCtx.storedClientSite.GUID,
      FetchSetDataPeriode
    );
  };

  const FetchDataPrestation = () => {
    if (ClientSiteContratCtx.storedClientSite.IdContrat === 0) {
      setIsLoadedPresta(true);
      return;
    }

    SetPrestations([]);

    GetPrestationContrat(
      tokenCt,
      DateSOAP(GetDateFromStringDDMMYYY(periodeEnCours.k)),
      DateSOAP(GetDateFromStringDDMMYYY(periodeEnCours.v)),
      ClientSiteContratCtx.storedClientSite.GUID,
      PrestationLoad
    );
  };

  const PrestationLoad = (data) => {
    SetPrestations(data);
    setIsLoadedPresta(true);
  };

  //#endregion

  //#region Evenement

  const AjouterUnAnPeriode = async () => {
    const _periodeEnCours = JSON.parse(JSON.stringify(periodeEnCours));
    const _indexPeriode = listePeriodes.findIndex(
      (f) =>
        GetDateFromStringDDMMYYY(f.k).getTime() ===
          GetDateFromStringDDMMYYY(_periodeEnCours.k).getTime() &&
        GetDateFromStringDDMMYYY(f.v).getTime() ===
          GetDateFromStringDDMMYYY(_periodeEnCours.v).getTime()
    );

    if (_indexPeriode < listePeriodes.length - 1) {
      setPeriodeEnCours(listePeriodes[_indexPeriode + 1]);
    }
  };

  const SoustraireUnAnPeriode = async () => {
    const _periodeEnCours = JSON.parse(JSON.stringify(periodeEnCours));
    const _indexPeriode = listePeriodes.findIndex(
      (f) =>
        GetDateFromStringDDMMYYY(f.k).getTime() ===
          GetDateFromStringDDMMYYY(_periodeEnCours.k).getTime() &&
        GetDateFromStringDDMMYYY(f.v).getTime() ===
          GetDateFromStringDDMMYYY(_periodeEnCours.v).getTime()
    );

    if (_indexPeriode > 0) {
      setPeriodeEnCours(listePeriodes[_indexPeriode - 1]);
    }
  };

  const HandleDropdownPeriodeSelect = async (index) => {
    const _periode = listePeriodes[index];
    setPeriodeEnCours(_periode);
  };

  //#endregion

  const DropDownYears = (small) => {
    let _arrayPeriodes = [];

    for (let index = 0; index < listePeriodes.length; index++) {
      const element = listePeriodes[index];
      let _dateStart = GetDateFromStringDDMMYYY(element.k);
      let _dateEnd = GetDateFromStringDDMMYYY(element.v);

      _arrayPeriodes.push({ dateStart: _dateStart, dateEnd: _dateEnd });
    }

    return (
      <DropdownButton
        variant=""
        className="button-periode"
        drop="down-centered"
        style={{ borderRadius: "10px" }}
        id="dropdown-datePeriode"
        // title={`Période : ${GetNomMois(dateDebutPeriode.getMonth() + 1, small)}
        //       ${dateDebutPeriode.getFullYear()} à
        //       ${GetNomMois(dateFinPeriode().getMonth() + 1, small)}
        //       ${dateFinPeriode().getFullYear()}`}

        title={`Période : ${GetNomMois(1, small)} ${GetDateFromStringDDMMYYY(
          periodeEnCours.k
        ).getFullYear()} à ${GetNomMois(12, small)} ${GetDateFromStringDDMMYYY(
          periodeEnCours.v
        ).getFullYear()}`}
        onSelect={(e) => {
          HandleDropdownPeriodeSelect(e);
        }}
      >
        {_arrayPeriodes.map((periode, index) => {
          return (
            // <Dropdown.Item key={index} eventKey={periode.dateStart}>
            <Dropdown.Item key={index} eventKey={index}>
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
    document.title = "Maintenance";

    setIsLoadedPresta(false);
    if (listePeriodes && listePeriodes.length === 0) {
      GetPeriodes();
    } else {
      FetchDataPrestation();
    }

    // eslint-disable-next-line
  }, [ClientSiteContratCtx.storedClientSite.GUID.GUID, periodeEnCours]);

  return (
    <Container fluid>
      <ContratPrestation
        IsLoaded={isLoadedPresta}
        Prestations={Prestations}
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
