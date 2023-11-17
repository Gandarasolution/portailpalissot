//#region Imports
import "./App.css";

//#region Bootstrap

import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";

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

//#endregion

//#endregion

//#region React

import { React, createContext } from "react";

import { useCookies } from "react-cookie";

import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
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
import AccountPage from "./Views/Home/AccountPage";
import HomePage from "./Views/Home/HomePage";
import ViewerPDFPage from "./Views/Viewer/ViewerPDF";
import ViewerWordPage from "./Views/Viewer/ViewerWord";
import ViewerImagePage from "./Views/Viewer/ViewerImage";
import ChangeMDPPage from "./Views/Home/ChangeMDPPage";

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

//#endregion
function App() {


  //Fonction de hash : https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
  const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };

  //#region ClientSiteContrat

  const clientSiteName = cyrb53("clientSiteHashed").toString();
  const [clientSiteCookie, setClientSiteCookie, removeClientSiteCookie] =
    useCookies([clientSiteName]);

  function setClientSite(clientSite) {
    setClientSiteCookie(clientSiteName, clientSite);
  }
  const storedClientSite = clientSiteCookie[clientSiteName];

  function removeclientSite() {
    removeClientSiteCookie(clientSiteName);
  }

  //#endregion

  //#region Parametres

  const listParamName = cyrb53("listeParamsHashed").toString();
  const [listeParamsCookie, setListeParamsCookie, removeListeParamsCookie] =
    useCookies([listParamName]);

  function setListeParamsViaCookies(listeParams) {
    setListeParamsCookie(listParamName, listeParams);
  }

  //#endregion

  //#region Viewer

  const viewerName = cyrb53("viewer").toString();
  const [viewerCookie, setViewerCookie, removeViewerCookie] = useCookies([
    viewerName,
  ]);

  const viewerURL = viewerCookie[viewerName];

  function setViewer(viewer) {
    console.log("viewer :", viewer);
    setViewerCookie(viewerName, viewer);
  }

  function removeViewer() {
    removeViewerCookie(viewerName);
  }

  //#endregion

  //#region Token

  const accountName = cyrb53("accountNamedHashed").toString();
  const [accountCookie, setAccountCookie, removeAccountCookie] = useCookies([
    accountName,
  ]);
  function setAccountName(name) {
    setAccountCookie(accountName, name);
  }

  const account = accountCookie[accountName];

  //Hashage du nom du token pour éviter une récupération mannuelle rapide
  const tokenName = cyrb53("tokenNameHashed").toString();

  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies([
    tokenName,
  ]);

  function setTokenViaCookies(token) {
    setTokenCookie(tokenName, token);
  }

  const handleDeconnexion = () => {
    removeTokenCookie(tokenName);
    removeListeParamsCookie(listParamName);
    removeClientSiteCookie(clientSiteName);
    removeAccountCookie(accountName);
  };

  if (!tokenCookie[tokenName] && ! window.location.href.toUpperCase().includes('changeMDP'.toUpperCase())) {
    return (
      <div className="App font-link background">
        <LoginPage
          setToken={setTokenViaCookies}
          setParams={setListeParamsViaCookies}
          setAccountName={setAccountName}
        />
      </div>
    );
  }

  //#endregion

  //#region Toast

  //#endregion

  //#region Composants
  const AppRoutes = () => {
    return (
      <Routes>
        
        <Route path="test" element={<PageTest />} />
        <Route path="/changemdp/:token" element={<ChangeMDPPage />}/>
        <Route
          path="*"
          element={storedClientSite ? <HomePage /> : <ClientSitePage />}
        />
        <Route
          path="/"
          element={storedClientSite ? <HomePage /> : <ClientSitePage />}
        />
        <Route path="/sites" element={<ClientSitePage />} />
        <Route path="waiting" element={<WaiterPage />} />
        <Route path="error" element={<ErrorPage />} />
        <Route path="viewerWord" element={<ViewerWord />} />
        <Route path="account" element={<AccountPage accountName={account} />} />
        <Route
          path="maintenance"
          element={storedClientSite ? <ContratPage /> : <ClientSitePage />}
        />
        <Route
          path="appareils"
          element={storedClientSite ? <AppareilsPage /> : <ClientSitePage />}
        />
        <Route
          path="interventions"
          exact
          element={storedClientSite ? <InterventionPage /> : <ClientSitePage />}
        />
        <Route
          path="nouvelleintervention"
          element={
            storedClientSite ? <NouvelleInterventionPage /> : <ClientSitePage />
          }
        />
        <Route
          path="devis"
          element={storedClientSite ? <DevisPage /> : <ClientSitePage />}
        />
        <Route
          path="factures"
          element={storedClientSite ? <FacturesPage /> : <ClientSitePage />}
        />
        <Route
          path="viewerPDF"
          element={storedClientSite ? <ViewerPDFPage /> : <ClientSitePage />}
        />{" "}
        <Route
          path="viewerDOC"
          element={storedClientSite ? <ViewerWordPage /> : <ClientSitePage />}
        />
        <Route
          path="viewerIMG"
          element={storedClientSite ? <ViewerImagePage /> : <ClientSitePage />}
        />
      </Routes>
    );
  };

  const SmallDown = () => {
    return (
      <Breakpoint small down>
        <TopBarMenu
          accountName={account}
          handleDeconnexion={handleDeconnexion}
        />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <AppRoutes />
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
            <TopBarMenu
              accountName={account}
              handleDeconnexion={handleDeconnexion}
            />
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
        value={{ storedClientSite, setClientSite, removeclientSite }}
      >
        <ParametresContext.Provider value={listeParamsCookie[listParamName]}>
          <ViewerContext.Provider
            value={{ viewerURL, setViewer, removeViewer }}
          >
            <Router>

              <BreakpointProvider>
                <SmallDown />
                <LargeUp />
              </BreakpointProvider>
            </Router>
          </ViewerContext.Provider>
        </ParametresContext.Provider>
      </ClientSiteContratContext.Provider>
    </TokenContext.Provider>
  );
}

export default App;
