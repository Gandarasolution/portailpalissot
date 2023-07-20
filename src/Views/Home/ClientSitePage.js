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
} from "../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../App";
import {
  IconeAppareil,
  IconeContrat,
  IconeDepannage,
  IconeDevis,
  IconeFacture,
} from "../../components/commun/Icones";
import { ParseKVAsArray } from "../../functions";

//#endregion

//#endregion

const ClientSitePage = () => {
  const tokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);

  //#region States

  const [listeClientSite, setListeClientSite] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [search, setSearch] = useState("");

  //#endregion

  //#region Fonctions

  function GetDataTrimed() {
    let _data = JSON.parse(JSON.stringify(listeClientSite));

    if (search.length > 0) {
      const filteredData = _data.filter(
        (f) =>
          f.NomCompletClientSite.toUpperCase().includes(search.toUpperCase()) ||
          (ClientSiteCt.storedClientSite &&
            f.GUID === ClientSiteCt.storedClientSite.GUID)
      );

      _data = filteredData;
    }

    if (ClientSiteCt.storedClientSite) {
      let _tempArray = JSON.parse(JSON.stringify(_data)).filter(
        (cs) => cs.GUID === ClientSiteCt.storedClientSite.GUID
      );

      let _tempWithout = JSON.parse(JSON.stringify(_data)).filter(
        (cs) => cs.GUID !== ClientSiteCt.storedClientSite.GUID
      );

      _data = _tempArray.concat(_tempWithout);
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

  const CardClientSite = ({ clientSite, actual }) => {
    const CARDHEADER = () => {
      const TITRE = () => {
        return (
          <Card.Title>
            <h3>

            {HighlightTextIfSearch(clientSite.NomCompletClientSite)}
            </h3>
          </Card.Title>
        );
      };

      const SOUSTITRE = () => {
        return (
          <Card.Subtitle>
            <h4>

            {clientSite.IdContrat > 0
              ? `Contrat N° ${clientSite.IdContrat} souscrit le ${new Date(
                clientSite.DateSouscriptionContrat
                ).toLocaleDateString()}`
                : `Aucun contrat actif`}
                </h4>
          </Card.Subtitle>
        );
      };

      const HandleChoixDuSite = () => {
        if(!actual) {
          ClientSiteCt.setClientSite(clientSite);
        }
      };

      return (
        <Card.Header onClick={HandleChoixDuSite} className={actual ? "" : "header-card-site"} >
          <TITRE />
          <SOUSTITRE />
        </Card.Header>
      );
    };

    const CARDBODY = () => {
      const ADRESSE = () => {
        return (
          <h5 className="m-2">
            <FontAwesomeIcon icon={faLocationDot} />{" "}
            <a
              href={`https://www.google.fr/maps/place/${clientSite.CoordonneesGPSClientSite}`}
              target="blank"
            >
              {clientSite.AdresseClientSite}
            </a>
          </h5>
        );
      };

      const CONTACTS = () => {
        const CONTACT = ({
          functionGet,
          spanButton,
          modalTitle,
          modalColValueTitle,
        }) => {
          const [showModal, setShowModal] = useState(false);
          const [listeModal, setListeModal] = useState([]);
          const [listeIsLoaded, setListeIsLoaded] = useState(false);

          const HandleShowModal = async () => {
            const FetchSetData = (data) => {
              let _arrayData = ParseKVAsArray(data);
              setListeModal(_arrayData);
              setListeIsLoaded(true);
            };

            setShowModal(true);
            if (listeModal.length <= 0) {
              await functionGet(tokenCt, clientSite.GUID, FetchSetData);
            }
          };

          const MODALCONTACT = () => {
            const MODALHEADER = () => {
              return (
                <Modal.Header closeButton>
                  <Modal.Title>
                    <h1>{modalTitle}</h1>
                    <h4>{clientSite.NomCompletClientSite}</h4>
                  </Modal.Title>
                </Modal.Header>
              );
            };

            const MODALBODY = () => {
              const MODALTABLEHEAD = () => {
                return (
                  <thead>
                    <tr>
                      <th>{modalColValueTitle}</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                );
              };

              const TABLEROW = ({ kv }) => {
                return (
                  <tr>
                    <td>{kv.v}</td>
                    <td>{kv.k}</td>
                  </tr>
                );
              };
              const MODALTABLEPLACEHOLDER = () => {
                return (
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
                );
              };

              return (
                <Modal.Body>
                  <Table hover variant="light">
                    <MODALTABLEHEAD />
                    <tbody>
                      {listeIsLoaded ? (
                        listeModal.map((kv, index) => {
                          return <TABLEROW key={index} kv={kv} />;
                        })
                      ) : (
                        <MODALTABLEPLACEHOLDER />
                      )}
                    </tbody>
                  </Table>
                </Modal.Body>
              );
            };

            return (
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <MODALHEADER />
                <MODALBODY />
              </Modal>
            );
          };

          return (
            <Col md={6}>
              <Button variant=" " className="border" onClick={HandleShowModal}>
                {spanButton}
              </Button>
              <MODALCONTACT />
            </Col>
          );
        };

        const TELEPHONES = () => {
          const _spanButton = (
            <span>
              <FontAwesomeIcon icon={faPhone} />
              Liste des téléphones
            </span>
          );

          return (
            <CONTACT
              functionGet={GetListeTels}
              spanButton={_spanButton}
              modalTitle={"Liste des téléphones"}
              modalColValueTitle={"N°"}
            />
          );
        };

        const MAILS = () => {
          const _spanButton = (
            <span>
              <FontAwesomeIcon icon={faEnvelope} />
              Liste des mails
            </span>
          );
          return (
            <CONTACT
              functionGet={GetListeMails}
              spanButton={_spanButton}
              modalTitle={"Liste des mails"}
              modalColValueTitle={"Adresse"}
            />
          );
        };

        return (
          <Row>
            <TELEPHONES />
            <MAILS />
          </Row>
        );
      };

      const INFOS = () => {
        const ROWINFO = () => {
          const BADGEINFO = ({ kv }) => {
            let _href = "";
            let _icon = undefined;
            let _text = "";
            let _wBadge = false;
            switch (kv.k) {
              case "maintenance":
                _href = "/maintenance";
                _icon = <IconeContrat />;
                break;
              case "appareils":
                _href = "/appareils";
                _icon = <IconeAppareil />;
                _text = "appareils enregistrés";
                break;
              case "interventions":
                _href = "/interventions";
                _icon = <IconeDepannage />;
                _text = `interventio${kv.v > 1 ? "ns" : "n"} en cours`;
                _wBadge = kv.v > 0;
                break;
              case "devis":
                _href = "/devis";
                _icon = <IconeDevis />;
                _text = "devis en attente de décision";
                _wBadge = kv.v > 0;
                break;
              case "factures":
                _href = "/factures";
                _icon = <IconeFacture />;
                break;
              default:
                break;
            }

            const BADGE = () => {
              return (
                <>
                  <div className="position-relative d-inline-block">
                    <div className="badge badge-bg-info-nowrap">
                      {_icon} {` ${kv.v} ${_text} `}
                    </div>
                    {_wBadge && (
                      <div className="position-absolute top-0 start-100 translate-middle p-2 circle-danger">
                        {" "}
                      </div>
                    )}
                  </div>
                </>
              );
            };

            return (
              <Col md={"auto"} className="m-2">
                {actual ? (
                  <a href={_href}>
                    <BADGE />
                  </a>
                ) : (
                  <BADGE />
                )}
              </Col>
            );
          };
          return (
            <Row className="justify-content-md-center">
              {clientSite.NbPortail.KV.map((kv, index) => {
                return <BADGEINFO kv={kv} key={index} />;
              })}
            </Row>
          );
        };
        return        (  <h4 className="m-2">
            <ROWINFO />
          </h4>)
       
      };

      return (
        <Card.Body>
          <ADRESSE />
          <CONTACTS />
          <INFOS />
        </Card.Body>
      );
    };

    // const CARDFOOTER = () => {
    //   const HandleChoixDuSite = () => {
    //     ClientSiteCt.setClientSite(clientSite);
    //   };

    //   return (
    //     <Card.Footer className="card-footer-button">
    //       <Row>
    //         <Button onClick={HandleChoixDuSite} variant="">
    //           Choisir ce site
    //         </Button>
    //       </Row>
    //     </Card.Footer>
    //   );
    // };

    return (
      <Card className={`m-2 h-100 ${actual ? "card-clientsite" : ""}`}>
        <CARDHEADER />
        <CARDBODY />
        {/* {!actual && <CARDFOOTER />} */}
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

      <div className="m-2">{SearchBar()}</div>
      <Container fluid className="container-table p-4 ">
        <Row>
          {!ClientSiteCt.storedClientSite && <h1>Merci de choisir un site</h1>}
          {isLoaded ? (
            GetDataTrimed().map((clientSite) => {
              return (
                <Col className="p-1" md={4} key={clientSite.GUID}>
                  <CardClientSite
                    clientSite={clientSite}
                    actual={
                      ClientSiteCt.storedClientSite &&
                      clientSite.GUID === ClientSiteCt.storedClientSite.GUID
                    }
                  />
                </Col>
              );
            })
          ) : (
            <PlaceholderCards number={9} />
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default ClientSitePage;
