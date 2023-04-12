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
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ vue }) => {
const Sites = [{"id":1, "nom":"Agence"},{"id":2, "nom":"Immeuble"},{"id":3,"nom":"Maison"}];
const [siteSelect,setSiteSelect] = useState(Sites.at(0));

const OnDropdownSiteChanged =(e) => {
  setSiteSelect(Sites.find(s => s.id === e));
};


  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openDepannage, setOpenDepannage] = useState(false);

  return (
    <div style={{display: "flex", direction: "row"}}>
        <CDBSidebar textColor="#333" backgroundColor="#fff"  >
          <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <a href="/" className="text-decoration-none" style={{ color: 'primary' }}>
              GANDARA - DEMO
            </a>
          </CDBSidebarHeader>

          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>

            <DropdownButton
                            variant=''
                            title={`Site : ${siteSelect.nom}`}
                            id="dropdown-Site"
                            onSelect={(e)=> OnDropdownSiteChanged(e)}
                        >
                          {Sites.map((site)=> {
                            return(
                              <Dropdown.Item key={site.id} eventKey={site.id}>{site.nom}</Dropdown.Item>
                            )
                          })}
                            
                        </DropdownButton>

              <Button variant='btCollapseMenu' onClick={() => setOpenMaintenance(!openMaintenance)} aria-controls="collapse-maintenance" aria-expanded={openMaintenance}>

                <CDBSidebarMenuItem icon="cog">
                  Maintenance

                </CDBSidebarMenuItem>
              </Button>


              <Collapse in={openMaintenance}>
                <div id="collapse-maintenance" className='container' >
                  <NavLink exact="true" to="/maintenance/contrat" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="file-alt">Contrat</CDBSidebarMenuItem>
                  </NavLink>

                  <NavLink exact="true" to="/maintenance/documents" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="folder">Documents</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/maintenance/appareils" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="mobile-alt">Appareils</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/maintenance/prestations" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="chart-bar">Suivi des prestations</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/maintenance/factures" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="list-alt">Factures</CDBSidebarMenuItem>
                  </NavLink>
                </div>
              </Collapse>



              <Button variant='btCollapseMenu' onClick={() => setOpenDepannage(!openDepannage)} aria-controls="collapse-depannage" aria-expanded={openDepannage}>
                <CDBSidebarMenuItem icon="wrench">Dépannage              </CDBSidebarMenuItem>



              </Button>

              <Collapse in={openDepannage}>
                <div id="collapse-depannage" className='container' >
                  <NavLink exact="true" to="/depannage/demandes" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="phone">Demandes</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/depannage/interventions" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="truck">Interventions</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/depannage/appareils" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="mobile-alt">Appareils</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/depannage/devis" activeclassname="activeClicked">
                    <CDBSidebarMenuItem icon="clock">Devis en attente</CDBSidebarMenuItem>
                  </NavLink>
                  <NavLink exact="true" to="/depannage/factures" activeclassname="activeClicked">
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
        {vue}


      </div>


  );
};


export default Sidebar;