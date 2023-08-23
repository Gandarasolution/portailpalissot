//#region Imports
import React from "react";
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

//#endregion

//#region Interne

import logo from "../../image/favicon.ico";

//#endregion

//#endregion

//#endregion

const SideBarMenuLeft = () => {
  //#region States

  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  //#endregion

  //#region Components

  const MenuNavLink = ({ href, text, icon }) => {
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
        backgroundColor={"#282c34"}
        breakpoint={992}
        fluid
      >
        <CDBSidebarHeader>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            <Container>
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
              />
              GMAO
            </Container>
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content sidebar-gmao">
          <CDBSidebarMenu>
            <MenuNavLink href={"/"} icon={"home"} text={"Accueil"} />
            <MenuNavLink
              href={"/maintenance"}
              icon={"calendar"}
              text={"Maintenance"}
            />

            <MenuNavLink
              href={"/interventions"}
              icon={"wrench"}
              text={"Dépannage"}
            />
            <MenuNavLink
              href={"/appareils"}
              icon={"mobile"}
              text={"Appareils"}
            />
            <MenuNavLink href={"/devis"} icon={"book"} text={"Devis"} />
            <MenuNavLink href={"/factures"} icon={"file"} text={"Factures"} />
          </CDBSidebarMenu>
        </CDBSidebarContent>
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
