//#region Imports

import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import TitreOfPage from "../../components/commun/TitreOfPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const AccountPage = ({ accountName }) => {
  document.title = "Mon compte";
  //#region States

  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  //#endregion

  //#region Composants

  const INFOS = () => {
    return (
      <span>
        <div style={{ textAlign: "start" }}>
          <h3>
            <FontAwesomeIcon icon={faUserPen} /> Mes informations
          </h3>
        </div>
        <Row>
          <Col>
            <InputGroup>
              <InputGroup.Text htmlFor="emailAccountName">
                Adresse mail :
              </InputGroup.Text>
              <Form.Control
                id="emailAccountName"
                type="mail"
                value={accountName}
                readOnly
              />
              <Button variant="info">Modifier</Button>
            </InputGroup>
          </Col>

          <Col>
            <Button variant="danger">Réinitialiser mon mot de passe</Button>
          </Col>

         
        </Row>
      </span>
    );
  };



  //#endregion

  return (
    <Container fluid>
      <TitreOfPage
        titre={"Mon compte"}
        soustitre={accountName}
        isLoaded={true}
      />

      <Container fluid className="container-table p-4 ">
        <INFOS />

      </Container>
    </Container>
  );
};

export default AccountPage;
