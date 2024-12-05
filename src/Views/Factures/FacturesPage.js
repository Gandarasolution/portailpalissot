//#region Imports

import { useState, useEffect, useContext, createContext } from "react";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
//#endregion

//#region Components
import {
  GetListeFactures,
  VoirFactureDocument,
} from "../../axios/WSGandara";
import { DateSOAP, base64toBlob } from "../../functions";
import {
  ClientSiteContratContext,
  TokenContext,
  ViewerContext,
} from "../../App";
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCardModel,
  CreateNewCell,
  CreateNewCellSelector,
  CreateNewDocumentCell,
  CreateNewHeader,
  CreateNewHeaderSelector,
  CreateNewUnboundHeader,
  EditorDateFromDateTime,
  EditorMontant,
} from "../../components/commun/TableData";
import TitreOfPage from "../../components/commun/TitreOfPage";
//#endregion

//#endregion

export const FactureContext = createContext(null);

const FacturesPage = () => {
  const tokenCt = useContext(TokenContext);
  const clientSiteCt = useContext(ClientSiteContratContext);
  const viewerCt = useContext(ViewerContext);

  //#region States
  const [isFacturesLoaded, setIsFactureLoaded] = useState(false);
  const [listeFactures, setListeFactures] = useState([]);

  const [factureSelected, setFactureSelected] = useState(null);
  const [voirFacture, setVoirFacture] = useState(false);
  const [TelechargerFacture, setTelechargerFacture] = useState(false);

  //#endregion

  //#region Fonctions

  function GetListeFactureTrimed() {
    let _arrayFacture = JSON.parse(JSON.stringify(listeFactures));
    if (!Array.isArray(_arrayFacture)) {
      let _arrTmp = [];
      _arrTmp.push(_arrayFacture);
      _arrayFacture = _arrTmp;
    }

    _arrayFacture = _arrayFacture.filter((fa) => fa.Type !== "Chantier");

    return _arrayFacture;
  }

  function CreateHeaderForTable() {
    // Date	Code	Libellé	Total HT	Total TTC	Origine	Type
    let _headers = [];
    _headers.push(CreateNewHeaderSelector("factures"));
    _headers.push(
      CreateNewHeader(
        "DateFacture",
        CreateFilter(true, false, false, false, true),
        "Date",
        EditorDateFromDateTime
      )
    );

    _headers.push(
      CreateNewHeader(
        "Avoir",
        CreateFilter(true, true, false, false),
        "Catégorie",
        EditorTypeAvoirFacture
      )
    );

    _headers.push(
      CreateNewHeader(
        "IdFacture",
        CreateFilter(true, true, false, true),
        "Facture N°"
      )
    );
    _headers.push(
      CreateNewHeader("Sujet", CreateFilter(true, true, false, true), "Libellé")
    );
    _headers.push(
      CreateNewHeader(
        "MontantHT",
        CreateFilter(true, true, true, true),
        "Total HT",
        EditorMontant
      )
    );
    _headers.push(
      CreateNewHeader(
        "MontantTTC",
        CreateFilter(true, true, true, true),
        "Total TTC",
        EditorMontant
      )
    );
    _headers.push(
      CreateNewHeader(
        "Dossier",
        CreateFilter(true, true, false, true),
        "Origine"
      )
    );
    _headers.push(
      CreateNewHeader(
        "Type",
        CreateFilter(true, true, false, true),
        "Type",
        EditorType
      )
    );
    _headers.push(
      CreateNewUnboundHeader(CreateFilter(), "Actions", [
        "tagFactureVoir",
        "tagFactureTelecharger",
      ])
    );

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(CreateNewCellSelector("factures"));
    _cells.push(
      CreateNewCell("DateFacture", false, true, false, EditorDateFromDateTime)
    );
    _cells.push(
      CreateNewCell("Avoir", false, true, false, EditorTypeAvoirFacture)
    );
    _cells.push(CreateNewCell("IdFacture", false, true, false));
    _cells.push(CreateNewCell("Sujet", false, true, false));
    _cells.push(CreateNewCell("MontantHT", false, true, false, EditorMontant));
    _cells.push(CreateNewCell("MontantTTC", false, true, false, EditorMontant));
    _cells.push(CreateNewCell("Dossier", false, true, false));
    _cells.push(CreateNewCell("Type", false, true, false, EditorType));

    const methodTitle = (e) => {
      const dateFR = new Date().toLocaleDateString("fr-FR");
      return `${dateFR} Facture N°${e.IdFacture}.pdf`;
    };

    const methodTelecharger = async (facture) => {
      // TelechargerFactureDocument(
      //   tokenCt,
      //   facture.IdFacture,
      //   facture.Type,
      //   facture.Avoir
      // );
      // setTelechargerFacture(false);

      return await await VoirFactureDocument(
        tokenCt,
        facture.IdFacture,
        facture.Type,
        facture.Avoir,
        true
      );
    };

    const methodVoir = async (facture) => {
      //On ouvre une nouvelle fenêtre d'attente
      let targetWindow = window.open("/waiting");

      //On récupère le fichier en b64
      const b64data = await VoirFactureDocument(
        tokenCt,
        facture.IdFacture,
        facture.Type,
        facture.Avoir,
        true
      );

      //On transforme le fichier en blob
      const blobData = base64toBlob(b64data.v);

      //On créer l'URL utilisé par les viewers
      const url = URL.createObjectURL(blobData);

      //On l'enregistre dans le viewerContext
      viewerCt.setViewer(url);

      //On navigue la page d'attente au viewer qui chargera l'URL du fichier
      //Le bon viewer est déterminé par l'extension
      targetWindow.location.href = "/viewerPDF";

      setVoirFacture(false);
    };

    _cells.push(
      CreateNewDocumentCell(methodTitle, "PDF", methodTelecharger, methodVoir)
    );

    return _cells;
  }

  function CreateButtonFiltersForTable() {
    let _arrBt = [];

    _arrBt.push(
      CreateNewButtonFilter("Type", "Facture Contrat", () => "Contrat")
    );
    _arrBt.push(
      CreateNewButtonFilter(
        "Type",
        ["Facture SAV", "Facture SAV Selon Devis"],
        () => "Dépannage"
      )
    );

    return _arrBt;
  }

  //#region Editors

  const EditorType = (type) => {
    if (type.includes("SAV")) return "Dépannage";
    if (type.includes("Contrat")) return "Contrat";

    return type;
  };

  const EditorTypeAvoirFacture = (data) => {
    if (
      (typeof data === typeof true && data === true) ||
      (typeof data === typeof "" && data === "true")
    ) {
      return (
        <Stack direction="horizontal">
          <div className="circle-danger me-1"></div> Avoir
        </Stack>
      );
    }
    return (
      <Stack direction="horizontal">
        <div className="circle-success me-1"> </div> Facture
      </Stack>
    );
  };

  const EditorCardBody = (facture) => {
    return (
      <span>
        <Row>
          <Col>
            <h3>Montant Hors taxe : {EditorMontant(facture.MontantHT)}</h3>
          </Col>
          <Col>
            <h3>Montant TTC : {EditorMontant(facture.MontantTTC)}</h3>{" "}
          </Col>
        </Row>
        <Row>
          <Col className="p-4">
            <Button
              className="m-2"
              onClick={() => {
                setFactureSelected(facture);
                setVoirFacture(true);
              }}
            >
              Voir la facture
            </Button>
            <Button
              className="m-2"
              onClick={() => {
                setFactureSelected(facture);
                setTelechargerFacture(true);
              }}
            >
              Télécharger la facture
            </Button>
          </Col>
        </Row>
      </span>
    );
  };

  const EditorCardTitle = (facture) => {
    return `F${facture.IdFacture} du ${EditorDateFromDateTime(
      facture.DateFacture
    )}`;
  };

  const EditorCardSubtitle = (facture) => {
    return `Origine : ${facture.Type} ${facture.Dossier}`;
  };

  //#endregion

  //#endregion

  //#region Composants

  //#region TableData

  const TableFactures = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    const _ButtonFilters = CreateButtonFiltersForTable();
    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
      EditorCardSubtitle
    );

    return (
      <FactureContext.Provider
        value={{
          factureSelected,
          voirFacture,
          setVoirFacture,
          TelechargerFacture,
          setTelechargerFacture,
        }}
      >
        <TableData
          Data={GetListeFactureTrimed()}
          Headers={_Headers}
          Cells={_Cells}
          IsLoaded={isFacturesLoaded}
          Pagination
          CardModel={_CardModel}
          ButtonFilters={_ButtonFilters}
        />
      </FactureContext.Provider>
    );
  };

  //#endregion
  //#endregion

  const GetFactures = async () => {
    setIsFactureLoaded(false);
    const FetchSetData = (data) => {
      setListeFactures(data);
      setIsFactureLoaded(true);
    };
    await GetListeFactures(
      tokenCt,
      clientSiteCt.storedClientSite.GUID,
      DateSOAP(new Date()),
      DateSOAP(new Date()),
      FetchSetData
    );
  };

  useEffect(() => {
    document.title = "Factures";
    GetFactures();
    //eslint-disable-next-line
  }, [clientSiteCt.storedClientSite.GUID]);

  return (
    <Container fluid>
      {/* <TitreOfPage
        titre={"Factures"}
        soustitre={` ${GetListeFactureTrimed().length} factures`}
        isLoaded={isFacturesLoaded}
      /> */}
      <TableFactures />
    </Container>
  );
};

export default FacturesPage;
