//#region Imports
import { useState, useEffect } from "react";
//#region FontAwsome icones

//#endregion

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";

//#endregion

//#region Components

//#endregion

//#region DEV
import { loremIpsum } from "react-lorem-ipsum";
import { Breakpoint, BreakpointProvider } from "react-socks";
import TableData from "../../../components/commun/TableData";
import { Dropdown, DropdownButton, Pagination, Stack } from "react-bootstrap";

//#endregion

//#endregion

const AppareilsPage = () => {
  //#region Mockup

  const [listeAppareils, setListeAppareils] = useState([
    {
      Id: 1,
      Secteur: loremIpsum(),
      Libelle: loremIpsum(),
      IdEtat: 4,
      LibelleEtat: "Accepté",
    },
  ]);

  const MockupListeappareils = () => {
    let _listeAppareil = [];
    for (
      let index = 0;
      index < getRandomInt(getRandomInt(0, 4), getRandomInt(15, 26));
      index++
    ) {
      let _idetat = getRandomInt(1, 3);
      let _app = {
        Id: index + 1,
        Secteur: loremIpsum({
          avgSentencesPerParagraph: 1,
          startWithLoremIpsum: false,
          random: "false",
        }).join(),
        Libelle: loremIpsum({
          avgSentencesPerParagraph: 1,
          startWithLoremIpsum: false,
          random: "false",
        }).join(),
        IdEtat: _idetat,
        LibelleEtat: GetLibEtatById(_idetat),
      };
      _listeAppareil.push(_app);
    }
    setListeAppareils(_listeAppareil);
  };

  function GetLibEtatById(idEtat) {
    switch (idEtat) {
      case 1:
        return "Hors contrat";
      case 2:
        return "Actif";
      case 3:
        return "Détruit";
      default:
        break;
    }
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);

    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //#endregion

  //#region States
  const [isLoaded, setIsLoaded] = useState(false);

  //#region filter/search/sort
  const [search, setSearch] = useState("");

  const [filterActif, SetFilterActif] = useState(true);
  const [filterHorscontrat, SetFilterHorscontrat] = useState(true);
  const [filterDetruit, SetFilterDetruit] = useState(true);

  const [arrayFilters, setArrayFilters] = useState([]);

  //#endregion
  const [nbParPages, setNbParPages] = useState(10);
  const [pageActuelle, setPageActuelle] = useState(1);
  //#endregion

  //#region Fonctions

  function IsFiltercheckboxShouldBeCheck(fieldname, item) {
    if (
      arrayFilters.findIndex(
        (filter) => filter.fieldname === fieldname && filter.item === item
      ) > -1
    )
      return true;
    return false;
  }

  function FiltreColonnes(_lAppareils) {
    if (arrayFilters.length > 0) {
      let _arraySecteur = arrayFilters.filter(
        (filter) => filter.fieldname === "Secteur"
      );
      let _arrayLibelle = arrayFilters.filter(
        (filter) => filter.fieldname === "Libelle"
      );
      let _arrayEtat = arrayFilters.filter(
        (filter) => filter.fieldname === "LibelleEtat"
      );

      if (_arraySecteur.length > 0)
        _lAppareils = _lAppareils.filter(
          (appareil) =>
            _arraySecteur.filter((filter) => filter.item === appareil.Secteur)
              .length > 0
        );

      if (_arrayLibelle.length > 0)
        _lAppareils = _lAppareils.filter(
          (appareil) =>
            _arrayLibelle.filter((filter) => filter.item === appareil.Libelle)
              .length > 0
        );

      if (_arrayEtat.length > 0)
        _lAppareils = _lAppareils.filter(
          (appareil) =>
            _arrayEtat.filter((filter) => filter.item === appareil.LibelleEtat)
              .length > 0
        );
    }

    return _lAppareils;
  }

  const reactStringReplace = require("react-string-replace");
  /**
   *
   * @param {*Le texte qui peut éventuellement contenir 'search'} text
   * @returns Le même texte mais avec le 'search' balisé par <mark></mark>
   */
  function HighlightTextIfSearch(text) {
    //L'utilisateur à recherché quelque chose et le texte contient ce qu'il à rechercher
    if (
      search.length > 0 &&
      text.toUpperCase().includes(search.toUpperCase())
    ) {
      //on remplace le 'search' dans le 'text' par <mark>'match'</mark>
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

  /**
   * Retourne la liste des appareils filtrée
   * @returns La liste des appareils à laquelle on a appliqué les filtres, le search et l'order by
   */
  const GetAppareilsSearched = () => {
    let _listeAppareil = listeAppareils;

    //Filtres
    if (!filterActif)
      _listeAppareil = _listeAppareil.filter((appar) => appar.IdEtat !== 2);

    if (!filterHorscontrat)
      _listeAppareil = _listeAppareil.filter((appar) => appar.IdEtat !== 1);

    if (!filterDetruit)
      _listeAppareil = _listeAppareil.filter((appar) => appar.IdEtat !== 3);

    //Colonnes
    _listeAppareil = FiltreColonnes(_listeAppareil);

    //Search
    if (search.length > 0) {
      return _listeAppareil.filter(
        (item) =>
          item.Libelle.toUpperCase().includes(search.toUpperCase()) ||
          item.Secteur.toUpperCase().includes(search.toUpperCase())
      );
    } else {
      return _listeAppareil;
    }
  };

  function GetBGColorAppareilEtat(IdEtat) {
    switch (IdEtat) {
      case 1:
        return "nonPlannifie";
      case 2:
        return "plannifie";
      case 3:
        return "enCours";
      default:
        break;
    }
  }

  //#endregion

  //#region Evenements

  const handleSearch = (event) => {
    setSearch(event.target.value);
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

  const handlePagePrev = () => {
    if (pageActuelle > 1) {
      //Suprrime les filtres sur colonnes
      setArrayFilters([]);
      setPageActuelle(pageActuelle - 1);
    }
  };

  const handlePageChange = (number) => {
    //Suprrime les filtres sur colonnes
    setArrayFilters([]);
    setPageActuelle(number);
  };

  const handlePageNext = (number) => {
    if (pageActuelle < number) {
      //Suprrime les filtres sur colonnes
      setArrayFilters([]);
      setPageActuelle(pageActuelle + 1);
      //Annule l'affichage des documents/tâches
    }
  };

  //#endregion

  //#region Component

  //#region commun
  const AppareilBlue = require("../../../image/bottle.png");
  const AppareilGrey = require("../../../image/bottleGrey.png");
  const AppareilRed = require("../../../image/bottleRed.png");

  const ButtonFilter = (props) => {
    return (
      <Nav.Item>
        <Nav.Link
          onClick={() => props.methodState(!props.state)}
          variant=""
          className={
            props.state ? "btn-filter-active border" : "btn-filter border"
          }
        >
          {GetImageAppareilEtat(props.IdEtat, "img-bt-filter")}
          {props.title} {isLoaded && `(${props.number})`}
        </Nav.Link>
      </Nav.Item>
    );
  };

  const FilterFindPanel = () => {
    return (
      <Row className="mb-2">
        <Col className="m-1">
          <Nav fill>
            {listeAppareils.filter((appar) => appar.IdEtat === 2).length > 0 &&
              ButtonFilter({
                title: "Actif",
                methodState: SetFilterActif,
                state: filterActif,
                number: listeAppareils.filter((appar) => appar.IdEtat === 2)
                  .length,
                IdEtat: 2,
              })}

            {listeAppareils.filter((appar) => appar.IdEtat === 1).length > 0 &&
              ButtonFilter({
                title: "Hors contrat",
                methodState: SetFilterHorscontrat,
                state: filterHorscontrat,
                number: listeAppareils.filter((appar) => appar.IdEtat === 1)
                  .length,
                IdEtat: 1,
              })}

            {listeAppareils.filter((appar) => appar.IdEtat === 3).length > 0 &&
              ButtonFilter({
                title: "Détruit",
                methodState: SetFilterDetruit,
                state: filterDetruit,
                number: listeAppareils.filter((appar) => appar.IdEtat === 3)
                  .length,
                IdEtat: 3,
              })}
          </Nav>
        </Col>

        <Col md={6} className="m-1">
          <Form.Control
            type="search"
            placeholder="Rechercher"
            aria-label="Search"
            onChange={handleSearch}
          />
        </Col>
      </Row>
    );
  };

  const GetImageAppareilEtat = (IdEtat, className) => {
    return (
      <Image
        className={className}
        src={
          IdEtat === 1
            ? AppareilGrey
            : IdEtat === 2
            ? AppareilBlue
            : AppareilRed
        }
      />
    );
  };
  //#endregion

  //#region TableData
  const _header = [
    {
      title: "Secteur",
      filter: {
        fieldname: "Secteur",
      },
    },

    {
      title: "Code",
    },
    {
      title: "Libellé de l'appareil",
      filter: {
        fieldname: "Libelle",
      },
    },
    {
      title: "État",
      filter: {
        fieldname: "LibelleEtat",
      },
    },
  ];

  const _Data = () => {
    let _body = [];

    let _lAppareils = GetAppareilsSearched();

    for (let index = 0; index < _lAppareils.length; index++) {
      const appareil = _lAppareils[index];
      let _cells = [];

      let _secteur = {
        text: appareil.Secteur,
        isSearchable: true,
        isH1: false,
      };

      _cells.push(_secteur);
      let _code = {
        text: appareil.Id,
        isSearchable: false,
        isH1: false,
      };

      _cells.push(_code);

      let _lib = {
        text: appareil.Libelle,
        isSearchable: true,
        isH1: false,
      };
      _cells.push(_lib);

      let _etat = {
        text: (
          <span
            className={`badge badge-${GetBGColorAppareilEtat(appareil.IdEtat)}`}
          >
            {appareil.LibelleEtat}
          </span>
        ),
        isSearchable: true,
        isH1: false,
      };

      _cells.push(_etat);

      let _row = { data: appareil, cells: _cells };

      _body.push(_row);
    }
    return _body;
  };

  //#endregion

  //#region small
  const AppareilsCards = () => {
    if (!isLoaded) {
      return <div>{PlaceHolderCards(3)}</div>;
    }

    return GetAppareilsSearched().map((appareil) => {
      return (
        <Card
          key={appareil.Id}
          className={`m-2 border border-${GetBGColorAppareilEtat(
            appareil.IdEtat
          )} `}
        >
          <Card.Body>
            <Card.Title>
              {appareil.Id} - {HighlightTextIfSearch(appareil.Libelle)}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Secteur : {HighlightTextIfSearch(appareil.Secteur)}
            </Card.Subtitle>
            <Card.Text>
              {GetImageAppareilEtat(appareil.IdEtat)}
              <Badge pill bg={GetBGColorAppareilEtat(appareil.IdEtat)}>
                {appareil.LibelleEtat}
              </Badge>
            </Card.Text>
          </Card.Body>
        </Card>
      );
    });
  };

  const PlaceHolderCards = (numberOfLines) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfLines; index++) {
      _arrayLoading.push(index + 1);
    }
    return _arrayLoading.map((i) => {
      return (
        <Card key={i} className="m-2 border border-secondary">
          <Card.Body>
            <Card.Title>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={6} />
              </Placeholder>
            </Card.Title>

            <Card.Subtitle className="mb-2 text-muted">
              <Placeholder as="p" animation="glow">
                Secteur : <Placeholder xs={3} />
              </Placeholder>
            </Card.Subtitle>

            <div>
              <Placeholder as="p" animation="glow">
                <Placeholder xs={1} />
              </Placeholder>
            </div>
          </Card.Body>
        </Card>
      );
    });
  };

  //#endregion

  //#region pagination

  const PaginationAppareil = () => {
    let _items = [];

    let _lAppareils = GetAppareilsSearched();
    let _limiter = _lAppareils.length;

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

  //#endregion

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    async function makeRequest() {
      await delay(1000);

      setIsLoaded(true);
    }
    makeRequest();
    MockupListeappareils();
  }, [isLoaded]);

  return (
    <Container fluid className="h-100">
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Liste des appareils </span>|
        <span className="subtitle">
          {isLoaded ? (
            `${listeAppareils.length} appareils`
          ) : (
            <Placeholder animation="glow">
              <Placeholder xs={1} />
            </Placeholder>
          )}
        </span>
      </Col>
      {FilterFindPanel()}
      <BreakpointProvider>
        <Breakpoint large up>
          <Container fluid className="container-table p-4">
            <TableData
              IsLoaded={isLoaded}
              placeholdeNbLine={5}
              headers={_header}
              rawData={listeAppareils}
              handleCheckfilterChange={handleCheckfilterChange}
              isFiltercheckboxShouldBeCheck={IsFiltercheckboxShouldBeCheck}
              lData={_Data()}
              isRowActive={() => {
                return false;
              }}
              HighlightTextIfSearch={HighlightTextIfSearch}
              Pagination={PaginationAppareil()}
              nbParPages={nbParPages}
              pageActuelle={pageActuelle}
            />
          </Container>
        </Breakpoint>
        <Breakpoint medium down>
          {AppareilsCards()}
        </Breakpoint>
      </BreakpointProvider>
    </Container>
  );
};

export default AppareilsPage;
