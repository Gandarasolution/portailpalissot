//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";

//#endregion

//#region Components
import WhiteShadowCard from "../../components/commun/WhiteShadowCard";

//#endregion

import React from "react";
//#endregion

const ErrorPage = () => {
  
  return (
    <Container fluid>
      <WhiteShadowCard icon="yin-yang" title="Portail GMAO">
        Une erreur s'est produite :(
      </WhiteShadowCard>
    </Container>
  );
};

export default ErrorPage;
