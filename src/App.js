//#region Imports
import './App.css';

//#region Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//#endregion

//#region Components
// import SidebarMenu from 'react-bootstrap-sidebar-menu';
import NavbarMenu from './components/menu/navbarMenu';
// import LoginPage from './Views/Login/login';
import HomePage from './Views/Home/HomePage';
import ContratPage from './Views/Maintenance/Contrat/ContratPage';
//#endregion

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faSearch, faClock, faCalendarPlus, faYinYang, faFolder } from '@fortawesome/free-solid-svg-icons';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//#endregion


library.add(faFileAlt, faSearch, faClock,faCalendarPlus, faYinYang, faFolder)

export const SiteContext = React.createContext(null);




function App() {







  return (

    <Router>
      <div className='App'>
          <NavbarMenu/>



          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/maintenance/contrat" element={<ContratPage />} />


          </Routes>




      </div>
    </Router>






  );
}

export default App;
