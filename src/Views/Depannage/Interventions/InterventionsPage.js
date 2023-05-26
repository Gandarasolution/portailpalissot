//#region Imports

import { Button, Col, Container, Table } from "react-bootstrap";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const InterventionPage = () => {
  //#region States

  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  //#endregion

  return (
    <Container fluid className="h-100">
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Interventions </span>|
        <span className="subtitle"> xxx interventions </span>
      </Col>

      <Container fluid className="container-table p-4">


      <div>
<Button>
  Nouvelle demande d'intervention
</Button>

      </div>

<Table>
<thead>
  <th>
    Date
  </th>
</thead>

</Table>




      </Container>
    </Container>
  );
};

export default InterventionPage;
