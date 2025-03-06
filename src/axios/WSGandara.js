import $ from "jquery";
import { cyrb53, HTMLEncode } from "../functions";


const getUrlFromCookie = () => {
    let _cookieName = cyrb53("wsEntrepriseNameHashed");
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${_cookieName}=`))
        ?.split("=")[1];

    if (cookieValue && cookieValue?.length > 0) {
        return decodeURIComponent(cookieValue);
    }
}


const getWsFromCookie = ()=>{
    let _cookieName = cyrb53("wsEndpointName");
    const cookieValue = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${_cookieName}=`))
        ?.split("=")[1];

    if (cookieValue && cookieValue?.length > 0) {
        return decodeURIComponent(cookieValue);
    }}


/**
 * Appel le WS (ajax) via l'url stocké en cookie ou l'url fourni 
 * @param {string} endpoint La terminaison à joindre
 * @param {Object} data Les données POST {champs: valeur}
 * @param {?Function} callbackResponseSuccess La fonction qui utilise la réponse
 * @param {Boolean} mustReturnResponse  Si vrai la fonction retourne la réponse
 * @param {?string} urlToUse L'url à utiliser (autre que celle stocké en cookie)
 */
const CallEndpoint = async (endpoint, data, callbackResponseSuccess, mustReturnResponse, urlToUse) => {


    //Récupération de l'URL 
    let _url = "";

    if (urlToUse) {
        _url = urlToUse;
    } else {
        //Récupération de l'URL dans le cookie
        _url = getUrlFromCookie();
    }


    //EndpointTerm
    let _ws = "&ws=";
     _ws += getWsFromCookie();


    //Si aucun url récupéré
    if (_url.length === 0) {
        return;
    }

    /**
     * Gestion des erreurs
     * @param {jqXHR} xhr 
     * @param {string} status 
     * @param {?Object} error 
     */
    function ErrorHandling(xhr, status, error) {
        let _thrownError = new Error("Une erreur s'est produite");
        if(mustReturnResponse){
            return _thrownError;
        }
        if(callbackResponseSuccess) callbackResponseSuccess(_thrownError);
        // callbackResponseSuccess(xhr?.status);
        // console.log(xhr, status, error);
        // console.log("Erreur lors du endpoint ", endpoint);
        // console.log("avec les donnes ", data);
    }

    let _data = undefined;

    function isJSON(str) {
        try {
            return (JSON.parse(str) && !!str);
        } catch (e) {
            return false;
        }
    }
    //Appel ajax
    await $.ajax({
        type: "POST",
        url: _url + endpoint + _ws,
        data: data,
        success(data) {
            //Vérification erreur 500 manuelle
            if (JSON.parse(JSON.stringify(data)) && JSON.parse(JSON.stringify(data)) === "500") {
                ErrorHandling({ status: 500 }, "error", "Internal server error",);
                return;
            }

            _data = data;
            if (isJSON(data)) {
                _data = JSON.parse(data);
            }

            if (mustReturnResponse) return _data;

            if (callbackResponseSuccess) callbackResponseSuccess(_data);

        },
        error(xhr, status, error) {
            //La gestion de l'erreur se fait plus haut.
            ErrorHandling(xhr, status, error);
        }

    })


};



//#region Documents


const VoirDocument = (b64, filename, targetWindow) => {

    const callbackResponseSuccess = (data) => {
        const urlToOpen = `${getUrlFromCookie()}SeeDocument&filename=${data}`;
        if (targetWindow) {
            //Ouvre dans cette fenêtre
            targetWindow.location.href = urlToOpen;
        } else {
            //Ouvre dans une nouvelle fenetre
            window.open(urlToOpen, "_blank");
        }
    }
    CallEndpoint("File64", { b64: b64, filename: HTMLEncode(filename), callbackResponseSuccess })
};



const VoirDocumentOffice = async (b64, filename) => {
    let _urlRetour = undefined;

    const callbackResponseSuccess = (data) => {
        const urlToOpen = `${getUrlFromCookie()}SeeDocument&filename=${data}`;
        _urlRetour = urlToOpen;
    }
    await CallEndpoint("File64", { b64: b64, filename: HTMLEncode(filename) }, callbackResponseSuccess)

    // await $.ajax({
    //   type: "POST",
    //   url: `${getUrlFromCookie()}File64`,
    //   data: { b64: b64, filename: HTMLEncode(filename) },
    //   success(data) {
    //     const urlToOpen = `${getUrlFromCookie()}SeeDocument&filename=${data}`;
    //     _urlRetour = urlToOpen;
    //   },
    // });
    return _urlRetour;
};



const  TelechargerDocument = (b64, filename, targetWindow) => {

    const callbackResponseSuccess = (data) => {
        const urlToOpen = `${getUrlFromCookie()}DownloadDocument&filename=${data}`;
        if (targetWindow) {
            // targetWindow.location.href=urlToOpen;
            window.open(urlToOpen, "_blank");
            targetWindow.close();
        } else {
            window.open(urlToOpen, "_blank");
        }
    };
    CallEndpoint("File64", { b64: b64, filename: filename }, callbackResponseSuccess)

    // $.ajax({
    //   type: "POST",
    //   url: `${getUrlFromCookie()}File64`,
    //   data: { b64: b64, filename: filename },
    //   success(data) {
    //     const urlToOpen = `${getUrlFromCookie()}DownloadDocument&filename=${data}`;
    //     if (targetWindow) {
    //       // targetWindow.location.href=urlToOpen;
    //       window.open(urlToOpen, "_blank");
    //       targetWindow.close();
    //     } else {
    //       window.open(urlToOpen, "_blank");
    //     }
    //   },
    // });
};

const TelechargerZIP = (files, filename) => {
    const callbackResponseSuccess = (data) => {
        const urlToOpen = `${getUrlFromCookie()}DownloadDocument&filename=${data}`;
        window.open(urlToOpen, "_blank");
    }
    CallEndpoint("ZIPDocs", { arrayDocs: files, filename: filename }, callbackResponseSuccess);

    // $.ajax({
    //   type: "POST",
    //   url: `${getUrlFromCookie()}ZIPDocs`,
    //   data: { arrayDocs: files, filename: filename },
    //   success(data) {
    //     const urlToOpen = `${getUrlFromCookie()}DownloadDocument&filename=${data}`;
    //     window.open(urlToOpen, "_blank");
    //   },
    // });
};



//#endregion


export { CallEndpoint
    //Documents
    ,VoirDocument
    ,VoirDocumentOffice
    ,TelechargerDocument
    ,TelechargerZIP
 };