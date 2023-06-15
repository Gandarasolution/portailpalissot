//#region Imports
import { useState, useEffect } from "react";
import { Breakpoint, BreakpointProvider } from "react-socks";
//#region FontAwsome icones

//#endregion

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Placeholder from "react-bootstrap/Placeholder";
import Image from "react-bootstrap/Image";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

//#endregion

//#region Components
import TableData from "../../../components/commun/TableData";
import {FiltrerParCollones} from "../../../functions";
import Search from "../../../components/commun/Search";

//#endregion

//#region DEV
import { loremIpsum } from "react-lorem-ipsum";

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

  function IsButtonShouldBeCheck(fieldname) {
    if (
      arrayFilters.findIndex((filter) => filter.fieldname === fieldname) > -1
    ) {
      return true;
    }
    return false;
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
    _listeAppareil = FiltrerParCollones(_listeAppareil,arrayFilters);

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
        return "bg-secondary";
      case 2:
        return "bg-primary";
      case 3:
        return "bg-danger";
      default:
        break;
    }
  }

  //#endregion

  //#region Evenements

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


  //#endregion

  //#region Component

  //#region commun
  const AppareilBlue = require("../../../image/bottle.png");
  const AppareilGrey = require("../../../image/bottleGrey.png");
  const AppareilRed = require("../../../image/bottleRed.png");



  const ButtonFilter = (props) => {
    return (
      <li
      className={props.state ? "li-actif" : "li-inactif"}
          onClick={() => props.methodState(!props.state)}
        >
          {GetImageAppareilEtat(props.IdEtat, "img-bt-filter")}
          {props.title} {isLoaded && `(${props.number})`}
          </li>
    );
  };

  const FilterFindPanel = () => {
    return (
    
      <Row className="mb-2">
        <Col md={"auto"} className="m-1">
          <div className="project-sort-nav">
            <nav>
              <ul>
                {listeAppareils.filter((appar) => appar.IdEtat === 2).length >
                  0 &&
                  ButtonFilter({
                    title: "Actif",
                    methodState: SetFilterActif,
                    state: filterActif,
                    number: listeAppareils.filter((appar) => appar.IdEtat === 2)
                      .length,
                    IdEtat: 2,
                  })}

                {listeAppareils.filter((appar) => appar.IdEtat === 1).length >
                  0 &&
                  ButtonFilter({
                    title: "Hors contrat",
                    methodState: SetFilterHorscontrat,
                    state: filterHorscontrat,
                    number: listeAppareils.filter((appar) => appar.IdEtat === 1)
                      .length,
                    IdEtat: 1,
                  })}

                {listeAppareils.filter((appar) => appar.IdEtat === 3).length >
                  0 &&
                  ButtonFilter({
                    title: "Détruit",
                    methodState: SetFilterDetruit,
                    state: filterDetruit,
                    number: listeAppareils.filter((appar) => appar.IdEtat === 3)
                      .length,
                    IdEtat: 3,
                  })}
              </ul>
            </nav>
          </div>
        </Col>

        <Col md={6} className="m-1">
          <Search setSearch={setSearch} />
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

  //#endregion




  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    async function makeRequest() {
      await delay(1000);

      setIsLoaded(true);
    }
    makeRequest();
    MockupListeappareils();
    // eslint-disable-next-line
  }, [isLoaded]);

  return (
    <Container fluid className="h-100">
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Liste des appareils </span>|
        <span className="subtitle">
          {isLoaded ? (
            ` ${listeAppareils.length} appareils`
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




          {/* <TableData
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
      /> */}


            <TableData
              IsLoaded={isLoaded}
              placeholdeNbLine={5}
              headers={_header}
              lData={_Data()}
              rawData={listeAppareils}
              handleCheckfilterChange={handleCheckfilterChange}
              isFiltercheckboxShouldBeCheck={IsFiltercheckboxShouldBeCheck}
              isButtonShouldBeCheck={IsButtonShouldBeCheck}
              isRowActive={() => {
                return false;
              }}
              search={search}
              Pagination
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
