import { useParams } from "react-router-dom";
import ContratInfo from "./Components/ContratInformation";
import ContratPrestation from "./Components/ContratPrestations";



const ContratPage = () => {

    let { idContrat } = useParams();

const contrat = {IdContrat:idContrat, DateSouscrit: "12/04/2018", TypeContrat: "Classique : Du Lundi au Vendredi aux horaires de bureau", Indice:"Taux fixe",TypeFacturation:"A date d'anniversaire du contrat",Delai:"12h"}



    return  (
        <div className="container">
            <ContratInfo Contrat={contrat} />
            
            <ContratPrestation />
            

        </div>
    )
};

export default ContratPage;