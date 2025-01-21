//#region Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";

//#endregion

//#region fontAwsome
import {
  faCalendar,
  faWrench,
  faBook,
  faFile,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//#endregion

//#region Components

//#endregion

import React, { useEffect } from "react";

//#endregion

const HomePage = ({ setPageSubtitle, setPageTitle }) => {


  useEffect(() => {
    document.title = `Portail client`;
    setPageTitle(`Portail client`);
    setPageSubtitle(null);
    // eslint-disable-next-line
  }, [])

  const SpanLink = ({ title, to, img, kv, disable }) => {

    return (
      <Nav.Link href={to} disabled={disable ? true : false}>
        <div className="content  position-relative d-inline-block">
          <div>{title}</div>

        </div>
      </Nav.Link>
    );
  };

  return (
    <Container fluid className="h-100 p-0">
      {/* <TitreOfPage
        titre={"Portail client"}
        soustitre={ClientSiteCt.storedClientSite.NomCompletClientSite}
        isLoaded
      /> */}
      <Container fluid className="container-table">
        <div>

          <h2>Raccourcis</h2>
        </div>

        <span className="m-2">
          <Nav className="shortcut-link">
            <Nav.Item>
              <FontAwesomeIcon
                icon={faCalendar}
              />
              <SpanLink
                title={"Maintenances"}
                to={"/maintenance"}
              // img={ImgMaintenance}
              // disable={
              //   ClientSiteCt.storedClientSite.IdContrat <= 0 ? (
              //     <div className=" badge badge-bg-danger-nowrap ">
              //       Aucun contrat actif
              //     </div>
              //   ) : undefined
              // }
              />
            </Nav.Item>
            {/* <Nav.Item>
              <SpanLink
                title={"Voir la liste des appareils enregistrés"}
                to={"/appareils"}
                img={ImgAppareil}
              />
            </Nav.Item> */}
            <Nav.Item>
              <FontAwesomeIcon
                icon={faWrench}
              />
              <SpanLink
                title={"Dépannages"}
                to={"/interventions"}
              // img={ImgMaintenance}
              // kv={ClientSiteCt.storedClientSite.NbPortail.KV.find(
              //   (kv) => kv.k === "interventions"
              // )}
              />
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon
                icon={faBook}
              />
              <SpanLink
                title={"Devis"}
                to={"/devis"}
              // img={ImgDevis}
              // kv={ClientSiteCt.storedClientSite.NbPortail.KV.find(
              //   (kv) => kv.k === "devis"
              // )}
              />
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon
                icon={faFile}
              />
              <SpanLink
                title={"Factures"}
                to={"/factures"}
              // img={ImgFacture}
              />

              <NavLink></NavLink>
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon
                icon={faBell}
              />
              <SpanLink
                title={"Demande d'intervention"}
                to={"/nouvelleIntervention"}
              // img={ImgUrgence}
              />
            </Nav.Item>
            {/* <Nav.Item>
              <SpanLink
                title={"Gérer mon compte"}
                to={"/account"}
                img={ImgAccount}
              />

              <NavLink></NavLink>
            </Nav.Item> */}
          </Nav>
        </span>
      </Container>
    </Container>
  );
};

export default HomePage;
