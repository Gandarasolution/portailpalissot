//#region Imports
import $ from "jquery";
import { HTMLEncode } from "../functions";

//#endregion

//#region Données
//  const urlAction = "https://phpgao.000webhostapp.com/?endpoint=GMAO";
const urlAction = `http://localhost:8000/WSGandara.php?endpoint=GMAO`;

//#endregion

//#region Fonction publics

//#region Login

const Connexion = async (login, pass, setToken) => {
  $.ajax({
    type: "POST",
    url: urlAction + "Connexion",
    data: { login: login, pass_clear: pass },
    success(data) {
      setToken(data);
    },
    error(error) {
      setToken(500);
    },
  });
};

const GetListeParametres = async (token, setData) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetListeParametres",
    data: {
      token: token,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });

  // setData([{k:"TelUrgenceIntervention", v:"01 02 03 04 05"}]);
};

const GetClientSiteContrat = async (token, setClientSiteContrat) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetClientSiteContrat",
    data: { token: token },
    success(data) {
      setClientSiteContrat(JSON.parse(data));
    },
  });
};

//#endregion

//#region Contrat

const GetPrestationContrat = async (
  token,
  dateDebut,
  dateFin,
  IdSite,
  setData
) => {
  return $.ajax({
    type: "POST",
    url: urlAction + "GetPrestationContrat",

    data: {
      token: token,
      dateDebut: dateDebut,
      dateFin: dateFin,
      IdSite: IdSite,
    },
    success(data) {
      if (data === "Erreur de connexion") {
        setData(500);
        return;
      }
      if (JSON.parse(JSON.stringify(data)) === "500") {
        window.location.href = `/error?error=${data}`;
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

const GetPrestationReleveTache = async (
  token,
  IdPrestationContrat,
  setData
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetListeTaches",

    data: {
      token: token,
      IdPrestationContrat: IdPrestationContrat,
    },
    success(data) {
      if (data === "Erreur de connexion") {
        setData(500);
        return;
      }
      if (JSON.parse(JSON.stringify(data)) === "500") {
        window.location.href = "/error";
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

const GetDocumentPrestation = async (
  token,
  IdDossierIntervention,
  setDocuments,
  presta
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentsPrestation",
    data: { token: token, IdDossierIntervention: IdDossierIntervention },
    success(data) {
      setDocuments(data,presta);
    },
  });
};


const GetDocumentPrestationRapport = async (token, IdMobiliteIntervention,telecharger, returnData) => {

  if(returnData)
  {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: urlAction + "GetDocumentPrestationRapport",
      data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
      success(data) {
        _return = JSON.parse(data)
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentPrestationRapport",
    data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
    success(data) {
      if (data === "500") {
        targetWindow.location.href = `/error?error=500`;
      }
      const _kv = JSON.parse(data);
      if (telecharger) {
        TelechargerDocument(_kv.v, _kv.k, targetWindow);
      } else {
        VoirDocument(_kv.v, _kv.k, targetWindow);
      }
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });

}


const GetDocumentPrestationCERFA = async (token, IdMobiliteIntervention,telecharger, returnData) => {

  if(returnData)
  {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: urlAction + "GetDocumentPrestationCERFA",
      data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
      success(data) {
        _return = JSON.parse(data)
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentPrestationCERFA",
    data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
    success(data) {
      if (data === "500") {
        targetWindow.location.href = `/error?error=500`;
      }
      const _kv = JSON.parse(data);
      if (telecharger) {
        TelechargerDocument(_kv.v, _kv.k, targetWindow);
      } else {
        VoirDocument(_kv.v, _kv.k, targetWindow);
      }
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });

}

const GetDocumentPrestationExtranet = async (token, fullPath,telecharger,returnData) => {
  if(returnData)
  {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: urlAction + "GetDocumentPrestationExtranet",
      data: { token: token, fullPath: fullPath },
      success(data) {
        _return = JSON.parse(data)
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentPrestationExtranet",
    data: { token: token, fullPath: fullPath },
    success(data) {
      if (data === "500") {
        targetWindow.location.href = `/error?error=500`;
      }
      const _kv = JSON.parse(data);
      if (telecharger) {
        TelechargerDocument(_kv.v, _kv.k, targetWindow);
      } else {
        VoirDocument(_kv.v, _kv.k, targetWindow);
      }
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });
}


const GetDocumentPrestationTicket = async (token, IdPJ,telecharger, returnData) => {

  if(returnData)
  {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: urlAction + "GetDocumentPrestationTicket",
      data: { token: token, IdPJ: IdPJ },
      success(data) {
        let _data = JSON.parse(data);

        if( _data.k.substring(0 , _data.k.length - 4).split(".").pop() === "jpg" )
        {
          _data.k = _data.k.substring(0,_data.k.length - 4);
          _return = _data;
        }
        else {
          _return = JSON.parse(data)

        }
        
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentPrestationTicket",
    data: { token: token, IdPJ: IdPJ },
    success(data) {
      if (data === "500") {
        targetWindow.location.href = `/error?error=500`;
      }
      const _kv = JSON.parse(data);
      

      if( _kv.k.substring(0 , _kv.k.length - 4).split(".").pop() === "jpg" )
      {
        _kv.k = _kv.k.substring(0,_kv.k.length - 4);
      }

      if (telecharger) {

        // TelechargerDocument(_kv.v, _kv.k, targetWindow);
        TelechargerDocument(_kv.v, HTMLEncode(_kv.k), targetWindow);
      } else {

        VoirDocument(_kv.v, _kv.k, targetWindow);
      }
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });

}




//#endregion




//#region Documents

const VoirDocument = (b64, filename, targetWindow) => {
  $.ajax({
    type: "POST",
    url: `${urlAction}File64`,
    data: { b64: b64, filename: HTMLEncode(filename) },
    success(data) {
      const urlToOpen = `${urlAction}SeeDocument&filename=${data}`;
      if (targetWindow) {
        //Ouvre dans cette fenêtre
        targetWindow.location.href = urlToOpen;
      } else {
        //Ouvre dans une nouvelle fenetre
        window.open(urlToOpen, "_blank");
      }
    },
  });
};

const VoirDocumentOffice = async (b64, filename) => {
  let _urlRetour = undefined;
  await $.ajax({
    type: "POST",
    url: `${urlAction}File64`,
    data: { b64: b64, filename: HTMLEncode(filename) },
    success(data) {
      const urlToOpen = `${urlAction}SeeDocument&filename=${data}`;
      _urlRetour = urlToOpen;
    },
  });
  return _urlRetour;
}


const TelechargerDocument = (b64, filename, targetWindow) => {
  $.ajax({
    type: "POST",
    url: `${urlAction}File64`,
    data: { b64: b64, filename: filename },
    success(data) {
      const urlToOpen = `${urlAction}DownloadDocument&filename=${data}`;
      if (targetWindow) {
        // targetWindow.location.href=urlToOpen;
        window.open(urlToOpen, "_blank");
        targetWindow.close();
      } else {
        window.open(urlToOpen, "_blank");
      }
    },
  });
};

const TelechargerZIP = (files, filename) => {
 
    $.ajax({
      type: "POST",
      url: `${urlAction}ZIPDocs`,
      data: { arrayDocs: files, filename: filename },
      success(data) {
        const urlToOpen = `${urlAction}DownloadDocument&filename=${data}`;
          window.open(urlToOpen, "_blank");

      },
     
    });
 
};

//#endregion

//#region Appareils
const GetListeAppareils = async (token, IdClientSite, setData) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetAppareils",

    data: {
      token: token,
      IdClientSite: IdClientSite,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};
//#endregion

//#region Factures
const GetListeFactures = async (
  token,
  IdClientSite,
  dateDebut,
  dateFin,
  setData
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetFactures",

    data: {
      token: token,
      IdClientSite: IdClientSite,
      dateDebut: dateDebut,
      dateFin: dateFin,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

const VoirFactureDocument = async (token, IdFacture, TypeFacture, Avoir, returnData) => {
if (returnData)
{
  let _return = undefined;
  await $.ajax({
    type: "POST",
    url: urlAction + "GetFactureDocument",
    data: {
      token: token,
      IdFacture: IdFacture,
      TypeFacture: TypeFacture,
      Avoir: Number(Avoir),
    },
    success(data) {
      const _kv = JSON.parse(data);
      _return = _kv;
    },
  });

  return _return;
}else {

  let targetWindow = window.open("/waiting");
  $.ajax({
    type: "POST",
    url: urlAction + "GetFactureDocument",
    data: {
      token: token,
      IdFacture: IdFacture,
      TypeFacture: TypeFacture,
      Avoir: Number(Avoir),
    },
    success(data) {
      const _kv = JSON.parse(data);
      VoirDocument(_kv.v, _kv.k, targetWindow);
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });

}

};

const TelechargerFactureDocument = async (
  token,
  IdFacture,
  TypeFacture,
  Avoir
) => {
  let targetWindow = window.open("/waiting");
  $.ajax({
    type: "POST",
    url: urlAction + "GetFactureDocument",
    data: {
      token: token,
      IdFacture: IdFacture,
      TypeFacture: TypeFacture,
      Avoir: Number(Avoir),
    },
    success(data) {
      const _kv = JSON.parse(data);
      TelechargerDocument(_kv.v, _kv.k, targetWindow);
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });
};

//#endregion

//#region Interventions
const GetListeInterventions = async (
  token,
  IdClientSite,

  setData
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetListeInterventions",

    data: {
      token: token,
      IdClientSite: IdClientSite,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

const GetListeFIIntervention = async (
  token,
  IdDossierInterventionSAV,
  setData
) => {
  await $.ajax({
    type: "POST",
    url: urlAction + "GetListeFIIntervention",

    data: {
      token: token,
      IdDossierInterventionSAV: IdDossierInterventionSAV,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

const GeTListeFactureIntervention = async (
  token,
  IdDossierInterventionSAV,
  setData
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GeTListeFactureIntervention",

    data: {
      token: token,
      IdDossierInterventionSAV: IdDossierInterventionSAV,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

const GetDocumentFISAV = async (
  token,
  IdFicheInterventionSAV,
  telecharger,
  returnData
) => {
  if (returnData) {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: urlAction + "GetDocumentFISAV",

      data: {
        token: token,
        IdFicheInterventionSAV: IdFicheInterventionSAV,
      },
      success(data) {
        if (data !== "500") {
          
          _return = JSON.parse(data);
        }
      },
    });
    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentFISAV",

    data: {
      token: token,
      IdFicheInterventionSAV: IdFicheInterventionSAV,
    },
    success(data) {
      if (data === "500") {
        targetWindow.location.href = `/error?error=500`;
      }
      const _kv = JSON.parse(data);
      if (telecharger) {
        TelechargerDocument(_kv.v, _kv.k, targetWindow);
      } else {
        VoirDocument(_kv.v, _kv.k, targetWindow);
      }
    },
    error(error) {
      targetWindow.location.href = `/error?error=${error.status}`;
    },
  });
};

const GetListeSecteur = async (token, IdClientSiteRelation, setData) => {
  return $.ajax({
    type: "POST",
    url: urlAction + "GetListeSecteur",

    data: {
      token: token,
      IdClientSiteRelation: IdClientSiteRelation,
    },
    success(data) {
      if (data === "Erreur de connexion") {
        setData(500);
        return;
      }
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

//#endregion

//#endregion

export {
  Connexion,
  GetListeParametres,
  GetClientSiteContrat,
  VoirDocument,
  TelechargerDocument,
  TelechargerZIP,
  GetPrestationContrat,
  GetPrestationReleveTache,
  GetDocumentPrestation,
  GetDocumentPrestationRapport,
  GetDocumentPrestationCERFA,
  GetDocumentPrestationTicket,
  GetDocumentPrestationExtranet,
  GetListeAppareils,
  GetListeFactures,
  VoirFactureDocument,
  TelechargerFactureDocument,
  GetListeInterventions,
  GetListeFIIntervention,
  GeTListeFactureIntervention,
  GetDocumentFISAV,
  GetListeSecteur,
  VoirDocumentOffice,
};
