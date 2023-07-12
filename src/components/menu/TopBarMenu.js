//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavLink from "react-bootstrap/NavLink";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
//#enregion

//#region Fontawsome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faHome,
  faMobile,
  faRightFromBracket,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar, faFile } from "@fortawesome/free-regular-svg-icons";
//#endregion

//#region Components
import { ClientSiteContratContext } from "../../App";
import logo from "../../image/favicon.ico";

//#endregion
import { useContext, useState } from "react";

import { NavItem } from "react-bootstrap";
//#endregion

const TopBarMenu = ({ handleDeconnexion }) => {
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // const OffcanvasClientSite = () => {
  //   return (
  //     <span>
  //       <Button variant="" onClick={handleShow}>
  //         {`S${ClientSiteContratCtx.storedClientSite.IdClientSite}-${ClientSiteContratCtx.storedClientSite.NomCompletClientSite}`}
  //       </Button>

  //       <Offcanvas show={show} onHide={handleClose} placement="end">
  //         <Offcanvas.Header closeButton>
  //           <Offcanvas.Title>
  //             <p>
  //               {`S${ClientSiteContratCtx.storedClientSite.IdClientSite}-${ClientSiteContratCtx.storedClientSite.NomCompletClientSite}`}
  //             </p>
  //             <p>
  //               {ClientSiteContratCtx.storedClientSite.IdContrat > 0 ? (
  //                 <a href="/contrat">
  //                   {`Contrat N°${
  //                     ClientSiteContratCtx.storedClientSite.IdContrat
  //                   } souscrit le ${new Date(
  //                     ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat
  //                   ).toLocaleDateString()}`}
  //                 </a>
  //               ) : (
  //                 "Aucun contrat"
  //               )}
  //             </p>
  //           </Offcanvas.Title>
  //         </Offcanvas.Header>
  //         <Offcanvas.Body>
  //           <h6>Liste des sites</h6>
  //           <hr />
  //           {ClientSiteContratCtx.storedListe.map((csc, index) => {
  //             if (
  //               csc.IdClientSite ===
  //               ClientSiteContratCtx.storedClientSite.IdClientSite
  //             )
  //               return null;
  //             return (
  //               <span key={csc.IdClientSite}>
  //                 <Button
  //                   className="bt-clientsite"
  //                   key={index}
  //                   onClick={() => ClientSiteContratCtx.setClientSite(csc)}
  //                 >
  //                   {`S${csc.IdClientSite}-${csc.NomCompletClientSite}`}
  //                   {csc.IdContrat > 0 && (
  //                     <span className="ms-2">
  //                       {`Contrat N°${csc.IdContrat} souscrit le ${new Date(
  //                         csc.DateSouscriptionContrat
  //                       ).toLocaleDateString()}`}
  //                     </span>
  //                   )}
  //                 </Button>
  //               </span>
  //             );
  //           })}
  //         </Offcanvas.Body>
  //       </Offcanvas>
  //     </span>
  //   );
  // };



  


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
    // <span>
    // <Navbar bg="light" expand="lg" sticky="top">
    <Navbar bg="light" expand="lg">
      <Navbar.Toggle
        onClick={() => setShowMenu(true)}
        aria-controls="basic-navbar-nav"
        className="m-2"
      />

      <Container>
        <NavLink href="/clientSite">
          {ClientSiteContratCtx.storedClientSite.NomCompletClientSite}{" "}
          <Button variant="" className="border">
            {" "}
            Changer de site
          </Button>
        </NavLink>
      </Container>

      <Navbar.Collapse id="basic-navbar-nav">
        <OffcanvasMenu />
      </Navbar.Collapse>

      <Nav>
        {/* <OffcanvasClientSite /> */}
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
    // </span>
  );
};

export default TopBarMenu;
