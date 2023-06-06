//#region Imports
import axios from "axios";
//#endregion


//#region Données
const WSURL = "http://webservices.gandarasolution.fr:8039/WSGandara?wsdl";
//#endregion



//#region Fonction privées

/**
 * Vérifie si la requete n'a pas retourné une erreur unthaurised
 * @param {string} data La reponse XML sous forme de string 
 * @returns Si il y a une erreur
 */
const IsContainingError = (data) => {
  if (data.includes("faultstring")) {
    return true;
  }

  return false;
};


/**
 * Décompile l'enveloppe pour récupérer que la réponse
 * @param {*} data La réponse.data
 * @param {*} name Le nom du endpoint
 * @returns 
 */
const ParseData = (data, name) => {

  if (IsContainingError(data)) {
    return "401";
  }

  //Substring au format >RESULT<
  let _subConnexionResultWithOpenningTag = data.substring(
    data.indexOf(`<${name}Result`) + `<${name}Result`.length,
    data.lastIndexOf(`</${name}Result>`) + 1
  );

  //Trim la fin du tag d'entrée du Résult
  let _indexOfR = _subConnexionResultWithOpenningTag.indexOf(">") + 1;
  let _indexOfL = _subConnexionResultWithOpenningTag.lastIndexOf("<");
  let _subStringResult = _subConnexionResultWithOpenningTag.substring(
    _indexOfR,
    _indexOfL
  );

  return _subStringResult;
};

/**
 * Construit une enveloppe XML pour la reqête d'axios
 * @param {String} TemName Le nom du endpoint 
 * @param {*} arrayParam Les "tems" sous forme {key:'', value:''}
 * @returns Une string sous prête pour être utilisé par axios
 */
const CreateXML = (TemName, arrayParam) => {
  let _debut =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">    <soapenv:Header/>    <soapenv:Body>';
  let _temS = `<tem:${TemName}>`;
  let _temBody = arrayParam
    .map((tem) => {
      return `<tem:${tem.key}>${tem.value}</tem:${tem.key}>`;
    })
    .join("");
  let _temE = `</tem:${TemName}>`;
  let _fin = "</soapenv:Body></soapenv:Envelope>";

  return `${_debut}${_temS}${_temBody}${_temE}${_fin}`;
};

//#endregion


//#region Fonction publics

const Connexion = async (login, pass, setToken) => {
  let xml = CreateXML("Connexion", [
    { key: "login", value: login },
    { key: "pass_clear", value: pass },
  ]);
  // console.log(xml)
  axios
    .post(WSURL, xml, {
      headers: {
        "Content-Type": "text/xml",
        SOAPAction: "http://tempuri.org/IWSGandara/Connexion",
      },
    })
    .then((response) => {
      setToken(ParseData(response.data, "Connexion"));
    })
    .catch((error) => {
      setToken(error.response.status);
    });
};




const GetAppareils = async (token) => {
    
}

//#endregion

export { Connexion };
