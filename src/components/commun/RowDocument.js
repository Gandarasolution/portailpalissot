import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { Link } from "react-router-dom";
import ImageExtension, { IsExtensionVisible } from "./ImageExtension";
import { useEffect, useState } from "react";

const RowDocument = ({ props, index }) => {

// const [showToast, setShowToast] = useEffect(false);

// const Telechargement = ()=> {

//   //Affichage d'un toast

//   // setShowToast(true);
// }


  return (
    <>

{/* 
<ToastContainer
            className="p-3"
            position={"bottom-end"}
            // style={{ zIndex: 1 }}
          >
            <Toast show={showToast}>
              <Toast.Header closeButton={false}></Toast.Header>
              <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
            </Toast>
          </ToastContainer>
 */}

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

            {props.extension === "ERROR" && (<div>
              Impossible de récupérer les documents.
              </div>)}

          <div className="document-links">
            {IsExtensionVisible(props.extension.toUpperCase()) &&
              props.VoirDocumentSup && (
                <Link onClick={() => props.VoirDocumentSup()}>Voir</Link>
              )}

            {props.TelechargerDocumentSup && (
              <Link onClick={() => props.TelechargerDocumentSup()}>
                Télécharger
              </Link>
            //   <Link onClick={Telechargement}>
            //   Télécharger
            // </Link>
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
