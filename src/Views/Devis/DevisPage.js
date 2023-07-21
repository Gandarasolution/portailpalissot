//#region Imports

import { useState, useEffect, useContext } from "react";

//#region Bootstrap
import Container from "react-bootstrap/Container";
//#endregion

//#region Components
import TitreOfPage from "../../components/commun/TitreOfPage";
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCell,
  CreateNewDocumentCell,
  CreateNewHeader,
  CreateNewUnboundHeader,
  EditorDateFromDateTime,
  EditorMontant,
} from "../../components/commun/TableData";
import { GetListeDevis, GetdocumentDevis } from "../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../App";

//#endregion

//#endregion

const DevisPage = () => {
  const tokenCt = useContext(TokenContext);
  const clientSiteCt = useContext(ClientSiteContratContext);
  //#region States
  const [isLoaded, setIsLoaded] = useState(false);
  const [listeDevis, setListeDevis] = useState([]);

  //#endregion

  //#region Fonctions

  const GetDevis = () => {
    setIsLoaded(false);

    const FetchSetDevis = (data) => {
      setListeDevis(data);
      setIsLoaded(true);
    };

    GetListeDevis(tokenCt, clientSiteCt.storedClientSite.GUID, FetchSetDevis);
  };

  const GetDevisTrimmed = () => {
    let _lDevis = JSON.parse(JSON.stringify(listeDevis));

    for (let index = 0; index < _lDevis.length; index++) {
      const element = _lDevis[index];
      element.LibEtat = element.Etat.LibEtat;
      element.IdEtat = element.Etat.IdEtat;
    }
    return _lDevis;
  };

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader(
        "DateDemandeDossierInterventionSAV",
        CreateFilter(true, false, false, false, true),
        "Date Demande"
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
      CreateNewHeader("IdDevis", CreateFilter(true, false, false, true), "Code")
    );
    _headers.push(
      CreateNewHeader(
        "DescriptionDevis",
        CreateFilter(true, false, false, true),
        "Objet du devis"
      )
    );
    _headers.push(
      CreateNewHeader("TotalHT", CreateFilter(true, false, true), "Total HT")
    );
    _headers.push(
      CreateNewHeader("TotalTTC", CreateFilter(true, false, true), "Total TTC")
    );
    _headers.push(
      CreateNewHeader("LibEtat", CreateFilter(true, true), "État", EditorEtat)
    );
    _headers.push(CreateNewUnboundHeader(false, "Action"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell(
        "DateDemandeDossierInterventionSAV",
        false,
        true,
        false,
        EditorDateFromDateTime
      )
    );
    _cells.push(CreateNewCell("DescriptionSecteur", false, true, false));
    _cells.push(CreateNewCell("IdDevis", false, true, false));
    _cells.push(CreateNewCell("DescriptionDevis", false, true, false));

    _cells.push(CreateNewCell("TotalHT", false, true, false, EditorMontant));
    _cells.push(CreateNewCell("TotalTTC", false, true, false, EditorMontant));
    _cells.push(CreateNewCell("LibEtat", false, false, false, EditorEtat));

    const methodTitleDoc = (e) => {
      const dateFR = new Date().toLocaleDateString("fr-FR");
      return `${dateFR} Devis N°${e.IdDevis}.pdf`;
    };
    const methodTelecharger = (e) => {
      GetdocumentDevis(tokenCt, e.IdDevis, true);
    };
    const methodVoir = (e) => {
      GetdocumentDevis(tokenCt, e.IdDevis);
    };

    _cells.push(
      CreateNewDocumentCell(
        methodTitleDoc,
        "PDF",
        methodTelecharger,
        methodVoir
      )
    );
    return _cells;
  }

  function CreateButtonFilters() {
    let _bt = [];
    _bt.push(CreateNewButtonFilter("IdEtat", 9, EditorFilter));
    _bt.push(CreateNewButtonFilter("IdEtat", 12, EditorFilter));
    return _bt;
  }

  //#endregion

  //#region Composant

  //#region Editors

  const EditorEtat = (e) => {
    const _id = listeDevis.find((d) => d.Etat.LibEtat === e).Etat.IdEtat;
    let _bgColor = "";
    switch (_id) {
      case 12:
        _bgColor = "success";
        break;

      default:
        _bgColor = "warning";
        break;
    }

    return <span className={`badge badge-bg-${_bgColor}`}>{e}</span>;

    // return ` ${_id} ${e}`
  };

  const EditorFilter = (e) => {
    if (e === 12) {
      return "Accepté";
    }
    return "En attente";
  };

  //#endregion

  const TableDevis = () => {
    const _Data = GetDevisTrimmed();
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();
    const _ButtonFilters = CreateButtonFilters();

    return (
      <TableData
        Data={_Data}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        ButtonFilters={_ButtonFilters}
        FilterDefaultValue={
          _Data.find((d) => d.Etat.IdEtat === 9) &&
          CreateNewButtonFilter("IdEtat", 9, EditorFilter)
        }
        Pagination
      />
    );
  };

  //#endregion

  useEffect(() => {
    document.title = "Devis";
    GetDevis();
    // eslint-disable-next-line
  }, [clientSiteCt.storedClientSite]);

  return (
    <Container fluid>
      <TitreOfPage
        titre={"Liste des devis"}
        soustitre={` ${listeDevis.length} devis`}
        isLoaded={isLoaded}
      />
      <TableDevis />
    </Container>
  );
};

export default DevisPage;
