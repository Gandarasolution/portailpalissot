//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec les contrats

import { HTMLEncode } from "../functions";
import { CallEndpoint, TelechargerDocument, VoirDocument } from "./WSGandara";



/**
 * 
 * @param {string} token 
 * @param {DateSOAP} dateDebut 
 * @param {DateSOAP} dateFin 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetPrestationContrat = (token, dateDebut, dateFin, guid, setData) => {
    return CallEndpoint(
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


/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetContratPrestationPeriodes = (token, guid, setData) => {
    return CallEndpoint(
        "GetContratPrestationPeriodes",
        {
            token: token,
            guid: guid,
        },
        setData
    );
};

/**
 * 
 * @param {string} token 
 * @param {number} IdPrestationContrat 
 * @param {Function} setData 
 */
const GetPrestationReleveTache = async (
    token,
    IdPrestationContrat,
    setData
) => {

    const callBackSet = (data) => {
        if (data === "Erreur de connexion") {
            setData(500);
            return;
        }
        if (JSON.parse(JSON.stringify(data)) === "500") {
            window.location.href = "/error";
            setData([]);
        } else {
            setData(data);
        }
    }

    await CallEndpoint("GetListeTaches", {
        token: token,
        IdPrestationContrat: IdPrestationContrat,
    }, callBackSet);


};

/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 */
const GetListeAppareils = async (token, guid, setData) => {
    
    CallEndpoint("GetAppareils", {
        token: token,
        guid: guid,
      },setData);
    
    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetAppareils",
  
    //   data: {
    //     token: token,
    //     guid: guid,
    //   },
    //   success(data) {
    //     if (JSON.parse(JSON.stringify(data)) === "500") {
    //       setData([]);
    //     } else {
    //       setData(JSON.parse(data));
    //     }
    //   },
    // });
  };

//#region Documents

/**
 * 
 * @param {string} token 
 * @param {Number} IdDossierIntervention 
 * @param {Function} setDocuments 
 * @param {Object} presta 
 */
const GetDocumentPrestation = async (
    token,
    IdDossierIntervention,
    setDocuments,
    presta
) => {

    await CallEndpoint("GetDocumentsPrestation", { token: token, IdDossierIntervention: IdDossierIntervention }, (data) => setDocuments(data,presta))
    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetDocumentsPrestation",
    //   data: { token: token, IdDossierIntervention: IdDossierIntervention },
    //   success(data) {
    //     setDocuments(data, presta);
    //   },

    // });
};


/**
 * 
 * @param {string} token 
 * @param {Number} IdMobiliteIntervention 
 * @param {Boolean} telecharger 
 * @param {Boolean} returnData 
 * @returns 
 */
const GetDocumentPrestationRapport = async (
    token,
    IdMobiliteIntervention,
    telecharger,
    returnData
) => {

    if (returnData) {
        let _return = undefined;
        _return = await CallEndpoint("GetDocumentPrestationRapport", { token: token, IdMobiliteIntervention: IdMobiliteIntervention }, null, true);
        return  JSON.parse(_return);

    }


    let targetWindow = window.open("/waiting");

    const callbackResponseSuccess = (data) => {
        if (data === "500") {
            targetWindow.location.href = `/error?error=500`;
        }
        const _kv = JSON.parse(data);
        if (telecharger) {
            TelechargerDocument(_kv.v, _kv.k, targetWindow);
        } else {
            VoirDocument(_kv.v, _kv.k, targetWindow);
        }
    }

    CallEndpoint("GetDocumentPrestationRapport", { token: token, IdMobiliteIntervention: IdMobiliteIntervention }, callbackResponseSuccess)

    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetDocumentPrestationRapport",
    //   data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
    //   success(data) {
    //     if (data === "500") {
    //       targetWindow.location.href = `/error?error=500`;
    //     }
    //     const _kv = JSON.parse(data);
    //     if (telecharger) {
    //       TelechargerDocument(_kv.v, _kv.k, targetWindow);
    //     } else {
    //       VoirDocument(_kv.v, _kv.k, targetWindow);
    //     }
    //   },
    //   error(error) {
    //     targetWindow.location.href = `/error?error=${error.status}`;
    //   },
    // });
};

/**
 * 
 * @param {string} token 
 * @param {Number} IdMobiliteIntervention 
 * @param {boolean} telecharger 
 * @param {Boolean} returnData 
 * @returns 
 */
const GetDocumentPrestationCERFA = async (
    token,
    IdMobiliteIntervention,
    telecharger,
    returnData
) => {

    if (returnData) {
        let _return = await CallEndpoint("GetDocumentPrestationCERFA", { token: token, IdMobiliteIntervention: IdMobiliteIntervention }, null, true);
        return JSON.parse(_return);
    }

    let targetWindow = window.open("/waiting");

    const callbackResponseSuccess = (data) => {
        if (data === "500") {
            targetWindow.location.href = `/error?error=500`;
        }
        const _kv = JSON.parse(data);
        if (telecharger) {
            TelechargerDocument(_kv.v, _kv.k, targetWindow);
        } else {
            VoirDocument(_kv.v, _kv.k, targetWindow);
        }
    }
    CallEndpoint("GetDocumentPrestationCERFA", { token: token, IdMobiliteIntervention: IdMobiliteIntervention }, callbackResponseSuccess);

    // if (returnData) {
    //   let _return = undefined;
    //   await $.ajax({
    //     type: "POST",
    //     url: getUrlFromCookie() + "GetDocumentPrestationCERFA",
    //     data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
    //     success(data) {
    //       _return = JSON.parse(data);
    //     },
    //   });

    //   return _return;
    // }

    // // let targetWindow = window.open("/waiting");

    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetDocumentPrestationCERFA",
    //   data: { token: token, IdMobiliteIntervention: IdMobiliteIntervention },
    //   success(data) {
    //     if (data === "500") {
    //       targetWindow.location.href = `/error?error=500`;
    //     }
    //     const _kv = JSON.parse(data);
    //     if (telecharger) {
    //       TelechargerDocument(_kv.v, _kv.k, targetWindow);
    //     } else {
    //       VoirDocument(_kv.v, _kv.k, targetWindow);
    //     }
    //   },
    //   error(error) {
    //     targetWindow.location.href = `/error?error=${error.status}`;
    //   },
    // });
};








/**
 * 
 * @param {string} token 
 * @param {string} fullPath 
 * @param {boolean} telecharger 
 * @param {boolean} returnData 
 * @returns 
 */
const GetDocumentPrestationExtranet = async (
    token,
    fullPath,
    telecharger,
    returnData
) => {

    if (returnData) {
        let _return = await CallEndpoint("GetDocumentPrestationExtranet", { token: token, fullPath: fullPath }, null, true);
        return JSON.parse(_return);
    }

    let targetWindow = window.open("/waiting");

    const callbackResponseSuccess = (data) => {
        if (data === "500") {
            targetWindow.location.href = `/error?error=500`;
        }
        const _kv = JSON.parse(data);
        if (telecharger) {
            TelechargerDocument(_kv.v, _kv.k, targetWindow);
        } else {
            VoirDocument(_kv.v, _kv.k, targetWindow);
        }

    }
    CallEndpoint("GetDocumentPrestationExtranet", { token: token, fullPath: fullPath }, callbackResponseSuccess);

    // if (returnData) {
    //   let _return = undefined;
    //   await $.ajax({
    //     type: "POST",
    //     url: getUrlFromCookie() + "GetDocumentPrestationExtranet",
    //     data: { token: token, fullPath: fullPath },
    //     success(data) {
    //       _return = JSON.parse(data);
    //     },
    //   });

    //   return _return;
    // }

    // // let targetWindow = window.open("/waiting");

    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetDocumentPrestationExtranet",
    //   data: { token: token, fullPath: fullPath },
    //   success(data) {
    //     if (data === "500") {
    //       targetWindow.location.href = `/error?error=500`;
    //     }
    //     const _kv = JSON.parse(data);
    //     if (telecharger) {
    //       TelechargerDocument(_kv.v, _kv.k, targetWindow);
    //     } else {
    //       VoirDocument(_kv.v, _kv.k, targetWindow);
    //     }
    //   },
    //   error(error) {
    //     targetWindow.location.href = `/error?error=${error.status}`;
    //   },
    // });
};



/**
 * 
 * @param {string} token 
 * @param {number} IdPJ 
 * @param {boolean} telecharger 
 * @param {boolean} returnData 
 * @returns 
 */
const GetDocumentPrestationTicket = async (
    token,
    IdPJ,
    telecharger,
    returnData
) => {

    if (returnData) {
        let _return;
        const callBackReturnData = (data) => {
            if (
                data.k
                    .substring(0, data.k.length - 4)
                    .split(".")
                    .pop() === "jpg"
            ) {
                data.k = data.k.substring(0, data.k.length - 4);
                _return = data;
            } else {
                _return = JSON.parse(data);
            }
        }

        await CallEndpoint("GetDocumentPrestationTicket", { token: token, IdPJ: IdPJ }, callBackReturnData);
        return JSON.parse(_return);
    }

    let targetWindow = window.open("/waiting");

    const callbackResponseSuccess = (data) => {
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
    }

    CallEndpoint("GetDocumentPrestationTicket", { token: token, IdPJ: IdPJ }, callbackResponseSuccess);



    // if (returnData) {
    //   let _return = undefined;
    //   await $.ajax({
    //     type: "POST",
    //     url: getUrlFromCookie() + "GetDocumentPrestationTicket",
    //     data: { token: token, IdPJ: IdPJ },
    //     success(data) {
    //       let _data = JSON.parse(data);

    //       if (
    //         _data.k
    //           .substring(0, _data.k.length - 4)
    //           .split(".")
    //           .pop() === "jpg"
    //       ) {
    //         _data.k = _data.k.substring(0, _data.k.length - 4);
    //         _return = _data;
    //       } else {
    //         _return = JSON.parse(data);
    //       }
    //     },
    //   });

    //   return _return;
    // }

    // // let targetWindow = window.open("/waiting");

    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetDocumentPrestationTicket",
    //   data: { token: token, IdPJ: IdPJ },
    //   success(data) {
    //     if (data === "500") {
    //       targetWindow.location.href = `/error?error=500`;
    //     }
    //     const _kv = JSON.parse(data);

    //     if (
    //       _kv.k
    //         .substring(0, _kv.k.length - 4)
    //         .split(".")
    //         .pop() === "jpg"
    //     ) {
    //       _kv.k = _kv.k.substring(0, _kv.k.length - 4);
    //     }

    //     if (telecharger) {
    //       // TelechargerDocument(_kv.v, _kv.k, targetWindow);
    //       TelechargerDocument(_kv.v, HTMLEncode(_kv.k), targetWindow);
    //     } else {
    //       VoirDocument(_kv.v, _kv.k, targetWindow);
    //     }
    //   },
    //   error(error) {
    //     targetWindow.location.href = `/error?error=${error.status}`;
    //   },
    // });
};



//#endregion

export {
    GetContratPrestationPeriodes
    , GetPrestationContrat
    , GetPrestationReleveTache
    , GetListeAppareils
    //Documents
    , GetDocumentPrestation
    , GetDocumentPrestationRapport
    , GetDocumentPrestationCERFA
    , GetDocumentPrestationExtranet
    , GetDocumentPrestationTicket
}