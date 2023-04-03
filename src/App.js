import './App.css';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from './Views/Login/login';
import HomePage from './Views/Home/HomePage';
import Sidebar from './components/menu/SidebarMenu';
import ContratPage from './Views/Maintenance/Contrat/ContratPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFileAlt,faSearch, faClock } from '@fortawesome/free-solid-svg-icons';


library.add(faFileAlt,faSearch,faClock)


function App() {
  return (

    <Router>
      <div className='App'>



        <Routes>


          <Route path="/" element={<Sidebar vue={<HomePage />} />} />
          
          <Route path="/maintenance/contrats" element={<Sidebar vue={<ContratPage/>}/>} />

          <Route path="/maintenance/contrat/:idContrat" element={<Sidebar vue={<ContratPage/>}/>} />
          <Route path="/login" element={<LoginPage />} />


        </Routes>
      </div>
    </Router>




  );
}

export default App;
