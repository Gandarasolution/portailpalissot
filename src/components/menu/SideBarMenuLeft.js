//#region Imports
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

//#region Contrast
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";

//#endregion

//#region Bootstrap

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";

//#endregion

//#region Interne

import logo from "../../image/imageHome/logo_blanc.png";
import { ClientSiteContratContext } from "../../App";

//#endregion

//#endregion

//#endregion

const SideBarMenuLeft = () => {
  //#region States
  const ClientSiteCt = useContext(ClientSiteContratContext);
  //#endregion

  //#region Fonctions
  const handleCookies = () => {
    alert("Gestion des cookies");
  };
  //#endregion

  //#region Evenements

  //#endregion

  //#region Components



  const MenuNavLink = ({ href, text, icon }) => {


    if(href === "/maintenance")
    {
      if(ClientSiteCt.storedClientSite.IdContrat <= 0 )
      {
        return;
      }

    }

    
    return (
      <NavLink to={href}>
        <CDBSidebarMenuItem icon={icon} iconSize="xl">
          {text}
          
        </CDBSidebarMenuItem>
      </NavLink>
    );
  };

  //#endregion

  const Sidebar = () => {
    return (
      <CDBSidebar
        className="sidebar-gmao "
        backgroundColor={"#fff"}
        breakpoint={992}
        fluid
      >
        <CDBSidebarHeader>
          <a
            href="/"
            className="text-decoration-none"
            style={{ backgroundColor: "#ba1d59" }}
          >
            <Container>
              <img
                alt=""
                src={logo}
                width="80"
                height="80"
                className="d-inline-block align-top img-logo"
              />
            </Container>
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content sidebar-gmao">
          <CDBSidebarMenu>
          <MenuNavLink href={"/"} icon={"home"} text={"Accueil"} />
           <MenuNavLink href={"/maintenance"} icon={"calendar"} text={"Maintenance"} />
            <MenuNavLink
              href={"/interventions"}
              icon={"wrench"}
              text={"Dépannage"}
            />
            {/* <MenuNavLink
              href={"/appareils"}
              icon={"mobile"}
              text={"Appareils"}
            /> */}
            <MenuNavLink href={"/devis"} icon={"book"} text={"Devis"} />
            <MenuNavLink href={"/factures"} icon={"file"} text={"Factures"} />
          </CDBSidebarMenu>
        </CDBSidebarContent>

          {/* Bouton gestion des cookies */}
          <div className="sidebar-footer">
          <Button
            variant=""
            className="cookies-btn"
            onClick={handleCookies}
          >
            <FontAwesomeIcon icon={faCookieBite} /> Gestion des cookies
          </Button>
        </div>
      </CDBSidebar>
    );
  };

  return (
    <div className="container-sidebar">
      <Sidebar />
    </div>
  );
};

export default SideBarMenuLeft;
