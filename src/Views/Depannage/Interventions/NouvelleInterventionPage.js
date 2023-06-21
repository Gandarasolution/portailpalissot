//#region Imports

import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  Row,
} from "react-bootstrap";
import { ParametresContext } from "../../../App";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const NouvelleInterventionPage = ({ props }) => {

const ParamsCt = useContext(ParametresContext);

  //#region States
  const [validated, setValidated] = useState(false);

  const [listeSecteurs, setListeSecteurs] = useState([
    { IdSecteur: 4, LibelleSecteur: "Chaufferie" },
    { IdSecteur: 8, LibelleSecteur: "Bruleûrs process" },
  ]);

  const [secteurChoix, setSecteurChoix] = useState(listeSecteurs[0]);

  const [objetDemande, setObjetDemande] = useState("");

  const [listeTels, setListeTel] = useState([
    { k: "Portable", v: "06 05 04 03 02" },
    { k: "Domicile", v: "03 04 05 06 07" },
  ]);
  const [telChoix, setTelChoix] = useState(listeTels[0].v);
  const [customTel, setCustomTel] = useState("");

  // const [telUrgence, setTelUrgence] = useState("01 02 03 04 05");
  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  const HandleSecteurChoix = (e) => {
    let _choix = listeSecteurs.find((secteur) => {
      return secteur.IdSecteur === Number(e.target.value);
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

  return (
    <Container fluid className="p-4 h-100">
      <Container fluid className="container-table ">
        <Form noValidate validated={validated} onSubmit={HandleSubmit}>
          <Row className="m-4">
            
            <Col md={12} className="mt-2">
              <FloatingLabel label="Choix du secteur">
                <Form.Select onChange={HandleSecteurChoix}>
                  {listeSecteurs.map((secteur) => {
                    return (
                      <option value={secteur.IdSecteur} key={secteur.IdSecteur}>
                        {secteur.LibelleSecteur}
                      </option>
                    );
                  })}
                </Form.Select>
              </FloatingLabel>
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
                />
                <Form.Control.Feedback type="invalid">
                  Merci de renseigner l'objet de votre demande.
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>

            <h4>Où vous rappeller</h4>

            <Col md={6} className="mt-2">
              <FloatingLabel label="Chosissez un numéro enregistré">
                {/* <Form.Label>Numéros enregistrés</Form.Label> */}
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
                label="Ou renseignez un atrue numéro"
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

            <Col md={6} className="mt-2">
              <Button variant="success" className="mx-auto m-4" type="submit">
                Envoyer
              </Button>
            </Col>
            <Col md={6} className="mt-2 ">
              <span className=" m-4">
                <h3 style={{ color: "red" }}>
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  En cas d'urgence contactez le{" "}
                  <Badge bg="danger">
                    {" "}
                    <a
                      className="text-decoration-none"
                      href={`tel:${ParamsCt.find((p)=> p.k === "TelUrgenceIntervention").v}`}
                    >
                      {ParamsCt.find((p)=> p.k === "TelUrgenceIntervention").v}
                    </a>{" "}
                  </Badge>
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
