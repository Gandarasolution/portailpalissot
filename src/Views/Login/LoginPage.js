//#region Imports

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";

//#region Bootstrap

//#endregion

//#region Components

//#endregion

//#endregion

const LoginPage = (props) => {
  //#region States

  const [revealed, setRevealed] = useState(false);

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

  //#endregion

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="formLogin">
          <Form.Label>Identifiant</Form.Label>
          <Form.Control type="email" placeholder="identifiant@exemple.com" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control
              type={revealed ? "text" : "password"}
              placeholder="Mot de passe"
            />
            <Button onClick={() => handleRevaledPassword()}>
              <FontAwesomeIcon icon={revealed ? faEyeSlash : faEye} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Button variant="primary" type="submit"  onClick={() => props.setToken("rr")} >
          Connexion
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
