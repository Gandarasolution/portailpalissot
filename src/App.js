//#region Imports
import "./App.css";

//#region Bootstrap

import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

//#endregion

//#region in-projet

//#region Pages

import LoginPage from "./Views/Login/LoginPage";
import ClientSitePage from "./Views/Home/ClientSitePage";
import ContratPage from "./Views/Maintenance/Contrat/ContratPage";
import InterventionPage from "./Views/Depannage/Interventions/InterventionsPage";
import FacturesPage from "./Views/Factures/FacturesPage";
import WaiterPage from "./Views/ErrorHandling/Waiter";
import ErrorPage from "./Views/ErrorHandling/Error";
// import AppareilsPage from "./Views/Maintenance/Appareils/AppareilsPage";
// import NouvelleInterventionPage from "./Views/Depannage/Interventions/NouvelleInterventionPage";

//#endregion

//#region Composants

import TopBarMenu from "./components/menu/TopBarMenu";
import SideBarMenuLeft from "./components/menu/SideBarMenuLeft";
import ScrollToTopButton from "./components/commun/ScrollToTopButton";
//#endregion

//#endregion

//#region React
import React, { useEffect } from "react";
import { createContext, useState } from "react";

import { useCookies } from "react-cookie";

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Breakpoint, BreakpointProvider } from "react-socks";

//#endregion

//eslint-disable-next-line
import PageTest from "./Views/Home/Test";
import ViewerWord from "./Views/Viewer/ViewerWord";
import DevisPage from "./Views/Devis/DevisPage";

//#endregion

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBook,
  faCalendar,
  faFile,
  faHome,
  faMobile,
  faSquareCheck,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import HomePage from "./Views/Home/HomePage";
import ViewerPDFPage from "./Views/Viewer/ViewerPDF";
import ViewerWordPage from "./Views/Viewer/ViewerWord";
import ViewerImagePage from "./Views/Viewer/ViewerImage";
import { addOneYear, cyrb53, DateSOAP } from "./functions";
import { Toast, ToastContainer } from "react-bootstrap";
import { SetLastSite } from "./axios/WS_ClientSite";
import ChangeMDPPage from "./Views/Home/ChangeMDPPage";
// import ChangeMDPPage from "./Views/Home/ChangeMDPPage";
// import AccountPage from "./Views/Home/AccountPage";

library.add(
  fas,
  faWrench,
  faCalendar,
  faHome,
  faMobile,
  faBook,
  faFile,
  faSquareCheck
);

//#region Context
export const TokenContext = createContext(null);

export const ListeClientSiteContratContext = createContext(null);
export const ClientSiteContratContext = createContext(null);

export const ParametresContext = createContext([]);

export const ToastContext = createContext(null);

export const ViewerContext = createContext(null);

export const TitreContext = createContext(null);
export const SetTitreContext = createContext(null);

//#endregion


function App() {
  useEffect(() => {

    let _theme = localStorage.getItem("theme")

    _theme = (_theme?.length || 0) > 5 ? _theme : "";
    document.body.className = ` ${_theme} `;

  }, [])

  //#region State
  const [listeSites, setListeSites] = useState([]);

  const [isErrorMenu, setIsErrorMenu] = useState(false);
  const [isErrorData, setIsErrorData] = useState(false);
  //#endregion


  //#region Cookies

  //#region Viewer

  const viewerName = cyrb53("viewer").toString();
  const [viewerCookie, setViewerCookie, removeViewerCookie] = useCookies([
    viewerName,
  ]);

  const viewerURL = viewerCookie[viewerName];

  function setViewer(viewer) {
    setViewerCookie(viewerName, viewer);
  }

  function removeViewer() {
    removeViewerCookie(viewerName);
  }

  //#endregion

  //#region ClientSiteContrat

  const clientSiteName = cyrb53("clientSiteHashed").toString();
  const [clientSiteCookie, setClientSiteCookie, removeClientSiteCookie] =
    useCookies([clientSiteName]);

  function setClientSite(clientSite) {

    // clientSite.DroitAccesDepannage = true;
    // clientSite.DroitAccesDevis = true;
    // clientSite.DroitAccesFactures = true;
    // clientSite.DroitAccesMaintenance = true;
    // clientSite.DroitAccesDepannage = true;

    setClientSiteCookie(clientSiteName, clientSite);
    SetLastSite(tokenCookie[tokenName], clientSite.GUID);
  }
  const storedClientSite = clientSiteCookie[clientSiteName];

  function removeclientSite() {
    removeClientSiteCookie(clientSiteName);
  }

  //#endregion

  //#region Endpoint

  const wsEndpointName = cyrb53("wsEndpointName").toString();
  //eslint-disable-next-line
  const [wsEndpointCookie, setWsEndpointCookie, removeWSEndpointCookie] = useCookies({ wsEndpointName });

  function setWsEndpoint(ws) {
    setWsEndpointCookie(wsEndpointName, ws);
  }

  //#endregion

  //#region WSURL
  const wsEntrepriseName = cyrb53("wsEntrepriseNameHashed").toString();
  const [wsEntrepriseCookie, setWsEntrepriseCookie, removeWsEntrepriseCookie] = useCookies([wsEntrepriseName,]);

  function setWsEntrepriseURL(wsUrl) {
    setWsEntrepriseCookie(wsEntrepriseName, wsUrl);
  }
  //#endregion

  //#region Token

  const isUserName = cyrb53("isUserNameHAshed").toString();

  const [isUserCookie, setIsUserCookie, removeIsUserCookie] = useCookies([isUserName,]);

  function setIsUserViaCookies(value) {
    setIsUserCookie(isUserName, value);
  }


  //Hashage du nom du token pour éviter une récupération mannuelle rapide
  const tokenName = cyrb53("tokenNameHashed").toString();
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies([
    tokenName,
  ]);

  function setTokenViaCookies(token) {
    setTokenCookie(tokenName, token);
  }

  const storedToken = (isUserCookie[isUserName] === "1" ? "**" : "") + tokenCookie[tokenName];


  //#endregion

  const handleDeconnexion = () => {
    removeTokenCookie(tokenName);
    removeClientSiteCookie(clientSiteName);
    removeWsEntrepriseCookie(wsEntrepriseName);
    removeWSEndpointCookie(wsEndpointName);

    removeIsUserCookie(isUserName);

    localStorage.clear();
    window.location.href = "/";

  };

 
  if (!(tokenCookie[tokenName] && wsEntrepriseCookie[wsEntrepriseName])) {
    return (
      <div className="App font-link background">

        <Router>
          <Routes>

            {/* <Route path="changemdp/:token" element={<ChangeMDPPage />} /> */}
             <Route path="newmdp/:token" element={<LoginPage
                setToken={setTokenViaCookies}
                setUrlWs={setWsEntrepriseURL}
                setWsEndpoint={setWsEndpoint}
                setTheme={setTheme}
                setImageClient={setImageClient}
                setIsUser={setIsUserViaCookies}
                forget={false}
                changeMdp={true}
                newMdp={true}
              />} />
            <Route path="changemdp/:token" element={<LoginPage
                setToken={setTokenViaCookies}
                setUrlWs={setWsEntrepriseURL}
                setWsEndpoint={setWsEndpoint}
                setTheme={setTheme}
                setImageClient={setImageClient}
                setIsUser={setIsUserViaCookies}
                forget={false}
                changeMdp={true}
                newMdp={false}

              />} />
            <Route path="/" element={
              <LoginPage
                setToken={setTokenViaCookies}
                setUrlWs={setWsEntrepriseURL}
                setWsEndpoint={setWsEndpoint}
                setTheme={setTheme}
                setImageClient={setImageClient}
                setIsUser={setIsUserViaCookies}
              />
            } />
            <Route path="/forget" element={
              <LoginPage
                setToken={setTokenViaCookies}
                setUrlWs={setWsEntrepriseURL}
                setWsEndpoint={setWsEndpoint}
                setTheme={setTheme}
                setImageClient={setImageClient}
                setIsUser={setIsUserViaCookies}
                forget={true}
              />
              
            } />
            <Route path="/forget/:token" element={
              <LoginPage
                setToken={setTokenViaCookies}
                setUrlWs={setWsEntrepriseURL}
                setWsEndpoint={setWsEndpoint}
                setTheme={setTheme}
                setImageClient={setImageClient}
                setIsUser={setIsUserViaCookies}
                forget={true}
                newMdp={true}
              />
              
            } />
          </Routes>
        </Router>
      </div>
    );
  }


  //#endregion


  //#region Fonctions

  function setTheme(theme) {
    localStorage.setItem("theme", theme)
    let _theme = (theme?.length || 0) > 5 ? theme : "";
    document.body.className = `${_theme}`;
  }

  function setImageClient(b64strImg) {
    localStorage.setItem("logoClient", b64strImg);
  }

  const consoleError = console.error;
  const SUPPRESSED_ERRORS = ['Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.'];
  console.error = function filterErrors(msg, ...args) {
    if (!SUPPRESSED_ERRORS.some((entry) => msg.includes(entry))) {
      consoleError(msg, ...args);
    }

  };

  //#endregion


  //#region ErrorBoundary
  class ErrorBoundaryMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      this.props.fallback(true);
    }

    render() {

      return <>
        {this.props.children}
      </>
    }

  }

  class ErrorBoundaryData extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, info) {
      this.props.fallback(true);
    }

    render() {

      return <>
        {this.props.children}
      </>
    }

  }

  //#endregion

  //#region Composants


  const AppRoutes = () => {
    const [pageSubtitle, setPageSubtitle] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    // const [showDropdownPeriode, setShowDropdownPeriode] = useState(false);
    const [isSetPeriode, setIsSetPeriode] = useState(false);


    const [periodeEnCours, setPeriodeEnCours] = useState({
      k: DateSOAP(GetDatePeriodeInitial()),
      v: DateSOAP(addOneYear(GetDatePeriodeInitial())),
    });

    function GetDatePeriodeInitial() {
      let _day = 1;
      // let _monthI = _dateContrat.getMonth();
      let _monthI = 0;
      let _year = new Date().getFullYear();
      let _DateRetour = new Date(_year, _monthI, _day);
      return _DateRetour;
    }
    return (
      <>
        <ErrorBoundaryMenu fallback={setIsErrorMenu}>

          <TopBarMenu
            // accountName={account}
            handleDeconnexion={handleDeconnexion}
            pageSubtitle={pageSubtitle}
            pageTitle={pageTitle}
            statePeriodes={{ periodeEnCours, setPeriodeEnCours, setIsSetPeriode }}
            isError={isErrorMenu}
          />
        </ErrorBoundaryMenu>
        <ErrorBoundaryData fallback={setIsErrorData}>

          <ToastContainer className="p-3" position="bottom-end" style={{ zIndex: 1 }} >
            <Toast show={isErrorData} bg={'danger'} onClose={() => {
              setIsErrorData(false);
            }} >
              <Toast.Header closeButton={false}>

                <strong className="me-auto">Une erreur est survenue</strong>
              </Toast.Header>
              <Toast.Body>Nous sommes désolé, une erreur est survenue.
                Veuillez réessayer plus tard.
              </Toast.Body>
            </Toast>
          </ToastContainer>
          <Routes>

            <Route path="/"
            >
              <Route index
                element={storedClientSite && storedClientSite.GUID ? <HomePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />

              <Route path="*" element={<Navigate to="/" replace />} />

              <Route path="waiting" element={<WaiterPage />} />
              <Route path="error" element={<ErrorPage />} />

              <Route path="sites" element={<ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />} />

              {(storedClientSite && storedClientSite.DroitAccesMaintenance)  && <Route
                path="maintenance"
                element={storedClientSite ? <ContratPage IsSetPeriode={isSetPeriode} periodeEnCours={periodeEnCours} setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />}
              {(storedClientSite && storedClientSite.DroitAccesDepannage) && <Route
                path="interventions"
                exact
                element={storedClientSite ? <InterventionPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />}

              {(storedClientSite && storedClientSite.DroitAccesDevis) && <Route
                path="devis"
                element={storedClientSite ? <DevisPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}

              />}
              {(storedClientSite && storedClientSite.DroitAccesFactures) && <Route
                path="factures"
                element={storedClientSite ? <FacturesPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />}


              <Route
                path="viewerPDF"
                element={storedClientSite ? <ViewerPDFPage /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />

              <Route
                path="viewerDOC"
                element={storedClientSite ? <ViewerWordPage /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />

              <Route
                path="viewerIMG"
                element={storedClientSite ? <ViewerImagePage /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
              />

              <Route path="viewerWord" element={<ViewerWord />} />
            </Route>
          </Routes>


        </ErrorBoundaryData >
      </>

    );
  };

  const SmallDown = () => {
    return (
      <Breakpoint small down>
        <Row className="background  m-0">

          <Col className="App font-link p-0">

            <AppRoutes />
          </Col>
        </Row>
      </Breakpoint>
    );
  };

  const LargeUp = () => {
    return (
      <Breakpoint medium up className="p-0 m-0">
        <Row className="background  m-0">
          {storedClientSite && (
            <Col md={"auto"} className="p-0">
              <SideBarMenuLeft />
            </Col>
          )}

          <Col className="App font-link p-0">

            <AppRoutes />
          </Col>
        </Row>
      </Breakpoint>
    );
  };

  //#endregion


  return (
    // <TokenContext.Provider value={{storedToken}}>
    // <TokenContext.Provider value={tokenCookie[tokenName]  }>
    <TokenContext.Provider value={storedToken}>

      <ClientSiteContratContext.Provider
        value={{ storedClientSite, setClientSite, removeclientSite, listeSites, setListeSites }}
      >
        <ViewerContext.Provider
          value={{ viewerURL, setViewer, removeViewer }}
        >

          <Router>


            <BreakpointProvider>
              <SmallDown />
              <LargeUp />
            </BreakpointProvider>
          </Router>
          <ScrollToTopButton />

        </ViewerContext.Provider>
      </ClientSiteContratContext.Provider>

    </TokenContext.Provider>
  );
}



export default App;