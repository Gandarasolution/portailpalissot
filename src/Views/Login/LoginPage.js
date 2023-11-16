//#region Imports
import { useEffect, useState, useRef } from "react";

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
import { Connexion, CreateTokenMDP, GetListeParametres } from "../../axios/WSGandara";

//#endregion

//#endregion

const LoginPage = (props) => {
  //#region States

  const [revealed, setRevealed] = useState(false);

  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [mailRecup, setMailRecup] = useState("");

  const [idError, setIdError] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

const [recupAlertVisible, setRecupAlerteVisible] = useState(false);
const [recupAlertText, setRecupAlertText] = useState("");
const [recupAlertVariant, setRecupAlertVariant] = useState("danger");

  const inputRef = useRef(null);

  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  const handleRevaledPassword = () => {
    let _revealed = !revealed;
    setRevealed(_revealed);
  };

  const handleLoginKeyPress = (event) => {
    if (event.key === "Enter") {
      inputRef.current.focus();
    }
  };

  const handlePasswordKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    //2 -> Callback de Connexion :
    const getToken = async (response) => {
      //?2.5 -> On va récupérer la liste des parametres de l'application
      if (isNaN(response)) {
        //4 -> CallBack de GetListeParamètres : on enregistre les infos retournées
        const FetchSetListeParams = async (data) => {
          props.setParams(data);
          props.setToken(response);
          props.setAccountName(login);
        };

        //3 -> On récupère la liste des paramètres de l'application
        await GetListeParametres(response, FetchSetListeParams);

        //?2.5 -> La connexion a retourné une erreur
      } else {
        setIdError(response);
      }

      setIsLoading(false);
    };

    //1 -> On envoie les infos pour demander un token
    await Connexion(login, password, getToken);
  };

  //#endregion

  //#region Composants

  //#region Forgot password

  const handleForgotPassword = () => {
    if (mailRecup.length > 0) {

      const FetchSetRecup = (data) => {
        setRecupAlertVariant("danger");
        if (data === 1)
        {
          //Alerte ok
          setRecupAlertText("Un mail de récupération vous a été envoyé. Merci de vérifier votre boite mail, et de suivre les instructions.")
          setRecupAlertVariant("success");
        }else if(data === 2)
        {
          //Alerte pas ok
          setRecupAlertText("Ce mail est inconnu.")
        }else {
          //alerte erreur
          setRecupAlertText("Une erreur est survenu. Merci de recommencer ultérieurement.")
        }
        setRecupAlerteVisible(true)
      }

      CreateTokenMDP(mailRecup, FetchSetRecup)

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
            {/* <Button variant="primary" type="submit"> */}
            <Button variant="primary" onClick={() => handleForgotPassword()}>
              Envoyer
            </Button>
          </div>
           
        </Form>
      </div>
    );
  };


const ModalAlerte = () => {
return (
  <Modal
  show={recupAlertVisible}
  onHide={() => setRecupAlerteVisible(false)}
  backdrop="static"
  keyboard={false}
>
  <Modal.Header closeButton>
    <h1>Changement de mot de passe</h1>
  </Modal.Header>

  <Modal.Body>
  <Alert variant={recupAlertVariant} show={recupAlertVisible} >
  {recupAlertText}
</Alert></Modal.Body>
</Modal>

)
}

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

  useEffect(() => {
    document.title = "Connexion";
  }, [login]);

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
            onKeyUp={handleLoginKeyPress}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              ref={inputRef}
              type={revealed ? "text" : "password"}
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={handlePasswordKeyPress}
            />
            <Button
              className="bt-eye-password"
              onClick={() => handleRevaledPassword()}
            >
              <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
            </Button>
          </InputGroup>
          {isLoading && (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          )}
          <AlertErrorConnexion />

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
    <Container fluid>
      <Row className="align-items-center viewport-height ">
        <Col md={{ span: 4, offset: 4 }} className="container-login-content">
          <div>
            <h1>Connexion</h1>
            <hr />
          </div>
          {FormSubmit()}
        </Col>
      </Row>
      {ModalForgotPassword()}
      {ModalAlerte()}
    </Container>
  );
};

export default LoginPage;
