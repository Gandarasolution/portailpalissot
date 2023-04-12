//#region Imports
import './App.css';

//#region Bootstrap

//#endregion

//#region Components
import Sidebar from './components/menu/SidebarMenu';
import LoginPage from './Views/Login/login';
import HomePage from './Views/Home/HomePage';
import ContratPage from './Views/Maintenance/Contrat/ContratPage';
//#endregion

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt, faSearch, faClock, faYinYang } from '@fortawesome/free-solid-svg-icons';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
//#endregion


library.add(faFileAlt, faSearch, faClock, faYinYang)


function App() {
  return (

    <Router>
      <div className='App'>

        <Sidebar>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/maintenance/contrat" element={<ContratPage />} />


          </Routes>
        </Sidebar>




      </div>
    </Router>






  );
}

export default App;
