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
import Form from "react-bootstrap/Form";

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

//#endregion

//#endregion

const ClientSitePage = () => {
  const tokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);

  //#region States
  // await GetListeParametres(response, FetchSetListeParams);

  const [listeClientSite, setListeClientSite] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");

  //#endregion

  //#region Fonctions

  function GetDataTrimed() {
    let _data = JSON.parse(JSON.stringify(listeClientSite));

    if (search.length > 0) {
      const filteredData = _data.filter((f) =>
        f.NomCompletClientSite.toUpperCase().includes(search.toUpperCase())
      );
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

    const HEADERCARD = () => {
      return (
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
      );
    };

    const BODYCARD = () => {
      const ADRESSE = () => {
        return (
          <div>
            <FontAwesomeIcon icon={faLocationDot} />{" "}
            {` ${clientSite.AdresseClientSite}`}
          </div>
        );
      };

      const CONTACT = () => {
        const [showTels, setShowTels] = useState(false);
        const [listeTels, setListeTels] = useState([]);
        const [telIsLoaded, setTelIsLoaded] = useState(false);

        const HandleShowTel = async () => {
          const FetchSetTel = (data) => {
            let _arrayTels = [];
            if (!Array.isArray(data)) {
              if (data) {
                _arrayTels.push(data);
              }
            } else {
              _arrayTels = data;
            }

            setListeTels(_arrayTels);
            setTelIsLoaded(true);
          };
          setShowTels(true);
          await GetListeTels(tokenCt, clientSite.IdClientSite, FetchSetTel);
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
                <Modal.Title>
                  <h1>Liste des téléphones</h1>
                  <h4>{clientSite.NomCompletClientSite}</h4>
                </Modal.Title>
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
                            <Placeholder xs={12} />
                          </Placeholder>
                        </td>
                        <td>
                          <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} />
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

        const [showMails, setShowMails] = useState(false);
        const [listeMails, setListeMails] = useState([]);
        const [mailsIsLoaded, setMailsIsLoaded] = useState(false);

        const HandleShowMail = async () => {
          const FetchSetMail = (data) => {
            let _arrayMails = [];
            if (!Array.isArray(data)) {
              if (data) {
                _arrayMails.push(data);
              }
            } else {
              _arrayMails = data;
            }

            setListeMails(_arrayMails);
            setMailsIsLoaded(true);
          };

          setShowMails(true);
          await GetListeMails(tokenCt, clientSite.IdClientSite, FetchSetMail);
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
                <Modal.Title>
                  <h1>Liste des mails</h1>
                  <h4>{clientSite.NomCompletClientSite}</h4>
                </Modal.Title>
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
                    {mailsIsLoaded ? (
                      listeMails.map((kv, index) => {
                        return <TableRowMel key={index} kv={kv} />;
                      })
                    ) : (
                      <tr>
                        <td>
                          <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} />
                          </Placeholder>
                        </td>
                        <td>
                          <Placeholder as="p" animation="glow">
                            <Placeholder xs={12} />
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

        return (
          <Row>
            <Col md={6}>
              <Button variant=" " className="border" onClick={HandleShowTel}>
                <FontAwesomeIcon icon={faPhone} />
                Liste des téléphones
              </Button>
              <ModalTels />
            </Col>
            <Col md={6}>
              <Button variant=" " className="border" onClick={HandleShowMail}>
                <FontAwesomeIcon icon={faEnvelope} />
                Liste des mails
              </Button>
              <ModalMail />
            </Col>
          </Row>
        );
      };

      const [nbPortail, setNbPortail] = useState([]);
      const [isLoadedNbPortail, setIsLoadedPortail] = useState(false);

      const GetNbPortails = async () => {
        const FetchSetNbPortail = (data) => {
          setNbPortail(data);
          setIsLoadedPortail(true);
        };

        GetNombrePortails(
          tokenCt,
          clientSite.IdClientSiteRelation,
          FetchSetNbPortail
        );
      };

      const INFOS = () => {
        const BADGEINFO = ({ kv }) => {
          return (
            <Col className="badge badge-bg-info-nowrap m-1">
              {`${kv.v} ${kv.k}`}
            </Col>
          );
        };

        return (
          <Row>
            {isLoadedNbPortail ? (
              nbPortail.map((kv, index) => {
                return <BADGEINFO kv={kv} key={index} />;
              })
            ) : (
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} bg="infoB" />
              </Placeholder>
            )}
          </Row>
        );
      };

      useEffect(() => {
        GetNbPortails();
      }, []);

      return (
        <Card.Body>
          <ADRESSE />
          <CONTACT />
          <INFOS />
        </Card.Body>
      );
    };

    return (
      <Card className="m-2">
        <HEADERCARD />
        <BODYCARD />

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
      const [showTels, setShowTels] = useState(false);
      const [listeTels, setListeTels] = useState([]);
      const [telIsLoaded, setTelIsLoaded] = useState(false);

      const HandleShowTel = async () => {
        const FetchSetTel = (data) => {
          let _arrayTels = [];
          if (!Array.isArray(data)) {
            if (data) {
              _arrayTels.push(data);
            }
          } else {
            _arrayTels = data;
          }

          setListeTels(_arrayTels);
          setTelIsLoaded(true);
        };
        setShowTels(true);
        await GetListeTels(tokenCt, _cs.IdClientSite, FetchSetTel);
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
              <Modal.Title>
                <h1>Liste des téléphones</h1>
                <h4>{_cs.NomCompletClientSite}</h4>
              </Modal.Title>
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
                          <Placeholder xs={12} />
                        </Placeholder>
                      </td>
                      <td>
                        <Placeholder as="p" animation="glow">
                          <Placeholder xs={12} />
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

      const [showMails, setShowMails] = useState(false);
      const [listeMails, setListeMails] = useState([]);
      const [mailsIsLoaded, setMailsIsLoaded] = useState(false);

      const HandleShowMail = async () => {
        const FetchSetMail = (data) => {
          let _arrayMails = [];
          if (!Array.isArray(data)) {
            if (data) {
              _arrayMails.push(data);
            }
          } else {
            _arrayMails = data;
          }

          setListeMails(_arrayMails);
          setMailsIsLoaded(true);
        };

        setShowMails(true);
        await GetListeMails(tokenCt, _cs.IdClientSite, FetchSetMail);
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
              <Modal.Title>
                <h1>Liste des mails</h1>
                <h4>{_cs.NomCompletClientSite}</h4>
              </Modal.Title>
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
                  {mailsIsLoaded ? (
                    listeMails.map((kv, index) => {
                      return <TableRowMel key={index} kv={kv} />;
                    })
                  ) : (
                    <tr>
                      <td>
                        <Placeholder as="p" animation="glow">
                          <Placeholder xs={12} />
                        </Placeholder>
                      </td>
                      <td>
                        <Placeholder as="p" animation="glow">
                          <Placeholder xs={12} />
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

      return (
        <Row>
          <Col md={6}>
            <Button variant=" " className="border" onClick={HandleShowTel}>
              <FontAwesomeIcon icon={faPhone} />
              Liste des téléphones
            </Button>
            <ModalTels />
          </Col>
          <Col md={6}>
            <Button variant=" " className="border" onClick={HandleShowMail}>
              <FontAwesomeIcon icon={faEnvelope} />
              Liste des mails
            </Button>
            <ModalMail />
          </Col>
        </Row>
      );
    };
    const [nbPortail, setNbPortail] = useState([]);
    const [isLoadedNbPortail, setIsLoadedPortail] = useState(false);

    const GetNbPortails = async () => {
      const FetchSetNbPortail = (data) => {
        setNbPortail(data);
        setIsLoadedPortail(true);
      };

      GetNombrePortails(tokenCt, _cs.IdClientSiteRelation, FetchSetNbPortail);
    };

    const INFOS = () => {
      const BADGEINFO = ({ kv }) => {
        let _href = "";
        switch (kv.k) {
          case "prestations maintenances":
            _href = "/contrat";
            break;
          case "appareils enregistrés":
            _href = "/appareils";
            break;
          case "interventions de dépannages":
            _href = "/interventions";
            break;
          case "devis":
            _href = "/devis";
            break;
          case "factures":
            _href = "/factures";
            break;
          default:
            break;
        }

        return (
          <Col>
            <a href={_href}>
              <div className="badge badge-bg-info-nowrap">
                {" "}
                {`${kv.v} ${kv.k}`}
              </div>
            </a>
          </Col>
        );
      };

      return (
        <h4 className="m-2">
          <Row>
            {isLoadedNbPortail ? (
              nbPortail.map((kv, index) => {
                return <BADGEINFO kv={kv} key={index} />;
              })
            ) : (
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} bg="infoB" />
              </Placeholder>
            )}
          </Row>
        </h4>
      );
    };

    useEffect(() => {
      GetNbPortails();
      // eslint-disable-next-line
    }, []);

    return (
      <Card>
        <Card.Header>
          <TITRE />
        </Card.Header>
        <Card.Body>
          <ADRESSE />
          <CONTACT />
          <INFOS />
        </Card.Body>
      </Card>
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

    if (!isLoaded) {
      GetClientSites();
    }

    // eslint-disable-next-line
  }, [isLoaded]);

  return (
    <Container fluid>
      <TitreOfPage
        titre={"Choix du site"}
        isLoaded={isLoaded}
        soustitre={`${listeClientSite.length} sites `}
      />
      {ClientSiteCt.storedClientSite && <ActualClientSite />}
      <div className="m-2">{SearchBar()}</div>
      <Row>
        {isLoaded ? (
          GetDataTrimed().map((clientSite) => {
            if (
              ClientSiteCt.storedClientSite &&
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
