import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";

import logo from "../../image/favicon.ico";
import { useContext } from "react";
import { ClientSiteContratContext } from "../../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";


const NavbarMenu = ({handleDeconnexion}) => {
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);



  const NavDropDownListeSite = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant=" " id="dropdown-basic">
          {`S${ClientSiteContratCtx.storedClientSite.IdClientSite}-${ClientSiteContratCtx.storedClientSite.NomCompletClientSite}`}
        </Dropdown.Toggle>
        <span className="mx-auto">
          <a href="/maintenance/contrat">
            Contrat N°{ClientSiteContratCtx.storedClientSite.IdContrat}
          </a>{" "}
          souscrit le{" "}
          {new Date(
            ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat
          ).toLocaleDateString()}
        </span>
        <Dropdown.Menu>
          {ClientSiteContratCtx.storedListe.map((csc, index) => {
            return (
              <Dropdown.Item
                key={index}
                onClick={() => ClientSiteContratCtx.setClientSite(csc)}
              >
                {csc.NomCompletClientSite}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <span>
      <Navbar bg="light" expand="lg" sticky="top">
        <Navbar.Brand href="/">
          <Container>
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            GANDARA-DEMO
          </Container>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="Maintenance" id="maintenance-nav-dropdown">
              <NavDropdown.Item href="/maintenance/contrat">
                Contrat
              </NavDropdown.Item>
              <NavDropdown.Item href="/maintenance/appareils">
                Appareils
              </NavDropdown.Item>
              <NavDropdown.Item href="/maintenance/factures">
                Factures
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Dépannage" id="maintenance-nav-dropdown">
              <NavDropdown.Item href="/Depannage/interventions">
                Interventions
              </NavDropdown.Item>
              <NavDropdown.Item href="/Depannage/devis">Devis</NavDropdown.Item>
              <NavDropdown.Item href="/Depannage/factures">
                Factures
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <NavDropDownListeSite />

          <Button variant=" " onClick={() => {handleDeconnexion()}}>
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip placement="bottom" className="in" id="tooltip-right">
                  Déconnexion
                </Tooltip>
              }
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </OverlayTrigger>
          </Button>
        </Nav>
      </Navbar>
    </span>
  );
};

export default NavbarMenu;
