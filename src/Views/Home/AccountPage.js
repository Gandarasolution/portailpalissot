//#region Imports

//#region FontAwsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
//#endregion

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
//#endregion

//#region Components
import TitreOfPage from "../../components/commun/TitreOfPage";
import { useContext, useState } from "react";
import { TokenContext } from "../../App";
// import { UpdateMDP } from "../../axios/WSGandara";

//#endregion

//#endregion

const AccountPage = ({ accountName }) => {
  document.title = "Mon compte";
  //#region States


  const tokenCt = useContext(TokenContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const [mdpActuel,setMdpActuel] = useState("")
  const [newMdp,setNewMdp] = useState("")
  const [newMdp2,setNewMdp2] = useState("")
  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  //#endregion

  //#region Composants

  const handleChangementPass = () => {

    if (mdpActuel.length > 0)
    {
      if(newMdp.length > 0)
      {
        if(newMdp === newMdp2)
        {
          const SetData = (data) => {
            setShow(false)
          }
          // UpdateMDP(tokenCt, newMdp,SetData);
        }
      }
    }


  };
  const Passwords = () => {
    return (
      <span>
        <Form>
          <Form.Group>
            <Form.Label>Mot de passe actuel</Form.Label>
            <Form.Control id="passActuel"  className="m-2" value={mdpActuel} onChange={(e) =>setMdpActuel(e.target.value)} />
            <Form.Label>Nouveau mot de passe</Form.Label>
            <Form.Control id="passNew" className="m-2" value={newMdp} onChange={(e) =>setNewMdp(e.target.value)}/>
            <Form.Label>Confirmer le nouveau mot de passe</Form.Label>
            <Form.Control id="passConfirm" className="m-2" value={newMdp2} onChange={(e) =>setNewMdp2(e.target.value)}/>
          </Form.Group>
        </Form>
      </span>
    );
  };
  const AfficherMdpModal = () => {
    handleShow();
  };

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
            <Button variant="danger" onClick={AfficherMdpModal}>
              Changer mon mot de passe
            </Button>
          </Col>
        </Row>
      </span>
    );
  };

  //#endregion

  return (
    <Container fluid>
      {/* <TitreOfPage
        titre={"Mon compte"}
        soustitre={accountName}
        isLoaded={true}
      /> */}

      <Container fluid className="container-table p-4 ">
        <INFOS />

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Changement de mot de passe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
           {Passwords()}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
            <Button variant="primary" onClick={handleChangementPass}>
              Valider
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
};

export default AccountPage;
