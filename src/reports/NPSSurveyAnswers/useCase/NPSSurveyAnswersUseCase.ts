import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { NPSSurveyAnswers } from "../entities/NPSSurveyAnswers";

@injectable()
class NPSSurveyAnswersUseCase {
    async execute({
        companyId
    }) {
        const npsSurveyAnswers = new NPSSurveyAnswers()

        const result = await npsSurveyAnswers.report(companyId)

        console.log(this.getLaborRisk(result))

        console.log(this.getBrandRisk(result))

        console.log(this.getNps(result))

        

        return result;
    }

    getLaborRisk(users: any){

        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey.user) {
              return npsSurvey.user.surveyAnswered;
            }
          });

        let laborRisk: number = npsSurveyAnswers.reduce(
            (laborRisckTotal = 0, employee) => {
              return laborRisckTotal + employee.user.laborRisk;
            },
            0
          );
    
          return (10 - (laborRisk / npsSurveyAnswers.length)).toFixed(2);

    }

    getBrandRisk(users: any){

        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey.user) {
              return npsSurvey.user.surveyAnswered;
            }
          });

        let brandRisk:number = npsSurveyAnswers.reduce(
            (brandRisckTotal = 0, employee) => {
              return brandRisckTotal + employee.user.brandRisk;
            },
            0
          );
    
          return (10 - (brandRisk / npsSurveyAnswers.length)).toFixed(2);
}


      getNps(users: any){

       /*  try { */
       //fazer um if para verificar diferente de undefined e de zero 
        const countUsersResponded = users.filter((user: any) => {
          //console.log(user)
          if(user.user?.surveyAnswered !== undefined && user.user?.surveyAnswered !== 0)

            return user.user?.surveyAnswered;
          
          //a interrogação eu falo que pode ser nulo e se for pega a propriedade
          //se nao voce para aqui
        }).length;

        //return countUsersResponded
        
        //console.log(countUsersResponded)

        //console.log('users', users)
        
        const result = users.reduce(

          (accumulators: any, companyEmployee: any) => {
            console.log(companyEmployee.user?.NPSSurvey)
            //console.log('npsAnswer',npsAnswer)
            //aqui eu consigo pegar as respostas dos usuários
            //console.log(accumulators)
            //let totalAwnswers = 0
            
            if (companyEmployee.user?.NPSSurvey < 7 && companyEmployee.user?.NPSSurvey !== undefined && companyEmployee.user?.NPSSurvey !== 0) {
              accumulators.npsAnswersLassThanSeven += 1;
              //totalAwnswers += 1
              
            }
            if (companyEmployee.user?.NPSSurvey > 8 && companyEmployee.user?.NPSSurvey !== undefined && companyEmployee.user?.NPSSurvey !== 0) {
              accumulators.npsAnswersMoreThanEight += 1;
              //totalAwnswers += 1
              
            }
            //accumulators.totalAwnswers = totalAwnswers

            console.log(accumulators)
            return accumulators;
          },
          { npsAnswersLassThanSeven: 0, npsAnswersMoreThanEight: 0 }
        );
        console.log(users.length)
  //console.log(result)
  
 console.log(countUsersResponded)
  return (result.npsAnswersMoreThanEight / countUsersResponded -
           result.npsAnswersLassThanSeven / countUsersResponded)
           .toFixed(2);

      
          
      }

      /* catch (error) {
        console.log(error)
      }
      */

      
}

export { NPSSurveyAnswersUseCase };
