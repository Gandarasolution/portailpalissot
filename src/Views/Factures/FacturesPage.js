//#region Imports

import { useState } from "react";
import { Button, Col, Container, Dropdown, DropdownButton, Stack } from "react-bootstrap";
import TableData, {
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
} from "../../components/commun/TableData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faDownload, faEye } from "@fortawesome/free-solid-svg-icons";
import { DateSOAP, GetNomMois, addOneYear, subOneYear } from "../../functions";
import { GetListeFactures } from "../../axios/WSGandara";
import { useContext } from "react";
import { ClientSiteContratContext, TokenContext } from "../../App";
import { useEffect } from "react";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const FacturesPage = () => {

  const tokenCt = useContext(TokenContext);
  const clientSiteCt = useContext(ClientSiteContratContext);

  //#region States
  const [isFacturesLoaded, setIsFactureLoaded] = useState(false);
  const [listeFactures, setListeFactures] = useState([]);
  const [dateDebutPeriode, setDateDebutPeriode] = useState(
    GetDatePeriodeInitial())

  //#endregion

  //#region Fonctions

const GetListeInterventions = async () => {
  const FetchSetData = (data) => {
    setListeFactures(data);
    setIsFactureLoaded(true);
  }

  await GetListeFactures(tokenCt,clientSiteCt.storedClientSite, DateSOAP(dateDebutPeriode), DateSOAP(dateFinPeriode()), FetchSetData );

}



  /**
   * Construit la date de début des preriodes initial
   * @returns ([1] / [DateContratSouscrit.getMonth] / [Date.Now.getYear])
   */
  function GetDatePeriodeInitial() {
    let _day = 1;
    // let _monthI = _dateContrat.getMonth();
    let _monthI = 0;
    let _year = new Date().getFullYear();
    let _DateRetour = new Date(_year, _monthI, _day);
    return _DateRetour;
  }



  const dateFinPeriode = () => {
    let _dateEndTmp = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));

    _dateEndTmp = addOneYear(_dateEndTmp);

    var day = _dateEndTmp.getDate() - 1;
    _dateEndTmp.setDate(day);

    return new Date(_dateEndTmp);
  };






  function CreateHeaderForTable() {

    // Date	Code	Libellé	Total HT	Total TTC	Origine	Type

    let _headers = [];
    _headers.push(
      CreateNewHeader("DateFacture", true, "Date")
    );
    _headers.push(CreateNewHeader("IdFacture", true, "Facture N°"));
    _headers.push(CreateNewHeader("LibelleFacture", true, "Libellé"));
    _headers.push(
      CreateNewHeader("TotalHTFacture", true, "Total HT")
    );
    _headers.push(CreateNewHeader("TotalTTCFacture", true, "Total TTC"));
    _headers.push(CreateNewHeader("OrigineFacture", true, "Origine"));
    _headers.push(CreateNewHeader("TypeFacture", true, "Type"));
    _headers.push(CreateNewUnboundHeader(false, "Actions"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell("DateFacture", true, true, false)
    );
    _cells.push(CreateNewCell("IdFacture", true, true, false));
    _cells.push(CreateNewCell("LibelleFacture", false, true, false));
    _cells.push(
      CreateNewCell("TotalHTFacture", true, true, false)
    );
    _cells.push(CreateNewCell("TotalTTCFacture", false, true, false));
    _cells.push(CreateNewCell("OrigineFacture", false, true, false));
    _cells.push(CreateNewCell("TypeFacture", false, true, false));

    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionVoir,
        "tagFactureVoir"
      )
    );
    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionTelecharger,
        "tagFactureTelecharger"
      )
    );
    return _cells;
  }


//#region Editors

const EditorActionVoir = (e) => {

    return (
        <FontAwesomeIcon icon={faEye}  />
    )
}

const EditorActionTelecharger = (e) => {
    return (
        <FontAwesomeIcon icon={faDownload} />
    )
}


//#endregion


  //#endregion

  //#region Evenements

  const AjouterUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = addOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);

    setIsFactureLoaded(false);
     await GetListeInterventions()
  };

  const SoustraireUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = subOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);
    setIsFactureLoaded(false);
     await GetListeInterventions()
  };

  const HandleDropdownPeriodeSelect = async (dateStart) => {
    let _dateTemp = new Date(dateStart);

    setDateDebutPeriode(_dateTemp);
    setIsFactureLoaded(false);
     await GetListeInterventions()
  };
  //#endregion

  //#region Composants



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



  //#region TableData

  const TableFactures = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    // const _CardModel = CreateNewCardModel(
    //   EditorCardBody,
    //   EditorCardTitle,
    //   (presta) =>
    //     ` ${presta.IdPrestationContrat} - ${presta.DescriptionPrestationContrat}`
    // );

    return (
      <TableData
        // Data={GetListePrestationPrefiltre()}
        Data={listeFactures}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isFacturesLoaded}
        Pagination
        // TopPannelLeftToSearch={
        //   <Col className="m-1" md={"auto"}>
        //     <div className="project-sort-nav">
        //       <nav>
        //         <ul>
        //           <ButtonFilter IdEtat={-1} />
        //           <ButtonFilter IdEtat={1} />
        //           <ButtonFilter IdEtat={95} />
        //           <ButtonFilter IdEtat={3} />
        //           <ButtonFilter IdEtat={96} />
        //         </ul>
        //       </nav>
        //     </div>
        //   </Col>
        // }
        TopPannelRightToSearch={
          <Col md={"auto"} className="m-1">
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
          </Col>
        }
        // CardModel={_CardModel}
      />
    );
  };

  //#endregion
  //#endregion


useEffect(()=> {
  GetListeFactures();
},[isFacturesLoaded])

  return (
    <Container fluid className="h-100">
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Factures </span>|
        <span className="subtitle">
          {/* {IsLoaded ? (
                ` ${
                  Prestations.length
                    ? Prestations.length
                    : Prestations.IdPrestationContrat
                    ? 1
                    : 0
                } prestations`
              ) : (
                <Placeholder animation="glow">
                  <Placeholder xs={1} />
                </Placeholder>
              )} */}
        </span>
      </Col>

      <TableFactures />
    </Container>
  );
};

export default FacturesPage;
