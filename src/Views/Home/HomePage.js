//#region Bootstrap
import Container from "react-bootstrap/Container";
// import Button from "react-bootstrap/Button";

//#endregion

//#region Components
import TitreOfPage from "../../components/commun/TitreOfPage";

//#endregion

import React from "react";
import { Button, Image, Nav, NavLink } from "react-bootstrap";
import { useContext } from "react";
import { ClientSiteContratContext } from "../../App";
//#endregion

const HomePage = () => {
  const ClientSiteCt = useContext(ClientSiteContratContext);

  const ImgAppareil = require("../../image/imageHome/appareilImage.jpg");
  const ImgPresta = require("../../image/imageHome/PrestaContraImage.jpg");
  const ImgMaintenance = require("../../image/imageHome/MaintenanceImage.jpg");
  const ImgUrgence = require("../../image/imageHome/UrgenceImage.jpg");
  const ImgDevis = require("../../image/imageHome/DevisImage.jpg");
  const ImgFacture = require("../../image/imageHome/FacturationImage.jpg");
  const ImgAccount = require("../../image/imageHome/accountImage.jpg");

  const SpanLink = ({ title, to, img, kv, disable }) => {
    let _text = "";
    let _wBadge = false;

    if (kv) {
      switch (kv.k) {
        case "interventions":
          _text = `interventio${kv.v > 1 ? "ns" : "n"} en cours`;
          _wBadge = kv.v > 0;
          break;
        case "devis":
          _text = "devis en attente de décision";
          _wBadge = kv.v > 0;
          break;
        default:
          break;
      }
    }

    return (
      <Nav.Link href={to} disabled={disable ? true : false}>
        <div className="content  position-relative d-inline-block">
          <div>{title}</div>
          <div>
            <Image src={img} height={150} alt={`image-${to}`} />
          </div>
          {kv && kv.v > 0 && (
            <>
              <div className="position-absolute top-0 start-100 translate-middle p-2 circle-danger"></div>
              {_wBadge && (
                <div className=" badge badge-bg-danger-nowrap ">{`${kv.v} ${_text}`}</div>
              )}
            </>
          )}
          {disable}
        </div>
      </Nav.Link>
    );
  };

  return (
    <Container fluid className="p-4 h-100">
      <TitreOfPage
        titre={"Portail client"}
        soustitre={ClientSiteCt.storedClientSite.NomCompletClientSite}
        isLoaded
      />
      <Container fluid className="container-table ">
        <div>

        <h2>Bienvenue sur votre espace client !</h2>
        </div>

        <span className="m-2">
          <Nav>
            <Nav.Item>
              <SpanLink
                title={"Accéder à mes prestations contrats"}
                to={"/maintenance"}
                img={ImgPresta}
                disable={
                  ClientSiteCt.storedClientSite.IdContrat <= 0 ? (
                    <div className=" badge badge-bg-danger-nowrap ">
                      Aucun contrat actif
                    </div>
                  ) : undefined
                }
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Voir la liste des appareils enregistrés"}
                to={"/appareils"}
                img={ImgAppareil}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Consulter la liste des interventions réalisées"}
                to={"/interventions"}
                img={ImgMaintenance}
                kv={ClientSiteCt.storedClientSite.NbPortail.KV.find(
                  (kv) => kv.k === "interventions"
                )}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Demander une nouvelle intervention"}
                to={"/nouvelleIntervention"}
                img={ImgUrgence}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Voir mes devis"}
                to={"/devis"}
                img={ImgDevis}
                kv={ClientSiteCt.storedClientSite.NbPortail.KV.find(
                  (kv) => kv.k === "devis"
                )}
              />
            </Nav.Item>
            <Nav.Item>
              <SpanLink
                title={"Espace facturation"}
                to={"/factures"}
                img={ImgFacture}
              />

              <NavLink></NavLink>
            </Nav.Item>

            <Nav.Item>
              <SpanLink
                title={"Gérer mon compte"}
                to={"/account"}
                img={ImgAccount}
              />

              <NavLink></NavLink>
            </Nav.Item>
          </Nav>
        </span>
      </Container>
    </Container>
  );
};

export default HomePage;
