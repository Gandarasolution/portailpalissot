//#region Imports
import { useEffect, useState,useContext } from "react";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import NavLink from "react-bootstrap/NavLink";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
//#endregion

//#region Components
import { Connexion, GetClientSiteContrat } from "../../axios/WSGandara";
import { ListeClientSiteContratContext } from "../../App";

//#endregion

//#endregion

const LoginPage = (props) => {
  const ListeClientSiteContratCtx = useContext(ListeClientSiteContratContext);

  //#region States

  const [revealed, setRevealed] = useState(false);

  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [mailRecup, setMailRecup] = useState("");

  const [idError, setIdError] = useState(0);
  const [isLoading, setIsLoading] = useState(false);



  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  const handleRevaledPassword = () => {
    let _revealed = !revealed;
    setRevealed(_revealed);
  };




  const handleSubmit = async () => {

    setIsLoading(true);


    const getToken = async (response) => {
      if (isNaN(response)) {
        const FetchSetListeClientSiteContrat = (data) => {
          ListeClientSiteContratCtx.setListe(data);
          ListeClientSiteContratCtx.setClientSite(data[0]);
        }


      //   GetListeClientSiteContrat([{IdClientSiteRelation:1391,IdClientSite: 1391, IdContrat: 1366, NomCompletClientSite:"Société John DEERE" ,DateSouscriptionContrat : new Date(2008,0,1) }
      // ,{IdClientSiteRelation:6640,IdClientSite: 6663, IdContrat: 1851, NomCompletClientSite:"JOHN DEERE- Brûleurs PROCESS",DateSouscriptionContrat : new Date(2008,0,1)}
      
      // ])


        await GetClientSiteContrat(response,FetchSetListeClientSiteContrat);

        props.setToken(response);

      } else {
        setIdError(response);
      }


      setIsLoading(false);
    };
    await Connexion(login, password, getToken);


  };


  //#endregion

  //#region Composants

  //#region Forgot password

  const handleForgotPassword = () => {
    if (mailRecup.length > 0) {
    }
  };

  const FormModalForgotPassword = () => {
    return (
      <div>
        <p>
          Merci d'indiquer votre adresse mail. Si celle-ci est connu de notre
          service, vous recevrez un mail avec le lien de réinitialisation du mot
          de passe.
        </p>

        <Form className="m-4" onSubmit={() => handleForgotPassword()}>
          <Form.FloatingLabel label="Email" className="mb-3">
            <Form.Control
              type="email"
              required
              placeholder="identifiant@exemple.com"
              value={mailRecup}
              onChange={(e) => setMailRecup(e.target.value)}
            />
          </Form.FloatingLabel>

          <div className="d-flex justify-content-center">
            <Button variant="primary" type="submit">
              Envoyer
            </Button>
          </div>
        </Form>
      </div>
    );
  };

  const ModalForgotPassword = () => {
    return (
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <h1>Mot de passe oublié ?</h1>
        </Modal.Header>

        <Modal.Body>{FormModalForgotPassword()}</Modal.Body>
      </Modal>
    );
  };

  //#endregion

  //#region Erreurs
  const Erreur500 = () => {
    return (
      <span>
        Un problème est survenu lors de la connexion. Réessayez plus tard ou
        contactez le support au
        <Alert.Link className="link-password-forgot ms-1" href="tel:+384328955">
          03 84 32 89 55{" "}
        </Alert.Link>
        ou par mail à
        <Alert.Link
          className="link-password-forgot ms-1"
          href="mailto:support@gandarasolution.fr"
        >
          support@gandarasolution.fr
        </Alert.Link>
      </span>
    );
  };

  const Erreur401 = () => {
    return (
      <span>
        Identifiants incorrects. Vérifiez votre adresse mail et votre mot de
        passe.
        <Alert.Link
          className="link-password-forgot ms-1"
          onClick={() => setShowModal(true)}
        >
          Mot de passe oublié ?
        </Alert.Link>
      </span>
    );
  };

  const ErreurConnexion = () => {
    let _IdError = Number(idError);
    switch (true) {
      case _IdError > 499:
        return Erreur500();
      case _IdError === 401:
        return Erreur401();
      default:
        return Erreur500();
    }
  };

  const AlertErrorConnexion = () => {
    if (idError > 0) {
      return (
        <Alert variant="danger" className="m-2">
          {ErreurConnexion()}
        </Alert>
      );
    }
  };

  //#endregion

  useEffect(() => {}, [login]);

  const FormSubmit = () => {
    return (
      <Form className="m-4 p-2">
        <Form.Group className="mb-3" controlId="formLogin">
          <Form.Label>Identifiant</Form.Label>

          <Form.Control
            type="email"
            required
            placeholder="identifiant@exemple.com"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              type={revealed ? "text" : "password"}
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="bt-eye-password"
              onClick={() => handleRevaledPassword()}
            >
              <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
            </Button>
          </InputGroup>
          {
            isLoading && ( <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>)
          }
          <AlertErrorConnexion/>

          <div className=" d-flex justify-content-end m-2">
            <NavLink
              onClick={() => setShowModal(true)}
              className="link-password-forgot"
            >
              Mot de passe oublié ?
            </NavLink>
          </div>
        </Form.Group>

        <Button variant="primary" onClick={() => handleSubmit()}>
          Connexion
        </Button>
      </Form>
    );
  };

  //#endregion

  return (
    <Container fluid className="h-100">
      <Row className="align-items-center viewport-height">
        <Col md={{ span: 4, offset: 4 }} className="container-login-content">
          <div>
            <h1>Connexion</h1>
            <hr />
          </div>
          {FormSubmit()}
        </Col>
      </Row>
      {ModalForgotPassword()}
    </Container>
  );
};

export default LoginPage;
