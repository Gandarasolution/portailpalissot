//#region Imports

import { useState, useEffect, useContext } from "react";

//#region Bootstrap
import Container from "react-bootstrap/Container";
//#endregion
import { GetListeDevis, GetdocumentDevis } from "../../axios/WS_Devis";

//#region fontAwsome
import {
  faFile,
  faFilePdf,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//#endregion

//#region Components
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCardModel,
  CreateNewCell,
  CreateNewDocumentCell,
  CreateNewHeader,
  CreateNewUnboundHeader,
  EditorDateFromDateTime,
  EditorMontant,
  EditorActionsTooltip
} from "../../components/commun/TableData";
import { ClientSiteContratContext, TokenContext, ViewerContext } from "../../App";
import { Button, Col, Row } from "react-bootstrap";
import { GetURLLocationViewerFromExtension, base64toBlob } from "../../functions";
import { saveAs } from "file-saver";


//#endregion

//#endregion

const DevisPage = ({ setPageSubtitle, setPageTitle }) => {
  const tokenCt = useContext(TokenContext);
  const clientSiteCt = useContext(ClientSiteContratContext);
  const viewerCt = useContext(ViewerContext);

  //#region States
  const [isLoaded, setIsLoaded] = useState(false);
  const [listeDevis, setListeDevis] = useState([]);

  //#endregion

  //#region Fonctions

  //#region Data
  const GetDevis = () => {
    setIsLoaded(false);

    const FetchSetDevis = (data) => {
      setListeDevis(data);
      setPageSubtitle(`${data.length}`);
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

  //#endregion


  //#region Table

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

    const actionsForDevis = (devis) => [
      {
        label: "Voir le devis",
        onClick: () => {
          console.log("Voir le devis cliqué pour", devis);
          Voir(devis);
        },
        className: "action-view-devis icon-visualize",
      },
      {
        label: "Télécharger le devis",
        onClick: (e) => {
          console.log("Télécharger le devis cliqué pour", devis);
          if (e && e.stopPropagation) {
            e.stopPropagation(); // On s'assure que l'événement est arrêté si présent
          } else {
            console.log("Aucun événement transmis dans le onClick");
          }
          Telechargement(devis);
        },
        className: "action-download-facture icon-download",
      }
    ];



    _cells.push(
      CreateNewCell("Action", false, true, false, (val, row, index) => {
        console.log("EditorActionsTooltip reçoit row:", row);
        return <EditorActionsTooltip actions={actionsForDevis(row)} />;
      })
    );
    return _cells;
  }


  const methodTelecharger = async (e) => {


    return await GetdocumentDevis(tokenCt, e.IdDevis, true, true);


  };
  const methodVoir = async (e) => {
    return await GetdocumentDevis(tokenCt, e.IdDevis, false, true);
  };

  const Telechargement = async (e) => {
    //Affichage d'un toast
    // setShowToast(true);
    console.log("Téléchargement lancé pour", e);
    const _kv = await methodTelecharger(e);
    console.log("Données reçues :", _kv);
    try {
      const base64data = _kv.v;
      const _bblob = base64toBlob(base64data);
      console.log("Blob créé :", _bblob);
      saveAs(_bblob, _kv.k);
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };


  const Voir = async (e) => {
    //On ouvre une nouvelle fenêtre d'attente
    let targetWindow = window.open("/waiting");

    //On récupère le fichier en b64
    // const b64data = await DocumentMaintenanceGetFile(element.v, false, true);
    const b64data = await methodVoir(e);


    //On transforme le fichier en blob
    const blobData = base64toBlob(b64data.v);

    //On créer l'URL utilisé par les viewers
    const url = URL.createObjectURL(blobData);

    //On l'enregistre dans le viewerContext
    viewerCt.setViewer(url);

    //On navigue la page d'attente au viewer qui chargera l'URL du fichier
    //Le bon viewer est déterminé par l'extension
    targetWindow.location.href = GetURLLocationViewerFromExtension(
      b64data.k.split(".").pop()
    );
  }



  function CreateButtonFilters() {
    let _bt = [];
    _bt.push(CreateNewButtonFilter("IdEtat", 9, EditorFilter));
    _bt.push(CreateNewButtonFilter("IdEtat", 12, EditorFilter));
    return _bt;
  }

  //#endregion



  //#endregion

  //#region Composant

  //#region Table


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

    return <span className={`badge text-wrap badge-bg-${_bgColor}`}>{e}</span>;

    // return ` ${_id} ${e}`
  };

  const EditorFilter = (e) => {
    if (e === 12) {
      return "Accepté";
    }
    return "En attente";
  };

  const EditorCardBody = (devis) => {
    return (
      <>
        <h6>{`Secteur : ${devis.DescriptionSecteur}`}</h6>
        <Row>
          <Col>
            <h3>Montant Hors taxe : {EditorMontant(devis.TotalHT)}</h3>
          </Col>
          <Col>
            <h3>Montant TTC : {EditorMontant(devis.TotalTTC)}</h3>{" "}
          </Col>
        </Row>
        <Row>
          <Col className="p-4">
            <Button
              className="m-2"
              onClick={() => {

              }}
            >
              Voir le devis
            </Button>
            <Button
              className="m-2"
              onClick={() => {

              }}
            >
              Télécharger le devis
            </Button>
          </Col>
        </Row>
      </>
    )
  }


  const EditorCardTitle = (devis) => {
    return (
      <>
        <Row>
          <Col>
            {EditorDateFromDateTime(devis.DateDemandeDossierInterventionSAV)}
          </Col>

          <Col>
            {EditorEtat(devis.LibEtat)}
          </Col>
        </Row>
      </>
    );
  }

  const EditorCardSubtitle = (devis) => {
    return `${devis.IdDevis} - ${devis.DescriptionDevis}`;
  };

  //#endregion


  const TableDevis = () => {
    const _Data = GetDevisTrimmed();
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();
    const _ButtonFilters = CreateButtonFilters();
    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
      EditorCardSubtitle
    );

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
        CardModel={_CardModel}
      />
    );
  };

  //#endregion

  //#endregion

  useEffect(() => {
    document.title = "Devis";
    setPageTitle("Liste des devis");
    GetDevis();
    // eslint-disable-next-line
  }, [clientSiteCt.storedClientSite]);

  return (
    <>
      <Container fluid className="table-devis">
        <TableDevis />
      </Container>
    </>
  );
};

export default DevisPage;
