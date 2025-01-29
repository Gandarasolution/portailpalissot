//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec les clients/Sites

import { callEndpoint } from "./WSGandara";



/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetListeTels = (token, guid, setData) => {
    return callEndpoint("ListeTelsSelect", { token: token, guid: guid }, setData);
};

/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetListeMails = (token, guid, setData) => {
    return callEndpoint(
        "ListeMailsSelect",
        { token: token, guid: guid },
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
const GetNombrePortails = (token, guid, setData) => {
    return callEndpoint(
        "GetNombrePortails",
        { token: token, guid: guid },
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
    return callEndpoint(
        "GetListeSecteur",
        {
            token: token,
            guid: guid,
        },
        setData
    );
};



export {
    GetListeTels
    , GetListeMails
    , GetNombrePortails
    , GetListeSecteur
}


