import Container from "react-bootstrap/Container";
import { ULRDeplace } from "../../functions";

const ViewerWord = () => {
  document.title = "Document WORD";
  const queryParameters = new URLSearchParams(window.location.search);
  let _urlToOpen = ULRDeplace(queryParameters.get("urlToOpen"));

  _urlToOpen = _urlToOpen.replace(/"/g, "");

  return <Container fluid>Viewer !{_urlToOpen}</Container>;
};

export default ViewerWord;
