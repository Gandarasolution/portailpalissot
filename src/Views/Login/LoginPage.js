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
import { CreateTokenMDP, IsURICanonnical, Connexion, GetListeParametres, GetURLWs, CheckTokenMDP, ChangeMDP } from "../../axios/WS_User";

//#endregion

//#endregion
import backgroundLogin from "../../image/imageLogin/login.jpg";
// import logo from "../../image/favicon.ico";
import { ReactComponent as LogoNoir } from "../../image/imageLogin/login-gandara-propulsee-noir.svg";
import logoDefault from "../../image/imageLogin/logo_noir.png";
import { isValidEmail, isValidGUID } from "../../functions";
import { useParams } from "react-router-dom";
const LoginPage = (props) => {
  //#region States
  const [revealed, setRevealed] = useState(false);

  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");
  const [codeEntreprise, setCodeEntreprise] = useState("");

  const [imageLogo, setImageLogo] = useState(logoDefault);

  const [showCodeEntreprise, setShowCodeEntreprise] = useState(false);

  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);
  const [mailRecup, setMailRecup] = useState("");

  const [showModalChangePassword, setShowModalChangePassword] = useState(false);

  const { token } = useParams()
  const [validiteToken, setValiditeToken] = useState(0)//0 inconnu,1 valide,2 invalide 


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
    let _isUser = isNaN(login) ? 0 : 1;
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

  const FormModalForgotPassword = () => {

    const TextModalForgotPassword = () => {
      return <>
        <p>
          Merci d'indiquer votre adresse mail.
        </p>
        <p>
          Si celle-ci est connu de notre
          service, vous recevrez un mail avec le <span>{`lien de ${props.newMdp ? "création" : "réinitialisation"} du mot
            de passe.`}</span>
        </p>
      </>
    }


    const EmailModalForgotPassword = () => {
      return <Form.Control
        type="email"
        required
        placeholder="Tapez votre adresse email"
        value={mailRecup}
        onChange={(e) => setMailRecup(e.target.value)}
        onVal
      />
    }


    const handleForgotPassword = async () => {
      if (mailRecup.length > 0 && isValidEmail(mailRecup)) {

        const FetchSetRecup = (data) => {
          setRecupAlertVariant("danger");
          if (data === 1) {
            //Alerte ok
            setRecupAlertText("Si vous possédez un compte lié à cette adresse, un mail de récupération vous a été envoyé. Merci de vérifier votre boite mail, et de suivre les instructions.")
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

        let _wsForToken = "";
        let _wsEndpoint = "";
        const GetResponseURLWS = (data) => {
          if (isNaN(data) && data.urlWSClient) {
            _wsForToken = data.urlWSClient;
            _wsEndpoint = data.urlWSEndpoint
          }

        }

        await GetURLWs(codeEntreprise, GetResponseURLWS);

        CreateTokenMDP(mailRecup, FetchSetRecup, _wsForToken, _wsEndpoint)
      }
    };

    const SubmitButtonModalForgotPassword = () => {

      return <div>
        <Button className="btn-modal" type="submit" variant="" onClick={() => handleForgotPassword()}>
          Envoyer
        </Button>
      </div>

    }

    return (
      <div>
        <TextModalForgotPassword />

        <Form className="m-4" onSubmit={(e) => { e.preventDefault(); handleForgotPassword() }}>
          {EmailModalForgotPassword()}
          <SubmitButtonModalForgotPassword />
        </Form>
      </div>
    );
  };

  const ModalForgotPassword = () => {
    return (
      <Modal
        show={showModalForgotPassword}
        onHide={handleModalForgotPasswordClose}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-password"
      >
        <Modal.Header>
          <h1>{props.newMdp ? "Première visite ? " : "Mot de passe oublié ?"}</h1>
          {!props.newMdp && <Button
            className="close-modal"
            variant=""
          ><FontAwesomeIcon icon={faXmark} onClick={handleModalForgotPasswordClose} />
          </Button>}
        </Modal.Header>

        <Modal.Body>{FormModalForgotPassword()}</Modal.Body>
      </Modal>
    );
  };




  const handleModalForgotPasswordClose = () => {
    if (props.forget) {
      window.location.href = "/"
    } else {
      setShowModalForgotPassword(false);
    }
  }



  //#endregion

  //#region Change password

  const VerificationToken = async () => {//Vérifie que le token est encore valide
    // await CanonicalURICodeEntreprise()

    let _wsForToken = "";
    let _wsEndpoint = "";
    const GetResponseURLWS = (data) => {
      if (isNaN(data) && data.urlWSClient) {
        _wsForToken = data.urlWSClient;
        _wsEndpoint = data.urlWSEndpoint

      }
    }

    await GetURLWs(codeEntreprise, GetResponseURLWS)

    const FetchSetDataTokenIsValid = (data) => {
      if (data && (data === 1)) {//Le token est encore valide
        setValiditeToken(1);
      } else if (data && (data === 2)) {//Le token est périmé
        //Token plus valide
        setValiditeToken(2);
      }
      else {//Le token n'est pas correct, ou il n'existe pas.
        setValiditeToken(3);
      }


    }

    if (_wsForToken.length > 1 && _wsEndpoint.length > 1) {
      CheckTokenMDP(token, (props.newMdp ? 1 : 0), FetchSetDataTokenIsValid, _wsForToken, _wsEndpoint)

    } else {
      //Erreur de co au serveur
    }

  }

  const FormModalChangePassword = () => {
    const [newMdp, setNewMdp] = useState('')
    const [newMdp2, setNewMdp2] = useState('')
    /**
     * Composant permettant d'afficher les alertes selon la validité du token.
     * @returns Les alertes si le token n'est pas ou plus valide.
     */
    const AlertsTokenModalChangePassword = () => {
      return (<>
        {validiteToken === 2 && <Alert variant={"danger"} show={validiteToken === 2}>
          Ce lien est expiré. {``} Pour redemander un lien de {props.newMdp ? "finalisation d'accès" : "réinitialisation de mot de passe"} cliquez :
          <NavLink
            // href="/forget"
            href={`/forget${props.newMdp ? `/${token}` : ""}`}
            className="link-password-forgot"
          >
            {
              props.newMdp ? <div>
                Redemander un lien &gt;
              </div> : <div>
                Mot de passe oublié ?{" "}
                <span className="text-reset">
                  Réinitialiser &gt;
                </span></div>
            }
          </NavLink>
        </Alert>}
        {validiteToken === 3 && <Alert variant={"danger"} show={validiteToken === 3}>
          Le jeton n'est pas valide. Veuillez recommencer votre demande.
          <NavLink
            // href="/forget"
            href={`/forget${props.newMdp ? `/${token}` : ""}`}
            className="link-password-forgot"
          >
            {
              props.newMdp ? <div>
                Redemander un lien &gt;
              </div> : <div>
                Mot de passe oublié ?{" "}
                <span className="text-reset">
                  Réinitialiser &gt;
                </span></div>
            }
          </NavLink>
        </Alert>}
      </>)
    }

    /**
     * Composant permettant d'afficher un texte si c'est une finalisation d'acces et si le token est potentiellement valide ou valide.
     * @returns Le text affiché 
     */
    const TextModalChangePassword = () => {
      //Le texte apparait seulement si c'est la première vsite, et si le token n'est pas PLUS valide ni PAS valide.
      return (props.newMdp && (validiteToken === 0 || validiteToken === 1) &&
        <span>
          <p>
            Ceci est votre première visite.
          </p>
          <p>
            Afin de finaliser votre accès, merci de créer votre mot de passe.
          </p>
        </span>
      )
    }

    /**
     * Composant affichant le champs du code d'entreprise a renseigné si l'utl n'est pas cannonique
     * @returns Le Form.Group du code d'entreprise
     */
    const CodeEntrepriseModalChangePassword = () => {
      //Le code d'entreprise s'affiche uniquement si l'url n'est pas cannonique
      return (showCodeEntreprise && <Form.Group controlId="formCodeEntreprise" >
        <Form.Label>Code entreprise</Form.Label>
        <Form.Control
          type="number"
          required
          placeholder="000-000"
          value={codeEntreprise}
          onChange={(e) => setCodeEntreprise(e.target.value)}
        // onKeyUp={handleCodeEntrepriseKeyPress}
        />
      </Form.Group>)
    }


    /**
     * Composant permettant d'afficher les champs pour remplir nouveau mdp et confirmation, seulement si le token est potentiellement valide.
     * @returns Les contrôles permettant de renseigner le nouveau mot de passe et la confirmation
     */
    const PasswordModalChangePassword = () => {

      const [showPass1, setShowPass1] = useState(false);
      const [showPass2, setShowPass2] = useState(false);
      //Seulement si le token est potentiellement valide
      return (
        (validiteToken === 0 || validiteToken === 1) && <>
          <Form.Group controlId="formBasicPassword">
            {/* <Form.Label>Nouveau mot de passe</Form.Label> */}
            <Form.Control type={showPass1 ? '' : "password"} placeholder={`Veuillez renseigner votre${props.newMdp ? "" : " nouveau"} mot de passe`} value={newMdp} onChange={(e) => setNewMdp(e.target.value)} required />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            {/* <Form.Label>Nouveau mot de passe</Form.Label> */}
            <Form.Control type={showPass2 ? '' : "password"} placeholder={`Veuillez confirmer votre${props.newMdp ? "" : " nouveau"} mot de passe`} value={newMdp2} onChange={(e) => setNewMdp2(e.target.value)} required />
          </Form.Group>
        </>

      )
    }


    /**
     * Composant permettant d'afficher le bouton de validation seulement si le token est potentiellement valide.
     * @returns Le bouton de submit
     */
    const ButtonSubmitModalChangePassword = () => {
      const [alertPassVisible, setAlertPassVisible] = useState(false);
      const [alertPassVariant, setAlertPassVariant] = useState("danger");
      const [alertPassText1, setAlertPassText1] = useState("");
      const [alertPassText2, setAlertPassText2] = useState("");

      const ButtonSubmited = async e => {
        //Vérification mdp rempli
        let _isPass1 = newMdp.length > 0;
        let _isPass2 = newMdp2.length > 0;
        if (!_isPass1) {
          setAlertPassText1("Veuillez renseigner un mot de passe.")
        }
        if (!_isPass2) {
          setAlertPassText2("Veuillez confirmer votre mot de passe.")
        }

        if ((!_isPass1) || (!_isPass2)) {
          setAlertPassVisible(true);
          return;
        }

        e.preventDefault()

        //Vérification même mdp
        if (newMdp !== newMdp2) {
          setAlertPassText1("Les mots de passes ne sont pas identiques.")
          setAlertPassVisible(true);
          return;
        }

        //Réinit mot de passe
        const FetchSetData = (data) => {
          if (data === 1) {
            //Redirection connexion
            setAlertPassText1("Mot de passe modifié");
            setAlertPassVariant("success");
            setAlertPassVisible(true);

            window.location.href = "/";
          }

          else if (data === 0) {
            setAlertPassVariant("danger")
            setAlertPassText1("Votre demande ne peux pas aboutir.")
            setAlertPassVisible(true);
          }
          else {
            setAlertPassVariant("danger")
            setAlertPassText1("Une erreur est survenue lors de la tentative de changement de mot de passe. Veuillez vérifier votre connexion ou réessayer dans quelques minutes. Si le problème persiste, contactez le support.");
            setAlertPassVisible(true);
          }



        }

        let _wsForToken = "";
        let _wsEndpoint = "";
        const GetResponseURLWS = (data) => {
          if (isNaN(data) && data.urlWSClient) {
            _wsForToken = data.urlWSClient;
            _wsEndpoint = data.urlWSEndpoint
            // _themeFromWS = data?.themeClient;
            // _logoClient = data?.logoClient;
            // props.setWsEndpoint(data.urlWSEndpoint)
          }

        }
        await GetURLWs(codeEntreprise, GetResponseURLWS);

        ChangeMDP(token, newMdp, FetchSetData, _wsForToken, _wsEndpoint)



      }

      const AlertPass = () => {
        return <Alert variant={alertPassVariant} show={alertPassVisible}>
          {
            alertPassText1.length > 0 && <>{alertPassText1}</>
          }
          {
            alertPassText2.length > 0 && <> {alertPassText1.length > 0 ? <> <br /> {alertPassText2}</> : alertPassText2}</>
          }
        </Alert>
      }


      return (//seulement si le token est potentiellement valide.
        <>
          {(validiteToken === 0 || validiteToken === 1) && <Button type="submit" className="btn-modal" variant="" onClick={ButtonSubmited}>
            {props.newMdp ? "Finaliser mon accès" : "Changer de mot de passe"}
          </Button>}
          <AlertPass />
        </>
      )
    }


    return (
      <div>
        <TextModalChangePassword />
        <Form className="m-4" >
          <CodeEntrepriseModalChangePassword />
          {PasswordModalChangePassword()}
          <AlertsTokenModalChangePassword />
          <ButtonSubmitModalChangePassword />
        </Form>
      </div>
    );
  };


  const handleModalChangePasswordClose = () => {
    if (props.changeMdp) {
      window.location.href = "/"
    } else {
      setShowModalChangePassword(false);
    }
  }


  const ModalChangePassword = () => {
    return (props.newMdp || props.changeMdp) ? <Modal
      show={showModalChangePassword}
      onHide={handleModalChangePasswordClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-password"
    >
      <Modal.Header>
        <h1>Définir un {props.newMdp ? "" : "nouveau"} mot de passe.</h1>
      </Modal.Header>

      <Modal.Body>{FormModalChangePassword()}</Modal.Body>


    </Modal>
      : <></>
  }


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
          onClick={() => setShowModalForgotPassword(true)}
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

    if (codeEntreprise !== window.location.host) {
      CanonicalURICodeEntreprise();
    } else {
      if (props.forget) {
        setShowModalForgotPassword(true);
      }

      if (props.changeMdp) {

        setShowModalChangePassword(true);

        //Vérification token est viable
        if (isValidGUID(token)) {//Le token est un guid.
          VerificationToken();
        } else { setValiditeToken(3) }
      }
    }

    if (props.forget) {
      setShowModalForgotPassword(true);
    }


  }, [codeEntreprise]);

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
            onClick={() => setShowModalForgotPassword(true)}
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
      {ModalChangePassword()}
      {ModalAlerte()}
    </Container>
  );
};

export default LoginPage;
