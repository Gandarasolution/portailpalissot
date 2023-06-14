import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from 'react-bootstrap/Dropdown';

import logo from "../../image/favicon.ico";
import { useContext } from "react";
import { ClientSiteContratContext } from "../../App";

const NavbarMenu = () => {

  const ClientSiteContratCtx = useContext(ClientSiteContratContext);


  const DropDownListeSite = () => {


    return (
      <Dropdown>
     
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {ClientSiteContratCtx.storedClientSite.NomCompletClientSite}
      </Dropdown.Toggle>
        <span className="mx-auto"> Contrat : {ClientSiteContratCtx.storedClientSite.IdContrat} souscrit le {new Date(ClientSiteContratCtx.storedClientSite.DateSouscriptionContrat).toLocaleDateString()} </span>
      <Dropdown.Menu>
  
  {ClientSiteContratCtx.storedListe.map((csc,index)=> {
    return(
      
        <Dropdown.Item key={index} onClick={() => ClientSiteContratCtx.setClientSite(csc)} > {csc.NomCompletClientSite} </Dropdown.Item>
        )
      })}
  
      </Dropdown.Menu>
    </Dropdown>
    );
  
  }
  



  return (
    <span>
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
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
                <NavDropdown.Item href="/Depannage/devis">
                  Devis
                </NavDropdown.Item>
                <NavDropdown.Item href="/Depannage/factures">
                  Factures
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid className="container-table p-4 m-4">
      
      <DropDownListeSite />



      </Container>
    </span>
  );
};

export default NavbarMenu;
