//#region Imports
import { useEffect, useState, useContext } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";
import { Link } from "react-router-dom";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import CloseButton from "react-bootstrap/CloseButton";
import Stack from "react-bootstrap/Stack";
import Spinner from "react-bootstrap/Spinner";
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
import { FiltrerParCollones, GetFileSizeFromB64String } from "../../../../functions";
import Search from "../../../../components/commun/Search";
import TableData from "../../../../components/commun/TableData";
import ImageExtension from "../../../../components/commun/ImageExtension";
import { TokenContext } from "../../../../App";

import {
  GetDocumentPrestation,
  GetPrestationReleveTache,
  TelechargerDocument,
  TelechargerZIP,
  VoirDocument,
} from "../../../../axios/WSGandara";

//#endregion

//#endregion

const ContratPrestation = ({
  Prestations,
  ParentComponentPeriodeSelect,
  IsLoaded,
}) => {
  //#region Data
  const tokenCt = useContext(TokenContext);

  const FetchSetListeTache = (data) => {
    const groups = data.reduce((groups, item) => {
      const k = groups[item.k] || [];
      k.push(item);
      groups[item.k] = k;
      return groups;
    }, {});

    const arr = [];
    Object.keys(groups).forEach((key) =>
      arr.push({ name: key, value: groups[key] })
    );

    setListeTaches(arr);
    setModalLargeShow(true);
    setIsLoadingTache(false);
  };

  const FetchSetDocuments = (data) => {
    const _arrDocs = [];

    const arrData = JSON.parse(data);

    if (arrData.length) {
      //eslint-disable-next-line
      arrData.map((element) => {
        const _obj = {};

        if(element.k.includes("Rapport"))
        {
          _obj.title = `${element.k}.pdf`
          _obj.extension = "pdf"
        }else {

          _obj.title = element.k.split("fiche technicien\\").pop();
          _obj.extension = element.k.split(".").pop();
        }
        _obj.size = GetFileSizeFromB64String(element.v);
        _obj.b64s = element.v;

        _arrDocs.push(_obj);
      });
    } else {
      const _obj = {};

      if(arrData.k.includes("Rapport"))
      {
        _obj.title = `${arrData.k}.pdf`
        _obj.extension = "pdf"
      }else {
      _obj.title = arrData.k.split("fiche technicien\\").pop();
      _obj.extension = arrData.k.split(".").pop();
      }
      _obj.size = GetFileSizeFromB64String(arrData.v);
      _obj.b64s = arrData.v;

      _arrDocs.push(_obj);
    }

    setDocuments(_arrDocs);
    setIsDocumentLoaded(true);
  };

  //#endregion

  //#region States

  //#region Filters

  const [filterTous, setFilterTous] = useState(true);
  const [filterNP, setFilterNP] = useState(false);
  const [filterP, setFilterP] = useState(false);
  const [filterEC, setFilterEC] = useState(false);
  const [filterT, setFilterT] = useState(false);

  const [arrayFilters, setArrayFilters] = useState([]);
  //#endregion

  const [search, setSearch] = useState("");

  const [gridColMDValue, setGridColMDValue] = useState(12);
  const [modalLargeShow, setModalLargeShow] = useState(false);

  const [prestaSelected, setPrestaSelected] = useState(null);
  const [prestaDateSelected, setPrestaDateSelected] = useState(null);

  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [documents, setDocuments] = useState([]);

  const [isListeTacheAffiche, setIsListeTacheAffiche] = useState(true);
  const [listeTaches, setListeTaches] = useState([]);
  const [isLoadingTaches, setIsLoadingTache] = useState(false);

  //#endregion

  //#region Fonctions

  /**
   * retourne le nom du mois selon l'index
   * @param {Number} num L'index du mois
   * @param {bool} short Si le nom est abrégé ou pas
   * @returns String le nom du mois
   */
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
      case 95:
        return "Planifiée    ";
      case 3:
        return "En cours     ";
      case 96:
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
      case 95:
        return "bg-primary";
      case 3:
        return "bg-danger";
      case 96:
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

    for (let index = 0; index < _lPrestation.length; index++) {
      const element = _lPrestation[index];
      element.DateInterventionPrestation = new Date(
        element.DateInterventionPrestation
      );
    }

    if (search.length > 0) {
      _lPrestation = _lPrestation.filter(
        (item) =>
          item.DescriptionPrestationContrat.toUpperCase().includes(
            search.toUpperCase()
          ) || item.Secteur.toUpperCase().includes(search.toUpperCase())
      );
    }

    if (_lPrestation.length) {
      _lPrestation = _lPrestation.sort(
        (a, b) => a.DateInterventionPrestation - b.DateInterventionPrestation
      );
    } else {
      if (!_lPrestation.IdPrestationContrat) return [];

      _lPrestation = [_lPrestation];
    }

    return _lPrestation;
  };

  function FiltrePrestationsBouton(_lPrestations) {
    if (!filterTous) {
      let _arrayFilterIdEtat = [];
      if (filterNP) _arrayFilterIdEtat.push(1);
      if (filterP) _arrayFilterIdEtat.push(95);
      if (filterEC) _arrayFilterIdEtat.push(3);
      if (filterT) _arrayFilterIdEtat.push(96);

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
      case 95:
        return filterP;
      case 3:
        return filterEC;
      case 96:
        return filterT;
      default:
        return null;
    }
  }

  function GetFilterSetState(idEtat) {
    switch (idEtat) {
      case 1:
        return setFilterNP;
      case 95:
        return setFilterP;
      case 3:
        return setFilterEC;
      case 96:
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

  const GetZipName = () => {
    return `Documents_P${prestaSelected.IdPrestationContrat}_${
      prestaSelected.DateInterventionPrestation.getMonth() + 1
    }_${prestaSelected.DateInterventionPrestation.getFullYear()}`;
  };

  const GetJsonArrayOfDocumentForZIP = () => {
    let _arrDocs = JSON.parse(JSON.stringify(documents));

    let _arrayRetour = [];

    //eslint-disable-next-line
    _arrDocs.map((doc) => {
      let _arrayDocument = [doc.b64s, doc.title];
      _arrayRetour.push(_arrayDocument);
    });
    return _arrayRetour;
  };

  //#endregion

  //#region Evenements

  //#region Filtres

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

  //#endregion

  //#region Click
  const handleRowClicked = (presta, date) => {
   
    if (
      prestaSelected !== null &&
      prestaSelected.id === presta.id &&
      prestaDateSelected !== null &&
      prestaDateSelected.getTime() === date.getTime()
      ) {
      } else {

      setPrestaSelected(presta);
      setPrestaDateSelected(date);
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

  const handleAfficherListeTache = async (presta) => {
    //Récupère les données
    if (isLoadingTaches) return;

    setIsLoadingTache(true);
    await GetPrestationReleveTache(
      tokenCt,
      presta.IdPrestationContrat,
      FetchSetListeTache
    );
  };

  const handleAfficherDocuments = async (presta) => {
    if (prestaSelected === presta) {
      setGridColMDValue(gridColMDValue === 12 ? 10 : 12);
      return;
    }

    handleLigneClicked(presta);

    if (presta.IdDossierIntervention > 0) {
      setIsDocumentLoaded(false);

      await GetDocumentPrestation(
        tokenCt,
        presta.IdDossierIntervention,
        FetchSetDocuments
      );
    }

    setGridColMDValue(10);
  };

  //#endregion

  //#endregion

  //#region Composants

  //#region commun

  //#region Panel de recherche
  const ButtonFilter = ({ IdEtat }) => {
    if (IdEtat === -1) {
      return (
        <li
          className={filterTous ? "li-actif" : "li-inactif"}
          onClick={() => handleTousFilter()}
        >
          {GetLibEtat(IdEtat)}
        </li>
      );
    } else {
      return (
        <li
          className={GetFilterState(IdEtat) ? "li-actif" : "li-inactif"}
          onClick={() =>
            handleEtatsFilter({
              state: GetFilterState(IdEtat),
              setState: GetFilterSetState(IdEtat),
            })
          }
        >
          {GetLibEtat(IdEtat)}
        </li>
      );
    }
  };

  const SearchPrestation = () => {
    return (

      <Row  className="mb-2">
        <Col className="m-1" md={"auto"}>
          <div className="project-sort-nav">
            <nav>
              <ul>
                <ButtonFilter IdEtat={-1} />
                <ButtonFilter IdEtat={1} />
                <ButtonFilter IdEtat={95} />
                <ButtonFilter IdEtat={3} />
                <ButtonFilter IdEtat={96} />
              </ul>
            </nav>
          </div>
        </Col>
        <Col md={6} className="m-1">
          <Search setSearch={setSearch} />
        </Col>

        <Col md={"auto"} className="m-1">{ParentComponentPeriodeSelect}</Col>
      </Row>

    );
  };

  //#endregion


  
  //#region Liste des tâches
  const CardListeTaches = () => {
    if (listeTaches.length === 0) return null;

    let _body = (
      <div>
        {listeTaches.map((Relevetache, index) => {
          return (
            <span key={index} className="mb-2">
              <Row>
                <Col>
                  <FontAwesomeIcon icon={faList} /> {Relevetache.name}
                </Col>
              </Row>
              {isListeTacheAffiche &&
                Relevetache.value.map((tache, indexT) => {
                  return (
                    <Row key={indexT}>
                      <Col md={{ offset: 1 }}>
                        <Form.Check readOnly checked={false} label={tache.v} />
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
        {listeTaches.map((Relevetache, index) => {
          return (
            <span key={index} className="mb-2">
              <Row>
                <Col>
                  <FontAwesomeIcon icon={faList} /> {Relevetache.name}
                </Col>
              </Row>

              {isListeTacheAffiche &&
                Relevetache.value.map((tache, indexT) => {
                  return (
                    <Row key={indexT}>
                      <Col md={{ offset: 1 }}>
                        <Form.Check readOnly checked={false} label={tache.v} />
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
    let _DocZIP = {
      title: "Tous les documents",
      extension: "zip",
      size: " ",
    };

    const _arrayDocs = JSON.parse(JSON.stringify(documents));

    return (
      <Card className="mb-2">
        <Card.Header className="card-document">
          Documents{" "}
          {isDocumentLoaded ? (
            `(${_arrayDocs.length})`
          ) : (
            <Placeholder animation="glow">
              <Placeholder xs={1} />
            </Placeholder>
          )}
          <CloseButton
            onClick={() => {
              setGridColMDValue(12);
            }}
            className="ms-4"
          />
        </Card.Header>
        {isDocumentLoaded ? (
          <Card.Body>
            <div id="collapse-listeDocuments">
              {_arrayDocs.length > 0 ? RowDocument(_DocZIP) : "Aucun document"}

              {_arrayDocs.map((doc, index) => {
                return RowDocument(doc, index);
              })}
            </div>
          </Card.Body>
        ) : (
          <Card.Body>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={5} />
            </Placeholder>
          </Card.Body>
        )}
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
                  <p className="mb-0 document-title">{`${props.title}`}</p>
            <span className="document-size">{`${props.size}`}</span>
            <span className="document-links">
              {props.extension.toUpperCase() !== "ZIP" && (
                <Link onClick={() => VoirDocument(props.b64s, props.title)}>
                  Voir
                </Link>
              )}
              {props.extension.toUpperCase() === "ZIP" ? (
                <Link
                  onClick={() =>
                    TelechargerZIP(GetJsonArrayOfDocumentForZIP(), GetZipName())
                  }
                >
                  Télécharger
                </Link>
              ) : (
                <Link
                  onClick={() => TelechargerDocument(props.b64s, props.title)}
                >
                  Télécharger
                </Link>
              )}
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
              {`${GetNomMois(
                new Date(presta.DateInterventionPrestation).getMonth() + 1
              )} 
            ${new Date(presta.DateInterventionPrestation).getFullYear()} `}
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
            onClick={() => {
              presta.IdEtat === 96 && handleAfficherDocuments(presta);
            }}
          >
            <FontAwesomeIcon icon={faFile} /> Liste des documents
          </Button>

          <Button
            className="m-2 p-2"
            onClick={() => handleAfficherListeTache(presta)}
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

  //#region TableData

  const TablePrestation = () => {
    return (
      <TableData
        IsLoaded={IsLoaded}
        placeholdeNbLine={5}
        headers={_header}
        lData={_Data()}
        rawData={Prestations.length ? Prestations : [Prestations]}
        handleCheckfilterChange={handleCheckfilterChange}
        isFiltercheckboxShouldBeCheck={IsFiltercheckboxShouldBeCheck}
        isButtonShouldBeCheck={IsButtonShouldBeCheck}
        isRowActive={isRowSelected}
        search={search}
        Pagination
        methodPagination={resetSelection}
      />
    );
  };

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

    if (_lprestations.length === 0) return [];

    for (let index = 0; index < _lprestations.length; index++) {
      const presta = _lprestations[index];
      let _cells = [];

      let _date = {
        text: `${GetNomMois(
          new Date(presta.DateInterventionPrestation).getMonth() + 1
        )} ${new Date(presta.DateInterventionPrestation).getFullYear()} `,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleligneChangeDoc,
      };
      _cells.push(_date);

      let _secteur = {
        text: presta.Secteur,
        isSearchable: true,
        isH1: false,
        onClickMethod: handleligneChangeDoc,
      };
      _cells.push(_secteur);

      let _id = {
        text: presta.IdPrestationContrat,
        isSearchable: false,
        isH1: false,
        onClickMethod: handleligneChangeDoc,
      };
      _cells.push(_id);

      let _libelle = {
        text: presta.DescriptionPrestationContrat,
        isSearchable: true,
        isH1: true,
        onClickMethod: handleligneChangeDoc,
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
        onClickMethod: handleligneChangeDoc,
      };
      _cells.push(_etat);

      let _bt = {
        text: (
          <Stack direction="horizontal">
            <span>
              {isLoadingTaches ? (
                <Spinner size="sm" animation="border" role="status"></Spinner>
              ) : (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Relevés de tâches</Tooltip>}
                >
                  <FontAwesomeIcon
                    icon={faListCheck}
                    onClick={() => handleAfficherListeTache(presta)}
                    className="bt-actif"
                  />
                </OverlayTrigger>
              )}
            </span>

            <span className="ms-2">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Liste des documents</Tooltip>}
              >
                <FontAwesomeIcon
                  icon={faFileAlt}
                  onClick={() => {
                    presta.IdEtat === 96 && handleAfficherDocuments(presta);
                  }}
                  className={presta.IdEtat === 96 ? "bt-actif" : "bt-inactif"}
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
  };

  const handleligneChangeDoc = (presta) => {
    if (gridColMDValue === 10) {
      if (
        prestaSelected !== null &&
        prestaSelected.id === presta.id &&
        prestaDateSelected !== null &&
        prestaDateSelected === presta.DateInterventionPrestation
      ) {
      } else {
        handleAfficherDocuments(presta);
      }
    }
  };

  const isRowSelected = (presta) => {
    return (
      prestaDateSelected !== null &&
      prestaSelected !== null &&
      prestaSelected.IdPrestationContrat === presta.IdPrestationContrat &&
      prestaDateSelected.getTime() ===
        presta.DateInterventionPrestation.getTime()
    );
  };
  //#endregion

  //#endregion

  //#endregion

  useEffect(() => {
    setIsListeTacheAffiche(true);
  }, [isDocumentLoaded]);

  return (
    <BreakpointProvider>
      <Container fluid>
        <Col md={12} style={{ textAlign: "start" }}>
          <span className="title">Plannification </span>|
          <span className="subtitle">
            {IsLoaded ? (
              ` ${
                Prestations.length
                  ? Prestations.length
                  : Prestations.IdPrestationContrat
                  ? 1
                  : 0
              } prestations`
            ) : (
              <Placeholder animation="glow">
                <Placeholder xs={1} />
              </Placeholder>
            )}
          </span>
        </Col>
        <SearchPrestation />

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
          <Modal.Body>
            <CardListeTachesBody />
          </Modal.Body>
        </Modal>

        <Container fluid className="container-table p-4">
          <Breakpoint large up>
            <Row>
              <Col md={gridColMDValue}>
                <TablePrestation />
              </Col>
              {gridColMDValue !== 12 && (
                <Col md={12 - gridColMDValue}>
                  <CardDocs />
                </Col>
              )}
            </Row>
          </Breakpoint>

          <Breakpoint medium down>
            <GridCardPrestation />

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
              <Modal.Body>
                <CardDocs />
              </Modal.Body>
            </Modal>
          </Breakpoint>
        </Container>

        <Container fluid className="container-table p-4"></Container>
      </Container>
    </BreakpointProvider>
  );
};

export default ContratPrestation;
