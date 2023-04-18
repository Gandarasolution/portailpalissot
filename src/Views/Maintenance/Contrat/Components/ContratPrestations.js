//#region Imports
import { useState } from "react";
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
  faFileImage,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import WhiteShadowCard from "../../../../components/commun/WhiteShadowCard";
import { Container, Form } from "react-bootstrap";
//#endregion

//#region Components

//#endregion

//#endregion

const ContratPrestation = ({ Prestations, datePrestation }) => {
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
  //#endregion

  const [search, setSearch] = useState("");

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const GetPrestationSearched = () => {
    if (search.length > 0) {
      return Prestations.filter(
        (item) => item.libelle.includes(search) || item.secteur.includes(search)
      );
    } else {
      return Prestations;
    }
  };

  //#endregion

  //#region Fonctions
  function GetNomMois(num, short = false) {
    // console.log(num)
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
        return "Non plannifiée";
      case 2:
        return "Planifiée";
      case 3:
        return "En cours";
      case 4:
        return "Terminée";
      default:
        return "Non planifiée";
    }
  }

  function GetBadgeBgColor(e) {
    switch (e) {
      case 1:
        return "secondary";
      case 2:
        return "warning";
      case 3:
        return "warning";
      case 4:
        return "success";
      default:
        return "Non planifiée";
    }
  }

  //#endregion

  //#region Evenements

  const GroupClickedCollapse = (e) => {
    GetSetStateOpen(e)(!GetStateOpen(e));
  };

  //#endregion

  //#region Composants
  const TableGroupedMonth = () => {
    const _numMoisDebutPrestation = Number(datePrestation.getMonth() + 1);
    return (
      <Table>
        <thead>
          <tr>
            <th>Secteur</th>
            <th>N° de prestation</th>
            <th>Libellé</th>
            <th>Etat</th>
          </tr>
        </thead>

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

  const RowGroupMois = (e) => {
    let _numMois = Number(e);
    if (_numMois > 12) {
      _numMois -= 12;
    }

    let _lPrestation = GetPrestationSearched().filter(
      (item) => item.mois.at(_numMois - 1) > 0
    );

    return (
      <tbody>
        {_lPrestation.length > 0 ? (
          <tr>
            <td colSpan={4} onClick={() => GroupClickedCollapse(_numMois)}>
              <div className="shadow border rounded-pill bg-ligth border-secondary">
                <Row>
                  <Col>
                    {GetNomMois(_numMois)}{" "}
                    {Number(e) > 12
                      ? datePrestation.getFullYear() + 1
                      : datePrestation.getFullYear()}{" "}
                    ({_lPrestation.length}) :
                  </Col>
                  <Col>{ButtonAreaControl(_numMois)}</Col>
                </Row>
              </div>
            </td>
          </tr>
        ) : null}

        {_lPrestation.map((presta) => {
          return (
            <Collapse in={GetStateOpen(_numMois)} key={presta.id}>
              <tr>
                <td>{presta.secteur}</td>
                <td>{presta.id}</td>
                <td>{presta.libelle}</td>
                <td>
                  {" "}
                  <Badge
                    pill
                    bg={GetBadgeBgColor(presta.mois.at(_numMois - 1))}
                  >
                    {" "}
                    {GetLibEtat(presta.mois.at(_numMois - 1))}{" "}
                  </Badge>{" "}
                </td>
              </tr>
            </Collapse>
          );
        })}
      </tbody>
    );
  };

  const ButtonAreaControl = (e) => {
    return (
      <span className="align-right">
        <Button
          variant="contained"
          aria-controls={`collapse-row-${e}`}
          aria-expanded={open1}
          onClick={() => GetSetStateOpen(e)(!GetStateOpen(e))}
        >
          {GetStateOpen(e) ? (
            <FontAwesomeIcon icon={faCaretUp} />
          ) : (
            <FontAwesomeIcon icon={faCaretDown} />
          )}
        </Button>
      </span>
    );
  };

  const CardedPrestations = () => {
    // return Prestations.map((presta) => {
    return GetPrestationSearched().map((presta) => {
      return (
        <Card key={presta.id} className="m-2 p-2 shadow border-secondary">
          <Card.Title>{presta.libelle}</Card.Title>
          <Card.Subtitle>{`Secteur : ${presta.secteur}`}</Card.Subtitle>
          <Card.Body>
            <Row>
              {presta.mois.map((value, index) => {
                return value > 0 ? (
                  <Col key={index}>{Plannification(index, value)}</Col>
                ) : null;
              })}
            </Row>
          </Card.Body>
        </Card>
      );
    });
  };

  const Plannification = (indexMois, valeurMois) => {
    let _numMois = Number(indexMois) + 1;

    return (
      <span className="m-1">
        {`${GetNomMois(_numMois, true)} 
      `}
        <OverlayTrigger
          delay={{ show: 250, hide: 400 }}
          overlay={<Tooltip>{GetLibEtat(valeurMois)}</Tooltip>}
        >
          <Badge pill bg={GetBadgeBgColor(valeurMois)}>
            {GetBadgeIcon(valeurMois)}
          </Badge>
        </OverlayTrigger>

        {}
      </span>
    );
  };

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

  //#endregion

  return (
    <BreakpointProvider>
      <WhiteShadowCard icon="calendar-plus" title={`Suivi des prestations :`}>
        <Form.Control
          type="search"
          placeholder="Rechercher"
          className="mx-4"
          aria-label="Search"
          onChange={handleSearch}
        />

        <Row>
          <Col>
            <Container fluid>
              <Breakpoint large up>
                {TableGroupedMonth()}
              </Breakpoint>

              <Breakpoint medium down>
                {CardedPrestations()}
              </Breakpoint>
            </Container>
          </Col>
          <Col sm={2}>
            <Container fluid>
              <WhiteShadowCard icon="calendar-plus" title={`Liste des tâches`}>
                Releve Controle blabla blabla
              </WhiteShadowCard>

              <WhiteShadowCard icon="folder" title={`Documents`}>
                <Button variant="success" className="m-1"> 
                  <FontAwesomeIcon icon={faFilePdf} /> Rapport
                </Button>

                <Button variant="success" className="m-1">
                  <FontAwesomeIcon icon={faFilePdf} /> Extranet
                </Button>

                <Button variant="success" className="m-1">
                  <FontAwesomeIcon icon={faFileImage} /> Images
                </Button>
              </WhiteShadowCard>
            </Container>
          </Col>
        </Row>
      </WhiteShadowCard>
    </BreakpointProvider>
  );
};

export default ContratPrestation;
