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
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//#endregion

//#region Components

//#endregion

import React, { useContext, useEffect, useState } from "react";
import { GetDashboardData } from "../../axios/WS_ClientSite";
import { ClientSiteContratContext, TokenContext } from "../../App";

//#endregion

const HomePage = ({ setPageSubtitle, setPageTitle }) => {

  const tokenCt = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  const [dashboardData, setDashboardData] = useState([]);


  const DashboardData = async () => {
    const callBackData = (data) => {
      if (data) {
        setDashboardData(data);
      }
    }
    await GetDashboardData(tokenCt, ClientSiteContratCtx.storedClientSite.GUID, callBackData);
  }


  useEffect(() => {
    document.title = `Portail client`;
    setPageTitle(`Portail client`);
    setPageSubtitle(null);
    DashboardData();
    console.log("Données Dashboard:", dashboardData);
    // eslint-disable-next-line
  }, [dashboardData])


  const SpanLink = ({ title, to, img, kv, disable }) => {

    return (

      <NavLink href={to} disabled={disable ? true : false}>
        <div className="content  position-relative d-inline-block">
          <div>{title}</div>

        </div>
      </NavLink>
    );
  };

  // Récupération des données du timeline (activités récentes)
  const timelineData =
    dashboardData?.WidgetTimeline?.Activites?.GMAO_WidgetTimeline_Data || [];

  // Récupération des données de stats (WidgetsNombre)
  const statsData =
    dashboardData?.WidgetsNombre?.GMAO_WidgetNombre || [];

  return (
    <Container fluid className="h- p-0">
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
              />
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon
                icon={faWrench}
              />
              <SpanLink
                title={"Dépannages"}
                to={"/interventions"}
              />
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon
                icon={faBook}
              />
              <SpanLink
                title={"Devis"}
                to={"/devis"}
              />
            </Nav.Item>
            <Nav.Item>
              <FontAwesomeIcon
                icon={faFile}
              />
              <SpanLink
                title={"Factures"}
                to={"/factures"}
              />

              <NavLink></NavLink>
            </Nav.Item>
          </Nav>
        </span>
      </Container>

      <Container fluid className="container-table">
        <h2>Statistiques du moment</h2>

        <div className="row">
          {statsData.map((item, idx) => {
            // Ex. item = {
            //   "IdEtat": 9,
            //   "IdTypeDocument": 0,
            //   "NombreAffiche": 0,
            //   "SousTitre": "En attente de décision",
            //   "Titre": "Devis"
            // }
            return (
              <div className="col-sm-3 mb-3" key={idx}>
                <h4>{item.Titre}</h4>
                <p>
                  {item.NombreAffiche} {item.SousTitre}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
      <Container fluid className="container-table d-flex">
        <div className="p-4 d-flex align-items-center justify-content-center dashboard-request-intervention">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <FontAwesomeIcon icon={faBell} size="2x" />

            <h5>Demande d’intervention</h5>
            <p>
              Remplissez notre formulaire directement <br></br>
              depuis cette application.
            </p>
            <a href="/nouvelleintervention" className="btn">
              Faire une demande maintenant &gt;
            </a>
          </div>
        </div>

        <div className="dashboard-last-activities">
          <h2 className="mt-4">
            Activités récentes <span className="last-activities-subtitle">( 30 derniers jours )</span>
          </h2>
          <div className="last-activities-listing">
            <h5>
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              {dashboardData?.WidgetTimeline?.Texte ||
                ""}
            </h5>

            <ul className="last-activities-list">
              {timelineData.map((event, index) => {
                const colorMapping = {
                  Primary: "#007bff",
                  Secondary: "#6c757d",
                  Success: "#28a745",
                  Danger: "#dc3545",
                  Warning: "#ffc107",
                  Info: "#17a2b8",
                  Dark: "#343a40",
                };

                const timestamp = parseInt(event.DateStrUNIX, 10) * 1000;
                const dateObj = new Date(timestamp);
                const dateLocale = dateObj.toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                const bulletColor = colorMapping[event.CouleurTag] || "#ccc";

                return (
                  <li key={index} className="last-activity-item">
                    {/* Puce colorée */}
                    <span className="activity-bullet" style={{ borderColor: bulletColor }}></span>

                    {/* Texte de l'événement */}
                    <span className="activity-text">
                      {dateLocale} – {event.Texte}
                    </span>
                  </li>
                );
              })}
            </ul>

          </div>
        </div>



      </Container>
    </Container>


  );
};

export default HomePage;
