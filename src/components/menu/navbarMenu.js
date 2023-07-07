//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavLink from "react-bootstrap/NavLink";
// import Dropdown from "react-bootstrap/Dropdown";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
//#enregion

//#region Fontawsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
//#endregion

//#region Components
import { ClientSiteContratContext } from "../../App";
//#endregion
import { useContext, useState } from "react";
//#endregion

const NavbarMenu = ({ handleDeconnexion }) => {
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const OffcanvasClientSite = () => {
    return (
      <span>
        <Button variant="" onClick={handleShow}>
          {`S${ClientSiteContratCtx.storedClientSite.IdClientSite}-${ClientSiteContratCtx.storedClientSite.NomCompletClientSite}`}
        </Button>

        <Offcanvas show={show} onHide={handleClose} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <p>
                {`S${ClientSiteContratCtx.storedClientSite.IdClientSite}-${ClientSiteContratCtx.storedClientSite.NomCompletClientSite}`}
              </p>
              <p>
                {ClientSiteContratCtx.storedClientSite.IdContrat > 0 ? (
                  <a href="/contrat">
                    {`Contrat N°${
                      ClientSiteContratCtx.storedClientSite.IdContrat
                    } souscrit le ${new Date(
                      ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat
                    ).toLocaleDateString()}`}
                  </a>
                ) : (
                  "Aucun contrat"
                )}
              </p>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <h6>Liste des sites</h6>
            <hr />
            {ClientSiteContratCtx.storedListe.map((csc, index) => {
              if (
                csc.IdClientSite ===
                ClientSiteContratCtx.storedClientSite.IdClientSite
              )
                return null;
              return (
                <span key={csc.IdClientSite}>
                  <Button
                    className="bt-clientsite"
                    key={index}
                    onClick={() => ClientSiteContratCtx.setClientSite(csc)}
                  >
                    {`S${csc.IdClientSite}-${csc.NomCompletClientSite}`}
                    {csc.IdContrat > 0 && (
                      <span className="ms-2">
                        {`Contrat N°${csc.IdContrat} souscrit le ${new Date(
                          csc.DateSouscriptionContrat
                        ).toLocaleDateString()}`}
                      </span>
                    )}
                  </Button>
                </span>
              );
            })}
          </Offcanvas.Body>
        </Offcanvas>
      </span>
    );
  };

  return (
    <span>
      <Navbar bg="light" expand="lg" sticky="top">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink href="/contrat">Contrats</NavLink>
            <NavLink href="/appareils">Appareils</NavLink>
            <NavLink href="/interventions">Interventions</NavLink>
            <NavLink href="/devis">Devis</NavLink>
            <NavLink href="/factures">Factures</NavLink>
          </Nav>
        </Navbar.Collapse>
        <Nav>
          <OffcanvasClientSite />
          <Button
            variant=" "
            onClick={() => {
              handleDeconnexion();
            }}
          >
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
