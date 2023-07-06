//#region Imports

import { useState } from "react";
import { useEffect } from "react";

//#region Bootstrap
import Container from "react-bootstrap/Container";
//#endregion

//#region Components
import TitreOfPage from "../../components/commun/TitreOfPage";
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
  EditorActionTelecharger,
  EditorActionVoir,
  EditorDateFromDateTime,
  EditorMontant,
} from "../../components/commun/TableData";

//#endregion

//#endregion

const DevisPage = () => {
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

    FetchSetDevis([
      {
        IdDevis: 74714,
        DescriptionDevis:
          "Remplacement d'un servomoteur sur une vanne d'eau glacée.",
        Etat: { IdEtat: 9, LibEtat: "En Attente Client", VerrouEtat: 0 },
        TotalHT: 651.0,
        TotalTTC: 781.2,
        DateDemandeDossierInterventionSAV: "2023-06-20 17:15:00.000",
        DescriptionSecteur: "Métrologie",
      },
      {
        IdDevis: 73522,
        DescriptionDevis:
          "Fourniture d'un circuit imprimé sur des aérothermes WINTERWARM pour EH 50-18 et EH 50 le 24.03.2023  COMMANDE N°2023300593 DU 08.03.2023",
        Etat: { IdEtat: 12, LibEtat: "Accepté", VerrouEtat: 2 },
        TotalHT: 1282.5,
        TotalTTC: 1539.0,
        DateDemandeDossierInterventionSAV: "2023-03-07 08:37:00.000",
        DescriptionSecteur: "Expédition PF",
      },
    ]);
  };

  const GetDevisTrimmed = () => {
    let _lDevis = JSON.parse(JSON.stringify(listeDevis));

    for (let index = 0; index < _lDevis.length; index++) {
      const element = _lDevis[index];
      element.LibEtat = element.Etat.LibEtat;
      element.IdEtat = element.Etat.IdEtat;
      element.DateDemandeDossierInterventionSAV = new Date(
        element.DateDemandeDossierInterventionSAV
      ).toLocaleDateString("fr-FR");
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
        false,
        false,
        EditorDateFromDateTime
      )
    );
    _cells.push(CreateNewCell("DescriptionSecteur", false, false, false));
    _cells.push(CreateNewCell("IdDevis", false, false, false));
    _cells.push(CreateNewCell("DescriptionDevis", false, false, false));

    _cells.push(CreateNewCell("TotalHT", false, false, false, EditorMontant));
    _cells.push(CreateNewCell("TotalTTC", false, false, false, EditorMontant));
    _cells.push(CreateNewCell("LibEtat", false, false, false, EditorEtat));

    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionVoir,
        "tagDevisVoirDevis"
      )
    );
    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionTelecharger,
        "tagDevisAccesSAV"
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
        FilterDefaultValue={CreateNewButtonFilter("IdEtat", 9, EditorFilter)}
        Pagination
      />
    );
  };

  //#endregion

  useEffect(() => {
    document.title = "Devis";
    GetDevis();
  }, []);

  return (
    <Container fluid className="h-100">
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
