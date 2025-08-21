//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec les factures

// import { HTMLEncode } from "../functions";
import { CallEndpoint, TelechargerDocument, VoirDocument } from "./WSGandara";



/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {DateSOAP} dateDebut 
 * @param {DateSOAP} dateFin 
 * @param {Function} setData 
 */
const GetListeFactures = async (token, guid, dateDebut, dateFin, setData) => {
    await CallEndpoint("GetFactures", {
        token: token,
        guid: guid,
        dateDebut: dateDebut,
        dateFin: dateFin,
    }, setData);
    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetFactures",

    //   data: {
    //     token: token,
    //     guid: guid,
    //     dateDebut: dateDebut,
    //     dateFin: dateFin,
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


/**
 * 
 * @param {string} token 
 * @param {Number} IdFacture 
 * @param {Number} TypeFacture 
 * @param {Number} Avoir 
 * @param {Boolean} returnData 
 * @returns 
 */
const VoirFactureDocument = async (
    token,
    IdFacture,
    TypeFacture,
    Avoir,
    returnData
) => {

    if (returnData) {
        let _return = await CallEndpoint("GetFactureDocument", {
            token: token,
            IdFacture: IdFacture,
            TypeFacture: TypeFacture,
            Avoir: Number(Avoir),
        }, null, true);
        return JSON.parse(_return);
    }

    let targetWindow = window.open("/waiting");

    await CallEndpoint("GetFactureDocument", {
        token: token,
        IdFacture: IdFacture,
        TypeFacture: TypeFacture,
        Avoir: Number(Avoir),
    }, (data) => { VoirDocument(data.v, data.k, targetWindow); })


    //     if (returnData) {
    //       let _return = undefined;
    //       await $.ajax({
    //         type: "POST",
    //         url: getUrlFromCookie() + "GetFactureDocument",
    //         data: {
    //           token: token,
    //           IdFacture: IdFacture,
    //           TypeFacture: TypeFacture,
    //           Avoir: Number(Avoir),
    //         },
    //         success(data) {
    //           const _kv = JSON.parse(data);
    //           _return = _kv;
    //         },
    //       });

    //       return _return;
    //     } else {
    //       let targetWindow = window.open("/waiting");
    //       $.ajax({
    //         type: "POST",
    //         url: getUrlFromCookie() + "GetFactureDocument",
    //         data: {
    //           token: token,
    //           IdFacture: IdFacture,
    //           TypeFacture: TypeFacture,
    //           Avoir: Number(Avoir),
    //         },
    //         success(data) {
    //           const _kv = JSON.parse(data);
    //           VoirDocument(_kv.v, _kv.k, targetWindow);
    //         },
    //         error(error) {
    //           targetWindow.location.href = `/error?error=${error.status}`;
    //         },
    //       });
    //     }
};


/**
 * 
 * @param {string} token 
 * @param {Number} IdFacture 
 * @param {Number} TypeFacture 
 * @param {Number} Avoir 
 */
const TelechargerFactureDocument = async (
    token,
    IdFacture,
    TypeFacture,
    Avoir
) => {
    let targetWindow = window.open("/waiting");

    await CallEndpoint("GetFactureDocument", {
        token: token,
        IdFacture: IdFacture,
        TypeFacture: TypeFacture,
        Avoir: Number(Avoir),
    }, (data) => { TelechargerDocument(data.v, data.k, targetWindow); })
    // $.ajax({
    //   type: "POST",
    //   url: getUrlFromCookie() + "GetFactureDocument",
    //   data: {
    //     token: token,
    //     IdFacture: IdFacture,
    //     TypeFacture: TypeFacture,
    //     Avoir: Number(Avoir),
    //   },
    //   success(data) {
    //     const _kv = JSON.parse(data);
    //     TelechargerDocument(_kv.v, _kv.k, targetWindow);
    //   },
    //   error(error) {
    //     targetWindow.location.href = `/error?error=${error.status}`;
    //   },
    // });
};


export {
    GetListeFactures
    , VoirFactureDocument
    , TelechargerFactureDocument
}

