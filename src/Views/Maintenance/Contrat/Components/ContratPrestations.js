//#region Imports
import { useEffect, useState } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Collapse from "react-bootstrap/Collapse";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";
import Accordion from "react-bootstrap/Accordion";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Image from "react-bootstrap/Image";
import Pagination from "react-bootstrap/Pagination";
import Stack from "react-bootstrap/Stack";

// import { Image, Pagination, Stack } from "react-bootstrap";

//#endregion

//#region FontAwsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faCalendar,
  faCaretDown,
  faCaretUp,
  faCheck,
  faClock,
  faFile,
  faFileContract,
  faFileImage,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

//#endregion

//#region Components
// import WhiteShadowCard from "../../../../components/commun/WhiteShadowCard";

//#endregion
import { loremIpsum } from "react-lorem-ipsum";
import { Link } from "react-router-dom";

//#endregion

const ContratPrestation = ({
  Prestations,
  datePrestation,
  ParentComponentPeriodeSelect,
  IsLoaded,
}) => {
  const ImgJPG = require("../../../../image/jpg.png");
  const ImgPDF = require("../../../../image/pdf.png");
  const ImgPNG = require("../../../../image/png.png");
  const ImgDOC = require("../../../../image/doc.png");
  const ImgZIP = require("../../../../image/zip.png");

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
      _listeTaches.push({
        id: index + 1,
        description: loremIpsum({
          avgSentencesPerParagraph: 1,
          startWithLoremIpsum: false,
          random: "false",
        }).join(),
      });
    }
    setListeTaches(_listeTaches);
  };

  //#endregion

  //#region States

  //#region Collapses
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);
  const [open4, setOpen4] = useState(true);
  const [open5, setOpen5] = useState(true);
  const [open6, setOpen6] = useState(true);
  const [open7, setOpen7] = useState(true);
  const [open8, setOpen8] = useState(true);
  const [open9, setOpen9] = useState(true);
  const [open10, setOpen10] = useState(true);
  const [open11, setOpen11] = useState(true);
  const [open12, setOpen12] = useState(true);

  const [openTaches, setOpenTaches] = useState(true);
  const [openDocuments, setOpenDocuments] = useState(true);
  //#endregion

  //#region Filters

  const [filterTous, setFilterTous] = useState(true);
  const [filterNP, setFilterNP] = useState(false);
  const [filterP, setFilterP] = useState(false);
  const [filterEC, setFilterEC] = useState(false);
  const [filterT, setFilterT] = useState(false);

  const [nbParPages, setNbParPages] = useState(10);
  const [pageActuelle, setPageActuelle] = useState(1);

  //#endregion

  const [modaleShow, setModalShow] = useState(false);
  const [prestaSelected, setPrestaSelected] = useState(null);
  const [prestaMoisSelected, setPrestaMoisSelected] = useState(null);
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

  function GetStateOpen(e) {
    switch (e) {
      case 1:
        return open1;
      case 2:
        return open2;
      case 3:
        return open3;
      case 4:
        return open4;
      case 5:
        return open5;
      case 6:
        return open6;
      case 7:
        return open7;
      case 8:
        return open8;
      case 9:
        return open9;
      case 10:
        return open10;
      case 11:
        return open11;
      case 12:
        return open12;

      default:
        return null;
    }
  }

  function GetSetStateOpen(e) {
    switch (e) {
      case 1:
        return setOpen1;
      case 2:
        return setOpen2;
      case 3:
        return setOpen3;
      case 4:
        return setOpen4;
      case 5:
        return setOpen5;
      case 6:
        return setOpen6;
      case 7:
        return setOpen7;
      case 8:
        return setOpen8;
      case 9:
        return setOpen9;
      case 10:
        return setOpen10;
      case 11:
        return setOpen11;
      case 12:
        return setOpen12;

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
        return "nonPlannifie";
      case 2:
        return "plannifie";
      case 3:
        return "enCours";
      case 4:
        return "termine";
      default:
        return "Non planifiée";
    }
  }

  const GetPrestationSearched = () => {
    let _lPrestation = Prestations;

    if (search.length > 0) {
      _lPrestation = _lPrestation.filter(
        (item) =>
          item.libelle.toUpperCase().includes(search.toUpperCase()) ||
          item.secteur.toUpperCase().includes(search.toUpperCase())
      );
    }

    return _lPrestation;
  };

  const reactStringReplace = require("react-string-replace");
  function HighlightTextIfSearch(text) {
    if (
      search.length > 0 &&
      text.toUpperCase().includes(search.toUpperCase())
    ) {
      return (
        <span>
          {reactStringReplace(text, search, (match, i) => (
            <mark key={i}>{match}</mark>
          ))}
        </span>
      );
    } else {
      return text;
    }
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

  function GetImageExtension(extension) {
    switch (extension.toUpperCase()) {
      case "JPG":
        return ImgJPG;
      case "PDF":
        return ImgPDF;
      case "PNG":
        return ImgPNG;
      case "ZIP":
        return ImgZIP;
      default:
        return ImgDOC;
    }
  }

  //#endregion

  //#region Evenements

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

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

  const GroupClickedCollapse = (e) => {
    //change la valeur du state gérant le collapse
    GetSetStateOpen(e)(!GetStateOpen(e));

    //Annule l'affichage des documents/tâches
    setPrestaSelected(null);
    setPrestaMoisSelected(null);
    //La table prend toute la place
    setGridColMDValue(12);
  };

  const handleCardClicked = (presta) => {
    //Récupère les données
    MockupListeTache();

    setPrestaSelected(presta);

    //Affiche la modale
    setModalShow(true);
  };

  const handleRowClicked = (presta, mois) => {
    if (
      prestaSelected !== null &&
      prestaSelected.id === presta.id &&
      prestaMoisSelected !== null &&
      prestaMoisSelected === mois
    ) {
      //Même sélection (déselection)
      setGridColMDValue(12);
      setPrestaSelected(null);
      setPrestaMoisSelected(null);
    } else {
      setGridColMDValue(10);
      setPrestaSelected(presta);
      setPrestaMoisSelected(mois);
      MockupListeTache();
    }
  };

  //#endregion

  //#region Composants

  //#region commun
  const ButtonDownloadDocuments = () => {
    return (
      <Container p={2}>
        <Button className="m-1">
          {" "}
          <FontAwesomeIcon icon={faFile} /> Extranet{" "}
        </Button>
        <Button className="m-1">
          {" "}
          <FontAwesomeIcon icon={faFileContract} /> CERFA{" "}
        </Button>
        <Button className="m-1">
          {" "}
          <FontAwesomeIcon icon={faFileImage} /> Fiche rammonage{" "}
        </Button>
        <Button className="m-1">
          {" "}
          <FontAwesomeIcon icon={faFilePdf} /> Rapport technicien{" "}
        </Button>
      </Container>
    );
  };

  const ButtonFilter = (IdEtat) => {
    if (IdEtat === -1) {
      return (
        <Button
          className={
            filterTous ? "btn-filter-active border" : "btn-filter border"
          }
          onClick={() => handleTousFilter()}
        >
          {GetLibEtat(IdEtat)}
        </Button>
      );
    } else {
      return (
        <Button
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
        </Button>
      );
    }
  };

  const SearchPrestation = () => {
    return (
      <Container fluid className="d-flex flex-column">
        <Container fluid className="d-flex flex-row">
          <BreakpointProvider>
            <Breakpoint large up>
              <Container fluid className="m-2" style={{ flex: "1" }}>
                <ButtonGroup>
                  {ButtonFilter(-1)}
                  {ButtonFilter(1)}
                  {ButtonFilter(2)}
                  {ButtonFilter(3)}
                  {ButtonFilter(4)}
                </ButtonGroup>
              </Container>
            </Breakpoint>
          </BreakpointProvider>

          <Container className="m-2" style={{ flex: "2" }}>
            <Form.Control
              type="search"
              placeholder="Rechercher"
              aria-label="Search"
              onChange={handleSearch}
            />
          </Container>

          <div className="m-2" style={{ flex: "1" }}>
            {ParentComponentPeriodeSelect}
          </div>
        </Container>
      </Container>
    );
  };

  const handlePagePrev = () => {
    if (pageActuelle > 1) {
      setPageActuelle(pageActuelle - 1);

      //Annule l'affichage des documents/tâches
      setPrestaSelected(null);
      setPrestaMoisSelected(null);
      //La table prend toute la place
      setGridColMDValue(12);
    }
  };

  const handlePageChange = (number) => {
    setPageActuelle(number);
    //Annule l'affichage des documents/tâches
    setPrestaSelected(null);
    setPrestaMoisSelected(null);
    //La table prend toute la place
    setGridColMDValue(12);
  };

  const handlePageNext = (number) => {
    if (pageActuelle < number) {
      setPageActuelle(pageActuelle + 1);
      //Annule l'affichage des documents/tâches
      setPrestaSelected(null);
      setPrestaMoisSelected(null);
      //La table prend toute la place
      setGridColMDValue(12);
    }
  };

  const PaginationPrestations = () => {
    let _items = [];

    let _limiter = 0;

    let _lPrestation = GetPrestationSearched();

    _lPrestation.forEach((presta) => {
      for (let index = 0; index < 12; index++) {
        if (presta.mois[index] > 0) {
          _limiter += 1;
        }
      }
    });

    _items.push(
      <Pagination.Prev
        key={0}
        onClick={() => handlePagePrev()}
        className="m-1"
      />
    );
    for (let number = 1; number <= _limiter / nbParPages + 1; number++) {
      _items.push(
        <Pagination.Item
          key={number}
          active={number === pageActuelle}
          onClick={() => handlePageChange(number)}
          className="m-1"
        >
          {number}
        </Pagination.Item>
      );
    }
    _items.push(
      <Pagination.Next
        key={_items.length + 1}
        // onClick={() =>
        //   pageActuelle >= _limiter / nbParPages
        //     ? null
        //     : setPageActuelle(pageActuelle + 1)
        // }
        onClick={() => handlePageNext(_limiter / nbParPages)}
        className="m-1"
      />
    );

    return (
      <Stack direction="horizontal">
        <Pagination className="m-2">{_items}</Pagination>
        {DrodpdownNbPages()}
      </Stack>
    );
  };

  const DrodpdownNbPages = () => {
    return (
      <DropdownButton
        variant=""
        className="border button-periode"
        drop="down-centered"
        style={{ borderRadius: "10px" }}
        title={`${nbParPages} / page`}
      >
        <Dropdown.Item
          onClick={() => {
            setNbParPages(10);
            setPageActuelle(1);
          }}
        >
          10 / page
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setNbParPages(20);
            setPageActuelle(1);
          }}
        >
          20 / page
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setNbParPages(50);
            setPageActuelle(1);
          }}
        >
          50 / page
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => {
            setNbParPages(100);
            setPageActuelle(1);
          }}
        >
          100 / page
        </Dropdown.Item>
      </DropdownButton>
    );
  };

  //#endregion

  //#region large

  const RowDocument = (props, index) => {
    return (
      <Row className="mb-1" key={index}>
        <Col md={3}>{ImageExtension(props.extension)}</Col>
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
                <Link to={ImgDOC} target="_blank">
                  Voir
                </Link>
              )}
              <Link
                to={ImgDOC}
                target="_blank"
                download={`${props.title}_${prestaSelected.libelle}`}
              >
                Télécharger
              </Link>
            </span>
          </Row>
        </Col>
      </Row>
    );
  };

  const ImageExtension = (extension) => {
    return (
      <Image
        src={GetImageExtension(extension)}
        height={42}
        alt={`Icone ${extension} Crédit Dimitriy Morilubov`}
      />
    );
  };

  const PlaceHolderTableLine = (numberOfLines) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfLines; index++) {
      _arrayLoading.push(index + 1);
    }
    return _arrayLoading.map((i) => {
      return (
        <tbody key={i}>
          <tr>
            <td colSpan={4}>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={12} />
              </Placeholder>
            </td>
          </tr>
        </tbody>
      );
    });
  };

  /**
   *
   * @returns Le tableau des prestations, groupés par mois.
   */
  const TableGroupedMonth = () => {
    const _numMoisDebutPrestation = Number(datePrestation.getMonth() + 1);
    return (
      <Table className="table-presta ">
        {TableHead()}

        {RowGroupMois(_numMoisDebutPrestation)}
        {RowGroupMois(_numMoisDebutPrestation + 1)}
        {RowGroupMois(_numMoisDebutPrestation + 2)}
        {RowGroupMois(_numMoisDebutPrestation + 3)}
        {RowGroupMois(_numMoisDebutPrestation + 4)}
        {RowGroupMois(_numMoisDebutPrestation + 5)}
        {RowGroupMois(_numMoisDebutPrestation + 6)}
        {RowGroupMois(_numMoisDebutPrestation + 7)}
        {RowGroupMois(_numMoisDebutPrestation + 8)}
        {RowGroupMois(_numMoisDebutPrestation + 9)}
        {RowGroupMois(_numMoisDebutPrestation + 10)}
        {RowGroupMois(_numMoisDebutPrestation + 11)}
      </Table>
    );
  };

  const TableHead = () => {
    return (
      <thead className="m-2">
        <tr>
          <th>
            <div>Secteur</div>
          </th>
          <th>
            <div>N°</div>
          </th>
          <th>
            <div>Libellé</div>
          </th>
          <th>
            <div>Mois</div>
          </th>
          <th>
            <div>Etat</div>
          </th>
          {isListeTacheAffiche && (
            <th>
              <div>Liste des tâches</div>
            </th>
          )}
        </tr>
      </thead>
    );
  };

  let nombreAffiche = nbParPages * -1 * (pageActuelle - 1);
  /**
   *
   * @param {* Le numéro du mois (janvier = 1, décmebre = 12) } numeroDuMois
   * @returns Une ligne groupant toutes les prestations du mois et une ligne par prestation de ce mois
   */
  const RowGroupMois = (numeroDuMois) => {
    if (IsLoaded) {
      //Cast du parametre
      let _numMois = Number(numeroDuMois);
      //Le numéro ne peut être supérieur à 12
      if (_numMois > 12) {
        _numMois -= 12;
      }
      //Les prestations sont filtrés par le 'search'
      let _lPrestation = GetPrestationSearched().filter(
        (item) => item.mois.at(_numMois - 1) > 0
      );

      if (!filterTous) {
        let _arrayFilterIdEtat = [];
        if (filterNP) _arrayFilterIdEtat.push(1);
        if (filterP) _arrayFilterIdEtat.push(2);
        if (filterEC) _arrayFilterIdEtat.push(3);
        if (filterT) _arrayFilterIdEtat.push(4);

        _lPrestation = _lPrestation.filter((item) =>
          _arrayFilterIdEtat.includes(item.mois.at(_numMois - 1))
        );
      }

      return (
        <tbody>
          {_lPrestation.length > 0 && 1 === 2 ? (
            nombreAffiche > nbParPages ||
            nombreAffiche + _lPrestation.length < 0 ? null : (
              <tr>
                <td colSpan={4} onClick={() => GroupClickedCollapse(_numMois)}>
                  <div className=" rounded-pill bg-ligth border-secondary table-basic-row-group">
                    <Row>
                      <Col>
                        <strong>
                          {GetNomMois(_numMois)}{" "}
                          {numeroDuMois > 12
                            ? datePrestation.getFullYear() + 1
                            : datePrestation.getFullYear()}{" "}
                          ({_lPrestation.length}) :
                        </strong>
                      </Col>
                      <Col>{ButtonAreaControl(_numMois)}</Col>
                    </Row>
                  </div>
                </td>
              </tr>
            )
          ) : null}

          {_lPrestation.map((presta) => {
            if (nombreAffiche >= nbParPages || nombreAffiche < 0) {
              nombreAffiche += 1;
              return null;
            }
            nombreAffiche += 1;
            return (
              <Collapse key={presta.id} in={GetStateOpen(_numMois)}>
                <tr
                  className={
                    prestaMoisSelected !== null &&
                    prestaSelected !== null &&
                    prestaSelected.id === presta.id &&
                    prestaMoisSelected === _numMois
                      ? "table-presta-row-selected"
                      : ""
                  }
                >
                  <td onClick={() => handleRowClicked(presta, _numMois)}>
                    <span>{HighlightTextIfSearch(presta.secteur)} </span>
                  </td>

                  <td onClick={() => handleRowClicked(presta, _numMois)}>
                    <span> {presta.id}</span>
                  </td>
                  <td onClick={() => handleRowClicked(presta, _numMois)}>
                    <h1>{HighlightTextIfSearch(presta.libelle)}</h1>
                  </td>
                  <td onClick={() => handleRowClicked(presta, _numMois)}>
                    <h1>
                      {HighlightTextIfSearch(GetNomMois(_numMois))}{" "}
                      {numeroDuMois > 12
                        ? datePrestation.getFullYear() + 1
                        : datePrestation.getFullYear()}
                    </h1>
                  </td>
                  <td onClick={() => handleRowClicked(presta, _numMois)}>
                    <span
                      className={`badge badge-${GetBadgeBgColor(
                        presta.mois.at(_numMois - 1)
                      )}`}
                    >
                      {GetLibEtat(presta.mois.at(_numMois - 1))}
                    </span>
                  </td>
                  {isListeTacheAffiche && (
                    <td>
                      <Button onClick={() => handleAfficherListeTache()}>
                        Afficher
                      </Button>
                    </td>
                  )}
                </tr>
              </Collapse>
            );
          })}
        </tbody>
      );
    } else {
      return PlaceHolderTableLine(5);
    }
  };

  const handleAfficherListeTache = () => {
    setModalLargeShow(!modalLargeShow);
  };
  /**
   *
   * @param {* Le numéro du mois} numMois
   * @returns un bouton controllant le collapse
   */
  const ButtonAreaControl = (numMois) => {
    return (
      <span className="align-right">
        <Button
          variant="contained"
          aria-controls={`collapse-row-${numMois}`}
          aria-expanded={open1}
          onClick={() => GetSetStateOpen(numMois)(!GetStateOpen(numMois))}
        >
          {GetStateOpen(numMois) ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </Button>
      </span>
    );
  };

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
          <Button
            variant="contained"
            aria-controls={`collapse-listeDocuments`}
            aria-expanded={openTaches}
            onClick={() => setOpenDocuments(!openDocuments)}
          >
            {openDocuments ? (
              <FontAwesomeIcon icon={faCaretUp} />
            ) : (
              <FontAwesomeIcon icon={faCaretDown} />
            )}
          </Button>
        </Card.Header>
        <Card.Body>
          <Collapse in={openDocuments}>
            <div id="collapse-listeDocuments">
              {_arrayDocs.length > 0 ? RowDocument(_DocZIP) : "Aucun document"}

              {_arrayDocs.map((doc, index) => {
                return RowDocument(doc, index);
              })}
            </div>
          </Collapse>
        </Card.Body>
      </Card>
    );
  };

  const CardListeTaches = () => {
    if (listeTaches.length === 0) return null;

    let _body = (
      <div>
        {listeTaches.map((tache) => {
          return <p key={tache.id}>{`\u25CF ${tache.description}`}</p>;
        })}
      </div>
    );

    return (
      <Modal
        show={modalLargeShow}
        onHide={() => setModalLargeShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title> Liste des tâches</Modal.Title>
        </Modal.Header>
        <Modal.Body>{_body}</Modal.Body>
      </Modal>
    );
  };

  // const PopoverDocs = (
  //   // <Popover id="popover-basic">
  //   //   <Popover.Header as="h3" className="m-2 popover-liste">
  //   //     Liste des tâches ({listeTaches.length})
  //   //     <Button
  //   //       variant="contained"
  //   //       aria-controls={`collapse-listeTaches`}
  //   //       aria-expanded={openTaches}
  //   //       onClick={() => setOpenTaches(!openTaches)}
  //   //     >
  //   //       {openTaches ? (
  //   //         <FontAwesomeIcon icon={faCaretUp} />
  //   //       ) : (
  //   //         <FontAwesomeIcon icon={faCaretDown} />
  //   //       )}
  //   //     </Button>{" "}
  //   //   </Popover.Header>
  //   //   <Popover.Body>
  //   //     <Collapse in={openTaches}>
  //   //       <div
  //   //         id="collapse-listeTaches"
  //   //         style={{ height: "50vh", overflowY: "scroll" }}
  //   //       >
  //   //         {listeTaches.map((tache) => {
  //   //           return <p key={tache.id}>{tache.description}</p>;
  //   //         })}
  //   //       </div>
  //   //     </Collapse>
  //   //   </Popover.Body>

  //   //   <Popover.Header as="h3" className="m-2 popover-liste">
  //   //     Liste des documents
  //   //     <Button
  //   //       variant="contained"
  //   //       aria-controls={`collapse-listeDocuments`}
  //   //       aria-expanded={openTaches}
  //   //       onClick={() => setOpenDocuments(!openDocuments)}
  //   //     >
  //   //       {openDocuments ? (
  //   //         <FontAwesomeIcon icon={faCaretUp} />
  //   //       ) : (
  //   //         <FontAwesomeIcon icon={faCaretDown} />
  //   //       )}
  //   //     </Button>{" "}
  //   //   </Popover.Header>
  //   //   <Popover.Body>
  //   //     <Collapse in={openDocuments}>
  //   //       <div id="collapse-listeDocuments">{ButtonDownloadDocuments()}</div>
  //   //     </Collapse>
  //   //   </Popover.Body>
  //   // </Popover>

  // );

  //#endregion

  //#region small

  /**
   *
   * @returns Les listes de toutes les prestations sous forme de card
   */
  const CardedPrestations = () => {
    return IsLoaded ? (
      <Container>
        <div>
          {GetPrestationSearched().map((presta, index) => {
            return (
              <Card
                key={presta.id}
                className="m-2 p-2  border-secondary"
                // onClick={() => handleCardClicked(presta)}
              >
                <Accordion defaultActiveKey={index}>
                  <Accordion.Item eventKey={index}>
                    <Accordion.Header>
                      <Card.Title>
                        {presta.id} - {HighlightTextIfSearch(presta.libelle)}
                      </Card.Title>
                    </Accordion.Header>

                    <Accordion.Body>
                      <Card.Subtitle>
                        Secteur : {HighlightTextIfSearch(presta.secteur)}
                      </Card.Subtitle>
                      <Card.Body onClick={() => handleCardClicked(presta)}>
                        <Row>
                          {presta.mois.map((value, index) => {
                            return value > 0 ? (
                              <Col xs={12} key={index}>
                                {Plannification(index, value)}
                              </Col>
                            ) : null;
                          })}
                        </Row>
                      </Card.Body>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Card>
            );
          })}
        </div>
      </Container>
    ) : (
      <div> {PlaceHolderCard(5)}</div>
    );
  };

  /**
   *
   * @param {* l'index du mois indexé à 0 (0= janvier, 11=décembre)} indexMois
   * @param {* La valeur de l'état de la prestation } valeurMois
   * @returns Une liste des planification de cette préstation
   */
  const Plannification = (indexMois, valeurMois) => {
    let _numMois = Number(indexMois) + 1;

    return (
      <span className="">
        <Row>
          <Col xs={6}>{GetNomMois(_numMois)} : </Col>

          <Col xs={6}>
            <OverlayTrigger
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>{GetLibEtat(valeurMois)}</Tooltip>}
            >
              <Badge pill bg={GetBadgeBgColor(valeurMois)}>
                {GetBadgeIcon(valeurMois)} {GetLibEtat(valeurMois)}
              </Badge>
            </OverlayTrigger>
          </Col>
        </Row>
        <hr />
      </span>
    );
  };

  /**
   *
   * @param {* La valeur de l'état du mois} e
   * @returns Un badge indiquant l'état de la prestation du mois
   */
  const GetBadgeIcon = (e) => {
    switch (e) {
      case 1:
        return <FontAwesomeIcon icon={faBookmark} />;
      case 2:
        return <FontAwesomeIcon icon={faCalendar} />;
      case 3:
        return <FontAwesomeIcon icon={faClock} />;
      case 4:
        return <FontAwesomeIcon icon={faCheck} />;
      default:
        break;
    }
  };

  /**
   *
   * @returns La liste des taches et des documents à télécharger sous forme de fenêtre modal
   */
  const ModalDocuments = () => {
    let _tabs = null;
    let _title = null;

    if (prestaSelected !== null) {
      _title = prestaSelected.libelle;
      _tabs = (
        <Tabs variant="pills" fill>
          {prestaSelected.mois.map((mois, index) => {
            return mois > 0 ? (
              <Tab
                eventKey={GetNomMois(Number(index) + 1, true)}
                title={
                  <span>
                    {GetBadgeIcon(mois)} {GetNomMois(Number(index) + 1, true)}
                  </span>
                }
                key={index}
                tabClassName={`bg- border border-${GetBadgeBgColor(
                  mois
                )} text-${GetBadgeBgColor(mois)}`}
              >
                <Badge pill bg={GetBadgeBgColor(mois)}>
                  {GetBadgeIcon(mois)} {GetLibEtat(mois)}
                </Badge>
                <Container fluid>
                  <p className="h2">Liste des documents</p>
                  <span>{ButtonDownloadDocuments()}</span>
                </Container>

                <Container>
                  <p className="h2">
                    Liste des tâches
                    <Button
                      variant="contained"
                      aria-controls={`collapse-listeTaches`}
                      aria-expanded={openTaches}
                      onClick={() => setOpenTaches(!openTaches)}
                    >
                      {openTaches ? (
                        <FontAwesomeIcon icon={faCaretUp} />
                      ) : (
                        <FontAwesomeIcon icon={faCaretDown} />
                      )}
                    </Button>{" "}
                  </p>

                  <Collapse in={openTaches}>
                    <div
                      id="collapse-listeTaches"
                      style={{ height: "50vh", overflowY: "scroll" }}
                    >
                      {listeTaches.map((tache) => {
                        return (
                          <span key={tache.id}>
                            <p>{tache.description}</p> <hr />{" "}
                          </span>
                        );
                      })}
                    </div>
                  </Collapse>
                </Container>
              </Tab>
            ) : null;
          })}
        </Tabs>
      );
    }

    return (
      <Modal
        show={modaleShow}
        onHide={() => setModalShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{_title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{_tabs}</Modal.Body>
      </Modal>
    );
  };

  const PlaceHolderCard = (numberOfCards) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfCards; index++) {
      _arrayLoading.push(index + 1);
    }

    return _arrayLoading.map((i) => {
      return (
        <Card key={i}>
          <Card.Title>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={10} />
            </Placeholder>
          </Card.Title>
          <Card.Subtitle>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
          </Card.Subtitle>

          <Card.Body>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={2} /> <Placeholder xs={4} />
            </Placeholder>
            <hr />
            <Placeholder as="p" animation="glow">
              <Placeholder xs={2} /> <Placeholder xs={4} />
            </Placeholder>
            <hr />
            <Placeholder as="p" animation="glow">
              <Placeholder xs={2} /> <Placeholder xs={4} />
            </Placeholder>
            <hr />
          </Card.Body>
        </Card>
      );
    });
  };

  //#endregion

  //#endregion

  useEffect(() => {});

  return (
    <BreakpointProvider>
      {/* <WhiteShadowCard icon="calendar-plus" title={`Suivi des prestations :`}> */}

      <Container fluid>
        <Col md={12} style={{ textAlign: "start" }}>
          <span className="title">Plannification </span>|
          <span className="subtitle"> {Prestations.length} prestations </span>
        </Col>
        {SearchPrestation()}
        <Container fluid className="container-table p-4">
          <Breakpoint large up>
            <Row>
              <Col md={gridColMDValue}>
                {TableGroupedMonth()} {PaginationPrestations()}
                {isListeTacheAffiche && CardListeTaches()}
              </Col>

              {gridColMDValue !== 12 && (
                <Col md={12 - gridColMDValue}>{CardDocs()}</Col>
              )}
              {/* {gridColMDValue !== 12 ? (
                <Col md={gridColMDValue === 12 ? 0 : 12 - gridColMDValue}>
                  {CardDocs()} 
                </Col>
              ) : null} */}
            </Row>
          </Breakpoint>

          <Breakpoint medium down>
            {CardedPrestations()}
            {ModalDocuments()}
          </Breakpoint>
        </Container>
      </Container>
      {/* </WhiteShadowCard> */}
    </BreakpointProvider>
  );
};

export default ContratPrestation;
