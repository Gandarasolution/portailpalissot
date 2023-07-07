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
import HomePage from "./Views/Home/HomePage";
import ContratPage from "./Views/Maintenance/Contrat/ContratPage";
import AppareilsPage from "./Views/Maintenance/Appareils/AppareilsPage";
import InterventionPage from "./Views/Depannage/Interventions/InterventionsPage";
import NouvelleInterventionPage from "./Views/Depannage/Interventions/NouvelleInterventionPage";
import FacturesPage from "./Views/Factures/FacturesPage";
import WaiterPage from "./Views/Home/Waiter";
import ErrorPage from "./Views/Home/Error";

//#endregion

//#region Composants
import NavbarMenu from "./components/menu/NavbarMenu";
import SideBarMenuLeft from "./components/menu/SideBarMenuLeft";

//#endregion

//#endregion



//#region React
import { React, useState, createContext } from "react";

import { useCookies } from "react-cookie";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//#endregion

import PageTest from "./Views/Home/Test";
import ViewerWord from "./Views/Viewer/ViewerWord";
import DevisPage from "./Views/Devis/DevisPage";
import { Breakpoint, BreakpointProvider } from "react-socks";
import { Navbar } from "react-bootstrap";

//#endregion

// library.add(faFileAlt, faSearch, faClock, faCalendarPlus, faYinYang, faFolder);

//#region Context
export const TokenContext = createContext(null);

export const ListeClientSiteContratContext = createContext(null);
export const ClientSiteContratContext = createContext(null);

export const ParametresContext = createContext([]);

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

  const storedListe = JSON.parse(
    localStorage.getItem("listeClientSiteContrat")
  );
  // eslint-disable-next-line
  const [listeClientSiteContrat, setListeClientSiteContrat] = useState([]);
  const setListe = (liste) => {
    localStorage.setItem("listeClientSiteContrat", JSON.stringify(liste));
    setListeClientSiteContrat(liste);
  };

  const storedClientSite = JSON.parse(
    localStorage.getItem("clientSiteContrat")
  );
  // eslint-disable-next-line
  const [clientSiteContrat, setClientSiteContrat] = useState(null);
  const setClientSite = (clientSite) => {
    localStorage.setItem("clientSiteContrat", JSON.stringify(clientSite));
    setClientSiteContrat(clientSite);
  };

  //#endregion

  //#region Parametres

  const listParamName = cyrb53("listeParamsHashed").toString();
  const [listeParamsCookie, setListeParamsCookie, removeListeParamsCookie] =
    useCookies([listParamName]);

  function setListeParamsViaCookies(listeParams) {
    setListeParamsCookie(listParamName, listeParams);
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

  const handleDeconnexion = () => {
    removeTokenCookie(tokenName);
    removeListeParamsCookie(listParamName);
  };

  if (!tokenCookie[tokenName]) {
    return (
      <ListeClientSiteContratContext.Provider
        value={{ storedListe, setListe, storedClientSite, setClientSite }}
      >
        <div className="App font-link background">
          <LoginPage
            setToken={setTokenViaCookies}
            setParams={setListeParamsViaCookies}
          />
        </div>
      </ListeClientSiteContratContext.Provider>
    );
  }

  //#endregion

  const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/test" element={<PageTest />} />
        <Route path="/:lerest" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/waiting" element={<WaiterPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/viewerWord" element={<ViewerWord />} />
        <Route path="/contrat" element={<ContratPage />} />
        <Route path="/appareils" element={<AppareilsPage />} />
        <Route path="/interventions" element={<InterventionPage />} />
        <Route
          path="/nouvelleintervention"
          element={<NouvelleInterventionPage />}
        />
        <Route path="/devis" element={<DevisPage />} />
        <Route path="/factures" element={<FacturesPage />} />
      </Routes>
    );
  };

  return (
    <TokenContext.Provider value={tokenCookie[tokenName]}>
      <ClientSiteContratContext.Provider
        value={{ storedClientSite, setClientSite, storedListe }}
      >
        <ParametresContext.Provider value={listeParamsCookie[listParamName]}>
          <Router>
            <BreakpointProvider>
              <Breakpoint small down>
                <NavbarMenu handleDeconnexion={handleDeconnexion} />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />



                <AppRoutes />
              </Breakpoint>

              <Breakpoint medium up>
                <Row className="background">
                  <Col md={"auto"}>
                    <SideBarMenuLeft />
                  </Col>

                  <Col className="App font-link ">

                    <NavbarMenu handleDeconnexion={handleDeconnexion} />
                    <AppRoutes />
                  </Col>
                </Row>
              </Breakpoint>
            </BreakpointProvider>
          </Router>
        </ParametresContext.Provider>
      </ClientSiteContratContext.Provider>
    </TokenContext.Provider>
  );
}

export default App;
