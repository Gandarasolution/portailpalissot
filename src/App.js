import './App.css';

import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import LoginPage from './Views/Login/login';
import HomePage from './Views/Home/HomePage';
import Sidebar from './components/menu/SidebarMenu';
import ContratPage from './Views/Maintenance/Contrat/ContratPage';



function App() {
  return (

<Router>
<div className='App'>

  <Sidebar />

  <Routes>


    <Route path="/" element={<HomePage/>} />
    <Route path="/maintenance/contrat" element={<ContratPage/>} />
    <Route path="/login" exact element={<LoginPage/>} />


  </Routes>
  </div>
</Router>




  );
}

export default App;
