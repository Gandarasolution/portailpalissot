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
import logo from "../../image/favicon.ico";
import { ClientSiteContratContext } from "../../App";
//#endregion
import { useContext,useState } from "react";
//#endregion


const NavbarMenu = ({ handleDeconnexion }) => {
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  // const NavDropDownListeSite = () => {
  //   return (
  //     <Dropdown>
  //       <Dropdown.Toggle variant=" " id="dropdown-basic">
  //         {`S${ClientSiteContratCtx.storedClientSite.IdClientSite}-${ClientSiteContratCtx.storedClientSite.NomCompletClientSite}`}
  //       </Dropdown.Toggle>
  //       <span className="mx-auto">
  //         <a href="/maintenance/contrat">
  //           Contrat N°{ClientSiteContratCtx.storedClientSite.IdContrat}
  //         </a>{" "}
  //         souscrit le{" "}
  //         {new Date(
  //           ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat
  //         ).toLocaleDateString()}
  //       </span>
  //       <Dropdown.Menu>
  //         {ClientSiteContratCtx.storedListe.map((csc, index) => {
  //           return (
  //             <Dropdown.Item
  //               key={index}
  //               onClick={() => ClientSiteContratCtx.setClientSite(csc)}
  //             >
  //               {csc.NomCompletClientSite}
  //             </Dropdown.Item>
  //           );
  //         })}
  //       </Dropdown.Menu>
  //     </Dropdown>
  //   );
  // };

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
                <a href="/maintenance/contrat">
                  {`Contrat N°${
                    ClientSiteContratCtx.storedClientSite.IdContrat
                  } souscrit le ${new Date(
                    ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat
                  ).toLocaleDateString()}`}
                </a>
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
                    <span className="ms-2">
                      {`Contrat N°${csc.IdContrat} souscrit le ${new Date(
                        csc.DateSouscriptionContrat
                      ).toLocaleDateString()}`}
                    </span>
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


{/* 
            <NavDropdown title="Maintenance" id="maintenance-nav-dropdown">
              <NavDropdown.Item href="/maintenance/contrat">
                Contrat
              </NavDropdown.Item>
              <NavDropdown.Item href="/maintenance/appareils">
                Appareils
              </NavDropdown.Item>
              <NavDropdown.Item href="/factures">
                Factures
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Dépannage" id="maintenance-nav-dropdown">
              <NavDropdown.Item href="/Depannage/interventions">
                Interventions
              </NavDropdown.Item>
              <NavDropdown.Item href="/Depannage/devis">Devis</NavDropdown.Item>
              <NavDropdown.Item href="/factures">
                Factures
              </NavDropdown.Item>
            </NavDropdown> */}


            <NavLink href="/maintenance/contrat" >Contrats</NavLink>
            <NavLink href="/maintenance/appareils">Appareils</NavLink>
            <NavLink href="/Depannage/interventions">Interventions</NavLink>
            <NavLink  href="/Depannage/devis">Devis</NavLink>
            <NavLink  href="/factures">Factures</NavLink>


          </Nav>



        </Navbar.Collapse>
        <Nav>
          {/* <NavDropDownListeSite /> */}
          
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
