//#region Imports
import { useContext, useEffect, useState } from "react";

//#region FontAwsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
//#endregion

//#region Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Placeholder from "react-bootstrap/Placeholder";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

//#endregion

//#region Components
import TitreOfPage from "../../components/commun/TitreOfPage";
import {
  GetClientSiteContrat,
  GetListeMails,
  GetListeTels,
  GetNombrePortails,
} from "../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../App";
import { Form } from "react-bootstrap";

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
  const [listeTels, setListeTels] = useState([]);
  const [telIsLoaded, setTelIsLoaded] = useState(false);

  const [showMails, setShowMails] = useState(false);
  const [listeMails, setListeMails] = useState([]);
  const [mailIsLoaded, setMailIsLoaded] = useState(false);

  const [nbPortails, setNbPortails] = useState([]);
  const [isLoadedNbPortails, setIsLoadedNbPortails] = useState(false); 

  
  const [search, setSearch] = useState("");
  

  //#endregion

  //#region Fonctions

  function GetDataTrimed() {
    let _data = JSON.parse(JSON.stringify(listeClientSite));

    // if (search.length > 0) {
    //   const sortedData = []
    //     .concat(
    //       _data.map(
    //         (e) =>
    //           e.NomCompletClientSite.toUpperCase().includes(
    //             search.toUpperCase()
    //           ) && e
    //       ),
    //       _data.map(
    //         (e) =>
    //           !e.NomCompletClientSite.toUpperCase().includes(
    //             search.toUpperCase()
    //           ) && e
    //       )
    //     )
    //     .filter((e) => e);

    //   _data = sortedData;
    // }

    if(search.length > 0)
    {
      const filteredData = _data.filter((f) => f.NomCompletClientSite.toUpperCase().includes(search.toUpperCase()));
      _data = filteredData;
    }


    return _data;
  }

  const reactStringReplace = require("react-string-replace");
  function HighlightTextIfSearch(text) {
    if (
      String(search).length > 0 &&
      String(text).toUpperCase().includes(String(search).toUpperCase())
    ) {
      return (
        <span>
          {reactStringReplace(String(text), String(search), (match, i) => (
            <mark key={i}>{match}</mark>
          ))}
        </span>
      );
    } else {
      return text;
    }
  }

  function GetClientSites() {
    setIsLoaded(false);

    const FetchSetClientSite = (data) => {
      setListeClientSite(data);
      setIsLoaded(true);
    };

    GetClientSiteContrat(tokenCt, FetchSetClientSite);
  }

  function GetTels() {
    const FetchSetListeTels = (data) => {
      if (!Array.isArray(data)) {
        data = Array(data);
      }
      setListeTels(data);

      setTelIsLoaded(true);
    };

    setTelIsLoaded(false);
    setShowTels(true);

    GetListeTels(
      tokenCt,
      ClientSiteCt.storedClientSite.IdClientSite,
      FetchSetListeTels
    );
  }

  function GetMails() {
    const FetchSetListeMails = (data) => {
      if (!Array.isArray(data)) {
        data = Array(data);
      }
      setListeMails(data);

      setMailIsLoaded(true);
    };

    setMailIsLoaded(false);
    setShowMails(true);

    GetListeMails(
      tokenCt,
      ClientSiteCt.storedClientSite.IdClientSite,
      FetchSetListeMails
    );
  }

  //#endregion

  //#region Evenements

  const HandleSearchOnChange = (e) => {
    setSearch(e.target.value);
  };

  //#endregion

  //#region Composants

  const CardClientSite = ({ clientSite }) => {
    const HandleChoixDuSite = () => {
      ClientSiteCt.setClientSite(clientSite);
    };

    return (
      <Card className="m-2">
        <Card.Header>
          <Card.Title>
            {HighlightTextIfSearch(clientSite.NomCompletClientSite)}
          </Card.Title>
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
            <FontAwesomeIcon icon={faLocationDot} />{" "}
            {clientSite.AdresseClientSite}
          </div>

        
        </Card.Body>
        <Card.Footer>
        <Row>
            <Button onClick={HandleChoixDuSite} variant="">
              Choisir ce site
            </Button>
          </Row>
        </Card.Footer>
      </Card>
    );
  };

  const ActualClientSite = () => {
    const _cs = ClientSiteCt.storedClientSite;

    const TITRE = () => {
      return (
        <Row className="m-2">
          <h1>{_cs.NomCompletClientSite}</h1>
          <h2>
            {_cs.IdContrat > 0
              ? `Contrat N° ${_cs.IdContrat} souscrit le ${new Date(
                  _cs.DateSouscriptionContrat
                ).toLocaleDateString()}`
              : "Aucun contrat actif"}
          </h2>
        </Row>
      );
    };
    const ADRESSE = () => {
      return (
        <h4 className="m-2">
          <FontAwesomeIcon icon={faLocationDot} />{" "}
          <a
            href={`https://www.google.fr/maps/place/${_cs.CoordonneesGPSClientSite}`}
            target="blank"
          >
            {_cs.AdresseClientSite}
          </a>
        </h4>
      );
    };
    const CONTACT = () => {
      return (
        <Row className="m-2">
          <Col>
            <Button onClick={() => GetTels()} variant="">
              <h4>
                <FontAwesomeIcon icon={faPhone} /> Liste des téléphones{" "}
              </h4>
            </Button>
            <ModalTels />
          </Col>
          <Col>
            <Button onClick={() => GetMails()} variant="">
              <h4>
                <FontAwesomeIcon icon={faEnvelope} /> Liste des mails{" "}
              </h4>
            </Button>
            <ModalMail />
          </Col>
        </Row>
      );
    };
    const INFOS = () => {
      const BADGEINFO = ({ kv }) => {
        let _text = "";
        let _href = "";
        switch (kv.k) {
          case "NbPrestations":
            _text = "prestations maintenances";
            _href="/contrat";
            break;
          case "NbAppareils":
            _text = "appareils enregistrés";
            _href = "/appareils";
            break;
          case "NbInterventions":
            _text = "interventions de dépannages";
            _href= "/interventions";
            break;
          case "NbDevis":
            _text = "devis";
            _href = "/devis";
            break;
          case "NbFactures":
            _text = "factures";
            _href = "/factures";
            break;
          default:
            break;
        }
        
        return (
          // <Col>
            <a href={_href}>
              <div className="badge badge-bg-info-nowrap"> {`${kv.v} ${_text}`}</div>
              </a>
          // </Col>
        );
      };



      return (
        <h4 className="m-2">
          <Row>
            {isLoadedNbPortails ? 
            nbPortails.map((kv,index) => {
              return <Col key={index}>
               <BADGEINFO kv={kv}   />
              </Col>
            })  
            
            :  <Col>
          
          <Placeholder as="p" animation="glow">
                    <Placeholder xs={5} />
                  </Placeholder>
        </Col>
          }
{/* 
            <BADGEINFO text={`${125} prestations maintenances`} />
            <BADGEINFO text={`${52} appareils enregistrés`} />
            <BADGEINFO text={`${89} interventions de dépannages`} />
            <BADGEINFO text={`${12} devis`} />
            <BADGEINFO text={`${189} factures`} /> */}
          </Row>
        </h4>
      );
    };

    return (
      <Container fluid className="border rounded">
        <TITRE />
        <ADRESSE />
        <CONTACT />
        <INFOS />
      </Container>
    );
  };

  const PlaceholderCards = ({ number }) => {
    const _arrPl = new Array(Number(number)).fill(number);

    return (
      <Row>
        {_arrPl.map((v, index) => {
          return (
            <Col md={4} key={index}>
              <Card className="m-2">
                <Card.Title>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={v} />
                  </Placeholder>
                </Card.Title>
                <Card.Body>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={v} />
                  </Placeholder>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  const ModalTels = () => {
    const TableRowTel = ({ kv }) => {
      return (
        <tr>
          <td>{kv.v}</td>
          <td>{kv.k}</td>
        </tr>
      );
    };

    return (
      <Modal show={showTels} onHide={() => setShowTels(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des téléphones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover variant="light">
            <thead>
              <tr>
                <th>N°</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {telIsLoaded ? (
                listeTels.map((kv, index) => {
                  return <TableRowTel key={index} kv={kv} />;
                })
              ) : (
                <tr>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </td>

                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    );
  };

  const ModalMail = () => {
    const TableRowMel = ({ kv }) => {
      return (
        <tr>
          <td>{kv.v}</td>
          <td>{kv.k}</td>
        </tr>
      );
    };

    return (
      <Modal show={showMails} onHide={() => setShowMails(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Liste des mails</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover variant="light">
            <thead>
              <tr>
                <th>Adresse</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {mailIsLoaded ? (
                listeMails.map((kv, index) => {
                  return <TableRowMel key={index} kv={kv} />;
                })
              ) : (
                <tr>
                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </td>

                  <td>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={5} />
                    </Placeholder>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    );
  };

  const SearchBar = () => {
    return (
      <Form.Control
        type="search"
        placeholder="Recherchez..."
        value={search}
        onChange={HandleSearchOnChange}
      />
    );
  };
  //#endregion

  useEffect(() => {
    document.title = "Liste des sites";
    GetClientSites();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    
    const FetchSetNombrePortail = (data) => {
      setNbPortails(data);
      setIsLoadedNbPortails(true);
    }
    setIsLoadedNbPortails(false);
    GetNombrePortails(tokenCt,ClientSiteCt.storedClientSite.IdClientSiteRelation, FetchSetNombrePortail)


  },[ ClientSiteCt.storedClientSite])
  return (
    <Container fluid>
      <TitreOfPage
        titre={"Choix du site"}
        isLoaded={isLoaded}
        soustitre={`${listeClientSite.length} sites `}
      />
      <ActualClientSite />
      <div className="m-2">{SearchBar()}</div>
      <Row>
        {isLoaded ? (
          GetDataTrimed().map((clientSite) => {
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
          })
        ) : (
          <PlaceholderCards number={9} />
        )}
      </Row>
    </Container>
  );
};

export default ClientSitePage;
