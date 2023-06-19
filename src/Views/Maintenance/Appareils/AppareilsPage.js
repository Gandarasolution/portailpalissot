//#region Imports
import { useState, useEffect, useContext } from "react";
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

//#endregion

//#region Components
import TableData, {
  CreateNewCell,
  CreateNewHeader,
} from "../../../components/commun/TableData";

//#endregion

//#region DEV
import { GetListeAppareils } from "../../../axios/WSGandara";
import { ClientSiteContratContext, TokenContext } from "../../../App";

//#endregion

//#endregion

const AppareilsPage = () => {
  const tokenCx = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  //#region Mockup

  const [listeAppareils, setListeAppareils] = useState([]);

  //#endregion

  //#region States
  const [isLoaded, setIsLoaded] = useState(false);

  //#region filter/search/sort

  const [filterActif, SetFilterActif] = useState(true);
  const [filterHorscontrat, SetFilterHorscontrat] = useState(true);
  const [filterDetruit, SetFilterDetruit] = useState(true);

  //#endregion

  //#endregion

  //#region Fonctions
  const FetchSetListeAppareils = (data) => {
    setListeAppareils(data);
    setIsLoaded(true);
  };

  const GetAppareils = async () => {
    await GetListeAppareils(
      tokenCx,
      ClientSiteContratCtx.storedClientSite.IdClientSite,
      FetchSetListeAppareils
    );
  };

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(CreateNewHeader("RefClientAppareilSecteur", true, "Secteur"));
    _headers.push(CreateNewHeader("IdAppareilSecteur", false, "Code"));
    _headers.push(
      CreateNewHeader("DesignationAppareilSecteur", true, "Libelle")
    );
    _headers.push(CreateNewHeader("IdEtat", false, "État"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(CreateNewCell("RefClientAppareilSecteur", false, true, false));
    _cells.push(CreateNewCell("IdAppareilSecteur", false, true, false));
    _cells.push(CreateNewCell("DesignationAppareilSecteur", true, true, false));
    _cells.push(CreateNewCell("IdEtat", false, false, false, EditorEtat));

    return _cells;
  }

  // const reactStringReplace = require("react-string-replace");
  /**
   *
   * @param {*Le texte qui peut éventuellement contenir 'search'} text
   * @returns Le même texte mais avec le 'search' balisé par <mark></mark>
   */
  function HighlightTextIfSearch(text) {
    // //L'utilisateur à recherché quelque chose et le texte contient ce qu'il à rechercher
    // if (
    //   search.length > 0 &&
    //   text.toUpperCase().includes(search.toUpperCase())
    // ) {
    //   //on remplace le 'search' dans le 'text' par <mark>'match'</mark>
    //   return (
    //     <span>
    //       {reactStringReplace(text, search, (match, i) => (
    //         <mark key={i}>{match}</mark>
    //       ))}
    //     </span>
    //   );
    // } else {
    //   return text;
    // }
    return text;
  }

  /**
   * Retourne la liste des appareils filtrée
   * @returns La liste des appareils à laquelle on a appliqué les filtres, le search et l'order by
   */
  const GetAppareilsSearched = () => {
    let _listeAppareil = listeAppareils;

    //Filtres
    if (!filterActif)
      _listeAppareil = _listeAppareil.filter((appar) => appar.IdEtat !== 56);

    if (!filterHorscontrat)
      _listeAppareil = _listeAppareil.filter((appar) => appar.IdEtat !== 206);

    if (!filterDetruit)
      _listeAppareil = _listeAppareil.filter((appar) => appar.IdEtat !== 57);

    return _listeAppareil;
  };

  function GetBGColorAppareilEtat(IdEtat) {
    switch (IdEtat) {
      case 206:
        return "bg-secondary";
      case 56:
        return "bg-primary";
      case 57:
        return "bg-danger";
      default:
        break;
    }
  }

  function GetLibelleEtat(IdEtat) {
    switch (IdEtat) {
      case 56:
        return "Actif";
      case 57:
        return "Detruit";
      case 206:
        return "Hors contrat";
      default:
        break;
    }
  }
  //#endregion

  //#region Evenements

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

  const GetImageAppareilEtat = (IdEtat, className) => {
    return (
      <Image
        className={className}
        src={
          IdEtat === 206
            ? AppareilGrey
            : IdEtat === 56
            ? AppareilBlue
            : AppareilRed
        }
      />
    );
  };
  //#endregion

  //#region TableData
  const EditorEtat = (IdEtat) => {
    return (
      <span className={`badge badge-${GetBGColorAppareilEtat(IdEtat)}`}>
        {GetLibelleEtat(IdEtat)}
      </span>
    );
  };

  const TableAppareils = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    return (
      <TableData
        Data={GetAppareilsSearched()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        Pagination
        TopPannelLeftToSearch={
          <Col md={"auto"} className="m-1">
            <div className="project-sort-nav">
              <nav>
                <ul>
                  {listeAppareils.filter((appar) => appar.IdEtat === 56)
                    .length > 0 &&
                    ButtonFilter({
                      title: "Actif",
                      methodState: SetFilterActif,
                      state: filterActif,
                      number: listeAppareils.filter(
                        (appar) => appar.IdEtat === 56
                      ).length,
                      IdEtat: 56,
                    })}

                  {listeAppareils.filter((appar) => appar.IdEtat === 206)
                    .length > 0 &&
                    ButtonFilter({
                      title: "Hors contrat",
                      methodState: SetFilterHorscontrat,
                      state: filterHorscontrat,
                      number: listeAppareils.filter(
                        (appar) => appar.IdEtat === 206
                      ).length,
                      IdEtat: 206,
                    })}

                  {listeAppareils.filter((appar) => appar.IdEtat === 57)
                    .length > 0 &&
                    ButtonFilter({
                      title: "Détruit",
                      methodState: SetFilterDetruit,
                      state: filterDetruit,
                      number: listeAppareils.filter(
                        (appar) => appar.IdEtat === 57
                      ).length,
                      IdEtat: 57,
                    })}
                </ul>
              </nav>
            </div>
          </Col>
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
          key={appareil.IdAppareilSecteur}
          className={`m-2 border border-${GetBGColorAppareilEtat(
            appareil.IdEtat
          )} `}
        >
          <Card.Body>
            <Card.Title>
              {appareil.IdAppareilSecteur} -{" "}
              {HighlightTextIfSearch(appareil.DesignationAppareilSecteur)}
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Secteur :{" "}
              {HighlightTextIfSearch(appareil.RefClientAppareilSecteur)}
            </Card.Subtitle>
            <Card.Text>
              {GetImageAppareilEtat(appareil.IdEtat)}
              <Badge pill bg={GetBGColorAppareilEtat(appareil.IdEtat)}>
                {GetLibelleEtat(appareil.IdEtat)}
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
    GetAppareils();
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
      <BreakpointProvider>
        <Breakpoint large up>
          <TableAppareils />
        </Breakpoint>
        <Breakpoint medium down>
          {AppareilsCards()}
        </Breakpoint>
      </BreakpointProvider>
    </Container>
  );
};

export default AppareilsPage;
