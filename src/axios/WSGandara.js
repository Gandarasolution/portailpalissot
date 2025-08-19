import $ from "jquery";
import { cyrb53, HTMLEncode, IsUserFromToken } from "../functions";


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
    let _return;
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

    console.log(data);

    if(data.token && IsUserFromToken(data.token))
    {
        // console.log(data.token.substring(0,2));
        data.token = data.token.substring(2,data.token.length)
    }
    

//  if(endpoint === "GetClientSiteBySearch")
//  {
//     callbackResponseSuccess(      [{"AdresseClientSite":"ZA GIRANAUX \r\nBP 71 70100 ARC LES GRAY","CoordonneesGPSClientSite":"47.458364,5.601228","DateSouscriptionContrat":"2012-03-22T00:00:00","GUID":"73e4d572-5408-458d-bc2b-f02ee2eee3af","IdContrat":2088,"IsLastSiteVisite":false,"NbPortail":{"KV":[{"k":"devis","v":"7"},{"k":"interventions","v":"3"},{"k":"appareils","v":"134"}]},"NomCompletClientSite":" SIMU 1"},{"AdresseClientSite":"10 - 12 Rue Garibaldi  25000 BESANCON","CoordonneesGPSClientSite":"47.248,6.02583","DateSouscriptionContrat":"2013-02-01T00:00:00","GUID":"e020846a-0c3a-46b0-912c-4304781d2cb0","IdContrat":2273,"IsLastSiteVisite":false,"NbPortail":{"KV":[{"k":"devis","v":"0"},{"k":"interventions","v":"0"},{"k":"appareils","v":"5"}]},"NomCompletClientSite":" Copropri\u00e9t\u00e9 Garibaldi"},{"AdresseClientSite":"2 a 4 Rue Maria Montessori 25000 BESANCON","CoordonneesGPSClientSite":"47.22483,5.95288","DateSouscriptionContrat":"2013-12-17T00:00:00","GUID":"2bdf5555-2412-4a4e-aa72-6010ae58dd44","IdContrat":2364,"IsLastSiteVisite":true,"NbPortail":{"KV":[{"k":"devis","v":"1"},{"k":"interventions","v":"0"},{"k":"appareils","v":"7"}]},"NomCompletClientSite":" R\u00e9sidence Le Bellevue"},{"AdresseClientSite":"15 Chemin des Bicqueys 25000 BESANCON","CoordonneesGPSClientSite":"47.2532,6.0523","DateSouscriptionContrat":"2015-10-01T00:00:00","GUID":"2f1e4196-38c9-4f49-8cf6-16914d8ec50f","IdContrat":2507,"IsLastSiteVisite":false,"NbPortail":{"KV":[{"k":"devis","v":"0"},{"k":"interventions","v":"0"},{"k":"appareils","v":"7"}]},"NomCompletClientSite":"Copropri\u00e9t\u00e9 LES RESIDENTIELS DE BREGILLE"},{"AdresseClientSite":"64 Avenue Jacques DUHAMEL 39100 DOLE","CoordonneesGPSClientSite":"47.087961,5.48593","DateSouscriptionContrat":"2023-10-30T00:00:00","GUID":"9c852e25-9a32-4614-8383-da448adc0269","IdContrat":3415,"IsLastSiteVisite":false,"NbPortail":{"KV":[{"k":"devis","v":"3"},{"k":"interventions","v":"1"},{"k":"appareils","v":"19"}]},"NomCompletClientSite":" Caserne Bigueur - Dole"},{"AdresseClientSite":"Rue des Vernottes 70100 ARC LES GRAY","CoordonneesGPSClientSite":"47.458897,5.602904","DateSouscriptionContrat":"2020-10-08T00:00:00","GUID":"ce0ae699-5fba-471c-a0c7-a2516e9f9b26","IdContrat":3147,"IsLastSiteVisite":false,"NbPortail":{"KV":[{"k":"devis","v":"2"},{"k":"interventions","v":"0"},{"k":"appareils","v":"40"}]},"NomCompletClientSite":" CROSSJECT"},{"AdresseClientSite":"23 Rue des Giranaux  70100 ARC LES GRAY","CoordonneesGPSClientSite":"47.459136,5.600863","DateSouscriptionContrat":"2024-01-23T00:00:00","GUID":"72e63a93-142f-475d-888c-f550d9676a64","IdContrat":3865,"IsLastSiteVisite":false,"NbPortail":{"KV":[{"k":"devis","v":"4"},{"k":"interventions","v":"0"},{"k":"appareils","v":"16"}]},"NomCompletClientSite":" CROSSJECT GIRANAUX"}]
// );
// return;
//  }

    //Appel ajax
   _return = await $.ajax({
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
            if (mustReturnResponse) {
                return _data;
            }
            if (callbackResponseSuccess) callbackResponseSuccess(_data);

        },
        error(xhr, status, error) {
            //La gestion de l'erreur se fait plus haut.
            ErrorHandling(xhr, status, error);
        }

    })
    if(mustReturnResponse) return _return;
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