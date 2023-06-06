//#region Imports

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";

//#endregion

//#region Components
import { FiltrerParCollones } from "../../../functions";
import Search from "../../../components/commun/Search";
import TableData from "../../../components/commun/TableData";
import ImageExtension from "../../../components/commun/ImageExtension";
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

  const [arrayFilters, setArrayFilters] = useState([]);

  const [search, setSearch] = useState("");

  const [gridColMDValue, setGridColMDValue] = useState(12);
  const [interSelected, setInterSelected] = useState(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);

  //#endregion

  //#region Fonctions

  function GetListeInterventionsPreFiltre() {
    let _lInters = JSON.parse(JSON.stringify(listeInterventions));

    //Filtré par search
    _lInters = GetIntersSearched();
    //Filtrés par boutons d'état

    //Filtrés par colonnes
    _lInters = FiltrerParCollones(_lInters, arrayFilters);

    return _lInters;
  }

  const GetIntersSearched = () => {
    let _llisteInterventions = listeInterventions;

    if (search.length > 0) {
      _llisteInterventions = _llisteInterventions.filter(
        (item) =>
          item.LibelleDossierIntervention.toUpperCase().includes(
            search.toUpperCase()
          ) ||
          `DI${item.IdDossierIntervention.toString().toUpperCase()}`.includes(
            search.toUpperCase()
          ) ||
          (item.IdFacture &&
            `F${item.IdFacture.toString().toUpperCase()}`.includes(
              search.toUpperCase()
            ))
      );
    }

    _llisteInterventions = _llisteInterventions.sort(
      (a, b) => a.DateDemande - b.DateDemande
    );

    return _llisteInterventions;
  };

  function IsFiltercheckboxShouldBeCheck(fieldname, item) {
    if (
      arrayFilters.findIndex(
        (filter) => filter.fieldname === fieldname && filter.item === item
      ) > -1
    )
      return true;
    return false;
  }

  //#endregion

  //#region Evenements
  const handleCheckfilterChange = (checked, key, value) => {
    let _arrTemp = JSON.parse(JSON.stringify(arrayFilters));

    if (checked) {
      _arrTemp.push({ fieldname: key, item: value });
      setArrayFilters(_arrTemp);
    } else {
      const index = _arrTemp.findIndex(
        (filter) => filter.fieldname === key && filter.item === value
      );
      if (index > -1) {
        _arrTemp.splice(index, 1);
        setArrayFilters(_arrTemp);
      }
    }
  };

  const handleLigneClicked = (intervention) => {
    setInterSelected(intervention);
    setGridColMDValue(10);
    setIsDocumentLoaded(false);
  };

  //#endregion

  //#region TableData

  const _methodeDate = (e) => {
    return new Date(e).toLocaleDateString("fr-FR");
  };

  const _header = [
    {
      title: "Date de la demande",
    },

    {
      title: "Code",
      filter: {
        fieldname: "IdDossierIntervention",
        affichageMethod: (e) => {
          return `DI${e}`;
        },
      },
    },
    {
      title: "Objet de la demande",
      filter: {
        fieldname: "LibelleDossierIntervention",
      },
    },
    {
      title: "État",
      filter: {
        fieldname: "LibelleEtat",
      },
    },
    {
      title: "N° Facture",
    },
    {
      title: "Date Facture",
      filter: {
        fieldname: "DateFacture",
        affichageMethod: _methodeDate,
      },
    },
  ];

  const _Data = () => {
    let _body = [];

    let _linters = GetListeInterventionsPreFiltre();

    for (let index = 0; index < _linters.length; index++) {
      const inter = _linters[index];
      let _cells = [];

      let _DateDemande = {
        text: new Date(inter.DateDemande).toLocaleDateString("fr-FR"),
        isSearchable: false,
        isH1: false,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_DateDemande);

      let _code = {
        text: `DI${inter.IdDossierIntervention}`,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_code);

      let _lib = {
        text: inter.LibelleDossierIntervention,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_lib);

      let _etat = {
        text: (
          <span className="badge badge-bg-success">{inter.LibelleEtat} </span>
        ),
        isSearchable: false,
        isH1: false,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_etat);

      let _idFacture = {
        text:
          inter.IdFacture && inter.IdFacture > 0 ? `F${inter.IdFacture}` : null,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_idFacture);

      let _dateFacture = {
        text: inter.DateFacture
          ? new Date(inter.DateFacture).toLocaleDateString("fr-FR")
          : null,
        isSearchable: false,
        isH1: false,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_dateFacture);

      let _row = { data: inter, cells: _cells };

      _body.push(_row);
    }
    return _body;
  };

  //#endregion

  //#region Component

  const Pannel = () => {
    return (
      <Row className="mb-2">
        <Col md={6} className="m-1">
          <Nav fill>
            <Nav.Item>
              <Nav.Link className="btn-filter border">
                Nouvelle intervention
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        <Col className="m-1">
          <Search setSearch={setSearch} />
        </Col>
      </Row>
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

      {Pannel()}

      <Container fluid className="container-table p-4">
        <Row>
          <Col md={gridColMDValue}>
            <TableData
              IsLoaded={isLoaded}
              placeholdeNbLine={5}
              headers={_header}
              lData={_Data()}
              rawData={listeInterventions}
              handleCheckfilterChange={handleCheckfilterChange}
              isFiltercheckboxShouldBeCheck={IsFiltercheckboxShouldBeCheck}
              // isRowActive={(inter) => {
              //   return ( inter ?
              //     inter.IdDossierIntervention === interSelected.IdDossierIntervention
              //     : false
              //   );
              // }}
              isRowActive={()=>{return false}}
              Pagination
              search={search}
            />
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
