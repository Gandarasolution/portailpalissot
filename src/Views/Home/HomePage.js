//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";

//#endregion

//#region Components
import WhiteShadowCard from "../../components/commun/WhiteShadowCard";

//#endregion

import React from "react";
import Button from "react-bootstrap/Button";
// import { VoirDocument } from "../../axios/WSGandara";
//#endregion

const HomePage = () => {
  const handleClick = () => {
    // const name = "CERFA.pdf";
    // VoirDocument(b64, name);
  };

  return (
    <Container fluid>
      <WhiteShadowCard icon="yin-yang" title="Portail GMAO">
        <Button onClick={handleClick}>Clicke</Button>
      </WhiteShadowCard>
    </Container>
  );
};

export default HomePage;
