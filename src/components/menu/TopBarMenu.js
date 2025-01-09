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

//#enregion

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
import { ClientSiteContratContext } from "../../App";
import logo from "../../image/favicon.ico";

//#endregion
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

//#endregion

const TopBarMenu = ({ accountName, handleDeconnexion }) => {
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);
  const navigate = useNavigate();

  const { titre, soustitre } = getTitleAndSubtitle();

  const [showMenu, setShowMenu] = useState(false);
  const handleCloseMenu = () => setShowMenu(false);

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

  // const handleAccount = () => {
  //   navigate("/account");
  // };
  // const handleCookies = () => {
  // };
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

  const handleChangerClientsite = () => {
    navigate("/sites");
  }

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
            {ClientSiteContratCtx.storedClientSite &&
              ClientSiteContratCtx.storedClientSite.NomCompletClientSite}
          </div>
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


function getTitleAndSubtitle(data) {
  const pathname = window.location.pathname;

  switch (pathname) {
    case "/devis":
      return { titre: "Liste des devis", soustitre: `X` };

    case "/factures":
      return { titre: "Liste des factures", soustitre: `X` };

    case "/appareils":
      return { titre: "Liste des appareils", soustitre: `X` };

    case "/interventions":
      return { titre: "Liste des dépannages", soustitre: `X` };

    case "/maintenance":
      return { titre: "Liste des plannifications", soustitre: `X` };

    case "/account":
      return { titre: "Mon compte"};

    case "/": // Page d'accueil
      return { titre: "Tableau de bord" };

    default: // Page par défaut
      return { titre: "Titre page" };
  }
}
export default TopBarMenu;
