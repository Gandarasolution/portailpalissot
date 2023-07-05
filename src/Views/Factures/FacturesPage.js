//#region Imports

import { useState, useEffect, useContext, createContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
//#endregion

//#region Components
import { GetListeFactures } from "../../axios/WSGandara";
import { DateSOAP } from "../../functions";
import { ClientSiteContratContext, TokenContext } from "../../App";
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCardModel,
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
} from "../../components/commun/TableData";
import TitreOfPage from "../../components/commun/TitreOfPage";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
//#endregion

//#endregion

export const FactureContext = createContext(null);

const FacturesPage = () => {
  const tokenCt = useContext(TokenContext);
  const clientSiteCt = useContext(ClientSiteContratContext);

  //#region States
  const [isFacturesLoaded, setIsFactureLoaded] = useState(false);
  const [listeFactures, setListeFactures] = useState([]);

  const [factureSelected, setFactureSelected] = useState(null);
  const [voirFacture, setVoirFacture] = useState(false);
  const [TelechargerFacture, setTelechargerFacture] = useState(false);

  //#endregion

  //#region Fonctions


  function GetListeFactureTrimed(){
    let _arrayFacture = JSON.parse(JSON.stringify(listeFactures));
    _arrayFacture = _arrayFacture.filter((fa)=> fa.Type !=="Chantier")

    return _arrayFacture;

  }




  function CreateHeaderForTable() {
    // Date	Code	Libellé	Total HT	Total TTC	Origine	Type
    let _headers = [];
    _headers.push(
      CreateNewHeader(
        "DateFacture",
        CreateFilter(true, false, false, false,true),
        "Date",
        EditorDateFromDateTime
      )
    );

    _headers.push(CreateNewHeader("Avoir",CreateFilter(true,true,false,false),"Type",EditorTypeAvoirFacture));

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
      CreateNewHeader("Type", CreateFilter(true, true, false, true), "Type",EditorType)
    );
    _headers.push(CreateNewUnboundHeader(CreateFilter(), "Actions"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell("DateFacture", false, true, false, EditorDateFromDateTime)
    );
    _cells.push(CreateNewCell("Avoir", false,true,false,EditorTypeAvoirFacture));
    _cells.push(CreateNewCell("IdFacture", false, true, false));
    _cells.push(CreateNewCell("Sujet", false, true, false));
    _cells.push(CreateNewCell("MontantHT", false, true, false, EditorMontant));
    _cells.push(CreateNewCell("MontantTTC", false, true, false, EditorMontant));
    _cells.push(CreateNewCell("Dossier", false, true, false));
    _cells.push(CreateNewCell("Type", false, true, false,EditorType));

    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionVoir,
        "tagFactureVoir"
      )
    );
    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionTelecharger,
        "tagFactureTelecharger"
      )
    );
    return _cells;
  }

  function CreateButtonFiltersForTable() {
    let _arrBt = [];

    // _arrBt.push(CreateNewButtonFilter("Type", "Chantier"));
    _arrBt.push(CreateNewButtonFilter("Type", "Facture Contrat",()=>"Contrat"));
    _arrBt.push(CreateNewButtonFilter("Type", ["Facture SAV","Facture SAV Selon Devis"],()=>"Dépannage"));
    // _arrBt.push(CreateNewButtonFilter("Type", "Facture SAV Selon Devis"));

    return _arrBt;
  }

  //#region Editors

  const EditorType = (type) => {

    if(type.includes("SAV")) return "Dépannage";
    if(type.includes("Contrat")) return "Contrat";
    
    return type;
    
  }

  

  const EditorTypeAvoirFacture = (data) => {
    if(data === true)
    {
      return <Stack direction="horizontal">
        <div className="circle-danger me-1"></div> Avoir

      </Stack>
    }
    return <Stack direction="horizontal">
    <div className="circle-success me-1"> </div> Facture

  </Stack>
  }
  const EditorDateFromDateTime = (data) => {
    var dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g;
    let _match = data.match(dateRegex)[0];
    return _match;
  };

  const EditorMontant = (data) => {
    try {
      return `${new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(data)}`;
    } catch (error) {
      return `${data} €`;
    }
  };

  const EditorActionVoir = (e) => {
    return (
      <Button variant="">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Voir la facture</Tooltip>}
        >

        <FontAwesomeIcon icon={faEye} />
        </OverlayTrigger>
      </Button>
    );
  };

  const EditorActionTelecharger = (e) => {
    return (
      <Button variant="">
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip>Télécharger la facture</Tooltip>}
        >

<FontAwesomeIcon icon={faDownload} />
        </OverlayTrigger>

      </Button>
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
      clientSiteCt.storedClientSite.IdClientSite,
      DateSOAP(new Date()),
      DateSOAP(new Date()),
      FetchSetData
    );
  };

  useEffect(() => {
    GetFactures();
    //eslint-disable-next-line
  }, [clientSiteCt.storedClientSite.IdClientSite]);

  return (
    <Container fluid className="h-100">
      <TitreOfPage
        titre={"Factures"}
        soustitre={` ${GetListeFactureTrimed().length} factures`}
        isLoaded={isFacturesLoaded}
      />
      <TableFactures />
    </Container>
  );
};

export default FacturesPage;
