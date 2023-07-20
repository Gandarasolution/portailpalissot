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
import Row from "react-bootstrap/Row";

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

  const [showMenu, setShowMenu] = useState(false);
  const handleCloseMenu = () => setShowMenu(false);

  const MenuNavLink = ({ href, text, icon }) => {
    return (
      <NavItem>
        <NavLink href={href}>
          <FontAwesomeIcon icon={icon} />
          {text}
        </NavLink>
      </NavItem>
    );
  };

  const OffcanvasMenu = () => {
    return (
      <Offcanvas show={showMenu} onHide={handleCloseMenu} placement="start">
        <Offcanvas.Header closeButton>
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
          <MenuNavLink href={"/contrat"} icon={faCalendar} text={"Contrat"} />
          <MenuNavLink href={"/appareils"} icon={faMobile} text={"Appareils"} />
          <MenuNavLink
            href={"/interventions"}
            icon={faWrench}
            text={"Interventions"}
          />
          <MenuNavLink href={"/devis"} icon={faBook} text={"Devis"} />
          <MenuNavLink href={"/factures"} icon={faFile} text={"Factures"} />
        </Offcanvas.Body>
      </Offcanvas>
    );
  };

  const handleAccount = () => {
    navigate("/account");
  };
  const handleCookies = () => {
  };
  const PopoverAccount = (
    <Popover>
      <Popover.Header>{accountName}</Popover.Header>
      <Popover.Body>
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
        </Row>
      </Popover.Body>
    </Popover>
  );

const handleChangerClientsite = () => {
  navigate("/sites");
}

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Toggle
          onClick={() => setShowMenu(true)}
          aria-controls="basic-navbar-nav"
          className="m-2"
        />
        <OffcanvasMenu />

        <Navbar.Text>
          {ClientSiteContratCtx.storedClientSite &&
            ClientSiteContratCtx.storedClientSite.NomCompletClientSite}
          <Button
            variant=""
            className="border"
            // onClick={() => ClientSiteContratCtx.removeclientSite()}
            onClick={handleChangerClientsite}
          >
            Changer de site
          </Button>
        </Navbar.Text>

        <Navbar.Collapse className="justify-content-end">
          <OverlayTrigger
            trigger={"click"}
            placement="bottom"
            overlay={PopoverAccount}
          >
            <Button variant="" className="border">
              <FontAwesomeIcon icon={faCircleUser} /> {accountName}
            </Button>
          </OverlayTrigger>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBarMenu;
