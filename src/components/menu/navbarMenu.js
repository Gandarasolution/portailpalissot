import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import logo from "../../image/favicon.ico";
import { useState } from "react";
import { useContext } from "react";
import { SiteContext } from "../../App";
import { Button } from "react-bootstrap";

const NavbarMenu = ({ setSite }) => {
  const [show, setShow] = useState(false);
  const [listeSite, setListeSite] = useState([]);

  const handleShowOffCanvas = () => {
    let _liste = [
      {
        IdSite: 2,
        NomSite: "Madame LUCOT Marguerite",
      },
      {
        IdSite: 425,
        NomSite: "Appartements",
      },
    ];

    setListeSite(_liste);

    setShow(true);
  };

  const SiteCXT = useContext(SiteContext);

  return (
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
              <NavDropdown.Item href="/Depannage/devis">Devis</NavDropdown.Item>
              <NavDropdown.Item href="/Depannage/factures">
                Factures
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => handleShowOffCanvas()}>
              {`S${SiteCXT.IdSite} - ${SiteCXT.NomSite}`}
            </Nav.Link>
            <Offcanvas
              placement="end"
              show={show}
              onHide={() => setShow(false)}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>{`S${SiteCXT.IdSite} - ${SiteCXT.NomSite}`}</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {listeSite.length > 1 && <h6>Liste des sites :</h6>}
                {listeSite.map((site) => {
                  return (
                    site.IdSite !== SiteCXT.IdSite && (
                      <Button variant="info"
                        onClick={() => {
                          setSite(site);
                        }}
                        className="m-2"
                        key={site.IdSite}
                      >{`S${site.IdSite} - ${site.NomSite}`}</Button>
                    )
                  );
                })}
              </Offcanvas.Body>
            </Offcanvas>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMenu;
