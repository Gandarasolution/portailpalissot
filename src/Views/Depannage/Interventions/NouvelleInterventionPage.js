//#region Imports
import { useContext } from "react";
import { useState } from "react";

//#region FontAwesome
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//#endregion

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Placeholder from "react-bootstrap/Placeholder";

//#endregion

//#region Components
import {
  ClientSiteContratContext,
  ParametresContext,
  TokenContext,
} from "../../../App";
import { useEffect } from "react";
import { GetListeSecteur, GetListeTels } from "../../../axios/OLD_WSGandara";
import { ParseKVAsArray } from "../../../functions";

//#endregion

//#endregion

const NouvelleInterventionPage = ({ setPageSubtitle, setPageTitle }) => {
  const ParamsCt = useContext(ParametresContext);
  const TokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);

  //#region States
  const [validated, setValidated] = useState(false);

  const [listeSecteurs, setListeSecteurs] = useState([]);

  const [secteurChoix, setSecteurChoix] = useState(listeSecteurs[0]);

  const [objetDemande, setObjetDemande] = useState("");

  const [listeTels, setListeTel] = useState([
    // { k: "Portable", v: "06 05 04 03 02" },
    // { k: "Domicile", v: "03 04 05 06 07" },
  ]);
  const [telChoix, setTelChoix] = useState();
  const [customTel, setCustomTel] = useState("");

  const [isLoadedSecteurs, setIsLoadedSecteurs] = useState(false);
  // eslint-disable-next-line
  const [isLoadedTel, setIsLoadedTel] = useState(false);
  //#endregion

  //#region Fonctions

  const GetData = () => {
    setPageSubtitle("");
    const FetchSetSecteurs = (data) => {
      setListeSecteurs(data);
      setIsLoadedSecteurs(true);
    };

    const FetchSetTel = (data) => {
      setListeTel(ParseKVAsArray(data));
      setIsLoadedTel(true);
    };

    GetListeSecteur(
      TokenCt,
      ClientSiteCt.storedClientSite.GUID,
      FetchSetSecteurs
    );

    GetListeTels(TokenCt, ClientSiteCt.storedClientSite.GUID, FetchSetTel);
  };

  //#endregion

  //#region Evenements

  const HandleSecteurChoix = (e) => {
    let _choix = listeSecteurs.find((secteur) => {
      return Number(secteur.k) === Number(e.target.value);
    });
    setSecteurChoix(_choix);
  };

  const HandleObjetDemande = (e) => {
    e.preventDefault();
    setObjetDemande(e.target.value);
  };

  const HandleTelChoix = (e) => {
    setTelChoix(e.target.value);
  };
  const HandleCustomTelChoix = (e) => {
    setCustomTel(e.target.value);
  };

  const HandleSubmit = (event) => {
    const form = event.currentTarget;

    console.log("secteur : ", secteurChoix);
    console.log("objet : ", objetDemande);
    console.log("tel : ", customTel.length > 0 ? customTel : telChoix);

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  //#endregion

  useEffect(() => {
    document.title = "Demande de dépannage";
    setPageTitle("Demande de dépannage");
    GetData();
    // eslint-disable-next-line
  }, [ClientSiteCt.storedClientSite.GUID]);

  return (
    <Container fluid>
      {/* <TitreOfPage titre={"Nouvelle intervention"} /> */}
      <Container fluid className="container-table ">
        <Form noValidate validated={validated} onSubmit={HandleSubmit}>
          <Row className="m-4">
            <Col md={12} className="mt-2">
              {isLoadedSecteurs ? (
                <FloatingLabel label="Choix du secteur">
                  <Form.Select onChange={HandleSecteurChoix}>
                    {listeSecteurs.map((secteur) => {
                      return (
                        <option value={secteur.k} key={secteur.k}>
                          {secteur.v}
                        </option>
                      );
                    })}
                  </Form.Select>
                </FloatingLabel>
              ) : (
                <Placeholder as="p" animation="glow">
                  Choix du secteur
                  <Placeholder xs={12} />
                </Placeholder>
              )}
            </Col>

            <Col md={12} className="mt-4 mb-4">
              <FloatingLabel
                controlId="floatingTextarea2"
                label="Objet de la demande"
              >
                <Form.Control
                  required
                  as={"textarea"}
                  value={objetDemande}
                  onChange={HandleObjetDemande}
                  className="h-75"
                />
                <Form.Control.Feedback type="invalid">
                  Merci de renseigner l'objet de votre demande.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <h4>Où vous rappeller</h4>

            <Col md={6} className="mt-2">
              <FloatingLabel label="Chosissez un numéro enregistré">
                <Form.Select onChange={HandleTelChoix}>
                  {listeTels.map((tel, index) => {
                    return (
                      <option value={tel.v} key={index}>
                        {`${tel.k} - ${tel.v}`}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
            </Col>

            <Col md={6} className="mt-2">
              <FloatingLabel
                controlId="floatingTextarea2"
                label="Ou renseignez un autre numéro"
              >
                <Form.Control
                  type="tel"
                  value={customTel}
                  onChange={HandleCustomTelChoix}
                />
                <Form.Control.Feedback type="invalid">
                  Le numéro n'est pas correct
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <Col md={2} className="mt-2">
              <Button variant="success" className="mx-auto m-4" type="submit">
                Envoyer
              </Button>
            </Col>
            <Col md={10} className="mt-2 ">
              <span className=" m-4">
                <h3 style={{ color: "red" }}>
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  En cas d'urgence contactez le{" "}
                  <a
                    className="text-decoration-none"
                    href={`tel:${ParamsCt.find((p) => p.k === "TelUrgenceIntervention").v
                      }`}
                  >
                    {ParamsCt.find((p) => p.k === "TelUrgenceIntervention").v}
                  </a>{" "}
                  <FontAwesomeIcon icon={faBell} className="ms-2" />
                </h3>
              </span>
            </Col>
          </Row>
        </Form>
      </Container>
    </Container>
  );
};

export default NouvelleInterventionPage;
