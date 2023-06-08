//#region Imports
import $ from 'jquery'; 

//#endregion


//#region Données
 const urlAction = "https://phpgao.000webhostapp.com/?endpoint=";
  // const urlAction =`http://localhost:8000/WSGandara.php?endpoint=`;


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






//#endregion

export { Connexion };
