//#region Imports
import $ from "jquery";

//#endregion

//#region Données
//  const urlAction = "https://phpgao.000webhostapp.com/?endpoint=GMAO";
const urlAction = `http://localhost:8000/WSGandara.php?endpoint=GMAO`;

//#endregion

//#region Fonction publics

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
      if (data==="Erreur de connexion"){
        setData(500);
        return
      }
      if (JSON.parse(JSON.stringify(data)) === "500") {
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
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
};

//#endregion

//#region Documents

const GetDocumentPrestation = async (
  token,
  IdDossierIntervention,
  setDocuments
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetDocumentsPrestation",
    data: { token: token, IdDossierIntervention: IdDossierIntervention },
    success(data) {
      setDocuments(data);
    },
  });
};

const VoirDocument = (b64, filename) => {
  $.ajax({
    type: "POST",
    url: `${urlAction}File64`,
    data: { b64: b64, filename: filename },
    success(data) {
      const urlToOpen = `${urlAction}SeeDocument&filename=${data}`;
      window.open(urlToOpen, "_blank");
    },
  });
};

const TelechargerDocument = (b64, filename) => {
  $.ajax({
    type: "POST",
    url: `${urlAction}File64`,
    data: { b64: b64, filename: filename },
    success(data) {
      const urlToOpen = `${urlAction}DownloadDocument&filename=${data}`;
      window.open(urlToOpen, "_blank");
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
    url: urlAction + "GetListeFactures",

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



//#endregion

//#region Interventions
const GetListeInterventions = async (
  token,
  IdClientSite,
  dateDebut,
  dateFin,
  setData
) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetListeInterventions",

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

//#endregion

//#endregion

export {
  Connexion,
  GetClientSiteContrat,
  GetPrestationContrat,
  GetDocumentPrestation,
  VoirDocument,
  TelechargerDocument,
  TelechargerZIP,
  GetPrestationReleveTache,
  GetListeAppareils,
  GetListeFactures,
  GetListeInterventions,
  GetListeParametres,
};
