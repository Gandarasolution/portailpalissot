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
import AppareilsPage from "./Views/Maintenance/Appareils/AppareilsPage";
import InterventionPage from "./Views/Depannage/Interventions/InterventionsPage";
import NouvelleInterventionPage from "./Views/Depannage/Interventions/NouvelleInterventionPage";
import FacturesPage from "./Views/Factures/FacturesPage";
import WaiterPage from "./Views/ErrorHandling/Waiter";
import ErrorPage from "./Views/ErrorHandling/Error";

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

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Breakpoint, BreakpointProvider } from "react-socks";

//#endregion

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
import ChangeMDPPage from "./Views/Home/ChangeMDPPage";
import { addOneYear, cyrb53, DateSOAP } from "./functions";
import { Toast, ToastContainer } from "react-bootstrap";
import { SetLastSite } from "./axios/WS_ClientSite";
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



  //Hashage du nom du token pour éviter une récupération mannuelle rapide
  const tokenName = cyrb53("tokenNameHashed").toString();

  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies([
    tokenName,
  ]);

  function setTokenViaCookies(token) {
    setTokenCookie(tokenName, token);
  }
  //#endregion

  const handleDeconnexion = () => {
    removeTokenCookie(tokenName);
    removeClientSiteCookie(clientSiteName);
    removeWsEntrepriseCookie(wsEntrepriseName);
    removeWSEndpointCookie(wsEndpointName);
    localStorage.clear();
  };

  if (!(tokenCookie[tokenName] && wsEntrepriseCookie[wsEntrepriseName]) && !window.location.href.toUpperCase().includes('changeMDP/'.toUpperCase())) {
    return (
      <div className="App font-link background">
        <LoginPage
          setToken={setTokenViaCookies}
          setUrlWs={setWsEntrepriseURL}
          setWsEndpoint={setWsEndpoint}
          setTheme={setTheme}
          setImageClient={setImageClient}
        // setParams={setListeParamsViaCookies}
        // setAccountName={setAccountName}
        />
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

  function setImageClient(b64strImg){
    localStorage.setItem("logoClient",b64strImg);
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
            <Route path="test" element={<PageTest />} />
            <Route path="/changemdp/:token" element={<ChangeMDPPage />} />
            <Route
              path="/"
              element={storedClientSite ? <HomePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route path="waiting" element={<WaiterPage />} />
            <Route path="error" element={<ErrorPage />} />

            <Route path="/sites" element={<ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />} />
            {/* <Route path="account" element={<AccountPage accountName={account} />} /> */}
            <Route
              path="maintenance"
              element={storedClientSite ? <ContratPage IsSetPeriode={isSetPeriode} periodeEnCours={periodeEnCours} setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route
              path="appareils"
              element={storedClientSite ? <AppareilsPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route
              path="interventions"
              exact
              element={storedClientSite ? <InterventionPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route
              path="nouvelleintervention"
              element={
                storedClientSite ? <NouvelleInterventionPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />
              }
            />
            <Route
              path="devis"
              element={storedClientSite ? <DevisPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}

            />
            <Route
              path="factures"
              element={storedClientSite ? <FacturesPage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route
              path="viewerPDF"
              element={storedClientSite ? <ViewerPDFPage /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />{" "}
            <Route
              path="viewerDOC"
              element={storedClientSite ? <ViewerWordPage /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route
              path="viewerIMG"
              element={storedClientSite ? <ViewerImagePage /> : <ClientSitePage setPageSubtitle={setPageSubtitle} setPageTitle={setPageTitle} />}
            />
            <Route path="viewerWord" element={<ViewerWord />} />
          </Routes>


        </ErrorBoundaryData>
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
    <TokenContext.Provider value={tokenCookie[tokenName]}>

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