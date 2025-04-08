//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec les Devis

import { HTMLEncode } from "../functions";
import { CallEndpoint, TelechargerDocument, VoirDocument } from "./WSGandara";





/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetListeDevis = (token, guid, setData) => {
    return CallEndpoint(
        "GetListeDevis",
        {
            token: token,
            guid: guid,
        },
        setData
    );
};



//#region Document

/**
 * 
 * @param {string} token 
 * @param {Number} IdDevis 
 * @param {Boolean} telecharger 
 * @param {Function} returnData 
 * @returns 
 */
const GetdocumentDevis = async (token, IdDevis, telecharger, returnData) => {
    let targetWindow = undefined;

    if (returnData) {
        let _data = await CallEndpoint("GetdocumentDevis", { token: token, IdDevis: IdDevis }, null, true);
        return JSON.parse(_data);
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
        "GetdocumentDevis",
        { token: token, IdDevis: IdDevis },
        callbackResponseSuccess,
    );


    // if (returnData) {
    //   await $.ajax({
    //     type: "POST",
    //     url: getUrlFromCookie() + "GetdocumentDevis",
    //     data: { token: token, IdDevis: IdDevis },
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
    //   "GetdocumentDevis",
    //   { token: token, IdDevis: IdDevis },
    //   SetData,
    //   returnData
    // );
};

//#endregion



export {
    GetListeDevis
    ,GetdocumentDevis
}