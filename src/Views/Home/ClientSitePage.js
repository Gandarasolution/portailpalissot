//#region Imports

import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { ClientSiteContratContext, TokenContext } from "../../App";
import { GetClientSiteContrat } from "../../axios/WSGandara";
import { Button, Card, Col, Collapse, Container, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faCaretDown, faCaretUp, faEnvelope, faLocationDot, faMailBulk, faMessage, faPhone } from "@fortawesome/free-solid-svg-icons";
import TitreOfPage from "../../components/commun/TitreOfPage";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const ClientSitePage = () => {
  const tokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);

  //#region States
  // await GetListeParametres(response, FetchSetListeParams);

  const [listeClientSite, setListeClientSite] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);


  const [showTels, setShowTels] = useState(false);
  const [showMails, setShowMails] = useState(false);

  //#endregion

  //#region Fonctions

  function GetClientSites() {
    setIsLoaded(false);

    const FetchSetClientSite = (data) => {
      setListeClientSite(data);
      setIsLoaded(true);
    };

    GetClientSiteContrat(tokenCt, FetchSetClientSite);
  }

  //#endregion

  //#region Evenements

  //#endregion

  //#region Composants

  const CardClientSite = ({ clientSite }) => {
    const HandleChoixDuSite = () => {
      ClientSiteCt.setClientSite(clientSite);
    };

    return (
      <Card className="m-2">
        <Card.Header>
          <Card.Title>{clientSite.NomCompletClientSite}</Card.Title>
          <Card.Subtitle>
            {clientSite.IdContrat > 0
              ? `Contrat N° ${clientSite.IdContrat} souscrit le ${new Date(
                  clientSite.DateSouscriptionContrat
                ).toLocaleDateString()}`
              : `Aucun contrat actif`}
          </Card.Subtitle>
        </Card.Header>
        <Card.Body>
          <div>
            <FontAwesomeIcon icon={faLocationDot} /> ZI LES GIRANAUX BP 71 70100
            ARC LES GRAY
          </div>

          <Row>
            <Button onClick={HandleChoixDuSite} variant="success">
              Choisir ce site
            </Button>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  const ActualClientSite = () => {
    const _cs = ClientSiteCt.storedClientSite;
    const _adresse = "47.458364,5.601228";

    return (
      <Container fluid className="border rounded">
        <Row>
          <h1>{_cs.NomCompletClientSite}</h1>
          <h2>
            {_cs.IdContrat > 0
              ? `Contrat N° ${_cs.IdContrat} souscrit le ${new Date(
                  _cs.DateSouscriptionContrat
                ).toLocaleDateString()}`
              : "Aucun contrat actif"}
          </h2>

          <h4>
            <FontAwesomeIcon icon={faLocationDot} />{" "}
            <a
              href={`https://www.google.fr/maps/place/${_adresse}`}
              target="blank"
            >
              ZI LES GIRANAUX BP 71 70100 ARC LES GRAY
            </a>
          </h4>
        </Row>

        <Row>
          <Col>
            <Button variant="">
              <h4>
                <FontAwesomeIcon icon={faPhone} /> {" "}
                Liste des téléphones {" "}
              </h4>
            </Button>
          </Col>
          <Col>
          <Button variant="">
              <h4>
                <FontAwesomeIcon icon={faEnvelope} /> {" "}
                Liste des mails {" "}
              </h4>
            </Button>
          </Col>
        </Row>
      </Container>
    );
  };

  //#endregion

  useEffect(() => {
    document.title="Liste des sites";
    GetClientSites();
    // eslint-disable-next-line
  }, []);

  return (
    <Container fluid className="">
      <TitreOfPage
        titre={"Choix du site"}
        isLoaded={isLoaded}
        soustitre={`${listeClientSite.length} sites `}
      />
      <ActualClientSite />
      <Row>
        {isLoaded &&
          listeClientSite.map((clientSite) => {
            if (
              clientSite.IdClientSite ===
              ClientSiteCt.storedClientSite.IdClientSite
            )
              return null;
            return (
              <Col md={4} key={clientSite.IdClientSite}>
                <CardClientSite clientSite={clientSite} />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default ClientSitePage;
