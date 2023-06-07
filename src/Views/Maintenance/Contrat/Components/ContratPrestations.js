//#region Imports
import { useEffect, useState } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";

//#region Bootstrap
import Button from "react-bootstrap/Button";
// import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Nav from "react-bootstrap/Nav";
//#endregion

//#region FontAwsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faCaretDown,
  // faCaretUp,
  faListCheck,
  faList,
  faFile,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

//#endregion

//#region Components
import { FiltrerParCollones } from "../../../../functions";
import Search from "../../../../components/commun/Search";
import TableData from "../../../../components/commun/TableData";
import ImageExtension from "../../../../components/commun/ImageExtension";

//#endregion
import { loremIpsum } from "react-lorem-ipsum";
import { Link } from "react-router-dom";
import { CloseButton, Stack } from "react-bootstrap";

//#endregion

const ContratPrestation = ({
  Prestations,
  ParentComponentPeriodeSelect,
  IsLoaded,
  // datePrestation,
}) => {
  //#region Mockup

  const [listeTaches, setListeTaches] = useState([]);
  const [isListeTacheAffiche, setIsListeTacheAffiche] = useState(true);

  function getRandomInt(min, max) {
    min = Math.ceil(min);

    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const MockupListeTache = () => {
    let _listeTaches = [];
    let _limit = getRandomInt(1, 20);
    for (let index = 0; index < _limit; index++) {
      let _taches = [];
      for (let indexT = 0; indexT < getRandomInt(1, 8); indexT++) {
        _taches.push(
          loremIpsum({
            avgSentencesPerParagraph: 1,
            startWithLoremIpsum: false,
            random: "false",
          }).join()
        );
      }

      _listeTaches.push({
        id: index + 1,
        description: loremIpsum({
          avgSentencesPerParagraph: 1,
          startWithLoremIpsum: false,
          random: "false",
        }).join(),
        taches: _taches,
      });
    }
    setListeTaches(_listeTaches);
  };

  //#endregion

  //#region States

  //#region Collapses
  // const [openDocuments, setOpenDocuments] = useState(true);
  //#endregion

  //#region Filters

  const [filterTous, setFilterTous] = useState(true);
  const [filterNP, setFilterNP] = useState(false);
  const [filterP, setFilterP] = useState(false);
  const [filterEC, setFilterEC] = useState(false);
  const [filterT, setFilterT] = useState(false);

  const [arrayFilters, setArrayFilters] = useState([]);
  //#endregion

  const [prestaSelected, setPrestaSelected] = useState(null);
  const [prestaDateSelected, setPrestaDateSelected] = useState(null);
  const [gridColMDValue, setGridColMDValue] = useState(12);
  const [search, setSearch] = useState("");
  const [modalLargeShow, setModalLargeShow] = useState(false);

  //#endregion

  //#region Fonctions
  function GetNomMois(num, short = false) {
    if (num > 12) {
      num = num - 12;
    }
    switch (num) {
      case 1:
        return short ? "Jan." : "Janvier";
      case 2:
        return short ? "Fév." : "Février";
      case 3:
        return "Mars";
      case 4:
        return short ? "Avr." : "Avril";
      case 5:
        return "Mai";
      case 6:
        return "Juin";
      case 7:
        return short ? "Juil." : "Juillet";
      case 8:
        return "Août";
      case 9:
        return short ? "Sept." : "Septembre";
      case 10:
        return short ? "Oct." : "Octobre";
      case 11:
        return short ? "Nov." : "Novembre";
      case 12:
        return short ? "Déc." : "Décembre";
      default:
        return null;
    }
  }

  function GetLibEtat(e) {
    switch (e) {
      case 1:
        return "Non planifiée";
      case 2:
        return "Planifiée    ";
      case 3:
        return "En cours     ";
      case 4:
        return "Terminée     ";
      case -1:
        return "Tous         ";
      default:
        return "Non planifiée";
    }
  }

  function GetBadgeBgColor(e) {
    switch (e) {
      case 1:
        return "bg-warning";
      case 2:
        return "bg-primary";
      case 3:
        return "bg-danger";
      case 4:
        return "bg-success";
      default:
        return "Non planifiée";
    }
  }

  const GetListePrestationPrefiltre = () => {
    //Les prestations sont filtrés par le 'search'
    let _lPrestation = GetPrestationSearched();

    //Les prestations sont filtrés par les boutons d'état
    _lPrestation = FiltrePrestationsBouton(_lPrestation);

    // //Les prestations sont filtrés par les colonnes
    _lPrestation = FiltrerParCollones(_lPrestation, arrayFilters);

    return _lPrestation;
  };

  const GetPrestationSearched = () => {
    let _lPrestation = Prestations;

    if (search.length > 0) {
      _lPrestation = _lPrestation.filter(
        (item) =>
          item.DescriptionPrestationContrat.toUpperCase().includes(
            search.toUpperCase()
          ) || item.Secteur.toUpperCase().includes(search.toUpperCase())
      );
    }

    _lPrestation = _lPrestation.sort(
      (a, b) => a.DateInterventionPrestation - b.DateInterventionPrestation
    );

    return _lPrestation;
  };

  function FiltrePrestationsBouton(_lPrestations) {
    if (!filterTous) {
      let _arrayFilterIdEtat = [];
      if (filterNP) _arrayFilterIdEtat.push(1);
      if (filterP) _arrayFilterIdEtat.push(2);
      if (filterEC) _arrayFilterIdEtat.push(3);
      if (filterT) _arrayFilterIdEtat.push(4);

      _lPrestations = _lPrestations.filter((presta) =>
        _arrayFilterIdEtat.includes(presta.IdEtat)
      );
    }

    return _lPrestations;
  }

  function GetFilterState(idEtat) {
    switch (idEtat) {
      case 1:
        return filterNP;
      case 2:
        return filterP;
      case 3:
        return filterEC;
      case 4:
        return filterT;
      default:
        return null;
    }
  }

  function GetFilterSetState(idEtat) {
    switch (idEtat) {
      case 1:
        return setFilterNP;
      case 2:
        return setFilterP;
      case 3:
        return setFilterEC;
      case 4:
        return setFilterT;
      default:
        return null;
    }
  }

  function IsFiltercheckboxShouldBeCheck(fieldname, item) {
    if (
      arrayFilters.findIndex(
        (filter) => filter.fieldname === fieldname && filter.item === item
      ) > -1
    )
      return true;
    return false;
  }

  function IsButtonShouldBeCheck(fieldname) {
    if (
      arrayFilters.findIndex((filter) => filter.fieldname === fieldname) > -1
    ) {
      return true;
    }
    return false;
  }

  function resetSelection() {
    //Suprime les filtres sur colonnes
    setArrayFilters([]);
    //Annule l'affichage des documents/tâches
    setPrestaSelected(null);
    setPrestaDateSelected(null);
    //La table prend toute la place
    setGridColMDValue(12);
  }

  //#endregion

  //#region Evenements

  const handleTousFilter = () => {
    let _valueStart = JSON.parse(JSON.stringify(filterTous));

    if (_valueStart) {
      //on décoche la case tous : vérification qu'il y a au moins 1 filtre actif
      if (filterEC || filterNP || filterP || filterT) {
        setFilterTous(false);
      }
    } else {
      //on coche la case tous : on décoche tous les filtres

      setFilterEC(false);
      setFilterNP(false);
      setFilterP(false);
      setFilterT(false);

      setFilterTous(true);
    }
  };

  const handleEtatsFilter = (props) => {
    let _valueStart = JSON.parse(JSON.stringify(props.state));

    if (_valueStart) {
      //on décoche la case d'un filtre : vérification qu'il y a au moins un autre filtre sinon on coche la case tous
      props.setState(false);
    } else {
      //on coche la case d'un filtre : on décoche la case Tous
      setFilterTous(false);
      props.setState(true);
    }
  };

  const handleRowClicked = (presta, date) => {
    if (
      prestaSelected !== null &&
      prestaSelected.id === presta.id &&
      prestaDateSelected !== null &&
      prestaDateSelected === date
    ) {
      //Même sélection (déselection)
      // setGridColMDValue(12);
      // setPrestaSelected(null);
      // setPrestaMoisSelected(null);
      // setPrestaDateSelected(null);
    } else {
      // setGridColMDValue(10);
      setPrestaSelected(presta);
      // setPrestaMoisSelected(mois);
      setPrestaDateSelected(date);
      MockupListeTache();
    }
  };

  const handleCheckfilterChange = (checked, key, value) => {
    let _arrTemp = JSON.parse(JSON.stringify(arrayFilters));

    if (checked) {
      _arrTemp.push({ fieldname: key, item: value });
      setArrayFilters(_arrTemp);
    } else {
      const index = _arrTemp.findIndex(
        (filter) => filter.fieldname === key && filter.item === value
      );
      if (index > -1) {
        _arrTemp.splice(index, 1);
        setArrayFilters(_arrTemp);
      }
    }
  };

  const handleAfficherListeTache = () => {
    let _value = JSON.parse(JSON.stringify(modalLargeShow));
    _value = !_value;
    //Récupère les données
    MockupListeTache();
    setModalLargeShow(_value);
  };

  const handleAfficherDocuments = (presta) => {
    if (prestaSelected === presta) {
      setGridColMDValue(gridColMDValue === 12 ? 10 : 12);
      return;
    }

    handleLigneClicked(presta);

    setGridColMDValue(10);
  };

  //#endregion

  //#region Composants

  //#region commun

  //#region Panel de recherche
  const ButtonFilter = (IdEtat) => {
    if (IdEtat === -1) {
      return (
        <Nav.Link
          className={
            filterTous ? "btn-filter-active border " : "btn-filter border"
          }
          onClick={() => handleTousFilter()}
        >
          {GetLibEtat(IdEtat)}
        </Nav.Link>
      );
    } else {
      return (
        <Nav.Link
          className={
            GetFilterState(IdEtat)
              ? "btn-filter-active border"
              : "btn-filter border"
          }
          onClick={() =>
            handleEtatsFilter({
              state: GetFilterState(IdEtat),
              setState: GetFilterSetState(IdEtat),
            })
          }
        >
          {GetLibEtat(IdEtat)}
        </Nav.Link>
      );
    }
  };

  const SearchPrestation = () => {
    return (
      <Row className="mb-2">
        <Col className="m-1">
          <Nav fill>
            <Nav.Item>{ButtonFilter(-1)}</Nav.Item>
            <Nav.Item>{ButtonFilter(1)}</Nav.Item>
            <Nav.Item>{ButtonFilter(2)}</Nav.Item>
            <Nav.Item>{ButtonFilter(3)}</Nav.Item>
            <Nav.Item>{ButtonFilter(4)}</Nav.Item>
          </Nav>
        </Col>

        <Col md={5} className="m-1">
          <Search setSearch={setSearch} />
        </Col>

        <Col className="m-1">{ParentComponentPeriodeSelect}</Col>
      </Row>
    );
  };

  //#endregion

  //#region pagination

  //#endregion

  //#region Liste des tâches
  const CardListeTaches = () => {
    if (listeTaches.length === 0) return null;

    let _body = (
      <div>
        {listeTaches.map((Relevetache) => {
          return (
            <span key={Relevetache.id} className="mb-2">
              <Row>
                <Col>
                  <FontAwesomeIcon icon={faList} /> {Relevetache.description}
                </Col>
              </Row>
              {isListeTacheAffiche &&
                Relevetache.taches.map((tache, index) => {
                  return (
                    <Row key={index}>
                      <Col md={{ offset: 1 }}>
                        <Form.Check readOnly checked={false} label={tache} />
                      </Col>
                    </Row>
                  );
                })}
            </span>
          );
        })}
      </div>
    );

    return (
      <Modal
        dialogClassName="modal-90w"
        show={modalLargeShow}
        onHide={() => setModalLargeShow(false)}
        backdrop="static"
        keyboard={false}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Liste des relevés de tâches</Modal.Title>
        </Modal.Header>
        <Modal.Body>{_body}</Modal.Body>
      </Modal>
    );
  };

  const CardListeTachesBody = () => {
    if (listeTaches.length === 0) return <div>Aucune tâche enregistrée</div>;

    let _body = (
      <div>
        {listeTaches.map((Relevetache) => {
          return (
            <span key={Relevetache.id} className="mb-2">
              <Row>
                <Col>
                  <FontAwesomeIcon icon={faList} /> {Relevetache.description}
                </Col>
              </Row>
              {isListeTacheAffiche &&
                Relevetache.taches.map((tache, index) => {
                  return (
                    <Row key={index}>
                      <Col md={{ offset: 1 }}>
                        <Form.Check readOnly checked={false} label={tache} />
                      </Col>
                    </Row>
                  );
                })}
            </span>
          );
        })}
      </div>
    );

    return _body;
  };
  //#endregion

  //#region Documents

  const CardDocs = () => {
    let _arrayDocs = [
      { title: "CERFA", extension: "pdf", size: "18 MO" },
      {
        title: "Fiche rammonage",
        extension: "pdf",
        size: "12 MO",
      },
      {
        title: "Photo extranet",
        extension: "jpg",
        size: "32 MO",
      },
      {
        title: "Rapport d'intervention",
        extension: "pdf",
        size: "46 MO",
      },
    ];

    let _DocZIP = {
      title: "Tous les documents",
      extension: "zip",
      size: "90 MO",
    };
    return (
      <Card className="mb-2">
        <Card.Header className="card-document">
          Documents ({_arrayDocs.length})
          <CloseButton
            onClick={() => {
              setGridColMDValue(12);
            }}
            className="ms-4"
          />
          {/* <Button
            variant="contained"
            aria-controls={`collapse-listeDocuments`}
            aria-expanded={openDocuments}
            onClick={() => setOpenDocuments(!openDocuments)}
          >
            {openDocuments ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </Button> */}
        </Card.Header>
        <Card.Body>
          {/* <Collapse in={openDocuments}> */}
          <div id="collapse-listeDocuments">
            {_arrayDocs.length > 0 ? RowDocument(_DocZIP) : "Aucun document"}

            {_arrayDocs.map((doc, index) => {
              return RowDocument(doc, index);
            })}
          </div>
          {/* </Collapse> */}
        </Card.Body>
      </Card>
    );
  };

  const RowDocument = (props, index) => {
    return (
      <Row className="mb-1" key={index}>
        <Col md={3}>
          <ImageExtension extension={props.extension} />
        </Col>
        <Col md={9}>
          <Row>
            <p className="mb-0 document-title">{`${props.title}${
              props.extension.toUpperCase() === "ZIP"
                ? ""
                : `.${props.extension}`
            }`}</p>
            <span className="document-size">{`${props.size}`}</span>
            <span className="document-links">
              {props.extension.toUpperCase() !== "ZIP" && (
                <Link to={"#"} target="_blank">
                  Voir
                </Link>
              )}
              <Link to={"#"} target="_blank" download={`${props.title}`}>
                Télécharger
              </Link>
            </span>
          </Row>
        </Col>
      </Row>
    );
  };

  //#endregion

  //#endregion

  //#region small

  const GridCardPrestation = () => {
    if (!IsLoaded) return PlaceholderCardPrestation(5);

    let _lPrestation = GetListePrestationPrefiltre();
    return (
      <div>
        {_lPrestation.map((presta, index) => {
          return <div key={index}>{CardPrestation(presta)}</div>;
        })}
      </div>
    );
  };

  const CardPrestation = (presta) => {
    return (
      <Card className="m-2">
        <Card.Title>
          <Row>
            <Col>
              {`${GetNomMois(presta.DateInterventionPrestation.getMonth() + 1)} 
            ${presta.DateInterventionPrestation.getFullYear()} `}
            </Col>

            <Col>
              <span className={`badge badge-${GetBadgeBgColor(presta.IdEtat)}`}>
                {GetLibEtat(presta.IdEtat)}
              </span>
            </Col>
          </Row>
        </Card.Title>
        <Card.Subtitle>
          {` ${presta.IdPrestationContrat} - ${presta.DescriptionPrestationContrat}`}
        </Card.Subtitle>

        <Card.Body>
          <h6>{`Secteur : ${presta.Secteur}`}</h6>

          <Button
            className="m-2 p-2"
            onClick={() =>
              handleRowClicked(presta, presta.DateInterventionPrestation)
            }
          >
            <FontAwesomeIcon icon={faFile} /> Liste des documents
          </Button>

          <Button
            className="m-2 p-2"
            onClick={() => handleAfficherListeTache()}
          >
            <FontAwesomeIcon icon={faList} /> Relevés de tâches
          </Button>
        </Card.Body>
        {CardListeTaches()}
      </Card>
    );
  };

  const PlaceholderCardPrestation = (numberOfCards) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfCards; index++) {
      _arrayLoading.push(index + 1);
    }

    return _arrayLoading.map((p) => {
      return (
        <Card className="m-2" key={p}>
          <Card.Title>
            <Row>
              <Col>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </Col>

              <Col>
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={12} />
                </Placeholder>
              </Col>
            </Row>
          </Card.Title>
          <Card.Subtitle>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} />
            </Placeholder>
          </Card.Subtitle>

          <Card.Body>
            <h6>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
            </h6>

            <Button className="m-2 p-2">
              <FontAwesomeIcon icon={faFile} /> Liste des documents
            </Button>

            <Button className="m-2 p-2">
              <FontAwesomeIcon icon={faList} /> Relevés de tâches
            </Button>
          </Card.Body>
          {CardListeTaches()}
        </Card>
      );
    });
  };

  //#endregion

  //#endregion

  useEffect(() => {
    setIsListeTacheAffiche(true);
  }, []);

  //#region TableData

  //#region Headers

  const _methodeDate = (e) => {
    return `${GetNomMois(new Date(e).getMonth())}  ${new Date(
      e
    ).getFullYear()}`;
  };

  const _methodeEtat = (e) => {
    return GetLibEtat(Number(e));
  };

  const _header = [
    {
      title: "Date",
      filter: {
        fieldname: "DateInterventionPrestation",
        affichageMethod: _methodeDate,
      },
    },
    {
      title: "Secteur",
      filter: { fieldname: "Secteur" },
    },
    {
      title: "N°",
      filter: { fieldname: "IdPrestationContrat" },
    },
    {
      title: "Libellé",
      filter: { fieldname: "DescriptionPrestationContrat" },
    },
    {
      title: "Etat",
      filter: {
        fieldname: "IdEtat",
        affichageMethod: _methodeEtat,
      },
    },
    { title: "Action" },
  ];

  //#endregion

  //#region Données

  const _Data = () => {
    let _body = [];

    let _lprestations = GetListePrestationPrefiltre();

    for (let index = 0; index < _lprestations.length; index++) {
      const presta = _lprestations[index];
      let _cells = [];

      let _date = {
        text: `${GetNomMois(
          presta.DateInterventionPrestation.getMonth()
        )} ${presta.DateInterventionPrestation.getFullYear()} `,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_date);

      let _secteur = {
        text: presta.Secteur,
        isSearchable: true,
        isH1: false,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_secteur);

      let _id = {
        text: presta.IdPrestationContrat,
        isSearchable: false,
        isH1: false,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_id);

      let _libelle = {
        text: presta.DescriptionPrestationContrat,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_libelle);

      let _etat = {
        text: (
          <span className={`badge badge-${GetBadgeBgColor(presta.IdEtat)}`}>
            {GetLibEtat(presta.IdEtat)}
          </span>
        ),
        isSearchable: false,
        isH1: false,
        onClickMethod: handleLigneClicked,
      };
      _cells.push(_etat);

      let _bt = {
        text: (
          <Stack direction="horizontal">
            <span>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Relevés de tâches</Tooltip>}
              >
                <FontAwesomeIcon
                  icon={faListCheck}
                  onClick={() => handleAfficherListeTache()}
                />
              </OverlayTrigger>
            </span>

            <span className="ms-2">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Liste des documents</Tooltip>}
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  onClick={() => handleAfficherDocuments(presta)}
                />
              </OverlayTrigger>
            </span>
          </Stack>
        ),
        isSearchable: false,
        isH1: false,
        fixedWidth: "100px",
      };

      _cells.push(_bt);

      let _row = { data: presta, cells: _cells };

      _body.push(_row);
    }
    return _body;
  };

  //#endregion

  //#region Events
  const handleLigneClicked = (presta) => {
    handleRowClicked(presta, presta.DateInterventionPrestation);
    //TODO : Liste des documents
  };

  const isRowSelected = (presta) => {
    return (
      prestaDateSelected !== null &&
      prestaSelected !== null &&
      prestaSelected.id === presta.id &&
      prestaDateSelected === presta.DateInterventionPrestation
    );
  };
  //#endregion

  //#endregion

  return (
    <BreakpointProvider>
      <Container fluid>
        <Col md={12} style={{ textAlign: "start" }}>
          <span className="title">Plannification </span>|
          <span className="subtitle">
            {IsLoaded ? (
              ` ${Prestations.length} prestations`
            ) : (
              <Placeholder animation="glow">
                <Placeholder xs={1} />
              </Placeholder>
            )}
          </span>
        </Col>
        {SearchPrestation()}

        <Modal
          dialogClassName="modal-90w"
          show={modalLargeShow}
          onHide={() => setModalLargeShow(false)}
          backdrop="static"
          keyboard={false}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title> Liste des relevés de tâches </Modal.Title>
          </Modal.Header>
          <Modal.Body>{CardListeTachesBody()}</Modal.Body>
        </Modal>

        <Container fluid className="container-table p-4">
          <Breakpoint large up>
            <Row>
              <Col md={gridColMDValue}>
                <TableData
                  IsLoaded={IsLoaded}
                  placeholdeNbLine={5}
                  headers={_header}
                  lData={_Data()}
                  rawData={Prestations}
                  handleCheckfilterChange={handleCheckfilterChange}
                  isFiltercheckboxShouldBeCheck={IsFiltercheckboxShouldBeCheck}
                  isButtonShouldBeCheck={IsButtonShouldBeCheck}
                  isRowActive={isRowSelected}
                  search={search}
                  Pagination
                  methodPagination={resetSelection}
                />
              </Col>
              {gridColMDValue !== 12 && (
                <Col md={12 - gridColMDValue}>{CardDocs()}</Col>
              )}
            </Row>
          </Breakpoint>

          <Breakpoint medium down>
            {GridCardPrestation()}

            <Modal
              dialogClassName="modal-90w"
              show={gridColMDValue !== 12}
              onHide={() => setGridColMDValue(12)}
              backdrop="static"
              keyboard={false}
              animation={false}
            >
              <Modal.Header closeButton>
                <Modal.Title> Liste des documents </Modal.Title>
              </Modal.Header>
              <Modal.Body>{CardDocs()}</Modal.Body>
            </Modal>
          </Breakpoint>
        </Container>

        <Container fluid className="container-table p-4"></Container>
      </Container>
    </BreakpointProvider>
  );
};

export default ContratPrestation;
