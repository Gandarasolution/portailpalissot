//#region Imports
import { useEffect, useState, useRef } from "react";

import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
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
import {  CreateTokenMDP, IsURICanonnical,Connexion,  GetListeParametres, GetURLWs } from "../../axios/WS_User";

//#endregion

//#endregion
import backgroundLogin from "../../image/imageLogin/login.jpg";
// import logo from "../../image/favicon.ico";
import { ReactComponent as LogoNoir } from "../../image/imageLogin/login-gandara-propulsee-noir.svg";
import logoDefault from "../../image/imageLogin/logo_noir.png";
const LoginPage = (props) => {
  //#region States
  const [revealed, setRevealed] = useState(false);

  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [codeEntreprise, setCodeEntreprise] = useState("");
  const [imageLogo, setImageLogo] = useState(logoDefault);

  const [showCodeEntreprise, setShowCodeEntreprise] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [mailRecup, setMailRecup] = useState("");

  const [idError, setIdError] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [recupAlertVisible, setRecupAlerteVisible] = useState(false);
  const [recupAlertText, setRecupAlertText] = useState("");
  const [recupAlertVariant, setRecupAlertVariant] = useState("danger");

  const inputRefPassword = useRef(null);
  const inputRefLogin = useRef(null);


  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  const handleRevaledPassword = () => {
    let _revealed = !revealed;
    setRevealed(_revealed);
  };

  const handleCodeEntrepriseKeyPress = (event) => {
    if (event.key === "Enter") {
      inputRefLogin.current.focus();
    }
  };

  const handleLoginKeyPress = (event) => {
    if (event.key === "Enter") {
      inputRefPassword.current.focus();
    }
  };

  const handlePasswordKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    //Vérification identifiants renseignés
    if (codeEntreprise.length <= 0 || login.length <= 0 || password.length <= 0) {
      setIdError(400);
      return;
    }

    setIsLoading(true);

    let _wsForToken = "";
    let _themeFromWS = "";
    let _wsEndpoint = "";
    let _logoClient = "";
    let _isUser = !isNaN(login);
    const GetResponseURLWS = (data) => {
      if (isNaN(data) && data.urlWSClient) {
        _wsForToken = data.urlWSClient;
        _wsEndpoint = data.urlWSEndpoint
        _themeFromWS = data?.themeClient;
        _logoClient = data?.logoClient;
        props.setWsEndpoint(_wsEndpoint)
        
      }

    }



    await GetURLWs(codeEntreprise, GetResponseURLWS);

    //Vérification WS
    if (_wsForToken.length <= 0) {
      setIdError(500);
      return;
    }


    //2 -> Callback de Connexion :
    const getToken = async (response) => {
      //?2.5 -> On va récupérer la liste des parametres de l'application
      if (isNaN(response)) {

        props.setUrlWs(_wsForToken);

        //4 -> CallBack de GetListeParamètres : on enregistre les infos retournées
        const FetchSetListeParams = async (data) => {
          props.setToken(response);
          props.setTheme(_themeFromWS);
          props.setImageClient(_logoClient);
          props.setIsUser(_isUser);
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
    await Connexion(login, password, _wsForToken, getToken);
  };

  //#endregion

  //#region Composants

  //#region Forgot password

  const handleForgotPassword = () => {
    if (mailRecup.length > 0) {

      const FetchSetRecup = (data) => {
        setRecupAlertVariant("danger");
        if (data === 1) {
          //Alerte ok
          setRecupAlertText("Un mail de récupération vous a été envoyé. Merci de vérifier votre boite mail, et de suivre les instructions.")
          setRecupAlertVariant("success");
        } else if (data === 2) {
          //Alerte pas ok
          setRecupAlertText("Ce mail est inconnu.")
        } else {
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
          Merci d'indiquer votre adresse mail.
        </p>
        <p>
          Si celle-ci est connu de notre
          service, vous recevrez un mail avec le <span>lien de réinitialisation du mot
            de passe.</span>
        </p>

        <Form className="m-4" onSubmit={() => handleForgotPassword()}>
          <Form.Control
            type="email"
            required
            placeholder="Tapez votre adresse email"
            value={mailRecup}
            onChange={(e) => setMailRecup(e.target.value)}
          />

          <div>
            {/* <Button variant="primary" type="submit"> */}
            <Button className="btn-modal" variant="" onClick={() => handleForgotPassword()}>
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
        dialogClassName="modal-password"
      >
        <Modal.Header>
          <h1>Mot de passe oublié ?</h1>
          <Button
            className="close-modal"
            variant=""
          ><FontAwesomeIcon icon={faXmark} onClick={() => setShowModal(false)} />
          </Button>
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

  const ErreurChampsManquant = () => {
    let _messagesChamps = [];

    const pushMessageIfCondition = (_var, message) => {
      if (_var.length <= 0) {
        _messagesChamps.push(message);
      }
    }
    pushMessageIfCondition(codeEntreprise, "le code entreprise");
    pushMessageIfCondition(login, "l'email");
    pushMessageIfCondition(password, "le mot de passe");
    return (
      <span>
        Champs manquants. Merci de renseigner{
          _messagesChamps.map((msg, i, _messagesChamps) => {
            if (i === 0) {
              return ` ${msg}`;
            }

            if (i + 1 === _messagesChamps.length) {
              return ` et ${msg}`;
            }

            return `, ${msg}`;
          })
        } pour vous connecter.
      </span>
    );


  }

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
      case _IdError === 400:
        return ErreurChampsManquant();
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

  const CanonicalURICodeEntreprise = async () => {

    let _curentHost = window.location.host;

    let _responseURI = await IsURICanonnical();
    let _isCannon = _responseURI === "1";

    if (_isCannon) {
      // let _wsForToken;
      let _b64Image = "";
      const GetResponseURLWS = (data) => {
        if (isNaN(data) && data.urlWSClient) {
          // _wsForToken = data.urlWSClient;
          _b64Image = data?.logoClient;
        }
        setCodeEntreprise(_curentHost);
        setShowCodeEntreprise(false);
        setImageLogo(_b64Image);
      }
  
      await GetURLWs(_curentHost, GetResponseURLWS);

    } else {
      setShowCodeEntreprise(true);
    }

  }

  useEffect(() => {
    document.title = "Connexion";
    CanonicalURICodeEntreprise();
  }, [login]);

  const FormSubmit = () => {

    return (
      <Form className="m-4 p-2">
        {
          showCodeEntreprise &&
          <Form.Group className="mb-4" controlId="formCodeEntreprise">



            <Form.Label>Code entreprise</Form.Label>
            <Form.Control
              type="number"
              required
              placeholder="000-000"
              value={codeEntreprise}
              onChange={(e) => setCodeEntreprise(e.target.value)}
              onKeyUp={handleCodeEntrepriseKeyPress}
            />
          </Form.Group>
        }

        <Form.Group className="mb-4" controlId="formLogin">

          <Form.Label>Email</Form.Label>

          <Form.Control
            ref={inputRefLogin}
            type="email"
            required
            placeholder="@"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            onKeyUp={handleLoginKeyPress}
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="formPassword">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              ref={inputRefPassword}
              type={revealed ? "text" : "password"}
              required
              placeholder="****"
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
        </Form.Group>

        <Button onClick={() => handleSubmit()}>
          Connexion
        </Button>

        <div className=" d-flex justify-content-center m-4">
          <NavLink
            onClick={() => setShowModal(true)}
            className="link-password-forgot"
          >
            Mot de passe oublié ?{" "}
            <span className="text-reset">
              Réinitialiser &gt;
            </span>
          </NavLink>
        </div>
      </Form>
    );
  };

  //#endregion

  return (
    <Container fluid>
      <Row className="align-items-center" style={{ minHeight: "100vh" }}>
        <Col md={12} xl={9} className="p-0">
          <div className="login-background"
            style={{
              backgroundImage: `url(${backgroundLogin})`,
            }}
          />
        </Col>
        <Col md={12} xl={3} className="d-flex align-items-center justify-content-around flex-column login-content-wrapper">
          {/* Logo au-dessus du formulaire */}
          <div className="container-login-content">
          <img src={imageLogo} height={80} alt="logo entreprise" />
            {FormSubmit()}
          </div>
          {/* Image logo_noir en dessous du formulaire */}
          <div className="container-powered-by">
            <p className="text-center text-powered-by">Application propulsée <br></br>par</p>
              <LogoNoir className="d-inline-block align-top svg-powered-by" />
          </div> 
        </Col>
      </Row>
      {ModalForgotPassword()}
      {ModalAlerte()}
    </Container>
  );
};

export default LoginPage;
