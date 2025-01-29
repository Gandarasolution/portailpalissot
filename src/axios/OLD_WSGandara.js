//#region Imports
import $ from "jquery";
import { cyrb53, HTMLEncode } from "../functions";

//#endregion

//#region Données
// const urlAction = "https://phpgao.000webhostapp.com/?endpoint=GMAO";
// const urlAction = `http://localhost:8000/WSGandara.php?endpoint=GMAO`;
// const urlAction = `https://dev.extranet.gandarasolution.fr/extranet/inc_librairie/WSGandara.fct.php?endpoint=GMAO`;



// const urlAction = `https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO`;
// urlAction = "";
// https://dev.extranet.gandarasolution.fr/extranet/inc_librairie/WSGandara.fct.php

//#endregion 


const getUrlFromCookie = () => {
  let _cookieName = cyrb53("wsEntrepriseNameHashed");

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${_cookieName}=`))
    ?.split("=")[1];
  return decodeURIComponent(cookieValue);
}



const callEndpoint = async (endpoint, data, setData, returnData) => {

  let _data = undefined;
  let _cookieName = cyrb53("wsEntrepriseNameHashed");

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${_cookieName}=`))
    ?.split("=")[1];

  // console.log(decodeURIComponent(cookieValue));

  function ErrorHandling(error) {
    setData([]);
    // console.log(error);
    // console.log("Erreur lors du endpoint ", endpoint);
    // console.log("avec les donnes ", data);
  }

  $.ajax({
    type: "POST",

    // url: getUrlFromCookie() + endpoint,
    url: decodeURIComponent(cookieValue) + endpoint,
    data: data,
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        ErrorHandling(500);
      } else {
        _data = JSON.parse(data);
        if (returnData) {
          return _data;
        }

        setData(_data);
      }
    },
    error(error) {
      ErrorHandling(error);
    },
  });
};



//#region Fonction publics

//#region Login



const GetCanonicalURI = async ()=>{
  let _urlTemp = "https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";
  
  return ["test.gandarasolution.fr:3000",];

}


const GetURLWs = async (code, setResponse) => {
  let _urlTemp = "https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";

  await $.ajax({
    type: "POST",
    url: _urlTemp + "GetURLWsEntreprise",
    data: { codeEntreprise: code },
    success(data) {
      if (data) {
        setResponse(data);
      } else { setResponse(500); }
    }, error(xhr, status, error) {
      setResponse(xhr.status);
    }
  })
}



// const Connexion = async (login, pass, wsForToken, setToken) => {

//   $.ajax({
//     type: "POST",
//     url: wsForToken + "Connexion",
//     data: { login: login, pass_clear: pass },
//     success(data) {
//       if (data === 'Erreur de connexion') { setToken(500) }
//       else {
//         setToken(data);

//       }
//     },
//     error(error) {

//       setToken(500);
//     },
//   });
// };


const CreateTokenMDP = async (mail, setData) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "CreateTokenMDP",
    data: {
      mail: mail
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
    error(error) {
      setData(500);
    }
  });
}

const ChangeMDP = async (token, newMdp, setData) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "ChangeMDP",
    data: {
      token: token,
      newMDP: newMdp,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData(500);
      } else {
        setData(JSON.parse(data));
      }
    },
    error(error) {
      setData(500);
    }
  });
}


const UpdateMDP = async (token, newMdp, setData) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "_UpdateMdp",
    data: {
      token: token,
      newMdp: newMdp,
    },
    success(data) {
      if (JSON.parse(JSON.stringify(data)) === "500") {
        setData([]);
      } else {
        setData(JSON.parse(data));
      }
    },
  });
}


const GetListeParametres = async (token, setData) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetListeParametres",
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

const GetClientSiteContrat = async (token, setData) => {
  await $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetClientSiteContrat",
    data: { token: token },
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

//#region ClientSite
const GetListeTels = (token, guid, setData) => {
  return callEndpoint("ListeTelsSelect", { token: token, guid: guid }, setData);
};

const GetListeMails = (token, guid, setData) => {
  return callEndpoint(
    "ListeMailsSelect",
    { token: token, guid: guid },
    setData
  );
};

const GetNombrePortails = (token, guid, setData) => {
  return callEndpoint(
    "GetNombrePortails",
    { token: token, guid: guid },
    setData
  );
};

//#endregion

//#region Contrat

const GetPrestationContrat = (token, dateDebut, dateFin, guid, setData) => {
  return callEndpoint(
    "GetPrestationContrat",
    {
      token: token,
      dateDebut: dateDebut,
      dateFin: dateFin,
      guid: guid,
    },
    setData
  );
};

const GetContratPrestationPeriodes = (token, guid, setData) => {
  return callEndpoint(
    "GetContratPrestationPeriodes",
    {
      token: token,
      guid: guid,
    },
    setData
  );
};

const GetPrestationReleveTache = async (
  token,
  IdPrestationContrat,
  setData
) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetListeTaches",

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
    url: getUrlFromCookie() + "GetDocumentsPrestation",
    data: { token: token, IdDossierIntervention: IdDossierIntervention },
    success(data) {
      setDocuments(data, presta);
    },

  });
};

const GetDocumentPrestationRapport = async (
  token,
  IdMobiliteIntervention,
  telecharger,
  returnData
) => {
  if (returnData) {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetDocumentPrestationRapport",
      data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
      success(data) {
        _return = JSON.parse(data);
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetDocumentPrestationRapport",
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
};

const GetDocumentPrestationCERFA = async (
  token,
  IdMobiliteIntervention,
  telecharger,
  returnData
) => {
  if (returnData) {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetDocumentPrestationCERFA",
      data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
      success(data) {
        _return = JSON.parse(data);
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetDocumentPrestationCERFA",
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
};

const GetDocumentPrestationExtranet = async (
  token,
  fullPath,
  telecharger,
  returnData
) => {
  if (returnData) {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetDocumentPrestationExtranet",
      data: { token: token, fullPath: fullPath },
      success(data) {
        _return = JSON.parse(data);
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetDocumentPrestationExtranet",
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
};

const GetDocumentPrestationTicket = async (
  token,
  IdPJ,
  telecharger,
  returnData
) => {
  if (returnData) {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetDocumentPrestationTicket",
      data: { token: token, IdPJ: IdPJ },
      success(data) {
        let _data = JSON.parse(data);

        if (
          _data.k
            .substring(0, _data.k.length - 4)
            .split(".")
            .pop() === "jpg"
        ) {
          _data.k = _data.k.substring(0, _data.k.length - 4);
          _return = _data;
        } else {
          _return = JSON.parse(data);
        }
      },
    });

    return _return;
  }

  let targetWindow = window.open("/waiting");

  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetDocumentPrestationTicket",
    data: { token: token, IdPJ: IdPJ },
    success(data) {
      if (data === "500") {
        targetWindow.location.href = `/error?error=500`;
      }
      const _kv = JSON.parse(data);

      if (
        _kv.k
          .substring(0, _kv.k.length - 4)
          .split(".")
          .pop() === "jpg"
      ) {
        _kv.k = _kv.k.substring(0, _kv.k.length - 4);
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
};

//#endregion

//#region Documents

const VoirDocument = (b64, filename, targetWindow) => {
  $.ajax({
    type: "POST",
    url: `${getUrlFromCookie()}File64`,
    data: { b64: b64, filename: HTMLEncode(filename) },
    success(data) {
      const urlToOpen = `${getUrlFromCookie()}SeeDocument&filename=${data}`;
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
    url: `${getUrlFromCookie()}File64`,
    data: { b64: b64, filename: HTMLEncode(filename) },
    success(data) {
      const urlToOpen = `${getUrlFromCookie()}SeeDocument&filename=${data}`;
      _urlRetour = urlToOpen;
    },
  });
  return _urlRetour;
};

const TelechargerDocument = (b64, filename, targetWindow) => {
  $.ajax({
    type: "POST",
    url: `${getUrlFromCookie()}File64`,
    data: { b64: b64, filename: filename },
    success(data) {
      const urlToOpen = `${getUrlFromCookie()}DownloadDocument&filename=${data}`;
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
    url: `${getUrlFromCookie()}ZIPDocs`,
    data: { arrayDocs: files, filename: filename },
    success(data) {
      const urlToOpen = `${getUrlFromCookie()}DownloadDocument&filename=${data}`;
      window.open(urlToOpen, "_blank");
    },
  });
};

//#endregion

//#region Appareils
const GetListeAppareils = async (token, guid, setData) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetAppareils",

    data: {
      token: token,
      guid: guid,
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
const GetListeFactures = async (token, guid, dateDebut, dateFin, setData) => {
  $.ajax({
    type: "POST",
    url: getUrlFromCookie() + "GetFactures",

    data: {
      token: token,
      guid: guid,
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

const VoirFactureDocument = async (
  token,
  IdFacture,
  TypeFacture,
  Avoir,
  returnData
) => {
  if (returnData) {
    let _return = undefined;
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetFactureDocument",
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
  } else {
    let targetWindow = window.open("/waiting");
    $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetFactureDocument",
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
    url: getUrlFromCookie() + "GetFactureDocument",
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
const GetListeInterventions = async (token, guid, setData) => {
  return callEndpoint(
    "GetListeInterventions",
    {
      token: token,
      guid: guid,
    },
    setData
  );
};

const GetListeFIIntervention = async (
  token,
  IdDossierInterventionSAV,
  setData
) => {
  return callEndpoint(
    "GetListeFIIntervention",
    {
      token: token,
      IdDossierInterventionSAV: IdDossierInterventionSAV,
    },
    setData
  );
};

const GeTListeFactureIntervention = async (
  token,
  IdDossierInterventionSAV,
  setData
) => {
  return callEndpoint(
    "GeTListeFactureIntervention",
    {
      token: token,
      IdDossierInterventionSAV: IdDossierInterventionSAV,
    },
    setData
  );
};

const GetDocumentFISAV = async (
  token,
  IdFicheInterventionSAV,
  telecharger,
  returnData
) => {
  let targetWindow = undefined;

  let _return = undefined;
  if (returnData) {
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetDocumentFISAV",
      data: {
        token: token,
        IdFicheInterventionSAV: IdFicheInterventionSAV,
      },
      success(data) {
        _return = JSON.parse(data);
      },
      error(error) {
      }

    })

    return _return;
  }

  if (!returnData) {
    targetWindow = window.open("/waiting");
  }

  const SetData = (data) => {
    const _kv = data;
    if (telecharger) {
      TelechargerDocument(_kv.v, HTMLEncode(_kv.k), targetWindow);
    } else {
      VoirDocument(_kv.v, _kv.k, targetWindow);
    }
  };

  return callEndpoint(
    "GetDocumentFISAV",
    {
      token: token,
      IdFicheInterventionSAV: IdFicheInterventionSAV,
    },
    SetData,
    returnData
  );





};

const GetListeSecteur = async (token, guid, setData) => {
  return callEndpoint(
    "GetListeSecteur",
    {
      token: token,
      guid: guid,
    },
    setData
  );
  // return $.ajax({
  //   type: "POST",
  //   url: getUrlFromCookie() + "GetListeSecteur",

  //   data: {
  //     token: token,
  //     guid: guid,
  //   },
  //   success(data) {
  //     if (data === "Erreur de connexion") {
  //       setData(500);
  //       return;
  //     }
  //     if (JSON.parse(JSON.stringify(data)) === "500") {
  //       setData([]);
  //     } else {
  //       setData(JSON.parse(data));
  //     }
  //   },
  // });
};

//#endregion

//#region Devis

const GetListeDevis = (token, guid, setData) => {
  return callEndpoint(
    "GetListeDevis",
    {
      token: token,
      guid: guid,
    },
    setData
  );
};

const GetdocumentDevis = async (token, IdDevis, telecharger, returnData) => {
  let targetWindow = undefined;






  let _return = undefined;
  if (returnData) {
    await $.ajax({
      type: "POST",
      url: getUrlFromCookie() + "GetdocumentDevis",
      data: { token: token, IdDevis: IdDevis },
      success(data) {
        _return = JSON.parse(data);
      },
      error(error) {
      }

    })

    return _return;
  }







  if (!returnData) {
    targetWindow = window.open("/waiting");
  }

  const SetData = (data) => {
    const _kv = data;
    if (telecharger) {
      TelechargerDocument(_kv.v, HTMLEncode(_kv.k), targetWindow);
    } else {
      VoirDocument(_kv.v, _kv.k, targetWindow);
    }
  };

  return callEndpoint(
    "GetdocumentDevis",
    { token: token, IdDevis: IdDevis },
    SetData,
    returnData
  );
};

//#endregion

//#endregion

export {
  // GetURLWs,
  // Connexion,
  // GetListeParametres,
  // GetClientSiteContrat,
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
  GetListeDevis,
  GetdocumentDevis,
  GetListeTels,
  GetListeMails,
  GetNombrePortails,
  GetContratPrestationPeriodes,
  // UpdateMDP,
  // ChangeMDP,
  // CreateTokenMDP,
  // GetCanonicalURI,
};
