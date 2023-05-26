//#region Imports

//#region Bootstrap

//#endregion

//#region Components
import { Col, Collapse, Container, Placeholder, Row } from "react-bootstrap";

//#endregion

import React from "react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

//#endregion

const ContratInfo = ({ Contrat, IsLoaded }) => {
  // IdContrat: 2557,
  // DateSouscrit: "12/04/2018",
  // TypeContrat: "Classique : Du Lundi au Vendredi aux horaires de bureau",
  // Indice: "Taux fixe",
  // TypeFacturation: "A date d'anniversaire du contrat",
  // Delai: "12h",
  // LibelleContrat: "Entretien annuel",

  //#region States

  const [open, setOpen] = useState(true);

  //#endregion

  const PlaceholderField = (xsValue, as) => {
    if (String(as).length > 0) {
      return (
        <Placeholder as={as} animation="glow">
          <Placeholder xs={xsValue} />
        </Placeholder>
      );
    }
    return (
      <Placeholder animation="glow">
        <Placeholder xs={xsValue} />
      </Placeholder>
    );
  };

  const Field = (title, value, mdValue) => {
    return (
      <Col className="border-bottom m-2 p-0" md={mdValue}>
        <p style={{ fontSize: "12px" }} className="m-0 p-0 hoverclassic">
          {title}
        </p>
        {IsLoaded ? (
          <p className="m-0 p-0 hoverclassic">{value}</p>
        ) : (
          PlaceholderField(12, "p")
        )}
      </Col>
    );
  };

  return (
    <Container fluid>
      <Row>
        <Col md={11} style={{ textAlign: "start" }}>
          <span className="title">
            Contrat N° {IsLoaded ? Contrat.IdContrat : PlaceholderField(1)}
          </span>
          {` | `}
          <span className="subtitle">
            {IsLoaded ? Contrat.LibelleContrat : PlaceholderField(5)}
          </span>
        </Col>
        <Col md={1} onClick={() => setOpen(!open)} className="icon-bt">
          <FontAwesomeIcon
            icon={open ? faCaretUp : faCaretDown}
            className="icon-bt"
          />
        </Col>
      </Row>
      <Container fluid>
        <Collapse in={open} className="container-table p-4">
          <Row>
            {Field("Souscrit le", Contrat.DateSouscrit)}
            {Field("Type de contrat", Contrat.TypeContrat, 3)}
            {Field("Indice d'actualisation", Contrat.Indice)}
            {Field("Type de facturation", Contrat.TypeFacturation, 3)}
            {Field("Délai", Contrat.Delai)}
          </Row>
        </Collapse>
      </Container>
    </Container>
  );
};

export default ContratInfo;
