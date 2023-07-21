import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import ImageExtension, { IsExtensionVisible } from "./ImageExtension";

const RowDocument = ({ props, index }) => {
  return (
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
          <div className="document-links">
            {IsExtensionVisible(props.extension.toUpperCase()) &&
              props.VoirDocumentSup && (
                <Link onClick={() => props.VoirDocumentSup()}>Voir</Link>
              )}

            {props.TelechargerDocumentSup && (
              <Link onClick={() => props.TelechargerDocumentSup()}>
                Télécharger
              </Link>
            )}
          </div>
        </div>
        {props.extension.toUpperCase() === "ZIP" && <hr />}
      </Col>
    </Row>
  );
};

export default RowDocument;
