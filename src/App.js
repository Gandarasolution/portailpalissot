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
import { useState,createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


//#endregion

library.add(faFileAlt, faSearch, faClock, faCalendarPlus, faYinYang, faFolder);

//#region Context
export const TokenContext = createContext(null);
export const SiteContext = createContext(null);

export const ListeClientSiteContratContext = createContext(null);
export const ClientSiteContratContext = createContext(null);


//#endregion
function App() {





  //#region ClientSiteContrat



const storedListe = JSON.parse(localStorage.getItem("listeClientSiteContrat"));
// eslint-disable-next-line
const [listeClientSiteContrat, setListeClientSiteContrat] = useState([]);
const setListe = (liste)=> {
  localStorage.setItem("listeClientSiteContrat" , JSON.stringify(liste));
  setListeClientSiteContrat(liste);
}

const storedClientSite = JSON.parse(localStorage.getItem("clientSiteContrat"));
// eslint-disable-next-line
const [clientSiteContrat, setClientSiteContrat] = useState(null);
const setClientSite = (clientSite) => {
  localStorage.setItem("clientSiteContrat",JSON.stringify(clientSite));
  setClientSiteContrat(clientSite);
}

  //#endregion


  //#region Token
  const storedJwt = sessionStorage.getItem("token");
  const [jwt, setJwt] = useState(storedJwt || null);

  function setToken(token) {
    sessionStorage.setItem("token", token);
    setJwt(token);
  }

  if (!jwt) {
    return (
      <ListeClientSiteContratContext.Provider value={{storedListe, setListe, storedClientSite, setClientSite}} >

      <div className="App font-link background">
        <LoginPage setToken={setToken} />
      </div>
      </ListeClientSiteContratContext.Provider>
    );
  }

  //#endregion
  
  return (
    
    <TokenContext.Provider value={jwt}>
      <ClientSiteContratContext.Provider value={{storedClientSite, setClientSite, storedListe}} >

      <Router>
        <div className="App font-link background">
            <NavbarMenu />

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
      </ClientSiteContratContext.Provider>

    </TokenContext.Provider>
  );
}



// function App() {
//   const [name, setName] = useState("");
//   const [result, setResult] = useState("");

//   const handleChange = (e) => {
//       setName(e.target.value);
//   };

 


//   return (
//       <div className="App">
//           <form
//               action="http://localhost:8000/WSGandara.php"
//               method="post"
//               onSubmit={(event) => handleSumbit(event)}
//           >
//               <label htmlFor="name">Name: </label>
//               <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={name}
//                   onChange={(event) => handleChange(event)}
//               />
//               <br />
//               <button type="submit">Submit</button>
//           </form>
//           <h1>{result}</h1>
//       </div>
//   );

// }



export default App;
