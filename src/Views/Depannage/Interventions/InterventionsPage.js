//#region Imports

import { useEffect, useState, useContext } from "react";

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

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
  EditorDateFromDateTime,
  EditorActionsTooltip
} from "../../../components/commun/TableData";

import {
  faFile,
  faFilePdf,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { GetListeInterventions } from "../../../axios/WS_Intervention";
import { ClientSiteContratContext, TokenContext } from "../../../App";
import { Row } from "react-bootstrap";
//#endregion

//#endregion

const InterventionPage = ({ setPageSubtitle, setPageTitle }) => {
  const TokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);

  //#region States

  const [isLoaded, setIsLoaded] = useState(false);
  const [listeInterventions, setListeInterventions] = useState([]);

  //#endregion

  //#region Fonctions

  const GetData = async () => {
    setIsLoaded(false);
    const FetchSetData = (data) => {
      setListeInterventions(data);
      setPageSubtitle(`${data.length} interventions`);

      setIsLoaded(true);
    };

    await GetListeInterventions(
      TokenCt,
      ClientSiteCt.storedClientSite.GUID,
      FetchSetData
    );
  };

  function GetListeInterventionsTrimed() {
    let _lInters = JSON.parse(JSON.stringify(listeInterventions));
    for (let index = 0; index < _lInters.length; index++) {
      const element = _lInters[index];
      element.DateFacture = element.DateFacture ? element.DateFacture : "";

      element.LibEtat = JSON.parse(JSON.stringify(element.Etat.LibEtat));
      element.VerrouEtat = JSON.parse(JSON.stringify(element.Etat.VerrouEtat));
    }

    return _lInters;
  }

  function GetBGColorByLibEtat(LibEtat) {
    const VerrouEtat = JSON.parse(JSON.stringify(listeInterventions)).find(
      (f) => {
        return String(f.Etat.LibEtat) === String(LibEtat);
      }
    ).Etat.VerrouEtat;
    return GetBGColorByVerrouEtat(VerrouEtat);
  }
  function GetBGColorByVerrouEtat(VerrouEtat) {
    switch (VerrouEtat) {
      case 0:
        return "warning";
      case 1:
        return "primary";
      case 2:
        return "secondary";
      case 3:
        return "success";
      default:
        return "danger";
    }
  }

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader(
        "DateDemandeDossierInterventionSAV",
        CreateFilter(true, false, false, false, true),
        "Date de la demande",
        EditorDateFromDateTime
      )
    );
    _headers.push(
      CreateNewHeader(
        "DescriptionSecteur",
        CreateFilter(true, true, false, true),
        "Secteur"
      )
    );
    _headers.push(
      CreateNewHeader(
        "IdDossierInterventionSAV",
        CreateFilter(true, true, false, true),
        "Code"
      )
    );
    _headers.push(
      CreateNewHeader(
        "DescriptionDossierInterventionSAV",
        CreateFilter(true, true, false, true),
        "Objet de la demande"
      )
    );
    _headers.push(
      CreateNewHeader("LibEtat", CreateFilter(true, true, false, false), "État")
    );

    _headers.push(
      CreateNewHeader("Action", CreateFilter(), "Action")
    );
    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell(
        "DateDemandeDossierInterventionSAV",
        false,
        false,
        false,
        EditorDateFromDateTime
      )
    );
    _cells.push(CreateNewCell("DescriptionSecteur", false, true, false));
    _cells.push(CreateNewCell("IdDossierInterventionSAV", true, true, false));
    _cells.push(
      CreateNewCell("DescriptionDossierInterventionSAV", true, true, false)
    );
    _cells.push(CreateNewCell("LibEtat", false, false, false, EditorEtat));


    const actionsForIntervention = (inter) => [
      {
        label: "Voir les documents",
        onClick: () => EditorActionDocuments,
        className: "action-view-maintenance",
        icon: faFile
      }
    ];
    
    _cells.push(
      CreateNewCell("Action", false, true, false, (val, row) =>
        <EditorActionsTooltip actions={actionsForIntervention(row)} />
      )
    );

    return _cells;
  }

  function CreateButtonFilters() {
    let _bt = [];
    _bt.push(CreateNewButtonFilter("VerrouEtat", 1, EditorFiltres));
    _bt.push(CreateNewButtonFilter("VerrouEtat", 2, EditorFiltres));
    _bt.push(CreateNewButtonFilter("VerrouEtat", 3, EditorFiltres));
    _bt.push(CreateNewButtonFilter("VerrouEtat", 4, EditorFiltres));

    return _bt;
  }

  //#endregion

  //#region Component

  //#endregion

  useEffect(() => {
    document.title = "Dépannage";
    setPageTitle(`Dépannage`);

    GetData();
    // eslint-disable-next-line
  }, [ClientSiteCt.storedClientSite.GUID]);

  //#region Editors

  const EditorFiltres = (VerrouEtat) => {
    let _text = "";
    switch (VerrouEtat) {
      case 0:
        _text = "En attente";
        break;
      case 1:
        _text = "En cours";
        break;
      case 2:
        _text = "Attente facturation";
        break;
      case 3:
        _text = "Facturé";
        break;
      default:
        _text = "Autres";
        break;
    }

    return <span>{_text}</span>;
  };

  const EditorActionDocuments = (inter) => {
    return (
      <Button>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Voir les documents</Tooltip>}
        >
          <FontAwesomeIcon icon={faFile} />
        </OverlayTrigger>
      </Button>
    );
  };

  const EditorEtat = (Etat) => {
    return (
      <div className={` text-wrap badge badge-bg-${GetBGColorByLibEtat(Etat)}`}>
        {Etat}{" "}
      </div>
    );
  };

  //#endregion

  const EditorCardBody = (inter) => {
    return (
      <>
        <h6>{`Secteur : ${inter.DescriptionSecteur}`}</h6>
        <Button
          className={`m-2 p-2 noBorder bg-success`}
          onClick={() => {
          }
          }
        >
          <FontAwesomeIcon icon={faFile} /> Liste des documents
        </Button>
      </>
    )
  }


  const EditorCardTitle = (inter) => {
    return (
      <>
        <Row>
          <Col>
            {EditorDateFromDateTime(inter.DateDemandeDossierInterventionSAV)}
          </Col>

          <Col>
            {EditorEtat(inter.LibEtat)}
          </Col>
        </Row>
      </>
    );
  }

  const TableInterventions = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    const _ButtonFilter = CreateButtonFilters();
    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
      (inter) =>
        ` ${inter.IdDossierInterventionSAV} - ${inter.DescriptionDossierInterventionSAV}`
    );



    return (
      <TableData
        Data={GetListeInterventionsTrimed()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        Pagination
        ButtonFilters={_ButtonFilter}
        // TopPannelRightToSearch={
        //   <Col md={"auto"} className="m-1">
        //     <Button
        //       variant="danger"
        //       onClick={() => (window.location.href = "/nouvelleintervention")}
        //     >
        //       Demander une nouvelle intervention
        //     </Button>
        //   </Col>
        // }

        CardModel={_CardModel}
      />
    );
  };

  return (
    <Container fluid className="table-depannage">
      <Container fluid>
        <TableInterventions />
      </Container>
    </Container>
  );
};

export default InterventionPage;
