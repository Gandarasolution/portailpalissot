//#region Imports

//#region Bootstrap

//#endregion

//#region Components
import { Placeholder } from "react-bootstrap";
import WhiteShadowCard from "../../../../components/commun/WhiteShadowCard";

//#endregion

import React from "react";

//#endregion

const ContratInfo = ({ Contrat, IsLoaded }) => {
  return IsLoaded ? (
    <WhiteShadowCard icon="file-alt" title={`Contrat N° ${Contrat.IdContrat}`}>
      <div className="w-25 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            {" "}
            Souscrit le
          </p>
          <p className="m-0 my-1 p-0">{Contrat.DateSouscrit}</p>
        </div>
      </div>

      <div className="w-50 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Type
          </p>
          <p className="m-0 my-1 p-0">{Contrat.TypeContrat}</p>
        </div>
      </div>

      <div className="w-25 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Délai d'intervention
          </p>
          <p className="m-0 my-1 p-0">{Contrat.Delai}</p>
        </div>
      </div>

      <div className="w-25 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Indice d'actualisation
          </p>
          <p className="m-0 my-1 p-0">{Contrat.Indice}</p>
        </div>
      </div>

      <div className="w-50 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Type de facturation
          </p>
          <p className="m-0 my-1 p-0">{Contrat.TypeFacturation}</p>
        </div>
      </div>
    </WhiteShadowCard>
  ) : (
    <WhiteShadowCard icon="file-alt" title={"Contrat"}>
      <div className="w-25 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Souscrit le
          </p>
          <p className="m-0 my-1 p-0">
            <Placeholder animation="glow">
              <Placeholder xs={4} />
            </Placeholder>
          </p>
        </div>
      </div>

      <div className="w-50 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Type
          </p>
          <p className="m-0 my-1 p-0">
            <Placeholder animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
          </p>
        </div>
      </div>

      <div className="w-25 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Délai d'intervention
          </p>
          <p className="m-0 my-1 p-0">
            <Placeholder animation="glow">
              <Placeholder xs={2} />
            </Placeholder>
          </p>
        </div>
      </div>

      <div className="w-25 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Indice d'actualisation
          </p>
          <p className="m-0 my-1 p-0">
            <Placeholder animation="glow">
              <Placeholder xs={3} />
            </Placeholder>
          </p>
        </div>
      </div>

      <div className="w-50 px-3 mb-3">
        <div className="border-bottom ">
          <p style={{ fontSize: "12px" }} className="m-0 p-0">
            Type de facturation
          </p>
          <p className="m-0 my-1 p-0">
            <Placeholder animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
          </p>
        </div>
      </div>
    </WhiteShadowCard>
  );
};

export default ContratInfo;
