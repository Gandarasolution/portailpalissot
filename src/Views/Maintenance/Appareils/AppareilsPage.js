//#region Imports
import { useState, useEffect, useContext } from "react";
//#region FontAwsome icones

//#endregion

//#region Bootstrap

import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";

//#endregion

//#region Components
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCardModel,
  CreateNewCell,
  CreateNewHeader,
} from "../../../components/commun/TableData";

//#endregion

//#region DEV
import { GetListeAppareils } from "../../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../../App";
import TitreOfPage from "../../../components/commun/TitreOfPage";

//#endregion

//#endregion

const AppareilsPage = () => {
  const tokenCx = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  //#region Mockup

  const [listeAppareils, setListeAppareils] = useState([]);

  //#endregion

  //#region States
  const [isLoaded, setIsLoaded] = useState(false);

  //#endregion

  //#endregion

  //#region Fonctions
  const FetchSetListeAppareils = (data) => {
    setListeAppareils(data);
    setIsLoaded(true);
  };

  const GetAppareils = async () => {
    setIsLoaded(false);
    await GetListeAppareils(
      tokenCx,
      ClientSiteContratCtx.storedClientSite.GUID,
      FetchSetListeAppareils
    );
  };

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader(
        "RefClientAppareilSecteur",
        CreateFilter(true, true, false, true),
        "Secteur"
      )
    );
    _headers.push(
      CreateNewHeader(
        "IdAppareilSecteur",
        CreateFilter(true, true, true, true),
        "Code"
      )
    );
    _headers.push(
      CreateNewHeader(
        "DesignationAppareilSecteur",
        CreateFilter(true, true, false, true),
        "Libelle"
      )
    );
    _headers.push(CreateNewHeader("IdEtat", CreateFilter(), "État"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(CreateNewCell("RefClientAppareilSecteur", false, true, false));
    _cells.push(CreateNewCell("IdAppareilSecteur", false, true, false));
    _cells.push(CreateNewCell("DesignationAppareilSecteur", true, true, false));
    _cells.push(CreateNewCell("IdEtat", false, false, false, EditorEtat));

    return _cells;
  }

  function CreateButtonFilters() {
    let _bt = [];
    _bt.push(CreateNewButtonFilter("IdEtat", 56, EditorFilter));
    _bt.push(CreateNewButtonFilter("IdEtat", 206, EditorFilter));
    _bt.push(CreateNewButtonFilter("IdEtat", 57, EditorFilter));
    return _bt;
  }

  /**
   * Retourne la liste des appareils filtrée
   * @returns La liste des appareils à laquelle on a appliqué les filtres, le search et l'order by
   */
  const GetAppareilsTrimed = () => {
    let _listeAppareil = listeAppareils;

    return _listeAppareil;
  };

  function GetBGColorAppareilEtat(IdEtat) {
    switch (IdEtat) {
      case 206:
        return "secondary";
      case 56:
        return "primary";
      case 57:
        return "danger";
      default:
        break;
    }
  }

  function GetLibelleEtat(IdEtat) {
    switch (IdEtat) {
      case 56:
        return "Actif";
      case 57:
        return "Detruit";
      case 206:
        return "Hors contrat";
      default:
        break;
    }
  }
  //#endregion

  //#region Evenements

  //#endregion

  //#region Component

  //#region commun
  const AppareilBlue = require("../../../image/bottle.png");
  const AppareilGrey = require("../../../image/bottleGrey.png");
  const AppareilRed = require("../../../image/bottleRed.png");

  const GetImageAppareilEtat = ({ IdEtat, className }) => {
    return (
      <Image
        className={className}
        src={
          IdEtat === 206
            ? AppareilGrey
            : IdEtat === 56
            ? AppareilBlue
            : AppareilRed
        }
      />
    );
  };
  //#endregion

  //#region TableData

  //#region Editors
  const EditorEtat = (IdEtat) => {
    return (
      <span className={`badge badge-bg-${GetBGColorAppareilEtat(IdEtat)}`}>
        {GetLibelleEtat(IdEtat)}
      </span>
    );
  };

  const EditorFilter = (value) => {
    return (
      <span>
        {/* <GetImageAppareilEtat IdEtat={value} className={"img-bt-filter"} /> */}
        {GetLibelleEtat(value)}
      </span>
    );
  };

  const EditorCardBody = (appareil) => {
    return (
      <span>
        {/* <GetImageAppareilEtat IdEtat={appareil.IdEtat} /> */}
        <Badge pill bg={GetBGColorAppareilEtat(appareil.IdEtat)}>
          {GetLibelleEtat(appareil.IdEtat)}
        </Badge>
      </span>
    );
  };

  const EditorCardTitle = (appareil) => {
    return `${appareil.IdAppareilSecteur} - ${appareil.DesignationAppareilSecteur}`;
  };

  const EditorCardSubtitle = (appareil) => {
    return `Secteur : ${appareil.RefClientAppareilSecteur}`;
  };

  //#endregion

  const TableAppareils = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
      EditorCardSubtitle
    );

    const _ButtonFilters = CreateButtonFilters();

    return (
      <TableData
        Data={GetAppareilsTrimed()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        Pagination
        ButtonFilters={_ButtonFilters}
        FilterDefaultValue={CreateNewButtonFilter("IdEtat", 56, EditorFilter)}
        CardModel={_CardModel}
      />
    );
  };

  //#endregion

  //#endregion

  //#endregion

  useEffect(() => {
    document.title = "Appareils";

    GetAppareils();
    // eslint-disable-next-line
  }, [ClientSiteContratCtx.storedClientSite.GUID]);

  return (
    <Container fluid className="table-appareil">
      {/* <TitreOfPage
        titre={"Liste des appareils"}
        soustitre={` ${listeAppareils.length} appareils`}
        isLoaded={isLoaded}
      /> */}
      <TableAppareils />
    </Container>
  );
};

export default AppareilsPage;
