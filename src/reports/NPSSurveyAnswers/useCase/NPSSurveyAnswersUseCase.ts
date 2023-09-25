import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { NPSSurveyAnswers } from "../entities/NPSSurveyAnswers";

@injectable()
class NPSSurveyAnswersUseCase {
    async execute({ companyId }) {
        const npsSurveyAnswers = new NPSSurveyAnswers();
        let users;
        let result;
        console.log(companyId.user);

        if (companyId === "TUDO") {
            users = await npsSurveyAnswers.reportAllusers();
            //console.log(users);
        } else if (companyId === "B2B") {
            users = await npsSurveyAnswers.reportAllUsersB2b();
            //console.log(users);
        } else if (companyId === "B2C") {
            users = await npsSurveyAnswers.reportAllUsersB2c();
            //console.log(users);
        } else {
            result = await npsSurveyAnswers.report(companyId);
            users = result.map((r) => r.user);
            //console.log(users);
            //console.log(result);
        }
        let usersAll = await npsSurveyAnswers.reportAllusers();
        //console.log(this.getBrandRisk(usersAll));
        //console.log(result);

        //console.log(this.getTermination(users));
        return {
            laborRisk: this.getLaborRisk(users),
            brandRisk: this.getBrandRisk(users),
            nps: this.getNps(users),
            realocateds: result ? this.getRealocateds(result) : "N/A",
            termination: this.getTermination(users),
            laborIssues: result ? this.getLaborIssues(result) : "N/A",
            welcomed: this.getWelcomed(users),
            feelingMap: this.getFeelingMap(users),
            shutDown: this.getShutDown(users),
            general: {
                laborRisk: this.getLaborRisk(usersAll),
                brandRisk: this.getBrandRisk(usersAll),
                nps: this.getNps(usersAll),
                realocateds: `N/A`,
                termination: this.getTermination(usersAll),
                laborIssues: this.getLaborIssuesAllUsers(usersAll),
                welcomed: this.getWelcomed(usersAll),
                feelingMap: this.getFeelingMap(usersAll),
                shutDown: this.getShutDown(usersAll),
            },
        };
        //return "test";
    }

    getLaborRisk(users: any) {
        //console.log(users);
        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });
        if (npsSurveyAnswers.length === 0) {
            return "N/A";
        }

        let laborRisk: number = npsSurveyAnswers.reduce(
            (laborRisckTotal = 0, user) => {
                return laborRisckTotal + user.laborRisk * 1;
            },
            0
        );

        return (10 - laborRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getTermination(users: any) {
        const laborRiskData = [];
        const lastAnswers = [];

        const countUsersResponded = users.filter((user: any) => {
            return user?.surveyAnswered;
        }).length;

        if (countUsersResponded === 0) {
            return "N/A";
        }

        for (const user of users) {
            //of serve para desmembrar um array e listar direto em uma variável
            //ele já tira o objeto e joga ele
            //o in ele pega o index de cada objeto listado
            if (user?.laborRiskJSON === undefined) {
                continue;
            }
            const laborRisks = JSON.parse(user.laborRiskJSON);

            if (Array.isArray(laborRisks)) {
                for (const laborRiskMapped of laborRisks) {
                    if (laborRiskMapped.index === 9) {
                        lastAnswers.push(laborRiskMapped);

                        continue;
                    }
                }
            }
        }
        return (
            (
                (1 -
                    lastAnswers.reduce((acc, curr) => {
                        if (curr.answer === 0) return acc + 1;
                        return acc;
                    }, 0) /
                        users.length) *
                100
            ).toFixed(2) + "%"
        );
    }

    getLaborIssues(users: any) {
        const filterUsers = users.filter((employee: any) => {
            return employee.userId;
        });

        if (filterUsers.length === 0) {
            return "N/A";
        }

        const laborRiskAlerts = filterUsers.filter((user: any) => {
            return user.user.laborRiskAlert == "ALERT";
        });
        return (
            ((laborRiskAlerts.length / filterUsers.length) * 100).toFixed(2) +
            "%"
        );
    }

    getLaborIssuesAllUsers(users: any) {
        const filteredUsers = users.filter((user: any) => {
            return user.companyId !== null && user.companyId !== undefined;
        });

        const laborRiskAlerts = users.filter((user: any) => {
            return user.laborRiskAlert == "ALERT";
        });

        return ((filteredUsers.length / users.length) * 100).toFixed(2) + "%";
    }

    getBrandRisk(users: any) {
        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });
        if (npsSurveyAnswers.length === 0) {
            return "N/A";
        }

        let brandRisk: number = npsSurveyAnswers.reduce(
            (brandRisckTotal = 0, user: any) => {
                return brandRisckTotal + user.brandRisk * 1;
            },
            0
        );

        return (10 - brandRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getNps(users: any) {
        /*  try { */
        //fazer um if para verificar diferente de undefined e de zero
        const countUsersResponded = users.filter((user: any) => {
            ////console.log(user)
            if (
                user?.surveyAnswered !== undefined &&
                user?.surveyAnswered !== 0
            )
                return user?.surveyAnswered;

            //a interrogação eu falo que pode ser nulo e se for pega a propriedade
            //se nao voce para aqui
        }).length;

        if (countUsersResponded === 0) {
            return "N/A";
        }

        //return countUsersResponded

        ////console.log(countUsersResponded)

        ////console.log('users', users)

        const result = users.reduce(
            (accumulators: any, user: any) => {
                ////console.log(companyEmployee.user?.NPSSurvey)
                ////console.log('npsAnswer',npsAnswer)
                //aqui eu consigo pegar as respostas dos usuários
                ////console.log(accumulators)
                //let totalAwnswers = 0

                if (
                    user?.NPSSurvey < 7 &&
                    user?.NPSSurvey !== undefined &&
                    user?.NPSSurvey !== 0
                ) {
                    accumulators.npsAnswersLassThanSeven += 1;
                    //totalAwnswers += 1
                }
                if (
                    user?.NPSSurvey > 8 &&
                    user?.NPSSurvey !== undefined &&
                    user?.NPSSurvey !== 0
                ) {
                    accumulators.npsAnswersMoreThanEight += 1;
                    //totalAwnswers += 1
                }
                //accumulators.totalAwnswers = totalAwnswers

                ////console.log(accumulators)
                return accumulators;
            },
            { npsAnswersLassThanSeven: 0, npsAnswersMoreThanEight: 0 }
        );
        ////console.log(users.length)
        ////console.log(result)

        ////console.log(countUsersResponded)
        return (
            (result.npsAnswersMoreThanEight / countUsersResponded -
                result.npsAnswersLassThanSeven / countUsersResponded) *
            100
        ).toFixed(2);
    }

    /* catch (error) {
        //console.log(error)
      }
      */
    getRealocateds(users: any) {
        /* const realocateds = users.filter((user: any) => {
            return user.user?.realocateds == "REALOCATED";
          
        })

        const countRealocateds = realocateds.length;
        //console.log(countRealocateds)
      } */

        const filterUsers = users.filter((employee: any) => {
            return employee.userId;
        });

        const realocateds = filterUsers.filter((user: any) => {
            ////console.log(user.user.realocated);
            return user.user?.realocated == "REALOCATED";
        });

        if (filterUsers.length === 0) {
            return "N/A";
        }

        /* //console.log(realocateds.length)
    //console.log(users.length) */
        ////console.log(realocateds.length);
        ////console.log(filterUsers.length);
        return (
            ((realocateds.length / filterUsers.length) * 100).toFixed(2) + "%"
        );
    }

    getWelcomed(users: any) {
        /*  const filterUsers = users.filter((user: any) => {
            return user.user?.surveyAnswered;
        });
 */

        const filterUsers = users.length;
        ////console.log(filterUsers.length);

        const countAccepted = users.filter((user: any) => {
            if (user?.accepted != undefined)
                ////console.log(user.accepted);
                return user.accepted;
        }).length;
        ////console.log(filterUsers.length);
        ////console.log(countAccepted);
        return `${countAccepted}/${filterUsers}`;
    }

    getFeelingMap(users: any) {
        const feelingsMapData = [];
        for (const user of users) {
            //of serve para desmembrar um array e listar direto em uma variável
            //ele já tira o objeto e joga ele
            //o in ele pega o index de cada objeto listado
            if (user?.feelingsMapJSON === undefined) {
                continue;
            }
            const feelingsMap = JSON.parse(user?.feelingsMapJSON);

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
                    //console.log(feelingMapped);
                });
            }
        }
        return feelingsMapData;
    }

    getShutDown(users: any) {
        const laborRiskData = [];
        const lastAnswers = [];

        const countUsersResponded = users.filter((user: any) => {
            return user?.surveyAnswered;
        }).length;

        for (const user of users) {
            if (user?.laborRiskJSON === undefined) {
                continue;
            }
            const laborRisks = JSON.parse(user.laborRiskJSON);

            if (Array.isArray(laborRisks)) {
                for (const laborRiskMapped of laborRisks) {
                    if (laborRiskMapped.index === 9) {
                        lastAnswers.push(laborRiskMapped);
                        continue;
                    }

                    const findLaborRisk = laborRiskData.findIndex(
                        (laborRiskInserted) => {
                            ////console.log(laborRiskMapped);
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
                        //console.log(laborRiskMapped);
                    }
                }
            }
        }
        laborRiskData.forEach((laborRisk) => {
            laborRisk.count = (laborRisk.count / countUsersResponded).toFixed(
                2
            );
            //console.log(laborRisk.count);
            return laborRisk;
        });
        return laborRiskData;
    }
}
export { NPSSurveyAnswersUseCase };
