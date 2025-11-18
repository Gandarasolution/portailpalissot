//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec les interventions SAV

// import { error } from "jquery";
import { HTMLEncode } from "../functions";
import { CallEndpoint, TelechargerDocument, VoirDocument } from "./WSGandara";



/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetListeInterventions = async (token, guid, setData) => {
    return CallEndpoint(
        "GetListeInterventions",
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
 * @param {Number} IdDossierInterventionSAV 
 * @param {Function} setData 
 * @returns 
 */
const GetListeFIIntervention = async (
    token,
    IdDossierInterventionSAV,
    setData
) => {
    return CallEndpoint(
        "GetListeFIIntervention",
        {
            token: token,
            IdDossierInterventionSAV: IdDossierInterventionSAV,
        },
        setData
    );
};





/**
 * 
 * @param {string} token 
 * @param {Number} IdDossierInterventionSAV 
 * @param {Function} setData 
 * @returns 
 */
const GetListeFactureIntervention = async (
    token,
    IdDossierInterventionSAV,
    setData
) => {
    return CallEndpoint(
        "GeTListeFactureIntervention",
        {
            token: token,
            IdDossierInterventionSAV: IdDossierInterventionSAV,
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
const GetListeSecteur = async (token, guid, setData) => {
    return CallEndpoint(
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

//#region Documents
/**
 * 
 * @param {string} token 
 * @param {Number} IdFicheInterventionSAV 
 * @param {boolean} telecharger 
 * @param {boolean} returnData 
 * @returns 
 */
const GetDocumentFISAV = async (
    token,
    IdFicheInterventionSAV,
    telecharger,
    returnData
) => {
    let targetWindow = undefined;
    if (returnData) {
        let _return = await CallEndpoint("GetDocumentFISAV", {
            token: token,
            IdFicheInterventionSAV: IdFicheInterventionSAV,
        }, null, true);
        return JSON.parse(_return);
    }

    targetWindow = window.open("/waiting");
    const callbackResponseSuccess = (data) => {
        const _kv = data;
        if (telecharger) {
            TelechargerDocument(_kv.v, HTMLEncode(_kv.k), targetWindow);
        } else {
            VoirDocument(_kv.v, _kv.k, targetWindow);
        }
    };

    return CallEndpoint(
        "GetDocumentFISAV",
        {
            token: token,
            IdFicheInterventionSAV: IdFicheInterventionSAV,
        },
        callbackResponseSuccess,
    );

    // let _return = undefined;
    // if (returnData) {
    //   await $.ajax({
    //     type: "POST",
    //     url: getUrlFromCookie() + "GetDocumentFISAV",
    //     data: {
    //       token: token,
    //       IdFicheInterventionSAV: IdFicheInterventionSAV,
    //     },
    //     success(data) {
    //       _return = JSON.parse(data);
    //     },
    //     error(error) {
    //     }

    //   })

    //   return _return;
    // }

    // if (!returnData) {
    //   targetWindow = window.open("/waiting");
    // }

    // const SetData = (data) => {
    //   const _kv = data;
    //   if (telecharger) {
    //     TelechargerDocument(_kv.v, HTMLEncode(_kv.k), targetWindow);
    //   } else {
    //     VoirDocument(_kv.v, _kv.k, targetWindow);
    //   }
    // };

    // return CallEndpoint(
    //   "GetDocumentFISAV",
    //   {
    //     token: token,
    //     IdFicheInterventionSAV: IdFicheInterventionSAV,
    //   },
    //   SetData,
    //   returnData
    // );

};



//#endregion

export {
    GetListeInterventions
    , GetListeFIIntervention
    , GetListeSecteur
    , GetListeFactureIntervention
    //Documents
    , GetDocumentFISAV
}