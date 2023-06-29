//#region Imports

import { useEffect, useState } from "react";

//#region Bootstrap
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

//#endregion

//#region Components
// import { GetNomMois, addOneYear, subOneYear } from "../../../functions";
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
} from "../../../components/commun/TableData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFile,} from "@fortawesome/free-solid-svg-icons";
import TitreOfPage from "../../../components/commun/TitreOfPage";
import { GetListeInterventions } from "../../../axios/WSGandara";
import { useContext } from "react";
import { ClientSiteContratContext, TokenContext } from "../../../App";
//#endregion

//#endregion

const InterventionPage = () => {
  const TokenCt = useContext(TokenContext);
  const ClientSiteCt = useContext(ClientSiteContratContext);
  //#region States

  const [isLoaded, setIsLoaded] = useState(false);
  const [listeInterventions, setListeInterventions] = useState([]);

  // const [dateDebutPeriode, setDateDebutPeriode] = useState(
  //   GetDatePeriodeInitial()
  // );

  //#endregion

  //#region Fonctions

  const GetData = async () => {
    setIsLoaded(false);
    const FetchSetData = (data) => {
      setListeInterventions(data);
      setIsLoaded(true);
    };

    await GetListeInterventions(
      TokenCt,
      ClientSiteCt.storedClientSite.IdClientSite,
      FetchSetData
    );
  };

  function GetListeInterventionsTrimed() {
    let _lInters = JSON.parse(JSON.stringify(listeInterventions));
    for (let index = 0; index < _lInters.length; index++) {
      const element = _lInters[index];
      element.DateFacture = element.DateFacture ? element.DateFacture : "";

element.LibEtat = JSON.parse(JSON.stringify(element.Etat.LibEtat));
element.VerrouEtat = JSON.parse(JSON.stringify(element.Etat.VerrouEtat));
    }

    return _lInters;
  }

  // /**
  //  * Construit la date de début des preriodes initial
  //  * @returns ([1] / [DateContratSouscrit.getMonth] / [Date.Now.getYear])
  //  */
  // function GetDatePeriodeInitial() {
  //   let _day = 1;
  //   // let _monthI = _dateContrat.getMonth();
  //   let _monthI = 0;
  //   let _year = new Date().getFullYear();
  //   let _DateRetour = new Date(_year, _monthI, _day);
  //   return _DateRetour;
  // }

  // const dateFinPeriode = () => {
  //   let _dateEndTmp = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));

  //   _dateEndTmp = addOneYear(_dateEndTmp);

  //   var day = _dateEndTmp.getDate() - 1;
  //   _dateEndTmp.setDate(day);

  //   return new Date(_dateEndTmp);
  // };


  function GetBGColorByLibEtat(LibEtat)
  {
    const  VerrouEtat = JSON.parse(JSON.stringify(listeInterventions)).find((f)=>{return String(f.Etat.LibEtat) === String(LibEtat)}).Etat.VerrouEtat;
    return GetBGColorByVerrouEtat(VerrouEtat);
  }
  function GetBGColorByVerrouEtat(VerrouEtat) {
    switch (VerrouEtat) {
      case 0:
        return "warning";
      case 1:
        return "primary";
      case 2:
        return "secondary";
      case 3:
        return "success";
      case 4:
        return "danger";
      default:
        break;
    }
  }

  function CreateHeaderForTable() {
    let _headers = [];
    _headers.push(
      CreateNewHeader(
        "DateDemandeDossierInterventionSAV",
        CreateFilter(true, true, false, false),
        "Date de la demande",
        EditorDateFromDateTime
      )
    );
    _headers.push(CreateNewHeader("DescriptionSecteur",CreateFilter(true, true,false,true),"Secteur"));
    _headers.push(
      CreateNewHeader(
        "IdDossierInterventionSAV",
        CreateFilter(true, true, false, true),
        "Code"
      )
    );
    _headers.push(
      CreateNewHeader(
        "DescriptionDossierInterventionSAV",
        CreateFilter(true, true, false, true),
        "Objet de la demande"
      )
    );
    _headers.push(
      CreateNewHeader("LibEtat", CreateFilter(true, true, false, false), "État")
    );

_headers.push(CreateNewUnboundHeader(false,"Action"));

    // _headers.push(
    //   CreateNewHeader(
    //     "IdFacture",
    //     CreateFilter(true, false, false, true),
    //     "N° facture"
    //   )
    // );
    // _headers.push(
    //   CreateNewHeader(
    //     "DateFacture",
    //     CreateFilter(true, true, false, true),
    //     "Date de la facture",
    //     EditorDateFromDateTime
    //   )
    // );

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell(
        "DateDemandeDossierInterventionSAV",
        false,
        false,
        false,
        EditorDateFromDateTime
      )
    );
    _cells.push(CreateNewCell("DescriptionSecteur", false, true,false));
    _cells.push(CreateNewCell("IdDossierInterventionSAV", true, true, false));
    _cells.push(
      CreateNewCell("DescriptionDossierInterventionSAV", true, true, false)
    );
    _cells.push(CreateNewCell("LibEtat", false, false, false, EditorEtat));
    _cells.push(CreateNewUnboundCell(false,false,true,EditorActionDocuments,"tagInterventionDocuments"))
   

    return _cells;
  }

function CreateButtonFilters(){
  let _bt = [];
  _bt.push(CreateNewButtonFilter("VerrouEtat",3,EditorFiltres));
  _bt.push(CreateNewButtonFilter("VerrouEtat",2,EditorFiltres));
  _bt.push(CreateNewButtonFilter("VerrouEtat",1,EditorFiltres));
      _bt.push(CreateNewButtonFilter("VerrouEtat",0,EditorFiltres));
      _bt.push(CreateNewButtonFilter("VerrouEtat",4,EditorFiltres));

   
  return _bt;
}

  // const GetIntersSearched = () => {
  //   let _llisteInterventions = listeInterventions;

  //   if (search.length > 0) {
  //     _llisteInterventions = _llisteInterventions.filter(
  //       (item) =>
  //         item.LibelleDossierIntervention.toUpperCase().includes(
  //           search.toUpperCase()
  //         ) ||
  //         `DI${item.IdDossierIntervention.toString().toUpperCase()}`.includes(
  //           search.toUpperCase()
  //         ) ||
  //         (item.IdFacture &&
  //           `F${item.IdFacture.toString().toUpperCase()}`.includes(
  //             search.toUpperCase()
  //           ))
  //     );
  //   }

  //   _llisteInterventions = _llisteInterventions.sort(
  //     (a, b) => a.DateDemande - b.DateDemande
  //   );

  //   return _llisteInterventions;
  // };

  //#endregion

  //#region Evenements
  // const AjouterUnAnPeriode = async () => {
  //   let _dateTMP = dateDebutPeriode;
  //   _dateTMP = addOneYear(_dateTMP);
  //   let _dateDebutPeriode = new Date(_dateTMP);
  //   setDateDebutPeriode(_dateDebutPeriode);

  //   // setIsLoadedPresta(false);
  //   // await FetchDataPrestation();
  // };

  // const SoustraireUnAnPeriode = async () => {
  //   let _dateTMP = dateDebutPeriode;
  //   _dateTMP = subOneYear(_dateTMP);
  //   let _dateDebutPeriode = new Date(_dateTMP);
  //   setDateDebutPeriode(_dateDebutPeriode);
  //   // setIsLoadedPresta(false);

  //   // await FetchDataPrestation();
  // };

  // const HandleDropdownPeriodeSelect = async (dateStart) => {
  //   let _dateTemp = new Date(dateStart);

  //   setDateDebutPeriode(_dateTemp);
  //   // setIsLoadedPresta(false);

  //   // await FetchDataPrestation();
  // };

  //#endregion

  //#region Component

  // const DropDownYears = (small) => {
  //   let _dateDebut = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
  //   let _dateEnd = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
  //   let _arrayPeriodes = [
  //     {
  //       dateStart: new Date(_dateDebut),
  //       dateEnd: new Date(_dateEnd.setMonth(_dateDebut.getMonth() + 11)),
  //     },
  //   ];

  //   for (let index = 0; index < 10; index++) {
  //     let _dateStart = addOneYear(new Date(_arrayPeriodes[index].dateStart));
  //     let _dateEnd = addOneYear(new Date(_arrayPeriodes[index].dateEnd));

  //     _arrayPeriodes.push({ dateStart: _dateStart, dateEnd: _dateEnd });
  //   }

  //   return (
  //     <DropdownButton
  //       variant=""
  //       className="button-periode"
  //       drop="down-centered"
  //       style={{ borderRadius: "10px" }}
  //       id="dropdown-datePeriode"
  //       title={`Période : ${GetNomMois(dateDebutPeriode.getMonth() + 1, small)}
  //             ${dateDebutPeriode.getFullYear()} à
  //             ${GetNomMois(dateFinPeriode().getMonth() + 1, small)}
  //             ${dateFinPeriode().getFullYear()}`}
  //       onSelect={(e) => {
  //         HandleDropdownPeriodeSelect(e);
  //       }}
  //     >
  //       {_arrayPeriodes.map((periode, index) => {
  //         return (
  //           <Dropdown.Item key={index} eventKey={periode.dateStart}>
  //             {` ${GetNomMois(
  //               periode.dateStart.getMonth() + 1
  //             )} ${periode.dateStart.getFullYear()} à ${GetNomMois(
  //               periode.dateEnd.getMonth() + 1
  //             )} ${periode.dateEnd.getFullYear()}`}
  //           </Dropdown.Item>
  //         );
  //       })}
  //     </DropdownButton>
  //   );
  // };

  //#endregion

  useEffect(() => {
    GetData();
    // eslint-disable-next-line
  }, [ClientSiteCt.storedClientSite.IdClientSite]);

  //#region Editors

const EditorFiltres = (VerrouEtat) => {
  let _text = "";
  switch (VerrouEtat) {
    case 0:
      _text = "En attente";
      break;
    case 1:
      _text = "En cours";
      break;
    case 2:
      _text = "Attente facturation";
      break;
    case 3:
      _text = "Facturé";
      break;
    case 4:
      _text = "Autres";
    default:
      _text = "Autres";
      break;
  }

  return (
    <span>
    {/* <div
      className={` text-wrap badge badge-bg-${GetBGColorByVerrouEtat(
        VerrouEtat
        )}`}
        >{" "}</div> */}
      {_text}
      </span>
  );
};


const EditorActionDocuments = (inter) => {
  return (
    <Button>
      <FontAwesomeIcon icon={faFile} />
    </Button>
  );
};



  const EditorDateFromDateTime = (data) => {
    if (!data) return data;
    var dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g;
    let _match = data.match(dateRegex)[0];
    return _match;
  };

  const EditorEtat = (Etat) => {
    return <div className={` text-wrap badge badge-bg-${GetBGColorByLibEtat(Etat)}`}>{Etat} </div>;
  };


  //#endregion

  const TableInterventions = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    const _ButtonFilter = CreateButtonFilters();
    // const _CardModel = CreateNewCardModel(
    //   EditorCardBody,
    //   EditorCardTitle,
    //   (presta) =>
    //     ` ${presta.IdPrestationContrat} - ${presta.DescriptionPrestationContrat}`
    // );

    return (
      <TableData
        Data={GetListeInterventionsTrimed()}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isLoaded}
        Pagination
        ButtonFilters={_ButtonFilter}
        FilterDefaultValue={CreateNewButtonFilter("VerrouEtat",3,EditorFiltres)}
        // TopPannelLeftToSearch={
        //   <Col md={"auto"} className="m-1">
        //     <div className="project-sort-nav">
        //       <nav>
        //         <ul>
        //           <li className="li-actif">
        //             <a
        //               className="btn-filter text-decoration-none"
        //               href="/nouvelleintervention"
        //             >
        //               Nouvelle intervention
        //             </a>
        //           </li>
        //         </ul>
        //       </nav>
        //     </div>
        //   </Col>
        // }
        // TopPannelRightToSearch={
        //   <Col md={"auto"} className="m-1">
        //     <Stack direction="horizontal" className="centerStack " gap={1}>
        //       <Button
        //         variant=""
        //         className=" button-periode"
        //         onClick={() => SoustraireUnAnPeriode()}
        //       >
        //         <FontAwesomeIcon icon={faArrowLeft} />
        //       </Button>

        //       {DropDownYears(false)}

        //       <Button
        //         variant=""
        //         className="button-periode "
        //         onClick={() => AjouterUnAnPeriode()}
        //       >
        //         <FontAwesomeIcon icon={faArrowRight} />
        //       </Button>
        //     </Stack>
        //   </Col>
        // }
        
        // CardModel={_CardModel}
      />
    );
  };

  return (
    <Container fluid className="h-100">
      <Button variant="danger mt-2" onClick={()=> window.location.href="/nouvelleintervention"}>Demander une nouvelle intervention</Button>
      <TitreOfPage
        titre={"Interventions dépannage"}
        soustitre={` ${listeInterventions.length} intervention${
          listeInterventions.length > 1 ? "s" : ""
        } `}
        isLoaded={isLoaded}
      />
      <Container fluid>
        <TableInterventions />
      </Container>
    </Container>
  );
};

export default InterventionPage;
