//#region Imports
import { useState, useEffect } from "react";
//#region FontAwsome icones
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faMobileAlt,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";

//#endregion

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Placeholder from "react-bootstrap/Placeholder";
import Table from "react-bootstrap/Table";
//#endregion

//#region Components
import WhiteShadowCard from "../../../components/commun/WhiteShadowCard";

//#endregion

//#region DEV
import { loremIpsum } from "react-lorem-ipsum";
import { Badge, Card, Image } from "react-bootstrap";
import { Breakpoint, BreakpointProvider } from "react-socks";

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

  const [orderBy, setOrderBy] = useState({ col: "etat", order: "ASC" });
  //#endregion

  //#endregion

  //#region Fonctions
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

    //OrderBy

    _listeAppareil = ListeAppareilOrderBy(_listeAppareil);

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

  /**
   * Ordonne la liste selon le state orderBy
   * @param {La liste des appareils que l'on veut ordonné} liste
   * @returns La liste ordonnée selon le $orderBy ({col: ["libelle","etat","secteur"] , order: ["ASC","DESC"]})
   */
  function ListeAppareilOrderBy(liste) {
    switch (orderBy.col) {
      case "libelle":
        return orderBy.order === "ASC"
          ? liste.sort((a, b) => a.Libelle.localeCompare(b.Libelle))
          : liste.sort((a, b) => b.Libelle.localeCompare(a.Libelle));

      case "etat":
        return orderBy.order === "ASC"
          ? liste.sort((a, b) => a.LibelleEtat.localeCompare(b.LibelleEtat))
          : liste.sort((a, b) => b.LibelleEtat.localeCompare(a.LibelleEtat));

      case "secteur":
        return orderBy.order === "ASC"
          ? liste.sort((a, b) => a.Secteur.localeCompare(b.Secteur))
          : liste.sort((a, b) => b.Secteur.localeCompare(a.Secteur));
      default:
        return liste;
    }
  }

  function GetBGColorAppareilEtat(IdEtat) {
    switch (IdEtat) {
      case 1:
        return "secondary";
      case 2:
        return "primary";
      case 3:
        return "danger";
      default:
        break;
    }
  }

  //#endregion

  //#region Evenements

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleOrderby = (colonne) => {
    let _order = "ASC";

    if (orderBy.col === colonne) {
      _order = orderBy.order === "ASC" ? "DESC" : "ASC";
    }

    setOrderBy({ col: colonne, order: _order });
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
  //#endregion

  //#region Component

  //#region commun
  const AppareilBlue = require("../../../image/bottle.png");
  const AppareilGrey = require("../../../image/bottleGrey.png");
  const AppareilRed = require("../../../image/bottleRed.png");

  const SearchAppareil = () => {
    return (
      <Form.Control
        type="search"
        placeholder="Rechercher"
        className="mx-4"
        aria-label="Search"
        onChange={handleSearch}
      />
    );
  };

  const ButtonFilter = (props) => {
    return ( 
      <Button
        onClick={() => props.methodState(!props.state)}
        variant={props.state ? GetBGColorAppareilEtat(props.IdEtat) : "light"}
        className={`m-1 border-${GetBGColorAppareilEtat(props.IdEtat)}`}
      >
        <FontAwesomeIcon icon={faFilter} /> {props.title} ({props.number})
      </Button>
    );
  };

  const FilterFindPanel = () => {
    return (
      <Container>
        {listeAppareils.filter((appar) => appar.IdEtat === 2).length > 0 &&
          ButtonFilter({
            title: "Actif",
            methodState: SetFilterActif,
            state: filterActif,
            number: listeAppareils.filter((appar) => appar.IdEtat === 2).length,
            IdEtat: 2,
          })}

        {listeAppareils.filter((appar) => appar.IdEtat === 1).length > 0 &&
          ButtonFilter({
            title: "Hors contrat",
            methodState: SetFilterHorscontrat,
            state: filterHorscontrat,
            number: listeAppareils.filter((appar) => appar.IdEtat === 1).length,
            IdEtat: 1,
          })}

        {listeAppareils.filter((appar) => appar.IdEtat === 3).length > 0 &&
          ButtonFilter({
            title: "Détruit",
            methodState: SetFilterDetruit,
            state: filterDetruit,
            number: listeAppareils.filter((appar) => appar.IdEtat === 3).length,
            IdEtat: 3,
          })}
        {SearchAppareil()}
      </Container>
    );
  };

  const GetImageAppareilEtat = (IdEtat) => {
    return (
      <Image
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

  //#region large

  const AppareilsTable = () => {
    return (
      <Table>
        {TableHead()}
        <tbody>{TableBody()}</tbody>
      </Table>
    );
  };

  const TableHead = () => {
    return (
      <thead>
        <tr>
          <th>Secteur {ButtonOrder("secteur")}</th>
          <th>Code</th>
          <th>Libellé de l'appareil {ButtonOrder("libelle")}</th>
          <th></th>
          <th>État {ButtonOrder("etat")}</th>
        </tr>
      </thead>
    );
  };

  const TableBody = () => {
    if (isLoaded) {
      return GetAppareilsSearched().map((appareil) => {
        return (
          <tr key={appareil.Id}>
            <td>{HighlightTextIfSearch(appareil.Secteur)} </td>
            <td>{appareil.Id}</td>
            <td>{HighlightTextIfSearch(appareil.Libelle)}</td>
            <td>{GetImageAppareilEtat(appareil.IdEtat)}</td>
            <td>
              {" "}
              <Badge bg={GetBGColorAppareilEtat(appareil.IdEtat)}>
                {" "}
                {appareil.LibelleEtat}{" "}
              </Badge>{" "}
            </td>
          </tr>
        );
      });
    } else {
      return PlaceHolderTableLine(5);
    }
  };

  const PlaceHolderTableLine = (numberOfLines) => {
    let _arrayLoading = [];
    for (let index = 0; index < numberOfLines; index++) {
      _arrayLoading.push(index + 1);
    }
    return _arrayLoading.map((i) => {
      return (
        <tr key={i}>
          <td colSpan={4}>
            <Placeholder as="p" animation="glow">
              <Placeholder xs={12} />
            </Placeholder>
          </td>
        </tr>
      );
    });
  };

  const ButtonOrder = (orderName) => {
    return (
      <FontAwesomeIcon
        onClick={() => handleOrderby(orderName)}
        icon={
          orderBy.col === orderName
            ? orderBy.order === "ASC"
              ? faSortUp
              : faSortDown
            : faSort
        }
      />
    );
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



  useEffect(() => {
    async function makeRequest() {
      await delay(1000);
      
      setIsLoaded(true);
    }
    makeRequest();
    MockupListeappareils();
  },[isLoaded]);

  return (
    <Container fluid>
      <WhiteShadowCard icon={faMobileAlt} title="Liste des appareils :">
        {FilterFindPanel()}
        <Container fluid>
          <BreakpointProvider>
            <Breakpoint large up>
              {AppareilsTable()}
            </Breakpoint>
            <Breakpoint medium down>
              {AppareilsCards()}
            </Breakpoint>
          </BreakpointProvider>
        </Container>
      </WhiteShadowCard>
    </Container>
  );
};

export default AppareilsPage;
