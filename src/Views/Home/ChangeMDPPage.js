import { useEffect, useState } from "react";
import { Alert, Container, NavLink } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Navigate, useParams } from "react-router-dom";
import { ChangeMDP, GetURLWs, IsURICanonnical } from "../../axios/WS_User";
import logoDefault from "../../image/imageLogin/logo_noir.png";

const ChangeMDPPage = () => {
  const { token } = useParams()
  const [newMdp, setNewMdp] = useState('')
  const [newMdp2, setNewMdp2] = useState('')
  const [alertVisible, setAlertVisible] = useState(false)
  const [textalert, setTextAlert] = useState("")
  const [alertVariant, setAlertVariant] = useState("")
  const [showCodeEntreprise, setShowCodeEntreprise] = useState(false);
  const [codeEntreprise, setCodeEntreprise] = useState("");
  const [imageLogo, setImageLogo] = useState(logoDefault);
  // const navigate = useNavigate()


  /**
   * Ensures the value is a valid GUID
   * @param value string value
   */
  function isValidGUID(value) {
    if (value.length > 0) {
      if (!(/^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/).test(value)) {
        return false;
      }
    }

    return true;
  }

  const CanonicalURICodeEntreprise = async () => {

    let _curentHost = window.location.host;

    let _responseURI = await IsURICanonnical();
    let _isCannon = _responseURI === "1";

    if (_isCannon) {
      let _b64Image = "";
      const GetResponseURLWS = (data) => {
        if (isNaN(data) && data.urlWSClient) {
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


  const SubmitNewMDP = async () => {

    if (newMdp.length > 0 && newMdp === newMdp2) {
      const FetchSetData = (data) => {

        setAlertVariant("danger")

        if (data === 1) {

          //Redirection connexion
          setTextAlert("Mot de passe modifié");
          setAlertVisible(true);
          setAlertVariant("success");
          // navigate("/");
          window.location.href = "/";

        } else if (data === 0) {
          setTextAlert("La demande n'est plus valide. Veuillez recommencer votre demande");
          setAlertVisible(true);
        } else {
          setTextAlert("Une erreur est survenue lors de la tentative de changement de mot de passe. Veuillez vérifier votre connexion ou réessayer dans quelques minutes. Si le problème persiste, contactez le support.");
          setAlertVisible(true);

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


    } else {
      setAlertVariant("danger")

      setAlertVisible(true)
      setTextAlert("Les mots de passes ne sont pas identiques.")
    }


  }

  useEffect(() => {
    document.title = "Connexion";
    CanonicalURICodeEntreprise();

  }, []);



  return (
    <Container >

<h1>Définir un nouveau mot de passe</h1>
      <Form  className="m-5">
        {
          isValidGUID(token) && showCodeEntreprise &&
          <Form.Group className="mb-4" controlId="formCodeEntreprise">



            <Form.Label>Code entreprise</Form.Label>
            <Form.Control
              type="number"
              required
              placeholder="000-000"
              value={codeEntreprise}
              onChange={(e) => setCodeEntreprise(e.target.value)}
            // onKeyUp={handleCodeEntrepriseKeyPress}
            />
          </Form.Group>
        }

        {isValidGUID(token) && <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nouveau mot de passe</Form.Label>
          <Form.Control type="password" placeholder="Veuillez renseigner votre nouveau mot de passe" value={newMdp} onChange={(e) => setNewMdp(e.target.value)} required />
          {/* <Form.Text className="text-muted">
          Merci de renseigner votre nouveau mot de passe
        </Form.Text> */}
        </Form.Group>}

        {isValidGUID(token) && <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Confirmer votre nouveau mot de passe</Form.Label>
          <Form.Control type="password" placeholder="Veuillez confirmer votre nouveau mot de passe" value={newMdp2} onChange={(e) => setNewMdp2(e.target.value)} required />
          {/* <Form.Text className="text-muted">
          Merci de renseigner votre nouveau mot de passe
        </Form.Text> */}
        </Form.Group>}

        <Alert variant={"danger"} show={!isValidGUID(token)}>
          Le jeton n'est pas valide. Veuillez recommencer votre demande.
          <NavLink
            href="/forget"
            className="link-password-forgot"
          >
            Mot de passe oublié ?{" "}
            <span className="text-reset">
              Réinitialiser &gt;
            </span>
          </NavLink>
        </Alert>
        <Alert variant={alertVariant} show={alertVisible}>
          {textalert}
        </Alert>

        <div className=" d-flex justify-content-center m-4">
        </div>
        {isValidGUID(token) && <Button variant="" className="button-password mt-10" onClick={() => SubmitNewMDP()}>
          Changer de mot de passe
        </Button>}
      </Form>
      </Container>

  );
};

export default ChangeMDPPage;
