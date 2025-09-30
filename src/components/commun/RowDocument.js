import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Link } from "react-router-dom";
import ImageExtension, { IsExtensionVisible } from "./ImageExtension";
import { useState } from "react";
import { base64toBlob } from "../../functions";
import { saveAs } from "file-saver";


const RowDocument = ({ props, index }) => {

  //#region States


  //#endregion




  //#region Evenements
  const Telechargement = async () => {


    //Affichage d'un toast
    const _kv = await props.TelechargerDocumentSup();

    try {
      //Transformation en blob
      const base64data = _kv.v;

      const _bblob = base64toBlob(base64data, props?.type);
      //Téléchargement
      saveAs(_bblob, _kv.k);


    }
    catch (error) {

      console.log("Erreur lors du téléchargement")
    } finally {

      //Cacher le toast
      // setShowToast(false);

    }
  };

  // const Visualisation = async () => {
  //   let targetWindow = window.open("/waiting");

  //   const _kv = await props.VoirDocumentSup();

  //   //On récupère le fichier en b64
  //   const b64data = _kv.v;

  //   //On transforme le fichier en blob
  //   const blobData = base64toBlob(b64data.v);

  //   //On créer l'URL utilisé par les viewers
  //   const url = URL.createObjectURL(blobData);

  //   //On l'enregistre dans le viewerContext
  //   viewerCt.setViewer(url);

  //   //On navigue la page d'attente au viewer qui chargera l'URL du fichier
  //   //Le bon viewer est déterminé par l'extension
  //   targetWindow.location.href = GetURLLocationViewerFromExtension(
  //     _kv.k.split(".").pop()
  //   );
  // }


  //#endregion

  //#region Component


  //#endregion

  return (
    <>
         
      <Row key={index}>

        <Col md={"auto"}>
          <ImageExtension extension={props.extension} />
        </Col>
        <Col>
          <div>
            <div className="mb-0 document-title">{`${props.title}`}</div>
            {props.size && (
              <span className="document-size">{`${props.size}`}</span>
            )}

            {props.extension === "ERROR" && (
              <div>Impossible de récupérer les documents.</div>
            )}

            <div className="document-links">
              {IsExtensionVisible(props.extension.toUpperCase()) &&
                props.VoirDocumentSup && (
                  <Link onClick={() => props.VoirDocumentSup()}>Voir</Link>
                )}

              {props.TelechargerDocumentSup && (
                <Link onClick={() => Telechargement()}>Télécharger</Link>
              )}
            </div>
          </div>
          {props.extension.toUpperCase() === "ZIP" && <hr />}
        </Col>
      </Row>
    </>
  );
};

export default RowDocument;
