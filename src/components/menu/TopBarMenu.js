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

//#enregion

//#region Fontawsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
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

//#endregion

const TopBarMenu = ({ handleDeconnexion }) => {
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

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
            onClick={() => ClientSiteContratCtx.removeclientSite()}
          >
            Changer de site
          </Button>
        </Navbar.Text>
        <Navbar.Collapse className="justify-content-end">
          <OverlayTrigger
            trigger={"click"}
            placement="left"
            overlay={
              <Popover>
                <Popover.Body>
                  <Button variant="" onClick={handleDeconnexion}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Se déconnecter
                  </Button>
                </Popover.Body>
              </Popover>
            }
          >
            <Button variant="" className="border">
              <FontAwesomeIcon icon={faUser} />
            </Button>
          </OverlayTrigger>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopBarMenu;
