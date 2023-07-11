import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

const WaiterPage = () => {
  document.title = "Un instant...";
  return (
    <Container fluid>
      <Row className="align-items-center viewport-height ">
        <Col
          md={{ span: 4, offset: 4 }}
          className="container-login-content waiting"
        >
          <div>
            <h1>Veuillez patientez...</h1>
          </div>
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="dark" />
        </Col>
      </Row>
    </Container>
  );
};

export default WaiterPage;
