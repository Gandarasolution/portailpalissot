//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec les clients/Sites

import { CallEndpoint } from "./WSGandara";



/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetListeTels = (token, guid, setData) => {
    return CallEndpoint("ListeTelsSelect", { token: token, guid: guid }, setData);
};

/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @param {Function} setData 
 * @returns 
 */
const GetListeMails = (token, guid, setData) => {
    return CallEndpoint(
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
    return CallEndpoint(
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
    return CallEndpoint(
        "GetListeSecteur",
        {
            token: token,
            guid: guid,
        },
        setData
    );
};



/**
 * Enregistre le dernier site visité
 * @param {string} token 
 * @param {guid} guid 
 * @returns 
 */
const SetLastSite = async (token,guid) =>{
    return CallEndpoint("SetLastSite",{
        token: token,
        guid: guid
    })
}


/**
 * 
 * @param {string} token 
 * @param {guid} guid 
 * @returns 
 */
const GetDashboardData = async (token, guid,setData) =>{
    return CallEndpoint("GetDashboardData",{
        token:token,
        guid: guid
    },setData)
}

export {
    GetListeTels
    , GetListeMails
    , GetNombrePortails
    , GetListeSecteur
    ,SetLastSite
    ,GetDashboardData
}


