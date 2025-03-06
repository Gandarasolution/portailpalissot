//Ce fichier rassemble toutes les fonctions d'appel utilisée en rapport avec l'utilisateur

import { CallEndpoint } from "./WSGandara";



//#region Login

/**
 * Vérifie si l'URI est cannonique (pas besoin de code d'entreprise)
 * @returns boolean
 */
const IsURICanonnical = async () => {
  //L'url utilisé pour récupérer l'url du webservice
  let _urlTemp = "https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";
  let _uri = window.location.host;

  //TODO : Endpoint
  //TEMP

  return ["test.gandarasolution.fr:3000",].includes(_uri);

  //

  return await CallEndpoint("IsURICannonical", { uri: _uri }, () => { }, true, _urlTemp);

}


/**
 * Récupère l'url du Webservice à utiliser.
 * @param {string} codeOrURL Le code d'entreprise ou l'url à tester 
 * @param {Function} setResponse La callback pour la réponse 
 */
const GetURLWs = async (codeOrURL, setResponse) => {
  //L'url utilisé pour récupérer l'url du webservice
  let _urlTemp = "https://extranet.palissot.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";
  _urlTemp = "https://dev.extranet.gandarasolution.fr/extranet/inc_librairie/GMAO/WSGandara.fct.php?endpoint=GMAO";
  // await CallEndpoint("GetURLWsEntreprise", { codeEntreprise: 'test2' }, setResponse, false, _urlTemp);
  await CallEndpoint("GetURLWsEntreprise", { codeEntreprise: codeOrURL }, setResponse, false, _urlTemp);

}


/**
 * Récupère le token de connexion
 * @param {string} login 
 * @param {String} pass 
 * @param {string} wsForToken 
 * @param {Function} setToken 
 */
const Connexion = async (login, pass, wsForToken, setToken) => {

  const callbackSet = (data) => {
    if (data === "Erreur de connexion") { setToken(500); }
    else {
      setToken(data);
    }
  }
  await CallEndpoint("Connexion", { login: login, pass_clear: pass }, callbackSet, false, wsForToken);
};

//#endregion


//#region Gestion de mot de passe

/**
 * 
 * @param {string} mail 
 * @param {Function} setData 
 */
const CreateTokenMDP = async (mail, setData) => {
  await CallEndpoint("CreateTokenMDP", { mail: mail }, setData);
}


/**
 * 
 * @param {string} token 
 * @param {string} newMdp 
 * @param {Function} setData 
 */
const ChangeMDP = async (token, newMdp, setData) => {
  await CallEndpoint("ChangeMDP", {
    token: token,
    newMDP: newMdp,
  }, setData);
}


/**
 * 
 * @param {string} token 
 * @param {string} newMdp 
 * @param {Function} setData 
 */
const UpdateMDP = async (token, newMdp, setData) => {
  await CallEndpoint("_UpdateMdp", {
    token: token,
    newMdp: newMdp,
  }, setData);
}

//#endregion


//#region Informations

/**
 * 
 * @param {string} token 
 * @param {Function} setData 
 */
const GetListeParametres = async (token, setData) => {
  await CallEndpoint("GetListeParametres", {
    token: token,
  }, setData);
};


/**
 * 
 * @param {string} token 
 * @param {Function} setData 
 */
const GetClientSiteContrat = async (token, setData) => {
  await CallEndpoint("GetClientSiteContrat", { token: token }, setData);
};

//#endregion

export {
  //login
  IsURICanonnical
  , GetURLWs
  , Connexion
  //Gestion MDP
  , CreateTokenMDP
  , ChangeMDP
  , UpdateMDP
  //Infos
  , GetListeParametres
  , GetClientSiteContrat
}


