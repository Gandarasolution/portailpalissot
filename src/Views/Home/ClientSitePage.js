//#region Imports
import { useContext, useEffect, useState } from "react";

//#region FontAwsome
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faEnvelope,
//   faLocationDot,
//   faPhone,
// } from "@fortawesome/free-solid-svg-icons";
//#endregion

//#region Bootstrap
import Container from "react-bootstrap/Container";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Col from "react-bootstrap/Col";
// import Placeholder from "react-bootstrap/Placeholder";
// import Row from "react-bootstrap/Row";
// import Table from "react-bootstrap/Table";
// import Form from "react-bootstrap/Form";

//#endregion

//#region Components
import {
  GetClientSiteContrat,
} from "../../axios/WS_User";
import { ClientSiteContratContext, TokenContext } from "../../App";
import { useNavigate } from "react-router-dom";
import TableData, {
  CreateFilter,
  CreateNewCell,
  CreateNewHeader,
} from "../../components/commun/TableData";
import { IsUserFromToken } from "../../functions";

//#endregion

//#endregion

const ClientSitePage = ({ setPageSubtitle, setPageTitle }) => {

  const navigate = useNavigate();

  const tokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);

  //#region States

  const [listeClientSite, setListeClientSite] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isUser, setIsUser] = useState(false);
  //eslint-disable-next-line
  const [search, setSearch] = useState("");

  //#endregion

  //#region Fonctions

  function GetDataTrimed() {
    let _data = JSON.parse(JSON.stringify(listeClientSite));

    if (!Array.isArray(_data)) {
      // let _data2 = new Array();
      let _data2 = [];
      _data2.push(_data);
      _data = _data2;
    }

    if (search.length > 0) {
      const filteredData = _data.filter(
        (f) =>
          f.NomCompletClientSite.toUpperCase().includes(search.toUpperCase()) ||
          (ClientSiteCt.storedClientSite &&
            f.GUID === ClientSiteCt.storedClientSite.GUID)
      );

      _data = filteredData;
    }

    if (ClientSiteCt.storedClientSite) {
      let _tempArray = JSON.parse(JSON.stringify(_data)).filter(
        (cs) => cs.GUID === ClientSiteCt.storedClientSite.GUID
      );

      let _tempWithout = JSON.parse(JSON.stringify(_data)).filter(
        (cs) => cs.GUID !== ClientSiteCt.storedClientSite.GUID
      );

      _data = _tempArray.concat(_tempWithout);
    }
    return _data;
  }


  function GetClientSites() {
    setIsLoaded(false);

    const FetchSetClientSite = (data) => {
      if(data && data === "user")
      {
        setIsUser(true);
        data = [];
      }
      setListeClientSite(data);
      if (!Array.isArray(data)) {
        ClientSiteCt.setClientSite(data);
        navigate("/");
      }
      // Si un site est tagué comme étant le dernier visité, le selectionner
      if (!ClientSiteCt.storedClientSite) {

        var _found = data.find((e) => e.IsLastSiteVisite);
        if (_found) {
          ClientSiteCt.setClientSite(_found);
        }

      }
      setPageSubtitle(`${data.length > 1 ? data.length : 1}`);
      setIsLoaded(true);

    };

    if(IsUserFromToken(tokenCt))
    {
      FetchSetClientSite("user");
    }else {
      GetClientSiteContrat(tokenCt, FetchSetClientSite);
    }

  }

  //#endregion

  //#region Evenements

  //#endregion

  //#region Composants

  //#region Table
  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader(
        "NomCompletClientSite",
        CreateFilter(true, false, false, true),
        "Site"
      )
    );
    _headers.push(
      CreateNewHeader(
        "AdresseClientSite",
        CreateFilter(true, false, false, true),
        "Adresse"
      )
    );
    _headers.push(
      CreateNewHeader(
        "IdContrat",
        CreateFilter(true, false, false, true),
        "N° de contrat"
      )
    );

    return _headers;
  }


  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(CreateNewCell("NomCompletClientSite", false, true, true, null, "tagListeSite"));
    _cells.push(CreateNewCell("AdresseClientSite", false, true, true, null, "tagListeSite"));
    _cells.push(CreateNewCell("IdContrat", false, true, true, null, "tagListeSite"));

    return _cells;
  }

  const TableSites = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();


  const FetchSetUserClientSite = (data) => {
    setListeClientSite(data);
    if (!Array.isArray(data)) {
      ClientSiteCt.setClientSite(data);
      navigate("/");
    }
  }

    return (
      <TableData
        Data={GetDataTrimed()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        Pagination
        IsUser={isUser}
        UserClientSite={FetchSetUserClientSite}
      />
    );
  };

  //#endregion


  //#endregion

  useEffect(() => {
    document.title = "Liste des sites";

    setPageTitle("Liste des sites");

    if (!isLoaded) {
      GetClientSites();
    }

    // eslint-disable-next-line
  }, [isLoaded]);



  return (
    <Container fluid>
      <Container fluid className="table-sites">
        <TableSites />
      </Container>
    </Container>
  );
};

export default ClientSitePage;
