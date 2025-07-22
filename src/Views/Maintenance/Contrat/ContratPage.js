//#region Imports
import { useEffect, useState, useContext } from "react";

//#region Bootstrap
import Container from "react-bootstrap/Container";
//#endregion

//#region FontAwesome
//#endregion

//#region Components
import ContratPrestation from "./Components/ContratPrestations";
import {
  GetPrestationContrat,
} from "../../../axios/WS_Contrat";
import { ClientSiteContratContext, TokenContext } from "../../../App";
import {
  DateSOAP,
  GetDateFromStringDDMMYYY,
} from "../../../functions";

//#endregion

//#endregion

const ContratPage = ({ setPageSubtitle, setPageTitle, periodeEnCours, IsSetPeriode }) => {
  const tokenCt = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  //#region Données

  //#endregion

  //#region States
  const [isLoadedPresta, setIsLoadedPresta] = useState(false);
  const [Prestations, SetPrestations] = useState([]);


  //#endregion

  //#region Fonctions

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
    setPageSubtitle(`${data.length}`);

    setIsLoadedPresta(true);
  };

  //#endregion


  useEffect(() => {
    document.title = "Maintenance";
    setPageTitle(`Maintenance`);
    setIsLoadedPresta(false);
    if (IsSetPeriode) {
      FetchDataPrestation();
    }
    // eslint-disable-next-line
  }, [ClientSiteContratCtx.storedClientSite.GUID, periodeEnCours]);

  return (
    <Container fluid>
      <ContratPrestation
        IsLoaded={isLoadedPresta}
        Prestations={Prestations}
      />
    </Container>
  );
};

export default ContratPage;
