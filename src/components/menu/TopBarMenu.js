//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavLink from "react-bootstrap/NavLink";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavItem from "react-bootstrap/NavItem";
import Popover from "react-bootstrap/Popover";
// import Row from "react-bootstrap/Row";

//#endregion

//#region Fontawsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCircleUser,
  faCookieBite,
  faHome,
  faMobile,
  faRightFromBracket,
  faUser,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
//#endregion

//#region Components
import { ClientSiteContratContext, TokenContext } from "../../App";
import logo from "../../image/favicon.ico";

//#endregion
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetClientSiteContrat } from "../../axios/WSGandara";
import { Dropdown, DropdownButton } from "react-bootstrap";

//#endregion

const TopBarMenu = ({ accountName, handleDeconnexion, pageSubtitle, pageTitle, pageSubtitleLoaded }) => {

  //#region Contexts
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);
  // const PageCt = useContext(TitreContext);
  const TokenCt = useContext(TokenContext);

  //#endregion

  //#region States
  const [showMenu, setShowMenu] = useState(false);
  //#endregion

  const navigate = useNavigate();

  //Le titre et le soustitre de la page
  const { titre, soustitre } = getTitleAndSubtitle();

  //Le site selectionné et la liste des sites selectionnables
  const { siteActuel, listeSites } = getListSites();

  //#region Fonctions
  function getListSites() {

    let _retourSiteActuel = ClientSiteContratCtx.storedClientSite &&
      ClientSiteContratCtx.storedClientSite.NomCompletClientSite


    let _listeSites = ClientSiteContratCtx.listeSites;
    if (_listeSites.length <= 0) {

      const FetchSetClientSite = (data) => {
        ClientSiteContratCtx.setListeSites(data);
        _listeSites = data;
      }

      GetClientSiteContrat(TokenCt, FetchSetClientSite);
    }
    return { siteActuel: _retourSiteActuel, listeSites: _listeSites };
  }

  function getTitleAndSubtitle() {
    //Le titre et le sous titre sont donnés en paramètres du composant (states dans App.js parent)
    return { titre: pageTitle, soustitre: pageSubtitleLoaded ? "x" : pageSubtitle };
    // const pathname = window.location.pathname;

    //   switch (pathname) {
    //     case "/devis":
    //       return { titre: "Liste des devis", soustitre: `X` };

    //     case "/factures":
    //       return { titre: "Liste des factures", soustitre: `X` };

    //     case "/appareils":
    //       return { titre: "Liste des appareils", soustitre: `X` };

    //     case "/interventions":
    //       return { titre: "Liste des dépannages", soustitre: `X` };

    //     case "/maintenance":
    //       return { titre: "Liste des plannifications", soustitre: `X` };

    //     case "/account":
    //       return { titre: "Mon compte"};

    //     case "/": // Page d'accueil
    //       return { titre: "Tableau de bord" };


    //       case "/sites": // Page d'accueil
    //       return { titre: "Choix du site" };

    //     default: // Page par défaut
    //       return { titre: "Titre page" };
    //   }
  }

  //#endregion


  //#region Components
  const MenuNavLink = ({ href, text, icon, onClick }) => {
    return (
      <NavItem className="m-4" onClick={onClick}>
        <NavLink href={href}>
          <FontAwesomeIcon icon={icon} className="m-1" />
          {text}
        </NavLink>
      </NavItem>
    );
  };

  const OffcanvasMenu = () => {
    return (
      <Offcanvas show={showMenu} onHide={handleCloseMenu} placement="start" className="sidebar-small">
        <Offcanvas.Header closeButton className="sidebar-small-header">
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            <Container>
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              GMAO
            </Container>
          </a>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav></Nav>

          <MenuNavLink href={"/"} icon={faHome} text={"Accueil"} />
          <MenuNavLink href={"/maintenance"} icon={faCalendar} text={"Maintenance"} />
          <MenuNavLink
            href={"/interventions"}
            icon={faWrench}
            text={"Dépannage"}
          />
          <MenuNavLink href={"/appareils"} icon={faMobile} text={"Appareils"} />
          <MenuNavLink href={"/devis"} icon={faBook} text={"Devis"} />
          <MenuNavLink href={"/factures"} icon={faFile} text={"Factures"} />
          <br />
          <hr />

          <MenuNavLink href={"/account"} icon={faUser} text={"Mon compte"} />
          <MenuNavLink icon={faRightFromBracket} text={"Se déconnecter"} onClick={handleDeconnexion} />
          <MenuNavLink href={"/"} icon={faCookieBite} text={"Cookies"} />
          {/* 
          <Row>
          <Button variant="" className="border mb-2" onClick={handleAccount}>
            <FontAwesomeIcon icon={faUser} /> Mon compte
          </Button>
        </Row>
        <Row>
          <Button
            variant=""
            className="border mb-2"
            onClick={handleDeconnexion}
          >
            <FontAwesomeIcon icon={faRightFromBracket} /> Se déconnecter
          </Button>
        </Row>
        <Row>
          <Button variant="" className="border mb-2" onClick={handleCookies}>
            <FontAwesomeIcon icon={faCookieBite} /> Gestion des cookies
          </Button>
        </Row> */}






        </Offcanvas.Body>
      </Offcanvas>
    );
  };


  const PopoverAccount = (
    <Popover aria-label="Menu déconnexion" className="popover-menu">
      {/* <Popover.Header>{accountName}
      </Popover.Header> */}
      {/* <Popover.Body> */}
      {/* <Row>
          <Button variant="" className="border mb-2" onClick={handleAccount}>
            <FontAwesomeIcon icon={faUser} /> Mon compte
          </Button>
        </Row> */}
      {/* <Row> */}
      <Button
        variant=""
        className="popover-btn"
        onClick={handleDeconnexion}
      >
        <FontAwesomeIcon icon={faRightFromBracket} /> Se déconnecter
      </Button>
      {/* </Row> */}
      {/* <Row>
          <Button variant="" className="border mb-2" onClick={handleCookies}>
            <FontAwesomeIcon icon={faCookieBite} /> Gestion des cookies
          </Button>
        </Row> */}
      {/* </Popover.Body> */}
    </Popover>
  );


  const GetDropdownTitle = () => {
    return <span className="me-1">
      <i className="fas fa-building"></i>
    </span>
      ;
  }

  //#endregion


  //#region Events
  const handleCloseMenu = () => setShowMenu(false);


  const handleChangerClientsite = () => {
    navigate("/sites");
  }

  //#endregion


  return (
    <Navbar expand="lg" className="top-bar-menu">
      <Container fluid>
        <Navbar.Toggle
          onClick={() => setShowMenu(true)}
          aria-controls="basic-navbar-nav"
          className="m-2"
        />
        <OffcanvasMenu />

        <Navbar.Text className="navbar-title-container">
          <h1>{titre}</h1>
          {soustitre && (
            <div className="box-length">
              <span>{soustitre}</span>
            </div>
          )}
        </Navbar.Text>

        <Navbar.Text className="d-flex align-items-center">
          <div className="title-site">
            {siteActuel}
          </div>


          <DropdownButton title={GetDropdownTitle()}
            variant=""
            className="ms-2 me-3 switch-site"
          >
            {
              listeSites.map((site) => {
                return (
                  site.GUID !== ClientSiteContratCtx.storedClientSite.GUID &&
                  <Dropdown.Item key={site.GUID}
                    onClick={e => ClientSiteContratCtx.setClientSite(site)}
                  >
                    {site.NomCompletClientSite}
                  </Dropdown.Item>
                )
              })
            }

          </DropdownButton>
          <Button
            variant=""
            className="ms-2 me-3 switch-site"
            onClick={handleChangerClientsite}
          >
            <span className="me-1">
              <i className="fas fa-building"></i>
            </span>
            <span className="chevron-down">&gt;</span>
          </Button>

          <OverlayTrigger
            trigger={"click"}
            placement="bottom"
            overlay={PopoverAccount}
          >
            <Button variant="" className="icone-site">
              <FontAwesomeIcon icon={faCircleUser} />
            </Button>

          </OverlayTrigger>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
};

export default TopBarMenu;
