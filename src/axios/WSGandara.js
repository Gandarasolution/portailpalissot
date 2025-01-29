import $ from "jquery";
import { cyrb53 } from "../functions";

/**
 * Appel le WS (ajax) via l'url stocké en cookie ou l'url fourni 
 * @param {string} endpoint La terminaison à joindre
 * @param {Object} data Les données POST {champs: valeur}
 * @param {?Function} callbackResponseSuccess La fonction qui utilise la réponse
 * @param {Boolean} mustReturnResponse  Si vrai la fonction retourne la réponse
 * @param {?string} urlToUse L'url à utiliser (autre que celle stocké en cookie)
 */
const callEndpoint = async (endpoint, data, callbackResponseSuccess, mustReturnResponse, urlToUse) => {

    //Récupération de l'URL 
    let _url = "";

    if (urlToUse) {
        _url = urlToUse;
    } else {
        //Récupération de l'URL dans le cookie
        let _cookieName = cyrb53("wsEntrepriseNameHashed");
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${_cookieName}=`))
            ?.split("=")[1];

        if (cookieValue && cookieValue?.length > 0) {
            _url = decodeURIComponent(cookieValue);
        }
    }

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
        callbackResponseSuccess(xhr?.status);
        console.log(error);
        console.log("Erreur lors du endpoint ", endpoint);
        console.log("avec les donnes ", data);
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
        url: _url + endpoint,
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


export { callEndpoint, };