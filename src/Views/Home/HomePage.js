//#region Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavLink from "react-bootstrap/NavLink";

//#endregion

//#region fontAwsome
import {
  faCalendar,
  faWrench,
  faArrowDown,
  faBook,
  faFile,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//#endregion

//#region recharts
import { PieChart, Pie, Cell, Tooltip } from "recharts";
//#endregion

//#region Components

//#endregion

import React, { useContext, useEffect, useState, useRef } from "react";
import { GetDashboardData } from "../../axios/WS_ClientSite";
import { ClientSiteContratContext, TokenContext } from "../../App";
import { ReactComponent as Rythme } from "../../image/coeur.svg";
import { Placeholder, Spinner } from "react-bootstrap";
import { GetRedirectionFromIdTypeDocument } from "../../functions";
import { GetListeParametres } from "../../axios/WS_User";

//#endregion

const HomePage = ({ setPageSubtitle, setPageTitle }) => {

  const tokenCt = useContext(TokenContext);
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);
  const _maintenance = ClientSiteContratCtx.storedClientSite.DroitAccesMaintenance;
  const _sav = ClientSiteContratCtx.storedClientSite.DroitAccesDepannage;
  const _devis = ClientSiteContratCtx.storedClientSite.DroitAccesDevis;
  const _facture = ClientSiteContratCtx.storedClientSite.DroitAccesFactures;



  const [dashboardData, setDashboardData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [mailTo, setMailTo] = useState("");
  const [mailToLoaded, setMailToLoaded] = useState(false);

  const DashboardData = async () => {
    setDataLoaded(false);
    const callBackData = (data) => {
      if (data) {
        setDashboardData(data);
        setDataLoaded(true);
        // console.log("Données Dashboard:", data);
      }
    }
    await GetDashboardData(tokenCt, ClientSiteContratCtx.storedClientSite.GUID, callBackData);
  }

  const ParamsData = async () => {
    const callBackData = (data) => {
      if (data) {
        let _paramMailTo;
        if (Array.isArray(data)) {
          _paramMailTo = (data.find((x) => x.k === "GMAO.Affichage.DemandeDepannage.MailTo")).v
        } else {
          _paramMailTo = data.v;
        }

        setMailTo(_paramMailTo);
        setMailToLoaded(true);
      }
    }
    await GetListeParametres(tokenCt, callBackData);

  }

  useEffect(() => {
    document.title = `Portail client`;
    setPageTitle(`Portail client`);
    setPageSubtitle(null);
    ParamsData();
    DashboardData()
    // eslint-disable-next-line
  }, []);


  const SpanLink = ({ title, to, img, kv, disable }) => {

    return (

      <NavLink href={to} disabled={disable ? true : false}>
        <div className="content  position-relative d-inline-block">
          <div>{title}</div>

        </div>
      </NavLink>
    );
  };

  // Récupération des données de stats (WidgetsRoue)
  const rawRoueData = dashboardData?.WidgetsRoue?.GMAO_WidgetRoue?.Valeurs?.GMAO_WidgetRoue_Data;
  const roueData = Array.isArray(rawRoueData) ? rawRoueData : (rawRoueData ? [rawRoueData] : []);

  const étatTypes = [
    { TexteEtat: "Non planifiée", color: "#1f77b4", background: "#195C9D" },
    { TexteEtat: "Planifiée", color: "#9467bd", background: "#45276A" },
    { TexteEtat: "En cours", color: "#ff7f0e", background: "#E65833" },
    { TexteEtat: "Terminée", color: "#2ca02c", background: "#3B863D" },
  ];

  const total = roueData.reduce((sum, item) => sum + item.Nombre, 0);

  const maintenanceChartData = étatTypes.map(({ TexteEtat, background }) => {
    const item = roueData.find((r) => r.TexteEtat === TexteEtat);
    const nombre = item?.Nombre || 0;
    return {
      name: TexteEtat,
      value: nombre,
      percent: total > 0 ? Math.round((nombre / total) * 100) : 0,
      fill: background,
    };
  });



  // Récupération des données du timeline (activités récentes)
  //eslint-disable-next-line
  const timelineData =
    dashboardData?.WidgetTimeline?.Activites?.GMAO_WidgetTimeline_Data || [];


  // Récupération des données de stats (WidgetsNombre)
  const statsData = dashboardData?.WidgetsNombre?.GMAO_WidgetNombre || [];

  // Flèche scrollable activités 
  const activitiesRef = useRef(null);
  const [isActivitiesScrollable, setIsActivitiesScrollable] = useState(false);

  useEffect(() => {
    const checkScrollability = () => {
      if (activitiesRef.current) {
        const { scrollHeight, clientHeight } = activitiesRef.current;
        setIsActivitiesScrollable(scrollHeight > clientHeight);
      }
    };

    checkScrollability();
    window.addEventListener("resize", checkScrollability);

    return () => {
      window.removeEventListener("resize", checkScrollability);
    };
  }, [timelineData]);
  const scrollToBottomActivities = () => {
    if (activitiesRef.current) {
      activitiesRef.current.scrollTo({
        top: activitiesRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };


  const GetDroitStats = (IdTypeDocument) => {
    switch (IdTypeDocument) {
      case 0://Devis
        return _devis;
      case 25://DISAV
        return _sav;
      case 3://Factures
        return _facture;
      default:
        return false;
    }
  }

  return (
    <Container fluid className="h- p-0">
      <Container fluid className="container-table ">
        <div>
          <h2>Raccourcis</h2>
        </div>

        {/* <span className="m-2"> */}
        <div className="d-flex mt-4 flex-wrap">
          <Nav className="shortcut-link">
            {(_maintenance) && <Nav.Item>
              <FontAwesomeIcon
                icon={faCalendar}
              />
              <SpanLink
                title={"Maintenances"}
                to={"/maintenance"}
              />
            </Nav.Item>}
            {(_sav) &&
              <Nav.Item>
                <FontAwesomeIcon
                  icon={faWrench}
                />
                <SpanLink
                  title={"Dépannages"}
                  to={"/interventions"}
                />
              </Nav.Item>}

            {(_devis) && <Nav.Item>
              <FontAwesomeIcon
                icon={faBook}
              />
              <SpanLink
                title={"Devis"}
                to={"/devis"}
              />
            </Nav.Item>}

            {(_facture) && <Nav.Item>
              <FontAwesomeIcon
                icon={faFile}
              />
              <SpanLink
                title={"Factures"}
                to={"/factures"}
              />

              <NavLink></NavLink>
            </Nav.Item>}
          </Nav>
        </div>
        {/* </span> */}
      </Container>


      <Container fluid className="container-table dashboard-stats">
        <h2>Statistiques du moment</h2>

        <div className="d-flex mt-4 flex-wrap">
          {/* Bloc Maintenance séparé */}

          {(_maintenance) && (dataLoaded ? (
            
              <div className="mb-3 stats-maintenance">
                <div className="stats-card p-3">
                  <h5 className="stats-title">
                    Maintenance
                  </h5>
 {                 roueData.length > 0 ? (
                  <div className="stats-data stats-wheel">
                    <ul>
                      {maintenanceChartData.map((item, idx) => (
                        <li key={idx} style={{ color: item.fill }}>
                          <span className="stats-bullet"></span>
                          {item.name} – {item.percent}%
                        </li>
                      ))}
                    </ul>
                    <PieChart width={230} height={230}>
                      <Pie
                        data={maintenanceChartData}
                        dataKey="value"
                        nameKey="name"
                        // cx="50%"
                        // cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        isAnimationActive={true}
                      >
                        {maintenanceChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </div>) : (<div>Aucune donnée.</div>)}


                  <a href="/maintenance" className="stats-link">Voir le détail &gt;</a>
                </div>
              </div>
             
          ) : (
            <div className="mb-3 stats-maintenance">
              <div className="stats-card p-3">
                <h5 className="stats-title">Maintenance</h5>
                <div className="stats-data stats-wheel">
                  <ul>
                    {[...Array(4)].map((_, i) => (
                      <li key={i}>
                        <Placeholder as="span" animation="wave">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </li>
                    ))}
                  </ul>
                  <div
                    style={{
                      width: 230,
                      height: 230,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Spinner animation="border" />
                  </div>
                </div>
                <a disabled className="stats-link">Voir le détail &gt;</a>
              </div>
            </div>
          )
          )
          }


          {/* Autres stats : Devis, Dépannages, États des paiements */}
          {dataLoaded ? (
            statsData.length > 0 &&
            statsData.map((item, idx) => {
              const formattedTitle = item.Titre?.toLowerCase().replace(/\s+/g, "-") || item.Texte?.toLowerCase().replace(/\s+/g, "-") || "inconnu";
              const nombreAffiche = item.NombreAffiche ?? 0;
              const sousTitre = item.SousTitre?.trim() || "Aucune donnée";
              return (GetDroitStats(item.IdTypeDocument)) &&
                (
                  <div className={`mb-3 stats-other stats-${formattedTitle}`} key={idx}>
                    <div className="stats-card p-3">
                      <h5 className="stats-title">{item.Titre}</h5>

                      <div className="stats-data">
                        <p className="stats-number">
                          <span>{nombreAffiche}{formattedTitle === "états-des-paiements" && " €"}</span>
                        </p>
                        <p className="stats-number-title">
                          <span>{sousTitre}</span>
                        </p>
                      </div>

                      <a href={GetRedirectionFromIdTypeDocument(item.IdTypeDocument, item.IdEtat)} className="stats-link">Voir le détail &gt;</a>

                    </div>
                  </div>
                );
            })
          ) : (
            // Affichage temporaire de 3 cartes avec Placeholder
            ["Dépannages", "Devis", "États des paiements"].map((title, idx) => {
              const formattedTitle = title.toLowerCase().replace(/\s+/g, "-");
              return (
                <div className={`mb-3 stats-other stats-${formattedTitle}`} key={idx}>
                  <div className="stats-card p-3">
                    <h5 className="stats-title">{title}</h5>
                    <div className="stats-data">
                      <p className="stats-number">
                        <Placeholder as="span" animation="wave">
                          <Placeholder xs={3} />
                        </Placeholder>
                      </p>
                      <p className="stats-number-title">
                        <Placeholder as="span" animation="wave">
                          <Placeholder xs={6} />
                        </Placeholder>
                      </p>
                    </div>
                    <a disabled className="stats-link">Voir le détail &gt;</a>
                  </div>
                </div>
              );
            })
          )}


        </div>
      </Container>


      <Container fluid className="container-table d-flex mb-4" >
        <div className="p-4 d-flex align-items-center justify-content-center dashboard-request-intervention">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <FontAwesomeIcon icon={faBell} size="2x" />

            <h5>Demande d’intervention</h5>
            <p>
              Remplissez notre formulaire directement <br></br>
              depuis cette application.
            </p>
            {/* <a href="/nouvelleintervention" className="btn"> */}
            {mailToLoaded && <a href={`mailto:${mailTo}`} className="btn">
              Faire une demande maintenant &gt;
            </a>
            }
          </div>
        </div>

        <div className="dashboard-last-activities">
          <h2 className="mt-4">
            Activités récentes <span className="last-activities-subtitle">( 30 derniers jours )</span>
          </h2>
          <div className="last-activities-listing">
            <h5>
              <Rythme
                className="me-2" />
              {dashboardData?.WidgetTimeline?.Texte ||
                ""}
            </h5>

            <ul className="last-activities-list" ref={activitiesRef}>
              {dataLoaded ? (
                timelineData.map((event, index) => {
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
                      <span
                        className="stats-bullet"
                        style={{ borderColor: bulletColor }}
                      ></span>
                      <span className="activity-text">
                        {dateLocale} – {event.Texte}
                      </span>
                    </li>
                  );
                })
              ) : (

                [...Array(4)].map((_, index) => (
                  <li key={index} className="last-activity-item">
                    <span
                      className="stats-bullet"
                      style={{ borderColor: "#ddd" }}
                    ></span>
                    <span className="activity-text">
                      <Placeholder as="span" animation="wave">
                        <Placeholder xs={10} />
                      </Placeholder>
                    </span>
                  </li>
                ))
              )}
            </ul>
            {isActivitiesScrollable && (
              <button onClick={scrollToBottomActivities} className="scroll-listing-activities">
                <FontAwesomeIcon icon={faArrowDown} size="lg" />
              </button>
            )}


          </div>
        </div>




      </Container>
    </Container>


  );
};

export default HomePage;