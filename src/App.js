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
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { createContext } from "react";
//#endregion

library.add(faFileAlt, faSearch, faClock, faCalendarPlus, faYinYang, faFolder);

export const TokenContext = createContext(null);
export const SiteContext = createContext(null);



function App() {

const [site, setSite] = useState({IdSite: 2, NomSite: "Madame LUCOT Marguerite"})

  const storedJwt = sessionStorage.getItem("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  function setToken(token) {
    sessionStorage.setItem("token", token);
    setJwt(token);
  }

  if (!jwt) {
    return (
      <div className="App font-link background">
        <LoginPage setToken={setToken} />
      </div>
    );
  }

  return (
    <TokenContext.Provider value={jwt}>
      <Router>
        <div className="App font-link background">
          <SiteContext.Provider value={site}>
            <NavbarMenu setSite={setSite} />
          </SiteContext.Provider>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/maintenance/contrat" element={<ContratPage />} />
            <Route path="/maintenance/appareils" element={<AppareilsPage />} />
            <Route
              path="/depannage/interventions"
              element={<InterventionPage />}
            />
          </Routes>
        </div>
      </Router>
    </TokenContext.Provider>
  );
}

export default App;
