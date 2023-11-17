import { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeMDP } from "../../axios/WSGandara";

const ChangeMDPPage = () => {

const {token} = useParams()
const navigate = useNavigate()
const [newMdp, setNewMdp] = useState('')
const [newMdp2, setNewMdp2] = useState('')
const [alertVisible, setAlertVisible] = useState(false)
const [textalert,setTextAlert] = useState("")


if(token.length <= 2)
{
  setTextAlert("Le jeton n'est pas valide. Veuillez recommencer votre demande");
  setAlertVisible(true);
}


const SubmitNewMDP = () => {

  if(newMdp.length > 0 && newMdp === newMdp2) 
  {
    const FetchSetData =(data) => {
       console.log(data)
      if(data === 1)
      {
        //Redirection connexion
        navigate("/");
      }else if(data === 0)
      {
        setTextAlert("La demande n'est plus valide. Veuillez recommencer votre demande");
        setAlertVisible(true);
      }else {
        setTextAlert("Une erreur s'est produite. Veuillez recommencer votre demande ultérieurement.");
        setAlertVisible(true);
      }
    }
    ChangeMDP(token, newMdp,FetchSetData)

  }else {
    setAlertVisible(true)
    setTextAlert("Les mots de passes ne sont pas identiques")
  }


}




  return (
    <Container>
      
      <Form onSubmit={() => SubmitNewMDP()} > 
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nouveau mot de passe</Form.Label>
          <Form.Control type="password"  value={newMdp} onChange={(e)=> setNewMdp(e.target.value)} required />
          {/* <Form.Text className="text-muted">
          Merci de renseigner votre nouveau mot de passe
        </Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Confirmer votre nouveau mot de passe</Form.Label>
          <Form.Control type="password" value={newMdp2} onChange={(e)=> setNewMdp2(e.target.value)} required  />
          {/* <Form.Text className="text-muted">
          Merci de renseigner votre nouveau mot de passe
        </Form.Text> */}
        </Form.Group>
        <Alert  variant={'danger'} show={alertVisible} >
          {textalert}
        </Alert>
        <Button variant="primary" type="submit">
          Changer de mot de passe
        </Button>
      </Form>
    </Container>
  );
};

export default ChangeMDPPage;
