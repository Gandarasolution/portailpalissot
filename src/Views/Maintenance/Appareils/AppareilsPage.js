//#region Imports

import { Button, Container, Form, Table } from "react-bootstrap";
import WhiteShadowCard from "../../../components/commun/WhiteShadowCard";
import {
  faMobileAlt,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { loremIpsum } from "react-lorem-ipsum";
import { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const AppareilsPage = () => {
  //#region States
  const [listeAppareils, setListeAppareils] = useState([
    {
      Id: 1,
      Secteur: loremIpsum(),
      Libelle: loremIpsum(),
      IdEtat: 4,
      LibelleEtat: "Accepté",
    },
  ]);

  const [search, setSearch] = useState("");

  const [filterActif, SetFilterActif] = useState(true);
  const [filterHorscontrat, SetFilterHorscontrat] = useState(true);
  const [filterDetruit, SetFilterDetruit] = useState(true);

  const [orderBy, setOrderBy] = useState({ col: "etat", order: "ASC" });

  //#endregion

  //#region Mockup

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

  //#region Fonctions
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

  function ListeAppareilOrderBy(liste) {
    switch (orderBy.col) {
      // _listeAppareil =_listeAppareil.sort((a,b) =>  a.Libelle.localeCompare(b.Libelle))  ;

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
      // case "code":
      //   return orderBy.order === "ASC"
      //     ? liste.sort((a, b) => a.Id - b.Id)
      //     : liste.sort((a, b) => b.Id - a.Id);

      default:
        return liste;
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

  useEffect(() => {
    MockupListeappareils();
  }, []);
  //#endregion

  //#region Component

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

  //#endregion

  return (
    <Container fluid>
      <WhiteShadowCard icon={faMobileAlt} title="Liste des appareils :">
        <Container>
          <Button
            onClick={() => SetFilterActif(!filterActif)}
            variant={filterActif ? "primary" : "secondary"}
          >
            Actif ({listeAppareils.filter((appar) => appar.IdEtat === 2).length}
            ){" "}
          </Button>

          <Button
            onClick={() => SetFilterHorscontrat(!filterHorscontrat)}
            variant={filterHorscontrat ? "primary" : "secondary"}
          >
            Hors contrat(
            {listeAppareils.filter((appar) => appar.IdEtat === 1).length}){" "}
          </Button>

          <Button
            onClick={() => SetFilterDetruit(!filterDetruit)}
            variant={filterDetruit ? "primary" : "secondary"}
          >
            Détruit(
            {listeAppareils.filter((appar) => appar.IdEtat === 3).length}){" "}
          </Button>
        </Container>
        <Container fluid>
          <Container>
            {SearchAppareil()}

            <Table>
              <thead>
                <tr>
                  <th>
                    Secteur{"  "}
                    <FontAwesomeIcon
                      onClick={() => handleOrderby("secteur")}
                      icon={
                        orderBy.col === "secteur"
                          ? orderBy.order === "ASC"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th>Code</th>
                  <th>
                    Libellé de l'appareil{"  "}
                    <FontAwesomeIcon
                      onClick={() => handleOrderby("libelle")}
                      icon={
                        orderBy.col === "libelle"
                          ? orderBy.order === "ASC"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                  <th>
                    État {"  "}
                    <FontAwesomeIcon
                      onClick={() => handleOrderby("etat")}
                      icon={
                        orderBy.col === "etat"
                          ? orderBy.order === "ASC"
                            ? faSortUp
                            : faSortDown
                          : faSort
                      }
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                {GetAppareilsSearched().map((appareil) => {
                  return (
                    <tr key={appareil.Id}>
                      <td>{HighlightTextIfSearch(appareil.Secteur)} </td>
                      <td>{appareil.Id}</td>
                      <td>{HighlightTextIfSearch(appareil.Libelle)}</td>
                      <td>{appareil.LibelleEtat}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </Container>
      </WhiteShadowCard>
    </Container>
  );
};

export default AppareilsPage;
