//#region Imports
import React, { useContext, useEffect, useState } from "react";
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

import logo from "../../image/imageHome/logo_blanc.png";

import { ClientSiteContratContext } from "../../App";
import { GetURLWs } from "../../axios/WS_User";
import { ReactComponent as LogoNoir } from "../../image/imageLogin/login-gandara-propulsee-noir.svg";
import { faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//#endregion

//#endregion

//#endregion

const SideBarMenuLeft = () => {
  const ClientSiteCt = useContext(ClientSiteContratContext);

  const _maintenance = ClientSiteCt.storedClientSite.DroitAccesMaintenance;
  const _sav = ClientSiteCt.storedClientSite.DroitAccesDepannage;
  const _devis = ClientSiteCt.storedClientSite.DroitAccesDevis;
  const _facture = ClientSiteCt.storedClientSite.DroitAccesFactures;


  //#region States
  const [logoClient, setLogoClient] = useState(null);
  //#endregion

  //#region Fonctions

  const GetLogo = async () => {

    let _b64LocalStorage = localStorage.getItem("logoClient");
    if (_b64LocalStorage) {
      //Le logo est enregistré
      setLogoClient(_b64LocalStorage);
    } else {
      //On va aller rechercher le logo via WS (si url cannonique)
      const FetchSetLogoWS = (data) => {
        if (data && data?.logoClient?.includes("data:image/png;base64,")) {
          localStorage.setItem("logoClient", data.logoClient);
          setLogoClient(data.logoClient);
        } else {
          //Impossible de récupérer le log : on affiche par defaut.
          setLogoClient(logo);
        }

      }

      await GetURLWs(window.location.host, FetchSetLogoWS);

    }


  }


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
                src={logoClient}
                className="d-inline-block align-top img-logo"
              />
            </Container>
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content sidebar-gmao">
          <CDBSidebarMenu>
            <MenuNavLink href={"/"} icon={"home"} text={"Accueil"} />
            {(_maintenance) && <MenuNavLink
              href={"/maintenance"}
              icon={"calendar"}
              text={"Maintenance"}
            />}
            {(_sav) && <MenuNavLink
              href={"/interventions"}
              icon={"wrench"}
              text={"Dépannage"}
            />}
            {(_devis) && <MenuNavLink href={"/devis"} icon={"book"} text={"Devis"} />}
            {(_facture) && <MenuNavLink href={"/factures"} icon={"file"} text={"Factures"} />}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        {/* Bouton gestion des cookies */}
        <div className="sidebar-footer">
          <Button
            variant=""
            id="tarteaucitron"
            className="cookies-btn"
          >
            <FontAwesomeIcon icon={faCookieBite} /> Gestion des cookies
          </Button>

          <div className="container-powered-by">
            <p className="text-center text-powered-by">Application propulsée <br /> par</p>
            <LogoNoir className="d-inline-block align-top svg-powered-by" />
          </div>
        </div>
      </CDBSidebar>
    );
  };



  useEffect(() => {

    GetLogo();

    //eslint-disable-next-line
  }, [])


  return (
    <div className="container-sidebar">
      <Sidebar />
    </div>
  );
};

export default SideBarMenuLeft;
