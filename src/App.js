//#region Imports
import "./App.css";
//#region Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//#endregion

//#region Components
import NavbarMenu from "./components/menu/navbarMenu";
import HomePage from "./Views/Home/HomePage";
import ContratPage from "./Views/Maintenance/Contrat/ContratPage";
import AppareilsPage from "./Views/Maintenance/Appareils/AppareilsPage";
import InterventionPage from "./Views/Depannage/Interventions/InterventionsPage";
import LoginPage from "./Views/Login/LoginPage";
//#endregion

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFileAlt,
  faSearch,
  faClock,
  faCalendarPlus,
  faYinYang,
  faFolder,
} from "@fortawesome/free-solid-svg-icons";

import React from "react";
import { useState, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NouvelleInterventionPage from "./Views/Depannage/Interventions/NouvelleInterventionPage";
import FacturesPage from "./Views/Factures/FacturesPage";
import { GetListeParametres } from "./axios/WSGandara";

//#endregion

library.add(faFileAlt, faSearch, faClock, faCalendarPlus, faYinYang, faFolder);

//#region Context
export const TokenContext = createContext(null);

export const ListeClientSiteContratContext = createContext(null);
export const ClientSiteContratContext = createContext(null);

export const ParametresContext = createContext([]);
//#endregion
function App() {
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

  const [arrayParams, setArrayParams] = useState([]);
  const RecupererParams = async () => {
    const FetchSetParams = (data) => {
      setArrayParams(data);
    };
    await GetListeParametres(jwt, FetchSetParams);
  };

  //#endregion

  //#region Token
  const storedJwt = sessionStorage.getItem("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  function setToken(token) {
    sessionStorage.setItem("token", token);
    setJwt(token);
  }

  const handleDeconnexion = () => {
    sessionStorage.removeItem("token");
    setJwt(null);
  };

  if (!jwt) {
    return (
      <ListeClientSiteContratContext.Provider
        value={{ storedListe, setListe, storedClientSite, setClientSite }}
      >
        <div className="App font-link background">
          <LoginPage setToken={setToken} getSetParams={RecupererParams} />
        </div>
      </ListeClientSiteContratContext.Provider>
    );
  }

  //#endregion

  return (
    <TokenContext.Provider value={jwt}>
      <ClientSiteContratContext.Provider
        value={{ storedClientSite, setClientSite, storedListe }}
      >
        <ParametresContext.Provider value={[{k:"TelUrgenceIntervention", v:"01 02 03 04 05"}]}>
        <Router>
          <div className="App font-link background">
            <NavbarMenu handleDeconnexion={handleDeconnexion} />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/factures" element={<FacturesPage />} />
              <Route path="/maintenance/contrat" element={<ContratPage />} />
              <Route
                path="/maintenance/appareils"
                element={<AppareilsPage />}
              />
              <Route
                path="/depannage/interventions"
                element={<InterventionPage />}
              />{" "}
              <Route
                path="/depannage/nouvelleintervention"
                element={<NouvelleInterventionPage />}
              />
            </Routes>
          </div>
        </Router>
        </ParametresContext.Provider>

      </ClientSiteContratContext.Provider>
    </TokenContext.Provider>
  );
}

export default App;
