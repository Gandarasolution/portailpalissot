//#region Imports
import { createContext,  useState } from "react";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
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
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCardModel,
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
} from "../../../../components/commun/TableData";
import { GetNomMois } from "../../../../functions";
import TitreOfPage from "../../../../components/commun/TitreOfPage";

//#endregion

//#endregion

export const PrestaContext = createContext(null);

const ContratPrestation = ({
  Prestations,
  ParentComponentPeriodeSelect,
  IsLoaded,
}) => {

  const [showModalDoc, setShowModalDoc] = useState(false);
  const [showModalTaches, setShowModalTache] = useState(false);
  const [prestaSelected, setPrestaSelected] = useState(null);

  //#region Fonctions

  function GetLibEtat(e) {
    switch (Number(e)) {
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


  const _methodeDate = (e) => {
    return `${GetNomMois(new Date(e).getMonth() + 1)}  ${new Date(
      e
    ).getFullYear()}`;
  };

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader("DateInterventionPrestationTrimed", CreateFilter(true,true,false,false), "Date")
    );
    _headers.push(CreateNewHeader("Secteur", CreateFilter(true,true,false,true), "Secteur"));
    _headers.push(CreateNewHeader("IdPrestationContrat", CreateFilter(true,true,true,true), "N°"));
    _headers.push(
      CreateNewHeader("DescriptionPrestationContrat", CreateFilter(true,true,false,true), "Libellé")
    );
    _headers.push(CreateNewHeader("IdEtat", CreateFilter(true,true,false,false), "Etat",(e)=>{return GetLibEtat(e)}));
    _headers.push(CreateNewUnboundHeader(CreateFilter(false), "Actions"));

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


  function CreateButtonFiltersForTable()
  {
    let _arrBt = [];
  
    _arrBt.push(CreateNewButtonFilter("IdEtat",1,(e)=> {return GetLibEtat(e)}));
    _arrBt.push(CreateNewButtonFilter("IdEtat",95,(e)=> {return GetLibEtat(e)}));
    _arrBt.push(CreateNewButtonFilter("IdEtat",3,(e)=> {return GetLibEtat(e)}));
    _arrBt.push(CreateNewButtonFilter("IdEtat",96,(e)=> {return GetLibEtat(e)}));

    return _arrBt;
  }


  //#endregion

  //#region Evenements


  //#region Click

  //#endregion

  //#endregion

  //#region Composants

  //#region commun

 

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
        <Button className={`m-2 p-2 noBorder ${presta.IdEtat === 96 ? "bg-success" : "bg-secondary"} `}
        onClick={() => { if(presta.IdEtat === 96 ) {setShowModalDoc(true);setPrestaSelected(presta);}}}>
          <FontAwesomeIcon icon={faFile}  /> Liste des documents
        </Button>
        <Button
          className="m-2 p-2 noBorder bg-success"
          onClick={() => {setShowModalTache(true);setPrestaSelected(presta);} }
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
    const _ButtonFilters = CreateButtonFiltersForTable();



    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
      (presta) =>
        ` ${presta.IdPrestationContrat} - ${presta.DescriptionPrestationContrat}`
    );

    return (
      <PrestaContext.Provider value={{showModalDoc, showModalTaches, setShowModalDoc, setShowModalTache, prestaSelected}} >

      <TableData
        Data={GetPrestationTrimmed()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={IsLoaded}
        Pagination
        
        TopPannelRightToSearch={
          <Col md={"auto"} className="m-1">
            {ParentComponentPeriodeSelect}
          </Col>
        }

        CardModel={_CardModel}
        ButtonFilters={_ButtonFilters}
        
        />
        </PrestaContext.Provider>
    );
  };

  //#endregion

  //#endregion

  return (
    <Container fluid>
      <TitreOfPage titre={"Plannification"} soustitre={`${Prestations.length} prestations`} isLoaded={IsLoaded} />
      <TablePrestation />
    </Container>
  );
};

export default ContratPrestation;
