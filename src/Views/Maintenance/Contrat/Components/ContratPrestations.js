//#region Imports
import React from 'react';

//#region Bootstrap
import { Badge, Container } from 'react-bootstrap';

//#endregion

//#region Components
// import GridPrestation from './GridPrestation';
import WhiteShadowCard from '../../../../components/commun/WhiteShadowCard';
//#endregion


//#endregion


const ContratPrestation = ({ Prestations, Contrat }) => {


    function GetNomMois(num) {
        console.log(num)
        if (num > 12) {
            num = num - 12;
        }
        switch (num) {
            case 1:
                return "Jan.";
            case 2:
                return "Fév.";
            case 3:
                return "Mar.";
            case 4:
                return "Avr.";
            case 5:
                return "Mai";
            case 6:
                return "Juin";
            case 7:
                return "Juil.";
            case 8:
                return "Août";
            case 9:
                return "Sept.";
            case 10:
                return "Oct.";
            case 11:
                return "Nov.";
            case 12:
                return "Déc.";
            default: return null;

        }
    }
    const BadgeMonth = ( dateSouscrit ) => {
        let _dateTyped = new Date(dateSouscrit)
         _dateTyped = new Date(_dateTyped.toLocaleDateString("fr-FR"))
        console.log(_dateTyped)
        console.log(_dateTyped.getMonth())
        return(
            <Badge bg='danger' >
                {GetNomMois(_dateTyped.getMonth())}
            </Badge>
        )


    }



    return (

        <WhiteShadowCard icon="clock" title="Prestations :" >

            {/* <GridPrestation Prestations={Prestations} /> */}


            <Container fluid>
                <div>
                    {BadgeMonth(Contrat.DateSouscrit)}
                </div>


            </Container>




        </WhiteShadowCard>

    )

};

export default ContratPrestation;
