//#region Imports

import { useState, useEffect,useContext, createContext } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faDownload, faEye } from "@fortawesome/free-solid-svg-icons";

//#region Bootstrap
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Stack from "react-bootstrap/Stack";
//#endregion

//#region Components
import { GetListeFactures } from "../../axios/WSGandara";
import { DateSOAP, GetNomMois, addOneYear, subOneYear } from "../../functions";
import { ClientSiteContratContext, TokenContext } from "../../App";
import TableData, {
  CreateFilter,
  CreateNewButtonFilter,
  CreateNewCardModel,
  CreateNewCell,
  CreateNewHeader,
  CreateNewUnboundCell,
  CreateNewUnboundHeader,
} from "../../components/commun/TableData";
import { Placeholder, Row } from "react-bootstrap";
//#endregion

//#endregion

export const FactureContext = createContext(null);

const FacturesPage = () => {

  const tokenCt = useContext(TokenContext);
  const clientSiteCt = useContext(ClientSiteContratContext);

  //#region States
  const [isFacturesLoaded, setIsFactureLoaded] = useState(false);
  const [listeFactures, setListeFactures] = useState([]);
  const [dateDebutPeriode, setDateDebutPeriode] = useState(
    GetDatePeriodeInitial());


    const [factureSelected, setFactureSelected] = useState(null);
    const [voirFacture,setVoirFacture] = useState(false);
    const [TelechargerFacture, setTelechargerFacture] = useState(false);

  //#endregion

  //#region Fonctions

const GetListeInterventions = async () => {
  const FetchSetData = (data) => {
    setListeFactures(data);
    setIsFactureLoaded(true);
  }

  await GetListeFactures(tokenCt,clientSiteCt.storedClientSite, DateSOAP(dateDebutPeriode), DateSOAP(dateFinPeriode()), FetchSetData );

}


  /**
   * Construit la date de début des preriodes initial
   * @returns ([1] / [DateContratSouscrit.getMonth] / [Date.Now.getYear])
   */
  function GetDatePeriodeInitial() {
    let _day = 1;
    let _monthI = 0;
    let _year = new Date().getFullYear();
    let _DateRetour = new Date(_year, _monthI, _day);
    return _DateRetour;
  }


  const dateFinPeriode = () => {
    let _dateEndTmp = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));

    _dateEndTmp = addOneYear(_dateEndTmp);

    var day = _dateEndTmp.getDate() - 1;
    _dateEndTmp.setDate(day);

    return new Date(_dateEndTmp);
  };



  function CreateHeaderForTable() {
    // Date	Code	Libellé	Total HT	Total TTC	Origine	Type
    let _headers = [];
    _headers.push(
      CreateNewHeader("DateFacture", CreateFilter(true,true,false,false), "Date",EditorDateFromDateTime)
    );
    _headers.push(CreateNewHeader("IdFacture", CreateFilter(true,true,false,true), "Facture N°"));
    _headers.push(CreateNewHeader("Sujet", CreateFilter(true,true,false,true), "Libellé"));
    _headers.push(
      CreateNewHeader("MontantHT", CreateFilter(true,true,true,true), "Total HT",EditorMontant)
    );
    _headers.push(CreateNewHeader("MontantTTC", CreateFilter(true,true,true,true), "Total TTC",EditorMontant));
    _headers.push(CreateNewHeader("Dossier", CreateFilter(true,true,false,true), "Origine"));
    _headers.push(CreateNewHeader("Type", CreateFilter(true,true,false,true), "Type"));
    _headers.push(CreateNewUnboundHeader(CreateFilter(), "Actions"));

    return _headers;
  }

  function CreateCellsForTable() {
    let _cells = [];
    _cells.push(
      CreateNewCell("DateFacture", true, true, false,EditorDateFromDateTime)
    );
    _cells.push(CreateNewCell("IdFacture", false, true, false));
    _cells.push(CreateNewCell("Sujet", true, true, false));
    _cells.push(
      CreateNewCell("MontantHT", false, true, false,EditorMontant)
    );
    _cells.push(CreateNewCell("MontantTTC", true, true, false,EditorMontant));
    _cells.push(CreateNewCell("Dossier", false, true, false));
    _cells.push(CreateNewCell("Type", false, true, false));

    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionVoir,
        "tagFactureVoir"
      )
    );
    _cells.push(
      CreateNewUnboundCell(
        false,
        false,
        true,
        EditorActionTelecharger,
        "tagFactureTelecharger"
      )
    );
    return _cells;
  }


  function CreateButtonFiltersForTable()
  {
    let _arrBt = [];

    _arrBt.push(CreateNewButtonFilter("Type","Chantier"));
    _arrBt.push(CreateNewButtonFilter("Type","Facture Contrat"));
    _arrBt.push(CreateNewButtonFilter("Type","Facture SAV"));
    _arrBt.push(CreateNewButtonFilter("Type","Facture SAV Selon Devis"));


    return _arrBt;
  }

//#region Editors

const EditorDateFromDateTime = (data) => {
  var dateRegex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g;
  let _match = data.match(dateRegex)[0]
  return _match
}


const EditorMontant = (data) => {
  try {
    return `${new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(data)}`;
  } catch (error) {
    return `${data} €`;
  }
};


const EditorActionVoir = (e) => {

    return (
      <Button variant="" >
        <FontAwesomeIcon icon={faEye}  />
      </Button>
    )
}

const EditorActionTelecharger = (e) => {
    return (
      <Button variant="">
        <FontAwesomeIcon icon={faDownload} />
      </Button>
    )
}


const EditorCardBody = (facture) => {
  return (
    <span>

    <Row>
      <Col><h3>Montant Hors taxe : {EditorMontant(facture.MontantHT)}</h3></Col>
      <Col><h3>Montant TTC : {EditorMontant(facture.MontantTTC)}</h3> </Col>
    </Row>
    <Row>
      <Col className="p-4">
      <Button className="m-2" onClick={()=> {setFactureSelected(facture); setVoirFacture(true);}} >Voir la facture</Button>
      <Button className="m-2" onClick={()=> {setFactureSelected(facture); setTelechargerFacture(true);}}>Télécharger la facture</Button>
      </Col>
    </Row>
    </span>
  );
}

const EditorCardTitle = (facture) => {
  return `F${facture.IdFacture} du ${EditorDateFromDateTime(facture.DateFacture)}`
}

const EditorCardSubtitle = (facture) => {
  return `Origine : ${facture.Type} ${facture.Dossier}`
}


//#endregion


  //#endregion

  //#region Evenements

  const AjouterUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = addOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);

    setIsFactureLoaded(false);
     await GetListeInterventions()
  };

  const SoustraireUnAnPeriode = async () => {
    let _dateTMP = dateDebutPeriode;
    _dateTMP = subOneYear(_dateTMP);
    let _dateDebutPeriode = new Date(_dateTMP);
    setDateDebutPeriode(_dateDebutPeriode);
    setIsFactureLoaded(false);
     await GetListeInterventions()
  };

  const HandleDropdownPeriodeSelect = async (dateStart) => {
    let _dateTemp = new Date(dateStart);

    setDateDebutPeriode(_dateTemp);
    setIsFactureLoaded(false);
     await GetListeInterventions()
  };
  //#endregion

  //#region Composants


  const DropDownYears = (small) => {
    let _dateDebut = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
    let _dateEnd = new Date(JSON.parse(JSON.stringify(dateDebutPeriode)));
    let _arrayPeriodes = [
      {
        dateStart: new Date(_dateDebut),
        dateEnd: new Date(_dateEnd.setMonth(_dateDebut.getMonth() + 11)),
      },
    ];

    for (let index = 0; index < 10; index++) {
      let _dateStart = addOneYear(new Date(_arrayPeriodes[index].dateStart));
      let _dateEnd = addOneYear(new Date(_arrayPeriodes[index].dateEnd));

      _arrayPeriodes.push({ dateStart: _dateStart, dateEnd: _dateEnd });
    }

    return (
      <DropdownButton
        variant=""
        className="button-periode"
        drop="down-centered"
        style={{ borderRadius: "10px" }}
        id="dropdown-datePeriode"
        title={`Période : ${GetNomMois(dateDebutPeriode.getMonth() + 1, small)}
              ${dateDebutPeriode.getFullYear()} à
              ${GetNomMois(dateFinPeriode().getMonth() + 1, small)}
              ${dateFinPeriode().getFullYear()}`}
        onSelect={(e) => {
          HandleDropdownPeriodeSelect(e);
        }}
      >
        {_arrayPeriodes.map((periode, index) => {
          return (
            <Dropdown.Item key={index} eventKey={periode.dateStart}>
              {` ${GetNomMois(
                periode.dateStart.getMonth() + 1
              )} ${periode.dateStart.getFullYear()} à ${GetNomMois(
                periode.dateEnd.getMonth() + 1
              )} ${periode.dateEnd.getFullYear()}`}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>
    );
  };



  //#region TableData

  const TableFactures = () => {
    const _Headers = CreateHeaderForTable();
    const _Cells = CreateCellsForTable();

    const _ButtonFilters = CreateButtonFiltersForTable();
    const _CardModel = CreateNewCardModel(
      EditorCardBody,
      EditorCardTitle,
     EditorCardSubtitle
    );

    return (
      <FactureContext.Provider value={{factureSelected, voirFacture, setVoirFacture, TelechargerFacture, setTelechargerFacture}}>

      <TableData
        Data={listeFactures}
        Headers={_Headers}
        Cells={_Cells}
        IsLoaded={isFacturesLoaded}
        Pagination
        TopPannelRightToSearch={
          <Col md={"auto"} className="m-1">
             <Stack direction="horizontal" className="centerStack " gap={1}>
                <Button
                  variant=""
                  className=" button-periode"
                  onClick={() => SoustraireUnAnPeriode()}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Button>

                {DropDownYears(false)}

                <Button
                  variant=""
                  className="button-periode "
                  onClick={() => AjouterUnAnPeriode()}
                  >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </Stack>
          </Col>
        }
        CardModel={_CardModel}
        
        ButtonFilters={_ButtonFilters}
        />
        </FactureContext.Provider>
    );
  };

  //#endregion
  //#endregion



  const GetFactures = async () => {
    setIsFactureLoaded(false);
    const FetchSetData = (data) => {
      setListeFactures(data);
      setIsFactureLoaded(true);
    }
    await GetListeFactures(tokenCt, clientSiteCt.storedClientSite.IdClientSite,DateSOAP(dateDebutPeriode), DateSOAP(dateFinPeriode()),FetchSetData)

  }

useEffect(()=> {
  
  GetFactures();
  //eslint-disable-next-line
},[clientSiteCt.storedClientSite.IdClientSite])

  return (
    <Container fluid className="h-100">
      <Col md={12} style={{ textAlign: "start" }}>
        <span className="title">Factures </span>|
        <span className="subtitle">
          {isFacturesLoaded ? (
            ` ${listeFactures.length} factures`
          ) : (
            <Placeholder animation="glow">
              <Placeholder xs={1} />
            </Placeholder>
          )}
        </span>
      </Col>

      <TableFactures />
    </Container>
  );
};

export default FacturesPage;
