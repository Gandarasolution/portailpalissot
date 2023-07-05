import { Container } from "react-bootstrap";
import { ULRDeplace } from "../../functions";



const ViewerWord = () => {
    const queryParameters = new URLSearchParams(window.location.search)
    let _urlToOpen = ULRDeplace(queryParameters.get("urlToOpen"))

    _urlToOpen= _urlToOpen.replace(/"/g,"");
   

return <Container fluid className="h-100">

        Viewer ! 
       
{_urlToOpen}

    </Container>

}



export default ViewerWord;
