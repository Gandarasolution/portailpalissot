//#region Imports

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const LoginPage = (props) => {
  //#region States

  const [revealed, setRevealed] = useState(false);

  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("");

  //#endregion

  //#region Fonctions

  //#endregion

  //#region Evenements

  const handleRevaledPassword = () => {
    let _revealed = !revealed;
    setRevealed(_revealed);
  };
  //#endregion

  //#region Composants

  const FormSubmit = () => {
    return (
      <Form className="m-4" onSubmit={() => props.setToken("@")}>
        {/* <Form className="m-4"  onSubmit={()=> console.log(password)} > */}
        <Form.Group className="mb-3" controlId="formLogin">
          <Form.Label>Identifiant</Form.Label>
          <Form.Control
            type="email"
            placeholder="identifiant@exemple.com"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              type={revealed ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="bt-eye-password"
              onClick={() => handleRevaledPassword()}
            >
              <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit">
          Connexion
        </Button>
      </Form>
    );
  };

  //#endregion

  return (
    <Container fluid className="h-100">
      <Row className="align-items-center viewport-height">
        <Col md={{ span: 4, offset: 4 }} className="container-login-content">
          <div>
            <h1>Connexion</h1>
            <hr />
          </div>
          {FormSubmit()}
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
