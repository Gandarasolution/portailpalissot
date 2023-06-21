//#region Imports
import { useState } from "react";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Placeholder from "react-bootstrap/Placeholder";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
//#endregion

//#region FontAwsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faCaretDown,
  // faCaretUp,
  faListCheck,
  faList,
  faFile,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

//#endregion

//#region Components
import TableData, {
  CreateNewCardModel,
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
} from "../../../../components/commun/TableData";
import { GetNomMois } from "../../../../functions";

//#endregion

//#endregion

const ContratPrestation = ({
  Prestations,
  ParentComponentPeriodeSelect,
  IsLoaded,
}) => {
  //#region Data

  //#endregion

  //#region States

  //#region Filters

  const [filterTous, setFilterTous] = useState(true);
  const [filterNP, setFilterNP] = useState(false);
  const [filterP, setFilterP] = useState(false);
  const [filterEC, setFilterEC] = useState(false);
  const [filterT, setFilterT] = useState(false);

  //#endregion




  //#endregion

  //#region Fonctions

  function GetLibEtat(e) {
    switch (e) {
      case 1:
        return "Non planifiée";
      case 95:
        return "Planifiée    ";
      case 3:
        return "En cours     ";
      case 96:
        return "Terminée     ";
      case -1:
        return "Tous         ";
      default:
        return "Non planifiée";
    }
  }

  function GetBadgeBgColor(e) {
    switch (e) {
      case 1:
        return "bg-warning";
      case 95:
        return "bg-primary";
      case 3:
        return "bg-danger";
      case 96:
        return "bg-success";
      default:
        return "Non planifiée";
    }
  }

  const GetListePrestationPrefiltre = () => {
    //Les prestations sont filtrés par le 'search'
    let _lPrestation = GetPrestationTrimmed();

    //Les prestations sont filtrés par les boutons d'état
    _lPrestation = FiltrePrestationsBouton(_lPrestation);

    // //Les prestations sont filtrés par les colonnes
    // _lPrestation = FiltrerParCollones(_lPrestation, arrayFilters);

    return _lPrestation;
  };

  const GetPrestationTrimmed = () => {
    let _lPrestation = Prestations;
    for (let index = 0; index < _lPrestation.length; index++) {
      const element = _lPrestation[index];
      element.DateInterventionPrestation = new Date(
        element.DateInterventionPrestation
      );

      element.DateInterventionPrestationTrimed = _methodeDate(
        element.DateInterventionPrestation
      );
    }

    if (_lPrestation.length) {
      _lPrestation = _lPrestation.sort(
        (a, b) => a.DateInterventionPrestation - b.DateInterventionPrestation
      );
    } else {
      if (!_lPrestation.IdPrestationContrat) return [];

      _lPrestation = [_lPrestation];
    }

    return _lPrestation;
  };

  function FiltrePrestationsBouton(_lPrestations) {
    if (!filterTous) {
      let _arrayFilterIdEtat = [];
      if (filterNP) _arrayFilterIdEtat.push(1);
      if (filterP) _arrayFilterIdEtat.push(95);
      if (filterEC) _arrayFilterIdEtat.push(3);
      if (filterT) _arrayFilterIdEtat.push(96);

      _lPrestations = _lPrestations.filter((presta) =>
        _arrayFilterIdEtat.includes(presta.IdEtat)
      );
    }

    return _lPrestations;
  }

  function GetFilterState(idEtat) {
    switch (idEtat) {
      case 1:
        return filterNP;
      case 95:
        return filterP;
      case 3:
        return filterEC;
      case 96:
        return filterT;
      default:
        return null;
    }
  }

  function GetFilterSetState(idEtat) {
    switch (idEtat) {
      case 1:
        return setFilterNP;
      case 95:
        return setFilterP;
      case 3:
        return setFilterEC;
      case 96:
        return setFilterT;
      default:
        return null;
    }
  }

  const _methodeDate = (e) => {
    return `${GetNomMois(new Date(e).getMonth() + 1)}  ${new Date(
      e
    ).getFullYear()}`;
  };

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader("DateInterventionPrestationTrimed", true, "Date")
    );
    _headers.push(CreateNewHeader("Secteur", true, "Secteur"));
    _headers.push(CreateNewHeader("IdPrestationContrat", true, "N°"));
    _headers.push(
      CreateNewHeader("DescriptionPrestationContrat", true, "Libellé")
    );
    _headers.push(CreateNewHeader("IdEtat", true, "Etat"));
    _headers.push(CreateNewUnboundHeader(false, "Actions"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell("DateInterventionPrestationTrimed", true, true, false)
    );
    _cells.push(CreateNewCell("Secteur", true, true, false));
    _cells.push(CreateNewCell("IdPrestationContrat", false, true, false));
    _cells.push(
      CreateNewCell("DescriptionPrestationContrat", true, true, false)
    );
    _cells.push(
      CreateNewCell("IdEtat", false, false, false, EditorColonneEtat)
    );
    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionTaches,
        "tagListeTaches"
      )
    );
    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionDocuments,
        "tagListeDocuments"
      )
    );
    return _cells;
  }

  //#endregion

  //#region Evenements

  //#region Filtres

  const handleTousFilter = () => {
    let _valueStart = JSON.parse(JSON.stringify(filterTous));

    if (_valueStart) {
      //on décoche la case tous : vérification qu'il y a au moins 1 filtre actif
      if (filterEC || filterNP || filterP || filterT) {
        setFilterTous(false);
      }
    } else {
      //on coche la case tous : on décoche tous les filtres

      setFilterEC(false);
      setFilterNP(false);
      setFilterP(false);
      setFilterT(false);

      setFilterTous(true);
    }
  };

  const handleEtatsFilter = (props) => {
    let _valueStart = JSON.parse(JSON.stringify(props.state));

    if (_valueStart) {
      //on décoche la case d'un filtre : vérification qu'il y a au moins un autre filtre sinon on coche la case tous
      props.setState(false);
    } else {
      //on coche la case d'un filtre : on décoche la case Tous
      setFilterTous(false);
      props.setState(true);
    }
  };

  //#endregion

  //#region Click

  //#endregion

  //#endregion

  //#region Composants

  //#region commun

  //#region Panel de recherche

  const ButtonFilter = ({ IdEtat }) => {
    if (IdEtat === -1) {
      return (
        <li
          className={filterTous ? "li-actif" : "li-inactif"}
          onClick={() => handleTousFilter()}
        >
          {GetLibEtat(IdEtat)}
        </li>
      );
    } else {
      return (
        <li
          className={GetFilterState(IdEtat) ? "li-actif" : "li-inactif"}
          onClick={() =>
            handleEtatsFilter({
              state: GetFilterState(IdEtat),
              setState: GetFilterSetState(IdEtat),
            })
          }
        >
          {GetLibEtat(IdEtat)}
        </li>
      );
    }
  };

  //#endregion

  //#region TableData

  //#region Editors

  const EditorColonneEtat = (IdEtat) => {
    return (
      <span className={`badge badge-${GetBadgeBgColor(IdEtat)}`}>
        {GetLibEtat(IdEtat)}
      </span>
    );
  };

  const EditorCardBody = (presta) => {
    return (
      <>
        <h6>{`Secteur : ${presta.Secteur}`}</h6>
        <Button className="m-2 p-2">
          <FontAwesomeIcon icon={faFile} /> Liste des documents
        </Button>
        <Button
          className="m-2 p-2"
          // onClick={() => handleAfficerListeTache(presta)}
        >
          <FontAwesomeIcon icon={faList} /> Relevés de tâches
        </Button>
      </>
    );
  };

  const EditorCardTitle = (presta) => {
    return (
      <>
        <Row>
          <Col>
            {`${GetNomMois(
              new Date(presta.DateInterventionPrestation).getMonth() + 1
            )} 
            ${new Date(presta.DateInterventionPrestation).getFullYear()} `}
          </Col>

          <Col>
            <span className={`badge badge-${GetBadgeBgColor(presta.IdEtat)}`}>
              {GetLibEtat(presta.IdEtat)}
            </span>
          </Col>
        </Row>
      </>
    );
  };
  const EditorActionDocuments = (presta) => {
    return (
      <span className="ms-2">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Liste des documents</Tooltip>}
        >
          <FontAwesomeIcon
            icon={faFileAlt}
            className={presta.IdEtat === 96 ? "bt-actif" : "bt-inactif"}
          />
        </OverlayTrigger>
      </span>
    );
  };

  const EditorActionTaches = () => {
    return (
      <span>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Relevés de tâches</Tooltip>}
        >
          <span>
            <FontAwesomeIcon icon={faListCheck} className="bt-actif" />
          </span>
        </OverlayTrigger>
      </span>
    );
  };

  //#endregion

  const TablePrestation = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
      (presta) =>
        ` ${presta.IdPrestationContrat} - ${presta.DescriptionPrestationContrat}`
    );

    return (
      <TableData
        Data={GetListePrestationPrefiltre()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={IsLoaded}
        Pagination
        TopPannelLeftToSearch={
          <Col className="m-1" md={"auto"}>
            <div className="project-sort-nav">
              <nav>
                <ul>
                  <ButtonFilter IdEtat={-1} />
                  <ButtonFilter IdEtat={1} />
                  <ButtonFilter IdEtat={95} />
                  <ButtonFilter IdEtat={3} />
                  <ButtonFilter IdEtat={96} />
                </ul>
              </nav>
            </div>
          </Col>
        }
        TopPannelRightToSearch={
          <Col md={"auto"} className="m-1">
            {ParentComponentPeriodeSelect}
          </Col>
        }
        CardModel={_CardModel}
      />
    );
  };

  //#endregion

  //#endregion

  return (
    <Container fluid>
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Plannification </span>|
        <span className="subtitle">
          {IsLoaded ? (
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
          )}
        </span>
      </Col>

      <TablePrestation />
    </Container>
  );
};

export default ContratPrestation;
