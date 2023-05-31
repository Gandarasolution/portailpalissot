//#region Imports


import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import TableData from "../../../components/commun/TableData";
import { useEffect, useState } from "react";

//#region Bootstrap

//#endregion

//#region Components

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

  //#endregion

  //#region Fonctions

  function GetListeInterventionsPreFiltre() {
    let _lInters = JSON.parse(JSON.stringify(listeInterventions));

    //Filtré par search

    //Filtrés par boutons d'état

    //Filtrés par colonnes
    _lInters = FiltreColonnes(_lInters);

    return _lInters;
  }

  function FiltreColonnes(_lInters) {
    if (arrayFilters.length > 0) {
      let _arrayIdDossierIntervention = arrayFilters.filter(
        (filter) => filter.fieldname === "IdDossierIntervention"
      );

      let _arrayLibelle = arrayFilters.filter(
        (filter) => filter.fieldname === "LibelleDossierIntervention"
      );

      let _arrayEtat = arrayFilters.filter(
        (filter) => filter.fieldname === "LibelleEtat"
      );

      let _dateFacture = arrayFilters.filter(
        (filter) => filter.fieldname === "DateFacture"
      );

      if (_arrayIdDossierIntervention.length > 0)
        _lInters = _lInters.filter(
          (inter) =>
            _arrayIdDossierIntervention.filter(
              (filter) =>
                Number(filter.item) === Number(inter.IdDossierIntervention)
            ).length > 0
        );

      if (_arrayLibelle.length > 0)
        _lInters = _lInters.filter(
          (inter) =>
            _arrayLibelle.filter(
              (filter) => filter.item === inter.LibelleDossierIntervention
            ).length > 0
        );

      if (_arrayEtat.length > 0)
        _lInters = _lInters.filter(
          (inter) =>
            _arrayEtat.filter((filter) => filter.item === inter.LibelleEtat)
              .length > 0
        );

      if (_dateFacture.length > 0)
        _lInters = _lInters.filter(
          (inter) =>
            _dateFacture.filter(
              (filter) =>
                new Date(filter.item).getTime() ===
                new Date(inter.DateFacture).getTime()
            ).length > 0
        );
    }

    return _lInters;
  }

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
        method: (e) => {
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
        method: _methodeDate,
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
      };
      _cells.push(_DateDemande);

      let _code = {
        text: `DI${inter.IdDossierIntervention}`,
        isSearchable: false,
        isH1: false,
      };
      _cells.push(_code);

      let _lib = {
        text: inter.LibelleDossierIntervention,
        isSearchable: false,
        isH1: false,
      };
      _cells.push(_lib);

      let _etat = {
        text: <span className="badge badge-bg-success">{inter.LibelleEtat} </span>,
        isSearchable: false,
        isH1: false,
      };
      _cells.push(_etat);

      let _idFacture = {
        text:
          inter.IdFacture && inter.IdFacture > 0 ? `F${inter.IdFacture}` : null,
        isSearchable: false,
        isH1: false,
      };
      _cells.push(_idFacture);

      let _dateFacture = {
        text: inter.DateFacture
          ? new Date(inter.DateFacture).toLocaleDateString("fr-FR")
          : null,
        isSearchable: false,
        isH1: false,
      };
      _cells.push(_dateFacture);

      let _row = { data: inter, cells: _cells };

      _body.push(_row);
    }
    return _body;
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

      <Row className="mb-2">
        <Col className="m-1">
          <Nav fill>
            <Nav.Item>
              <Nav.Link className="btn-filter border">
                Nouvelle intervention
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>

      <Container fluid className="container-table p-4">
        <TableData
          IsLoaded={isLoaded}
          placeholdeNbLine={5}
          headers={_header}
          lData={_Data()}
          rawData={listeInterventions}
          handleCheckfilterChange={handleCheckfilterChange}
          isFiltercheckboxShouldBeCheck={IsFiltercheckboxShouldBeCheck}
          isRowActive={() => {
            return false;
          }}
           Pagination
        />
      </Container>
    </Container>
  );
};

export default InterventionPage;
