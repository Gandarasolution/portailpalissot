//#region Imports
import $ from 'jquery'; 

//#endregion


//#region Données
//  const urlAction = "https://phpgao.000webhostapp.com/?endpoint=";
  const urlAction =`http://localhost:8000/WSGandara.php?endpoint=`;


//#endregion



//#region Fonction publics

const Connexion = async (login, pass, setToken) => {
 
  $.ajax({
      type: "POST",
      url: urlAction+"Connexion",
      data: {login: login, pass_clear: pass},
      success(data) {
        setToken(data);
      },
  });

};

const GetPrestationContrat = async (token, dateDebut, dateFin, IdSite, setData) => {
  $.ajax({
    type: "POST",
    url: urlAction + "GetPrestationContrat",

    data: {
      token: token,
      dateDebut: dateDebut,
      dateFin: dateFin,
      IdSite: IdSite,
    },
    success(data) {
      console.log(dateDebut)
      console.log(dateFin)
      console.log(data);
      if(JSON.parse(JSON.stringify(data)) === "500") { setData([])}else
      {
        setData(JSON.parse(data));

      }
    },
  });
}






//#endregion

export { Connexion,GetPrestationContrat };
