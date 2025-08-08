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
  faArrowLeft,
  faArrowRight,
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
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GetContratPrestationPeriodes } from "../../axios/WS_Contrat";
import { GetClientSiteContrat } from "../../axios/WS_User";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { GetDateFromStringDDMMYYY, GetNomMois } from "../../functions";

//#endregion

const TopBarMenu = ({ handleDeconnexion, pageSubtitle, pageTitle, pageSubtitleLoaded, statePeriodes,isError }) => {

  //#region Contexts
  const ClientSiteContratCtx = useContext(ClientSiteContratContext);
  // const PageCt = useContext(TitreContext);
  const TokenCt = useContext(TokenContext);

  //#endregion

  //#region States
  const [showMenu, setShowMenu] = useState(false);
  const [listePeriodes, setListePeriodes] = useState([]);
  const [showDropdownPeriode, setShowDropdownPeriode] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSwitchSiteOpen, setIsSwitchSiteOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState("auto");

  const [listeSites, setListeSites] = useState([]); 

  const navbarRef = useRef(null);
  const titleDropdownRef = useRef(null);
  const dropdownButtonRef = useRef(null);


  //#endregion

  const navigate = useNavigate();

  //Le titre et le soustitre de la page
  const { titre, soustitre } = getTitleAndSubtitle();


  //#region Fonctions
  function getListSites() {

    let _listeSites = ClientSiteContratCtx.listeSites;
    if (_listeSites.length <= 0) {

      const FetchSetClientSite = (data) => {
        setListeSites(data);
      }
      GetClientSiteContrat(TokenCt, FetchSetClientSite);
    }
  }

  function getTitleAndSubtitle() {
    const titre = pageTitle;
    // Si pageSubtitle est null, on lui assigne une chaîne vide
    const soustitreRaw = pageSubtitleLoaded ? "x" : (pageSubtitle || "");
    
    const numberMatch = soustitreRaw.match(/\d+/);
    const soustitreNumber = numberMatch ? numberMatch[0] : "";
    
    return { titre, soustitre: soustitreNumber };
  }
  




  const GetPeriodes = async () => {
    const FetchSetDataPeriode = (data) => {
      if (data.length > 1) {
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          element.k = `01-01-${element.k}`;
          element.v = `31-12-${element.v}`;
        }
      } else {
        let _lData = [];
        data.k = `01-01-${data.k}`;
        data.v = `31-12-${data.v}`;
        _lData[0] = data;
        data = _lData;

      }

      setListePeriodes(data);
      const PeriodeInitial = GetDatePeriodeInitial();
      let _indexPeriode = data.findIndex((p) => {
        return (
          GetDateFromStringDDMMYYY(p.k).getTime() <= PeriodeInitial.getTime() &&
          GetDateFromStringDDMMYYY(p.v).getTime() >= PeriodeInitial.getTime()
        );
      });
      if (_indexPeriode <= -1) {
        _indexPeriode = data.length - 1;
      }
      statePeriodes.setPeriodeEnCours(data[_indexPeriode]);
      statePeriodes.setIsSetPeriode(true);
    };



    await GetContratPrestationPeriodes(
      TokenCt,
      ClientSiteContratCtx.storedClientSite.GUID,
      FetchSetDataPeriode
    );
  };

  function GetDatePeriodeInitial() {
    let _day = 1;
    // let _monthI = _dateContrat.getMonth();
    let _monthI = 0;
    let _year = new Date().getFullYear();
    let _DateRetour = new Date(_year, _monthI, _day);
    return _DateRetour;
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
          <MenuNavLink href={"/devis"} icon={faBook} text={"Devis"} />
          <MenuNavLink href={"/factures"} icon={faFile} text={"Factures"} />
          <br />
          <hr />

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



  const DropdownPeriode = () => {
    let _arrayPeriodes = [];

    for (let index = 0; index < listePeriodes.length; index++) {
      const element = listePeriodes[index];
      let _dateStart = GetDateFromStringDDMMYYY(element.k);
      let _dateEnd = GetDateFromStringDDMMYYY(element.v);

      _arrayPeriodes.push({ dateStart: _dateStart, dateEnd: _dateEnd });
    }
    return (

      <>
        <Button variant="" className="button-periode" onClick={() => SoustraireUnAnPeriode()} >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>

        <DropdownButton variant="" className="button-periode" drop="down-centered" align="end" id="dropdown-datePeriode"
          onSelect={(e) => {
            HandleDropdownPeriodeSelect(e);
          }}


          title={`Contrat de maintenance de : ${GetNomMois(1, false)} ${GetDateFromStringDDMMYYY(
            statePeriodes.periodeEnCours.k
          ).getFullYear()} à ${GetNomMois(12, false)} ${GetDateFromStringDDMMYYY(
            statePeriodes.periodeEnCours.v
          ).getFullYear()}`}>


          {_arrayPeriodes.map((periode, index) => {
            return (
              <Dropdown.Item key={index} eventKey={index}>
                {` ${GetNomMois(
                  periode.dateStart.getMonth() + 1
                )} ${periode.dateStart.getFullYear()} à ${GetNomMois(
                  periode.dateEnd.getMonth() + 1
                )} ${periode.dateEnd.getFullYear()}`}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>





        <Button variant="" className="button-periode" onClick={() => AjouterUnAnPeriode()} >
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </>
    );

  }

  //#endregion


  //#region Events
  const handleCloseMenu = () => setShowMenu(false);


  // const handleChangerClientsite = () => {
  //   navigate("/sites");
  // }


  const AjouterUnAnPeriode = async () => {
    const _periodeEnCours = JSON.parse(JSON.stringify(statePeriodes.periodeEnCours));
    const _indexPeriode = listePeriodes.findIndex(
      (f) =>
        GetDateFromStringDDMMYYY(f.k).getTime() ===
        GetDateFromStringDDMMYYY(_periodeEnCours.k).getTime() &&
        GetDateFromStringDDMMYYY(f.v).getTime() ===
        GetDateFromStringDDMMYYY(_periodeEnCours.v).getTime()
    );

    if (_indexPeriode < listePeriodes.length - 1) {
      statePeriodes.setPeriodeEnCours(listePeriodes[_indexPeriode + 1]);
    }
  };


  const HandleDropdownPeriodeSelect = async (index) => {
    const _periode = listePeriodes[index];
    statePeriodes.setPeriodeEnCours(_periode);
  };



  const SoustraireUnAnPeriode = async () => {
    const _periodeEnCours = JSON.parse(JSON.stringify(statePeriodes.periodeEnCours));
    const _indexPeriode = listePeriodes.findIndex(
      (f) =>
        GetDateFromStringDDMMYYY(f.k).getTime() ===
        GetDateFromStringDDMMYYY(_periodeEnCours.k).getTime() &&
        GetDateFromStringDDMMYYY(f.v).getTime() ===
        GetDateFromStringDDMMYYY(_periodeEnCours.v).getTime()
    );

    if (_indexPeriode > 0) {
      statePeriodes.setPeriodeEnCours(listePeriodes[_indexPeriode - 1]);
    }
  };



  //#endregion


useEffect(()=> {
  getListSites()

      // eslint-disable-next-line
},[])

  useEffect(() => {
    const pathname = window.location.pathname;
    if(isError)return;
    statePeriodes.setIsSetPeriode(false);

    let _isdropdownShown = false;
    if (pathname === "/maintenance") {
      _isdropdownShown = true;
    }
    setShowDropdownPeriode(_isdropdownShown)

    // eslint-disable-next-line
  }, [titre])




  useEffect(() => {
    if(isError)return;

    if (showDropdownPeriode) {
      GetPeriodes();
    }
    // eslint-disable-next-line
  }, [showDropdownPeriode])


  useEffect(() => {
    const handleScroll = () => {
      if (navbarRef.current) {
        const rect = navbarRef.current.getBoundingClientRect();
        setIsSticky(window.scrollY > 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (isSwitchSiteOpen && titleDropdownRef.current && dropdownButtonRef.current) {
      const textWidth = titleDropdownRef.current.scrollWidth;
      const buttonWidth = dropdownButtonRef.current.offsetWidth;
      const computedWidth = textWidth + buttonWidth;

      setDropdownWidth(`${computedWidth}px`);
    } else {
      setDropdownWidth("auto");
    }
  }, [isSwitchSiteOpen]);

  return (
    <Navbar expand="lg" className="top-bar-menu">
      <Container fluid>
        <Navbar.Toggle
          onClick={() => setShowMenu(true)}
          aria-controls="basic-navbar-nav"
          className="m-2"
        />
        <OffcanvasMenu />

        <Navbar.Text ref={navbarRef} className={`navbar-title-container ${isSticky ? "is-sticky" : ""}`}>
          <h1>{titre}</h1>
          {soustitre && (
            <div className="box-length">
              <span>{soustitre}</span>
            </div>
          )}
        </Navbar.Text>

        <Navbar.Text className="d-flex align-item" >
          {
           (!isError) && showDropdownPeriode &&
            <DropdownPeriode />
          }
        </Navbar.Text>

        <Navbar.Text className="d-flex align-items-center site-container">
          <div
            className={`d-flex align-items-start me-3 wrapper-site ${isSwitchSiteOpen ? "is-switching" : ""}`}
          >
            <div className="title-site me-2">
              {ClientSiteContratCtx.storedClientSite?.NomCompletClientSite}
            </div>

            {(!isError) && ClientSiteContratCtx.storedClientSite && (
              <div className="dropdown-container d-flex flex-column align-items-start">
                <div className="title-site-in-dropdown me-2 ms-3" ref={titleDropdownRef}>
                  {ClientSiteContratCtx.storedClientSite.NomCompletClientSite}
                </div>
                <DropdownButton
                  ref={dropdownButtonRef}
                  title={GetDropdownTitle()}
                  variant=""
                  className="switch-site d-flex flex-column align-items-end"
                  show={isSwitchSiteOpen}
                  onToggle={(nextShow, event, metadata) => {
                    setIsSwitchSiteOpen(nextShow);
                  }}
                  style={{ width: dropdownWidth }}
                >
                  {
                  listeSites && listeSites.length && listeSites.length >=1 && listeSites.map((site) => (
                    

                    site.GUID !== ClientSiteContratCtx.storedClientSite.GUID && (
                      <Dropdown.Item
                        key={site.GUID}
                        onClick={() => ClientSiteContratCtx.setClientSite(site)}
                         className="ms-3"

                      >
                        {site.NomCompletClientSite}
                      </Dropdown.Item>
                    )
                  
                ))}
                  <div className="dropdown-footer">
                    <Dropdown.Item
                      className="btn-see-all-sites"
                      onClick={() => navigate("/sites")}
                    >
                      Voir toute la liste
                    </Dropdown.Item>
                  </div>
                </DropdownButton>
              </div>
            )}
          </div>


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