//#region Imports

//#region Bootstrap
import Container from "react-bootstrap/Container";

//#endregion

//#region Components

//#endregion

import React from "react";
//#endregion

const ErrorPage = () => {
  document.title = "Une erreur est survenue";
  return <Container fluid>Une erreur s'est produite :(</Container>;
};

export default ErrorPage;
