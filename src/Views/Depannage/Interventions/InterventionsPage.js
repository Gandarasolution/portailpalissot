//#region Imports

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Stack from "react-bootstrap/Stack";

//#endregion

//#region Components
import {  GetNomMois, addOneYear, subOneYear } from "../../../functions";
import TableData, { CreateNewCell, CreateNewHeader } from "../../../components/commun/TableData";
import ImageExtension from "../../../components/commun/ImageExtension";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
//#endregion

//#endregion

const InterventionPage = () => {
  //#region Mockup

  const MockupListeInterventions = () => {
    let _inters = [];
    let _intervention = {
      DateDemande: new Date(2019, 0, 10),
      IdDossierIntervention: 2128,
      LibelleDossierIntervention: "Devis diagnostic",
      IdEtat: 1,
      LibelleEtat: "En cours",
      // IdFacture: null,
      // DateFacture: new Date(2019, 4, 13)
    };

    _inters.push(_intervention);

    _intervention = {
      DateDemande: new Date(2019, 1, 12),
      IdDossierIntervention: 2129,
      LibelleDossierIntervention: "Travaux sur la chaudière",
      IdEtat: 1,
      LibelleEtat: "Réalisé",
      IdFacture: 400516,
      DateFacture: new Date(2019, 4, 13),
    };

    _inters.push(_intervention);

    setListeInterventions(_inters);
  };

  //#endregion

  //#region States

  const [isLoaded, setIsLoaded] = useState(false);
  const [listeInterventions, setListeInterventions] = useState([]);

  const [gridColMDValue, setGridColMDValue] = useState(12);
  const [interSelected, setInterSelected] = useState(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);


  const [dateDebutPeriode, setDateDebutPeriode] = useState(
    GetDatePeriodeInitial())


  //#endregion

  //#region Fonctions

  function GetListeInterventionsPreFiltre() {
    let _lInters = JSON.parse(JSON.stringify(listeInterventions));



    return _lInters;
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
    let _headers = [];
    _headers.push(
      CreateNewHeader("DateDemande", true, "Date de la demande",EditorDate)
    );
    _headers.push(CreateNewHeader("IdDossierIntervention", true, "Code"));
    _headers.push(CreateNewHeader("LibelleDossierIntervention", true, "Objet de la demande"));
    _headers.push(
      CreateNewHeader("IdEtat", true, "État")
    );
    _headers.push(CreateNewHeader("IdFacture", false, "N° facture"));
    _headers.push(CreateNewHeader("DateFacture", false, "Date de la facture",EditorDate));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell("DateDemande", false, false, false,EditorDate)
    );
    _cells.push(CreateNewCell("IdDossierIntervention", true, true, false,));
    _cells.push(CreateNewCell("LibelleDossierIntervention", true, true, false,));
    _cells.push(CreateNewCell("IdEtat", false, false, false, EditorEtat));
    _cells.push(CreateNewCell("IdFacture", true, true, true, ()=>{},"tagInterventionfactures" ));
    _cells.push(CreateNewCell("DateFacture", false, false, true,EditorDate,"tagInterventionfactures" ));

    
    return _cells;
  }

  // const GetIntersSearched = () => {
  //   let _llisteInterventions = listeInterventions;

  //   if (search.length > 0) {
  //     _llisteInterventions = _llisteInterventions.filter(
  //       (item) =>
  //         item.LibelleDossierIntervention.toUpperCase().includes(
  //           search.toUpperCase()
  //         ) ||
  //         `DI${item.IdDossierIntervention.toString().toUpperCase()}`.includes(
  //           search.toUpperCase()
  //         ) ||
  //         (item.IdFacture &&
  //           `F${item.IdFacture.toString().toUpperCase()}`.includes(
  //             search.toUpperCase()
  //           ))
  //     );
  //   }

  //   _llisteInterventions = _llisteInterventions.sort(
  //     (a, b) => a.DateDemande - b.DateDemande
  //   );

  //   return _llisteInterventions;
  // };


  //#endregion

  //#region Evenements
  const AjouterUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = addOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);

    // setIsLoadedPresta(false);
    // await FetchDataPrestation();
  };

  const SoustraireUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = subOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);
    // setIsLoadedPresta(false);

    // await FetchDataPrestation();
  };

  const HandleDropdownPeriodeSelect = async (dateStart) => {
    let _dateTemp = new Date(dateStart);

    setDateDebutPeriode(_dateTemp);
    // setIsLoadedPresta(false);

    // await FetchDataPrestation();
  };

  //#endregion

  //#region TableData

 
  //#endregion

  //#region Component


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


 

  const CardDocuments = () => {
    if (!interSelected.IdFacture || interSelected.IdFacture <= 0) {
      return (
        <Card className="mb-2">
          <Card.Header className="card-document">Facture</Card.Header>
          <Card.Body></Card.Body>
          <p>Aucune facture.</p>
        </Card>
      );
    }

    async function makeRequest() {
      await delay(1000);

      setIsDocumentLoaded(true);
    }
    makeRequest();
    let _facture = { title: "Facture", extension: "pdf", size: "18 MO" };
    return (
      <Card className="mb-2">
        <Card.Header className="card-document">Facture</Card.Header>
        <Card.Body>
          {isDocumentLoaded ? (
            <Row className="mb-1">
              <Col md={3}>
                <ImageExtension extension={_facture.extension} />
              </Col>
              <Col md={9}>
                <Row>
                  <p className="mb-0 document-title">{`${_facture.title}${
                    _facture.extension.toUpperCase() === "ZIP"
                      ? ""
                      : `.${_facture.extension}`
                  }`}</p>
                  <span className="document-size">{`${_facture.size}`}</span>
                  <span className="document-links">
                    {_facture.extension.toUpperCase() !== "ZIP" && (
                      <Link to={"#"} target="_blank">
                        Voir
                      </Link>
                    )}
                    <Link
                      to={"#"}
                      target="_blank"
                      download={`${_facture.title}`}
                    >
                      Télécharger
                    </Link>
                  </span>
                </Row>
              </Col>
            </Row>
          ) : (
            <Placeholder animation="glow">
              <Placeholder xs={12} />
            </Placeholder>
          )}
        </Card.Body>
      </Card>
    );
  };

  //#endregion

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    async function makeRequest() {
      await delay(1000);

      setIsLoaded(true);
    }
    makeRequest();
    MockupListeInterventions();
  }, [isLoaded]);





  //#region Editors

const EditorDate = (date) => {
  if(!date) return "";
  return `${GetNomMois(new Date(date).getMonth() + 1)}  ${new Date(
    date
  ).getFullYear()}`;
};


const EditorEtat = (IdEtat) => {
return  <span className="badge badge-bg-success">{IdEtat} </span>
}

//#endregion



 

const TableInterventions = () => {


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
        Data={GetListeInterventionsPreFiltre()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        Pagination
        TopPannelLeftToSearch={
          <Col md={3} className="m-1">
            <div className="project-sort-nav">
              <nav>
                <ul>
                  <a
                    className="btn-filter text-decoration-none"
                    href="/depannage/nouvelleintervention"
                  >
                    Nouvelle intervention
                  </a>
                </ul>
              </nav>
            </div>
          </Col>
        }
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








  return (
    <Container fluid className="h-100">
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Interventions </span>|
        <span className="subtitle">
          {isLoaded ? (
            ` ${listeInterventions.length} intervention${
              listeInterventions.length > 1 ? "s" : ""
            } `
          ) : (
            <Placeholder animation="glow">
              <Placeholder xs={1} />
            </Placeholder>
          )}
        </span>
      </Col>


      <Container fluid >
        <Row>
          <Col md={gridColMDValue}>
           <TableInterventions />
          </Col>

          {gridColMDValue !== 12 && (
            <Col md={12 - gridColMDValue}>{CardDocuments()}</Col>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default InterventionPage;
