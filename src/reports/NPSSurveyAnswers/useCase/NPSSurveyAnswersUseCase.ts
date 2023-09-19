import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { NPSSurveyAnswers } from "../entities/NPSSurveyAnswers";

@injectable()
class NPSSurveyAnswersUseCase {
    async execute({ companyId }) {
        const npsSurveyAnswers = new NPSSurveyAnswers();

        const result = await npsSurveyAnswers.report(companyId);
        /* 
        console.log(this.getLaborRisk(result));

        console.log(this.getBrandRisk(result));

        console.log(this.getNps(result));

        console.log(this.getRealocateds(result));

        console.log(this.getWelcomed(result));

        console.log(this.getFeelingMap(result));

        console.log(this.getShutDown(result)); */

        return {
            laborRisk: this.getLaborRisk(result),
            brandRisk: this.getBrandRisk(result),
            nps: this.getNps(result),
            realocateds: this.getRealocateds(result),
            welcomed: this.getWelcomed(result),
            feelingMap: this.getFeelingMap(result),
            shutDown: this.getShutDown(result),
        };
    }

    getLaborRisk(users: any) {
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

        return (10 - laborRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getBrandRisk(users: any) {
        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey.user) {
                return npsSurvey.user.surveyAnswered;
            }
        });

        let brandRisk: number = npsSurveyAnswers.reduce(
            (brandRisckTotal = 0, employee) => {
                return brandRisckTotal + employee.user.brandRisk;
            },
            0
        );

        return (10 - brandRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getNps(users: any) {
        /*  try { */
        //fazer um if para verificar diferente de undefined e de zero
        const countUsersResponded = users.filter((user: any) => {
            //console.log(user)
            if (
                user.user?.surveyAnswered !== undefined &&
                user.user?.surveyAnswered !== 0
            )
                return user.user?.surveyAnswered;

            //a interrogação eu falo que pode ser nulo e se for pega a propriedade
            //se nao voce para aqui
        }).length;

        //return countUsersResponded

        //console.log(countUsersResponded)

        //console.log('users', users)

        const result = users.reduce(
            (accumulators: any, companyEmployee: any) => {
                //console.log(companyEmployee.user?.NPSSurvey)
                //console.log('npsAnswer',npsAnswer)
                //aqui eu consigo pegar as respostas dos usuários
                //console.log(accumulators)
                //let totalAwnswers = 0

                if (
                    companyEmployee.user?.NPSSurvey < 7 &&
                    companyEmployee.user?.NPSSurvey !== undefined &&
                    companyEmployee.user?.NPSSurvey !== 0
                ) {
                    accumulators.npsAnswersLassThanSeven += 1;
                    //totalAwnswers += 1
                }
                if (
                    companyEmployee.user?.NPSSurvey > 8 &&
                    companyEmployee.user?.NPSSurvey !== undefined &&
                    companyEmployee.user?.NPSSurvey !== 0
                ) {
                    accumulators.npsAnswersMoreThanEight += 1;
                    //totalAwnswers += 1
                }
                //accumulators.totalAwnswers = totalAwnswers

                //console.log(accumulators)
                return accumulators;
            },
            { npsAnswersLassThanSeven: 0, npsAnswersMoreThanEight: 0 }
        );
        //console.log(users.length)
        //console.log(result)

        //console.log(countUsersResponded)
        return (
            result.npsAnswersMoreThanEight / countUsersResponded -
            result.npsAnswersLassThanSeven / countUsersResponded
        ).toFixed(2);
    }

    /* catch (error) {
        console.log(error)
      }
      */
    getRealocateds(users: any) {
        /* const realocateds = users.filter((user: any) => {
            return user.user?.realocateds == "REALOCATED";
          
        })

        const countRealocateds = realocateds.length;
        console.log(countRealocateds)
      } */

        const filterUsers = users.filter((employee) => {
            return employee.userId;
        });

        const realocateds = filterUsers.filter((user: any) => {
            //console.log(user.user.realocated);
            return user.user?.realocated == "REALOCATED";
        });
        /* console.log(realocateds.length)
    console.log(users.length) */
        //console.log(realocateds.length);
        //console.log(filterUsers.length);
        return ((realocateds.length / filterUsers.length) * 100).toFixed(2);
    }

    getWelcomed(users: any) {
        /*  const filterUsers = users.filter((user: any) => {
            return user.user?.surveyAnswered;
        });
 */

        const filterUsers = users.length;
        //console.log(filterUsers.length);

        const countAccepted = users.filter((user: any) => {
            if (user?.accepted != undefined)
                //console.log(user.accepted);
                return user.accepted;
        }).length;
        //console.log(filterUsers.length);
        //console.log(countAccepted);
        return `${countAccepted}/${filterUsers}`;
    }

    getFeelingMap(users: any) {
        const feelingsMapData = [];
        for (const user of users) {
            //of serve para desmembrar um array e listar direto em uma variável
            //ele já tira o objeto e joga ele
            //o in ele pega o index de cada objeto listado
            if (user?.user?.feelingsMapJSON === undefined) {
                continue;
            }
            const feelingsMap = JSON.parse(user?.user?.feelingsMapJSON);

            if (Array.isArray(feelingsMap)) {
                feelingsMap.forEach((feelingMapped) => {
                    const findFeeling = feelingsMapData.findIndex(
                        (feelingInserted) => {
                            return (
                                feelingMapped.feeling == feelingInserted.feeling
                            );
                        }
                    );

                    if (findFeeling >= 0) {
                        feelingsMapData[findFeeling].count++;
                    } else {
                        feelingsMapData.push({ ...feelingMapped, count: 1 });
                    }
                    console.log(feelingMapped);
                });
            }
        }
        return feelingsMapData;
    }

    getShutDown(users: any) {
        const laborRiskData = [];
        const lastAnswers = [];

        const countUsersResponded = users.filter((user: any) => {
            return user.user?.surveyAnswered;
        }).length;

        for (const user of users) {
            if (user?.user?.laborRiskJSON === undefined) {
                continue;
            }
            const laborRisks = JSON.parse(user.user.laborRiskJSON);

            if (Array.isArray(laborRisks)) {
                for (const laborRiskMapped of laborRisks) {
                    if (laborRiskMapped.index === 9) {
                        lastAnswers.push(laborRiskMapped);
                        continue;
                    }

                    const findLaborRisk = laborRiskData.findIndex(
                        (laborRiskInserted) => {
                            //console.log(laborRiskMapped);
                            return (
                                laborRiskMapped.question ==
                                laborRiskInserted.question
                            );
                        }
                    );

                    if (findLaborRisk >= 0) {
                        laborRiskData[findLaborRisk].count +=
                            laborRiskMapped.answer * 1;
                    } else {
                        laborRiskData.push({
                            ...laborRiskMapped,
                            count: laborRiskMapped.answer * 1,
                        });
                        console.log(laborRiskMapped);
                    }
                }

                /*  laborRiskData.forEach((laborRisk) => {
                    laborRisk.count = (
                        laborRisk.count / countUsersResponded
                    ).toFixed(2);
                    console.log(laborRisk.count);
                    return laborRisk;
                });
 */
                return laborRiskData;
            }
        }
    }
}
export { NPSSurveyAnswersUseCase };

