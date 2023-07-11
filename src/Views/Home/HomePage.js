//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";

//#endregion

//#region Components
import TitreOfPage from "../../components/commun/TitreOfPage";

//#endregion

import React from "react";
//#endregion

const HomePage = () => {
  document.title="Portail GMAO";
  const ImgAppareil = require("../../image/appareilImage.jpg");
  const ImgPresta = require("../../image/PrestaContraImage.jpg");
  const ImgMaintenance = require("../../image/MaintenanceImage.jpg");
  const ImgUrgence = require("../../image/UrgenceImage.jpg");
  const ImgDevis = require("../../image/DevisImage.jpg");
  const ImgFacture = require("../../image/FacturationImage.jpg");

  const SpanLink = ({ title, to, img }) => {
    return (
      <Nav.Link href={to}>
        <div className="content">
          <div>{title}</div>
          <div>
            <Image src={img} height={150} alt={`image-${to}`} />
          </div>
        </div>
      </Nav.Link>
    );
  };

  return (
    <Container fluid>
      <TitreOfPage titre={"Portail client"} />
      <Container fluid className="container-table ">
        <h2>Bienvenue sur l'espace client de</h2>

        <span>
          <Nav>
            <Nav.Item>
              <SpanLink
                title={"Accéder à mes prestations contrats"}
                to={"/contrat"}
                img={ImgPresta}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Voir la liste des appareils enregistrés"}
                to={"/appareils"}
                img={ImgAppareil}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Consulter la liste des interventions réalisées"}
                to={"/interventions"}
                img={ImgMaintenance}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Demander une nouvelle intervention"}
                to={"/nouvelleIntervention"}
                img={ImgUrgence}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink title={"Voir mes devis"} to={"/devis"} img={ImgDevis} />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Espace facturation"}
                to={"/factures"}
                img={ImgFacture}
              />

              <NavLink></NavLink>
            </Nav.Item>
          </Nav>
        </span>
      </Container>
    </Container>
  );
};

export default HomePage;
