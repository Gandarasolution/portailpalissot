import React, { useState } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  // CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import { NavLink } from 'react-router-dom';

const Sidebar = () => {

  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openDepannage, setOpenDepannage] = useState(false);

  return (
    // <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#333" backgroundColor="#fff" >
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'primary' }}>
            GANDARA - DEMO
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>

          <Button variant='btCollapseMenu' onClick={() => setOpenMaintenance(!openMaintenance)} aria-controls="collapse-maintenance"  aria-expanded={openMaintenance}>
            
                     <CDBSidebarMenuItem icon="cog">
          Maintenance
         
         </CDBSidebarMenuItem>
            </Button>


         <Collapse in={openMaintenance}>
        <div id="collapse-maintenance" className='container' >
          <NavLink exact to="/maintenance/contrat" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="file-alt">Contrat</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/maintenance/documents" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="folder">Documents</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/maintenance/appareils" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="mobile-alt">Appareils</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/maintenance/prestations" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="chart-bar">Suivi des prestations</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/maintenance/factures" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list-alt">Factures</CDBSidebarMenuItem>
              </NavLink>
          </div>
      </Collapse>

              
                
              <Button variant='btCollapseMenu' onClick={() => setOpenDepannage(!openDepannage)} aria-controls="collapse-depannage"  aria-expanded={openDepannage}>
                <CDBSidebarMenuItem icon="wrench">Dépannage              </CDBSidebarMenuItem>

                
                
                </Button>
            
              <Collapse in={openDepannage}>
        <div id="collapse-depannage" className='container' >
          <NavLink exact to="/depannage/demandes" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="phone">Demandes</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/depannage/interventions" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="truck">Interventions</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/depannage/appareils" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="mobile-alt">Appareils</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/depannage/devis" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="clock">Devis en attente</CDBSidebarMenuItem>
              </NavLink>
              <NavLink exact to="/depannage/factures" activeClassName="activeClicked">
                <CDBSidebarMenuItem icon="list-alt">Factures</CDBSidebarMenuItem>
              </NavLink>
          </div>
      </Collapse>

      


          </CDBSidebarMenu>
        </CDBSidebarContent>

        {/* <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            powered by Gandarasolution
          </div>
        </CDBSidebarFooter> */}
      </CDBSidebar>
    // </div>
  );
};


export default Sidebar;