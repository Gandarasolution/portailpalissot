//#region Imports

//#region Bootstrap
import {   Container } from "react-bootstrap";

//#endregion

//#region Components
import WhiteShadowCard from "../../components/commun/WhiteShadowCard";

//#endregion

import React from "react";
//#endregion


const HomePage =  () => {


  return (
    <Container fluid>
      <WhiteShadowCard icon="yin-yang" title="Portail GMAO">
      </WhiteShadowCard>

    </Container>
  );
};

export default HomePage;
