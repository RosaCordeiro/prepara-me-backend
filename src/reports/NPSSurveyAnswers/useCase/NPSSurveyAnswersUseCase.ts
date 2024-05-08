import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { NPSSurveyAnswers } from "../entities/NPSSurveyAnswers";
import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { getFirstAndLastDayOfMonth } from "@utils/formatDate";

@injectable()
class NPSSurveyAnswersUseCase {
    async execute({ companyId, area, role, period, unity }) {
        const areaArray = area ? JSON.parse(area) : [];
        const roleArray = role ? JSON.parse(role) : [];
        const periodArray = period ? JSON.parse(period) : [];
        const unityArray = unity ? JSON.parse(unity) : [];

        const npsSurveyAnswers = new NPSSurveyAnswers();
        let users;
        let result;

        if (companyId === "TUDO") {
            users = await npsSurveyAnswers.reportAllusers();
        } else if (companyId === "B2B") {
            users = await npsSurveyAnswers.reportAllUsersB2b();
        } else if (companyId === "B2C") {
            users = await npsSurveyAnswers.reportAllUsersB2c();
        } else {
            result = await npsSurveyAnswers.report(
                companyId,
                areaArray,
                roleArray,
                periodArray.map((p) => getFirstAndLastDayOfMonth(p)),
                unityArray
            );

            users = result.map((r) => r.user);
        }

        let usersAll = await npsSurveyAnswers.reportAllusers();

        return {
            lessThanFive: users.length <= 5,
            laborRisk: this.getLaborRisk(users),
            brandRisk: this.getBrandRisk(users),
            nps: this.getNps(users),
            realocateds: result ? this.getRealocateds(result) : "N/A",
            termination: this.getTermination(users),
            laborIssues: result ? this.getLaborIssues(result) : "N/A",
            welcomed: result ? this.getWelcomed(result) : "N/A",
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

        if (filterUsers.length <= 5) {
            return "N/A";
        }

        const laborRiskAlerts = filterUsers.filter((user: any) => {
            return user?.user?.laborRiskAlert == "ALERT";
        });
        return (
            ((laborRiskAlerts.length / filterUsers.length) * 100).toFixed(2) +
            "%"
        );
    }

    getLaborIssuesAllUsers(users: any) {
        if (users.length <= 5) {
            return "N/A";
        }

        const filteredUsers = users.filter((user: any) => {
            return user.companyId !== null && user.companyId !== undefined;
        });

        const laborRiskAlerts = filteredUsers.filter((user: any) => {
            return user.laborRiskAlert == "ALERT";
        });

        return ((laborRiskAlerts.length / users.length) * 100).toFixed(2) + "%";
    }

    getBrandRisk(users: any) {
        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });

        if (npsSurveyAnswers.length <= 5) {
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
            //
            if (
                user?.surveyAnswered !== undefined &&
                user?.surveyAnswered !== 0
            )
                return user?.surveyAnswered;

            //a interrogação eu falo que pode ser nulo e se for pega a propriedade
            //se nao voce para aqui
        }).length;

        if (countUsersResponded <= 5) {
            return "N/A";
        }

        const result = users.reduce(
            (accumulators: any, user: any) => {
                //
                //
                //aqui eu consigo pegar as respostas dos usuários
                //
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
                }

                return accumulators;
            },
            { npsAnswersLassThanSeven: 0, npsAnswersMoreThanEight: 0 }
        );

        return (
            (result.npsAnswersMoreThanEight / countUsersResponded -
                result.npsAnswersLassThanSeven / countUsersResponded) *
            100
        ).toFixed(2);
    }

    getRealocateds(users: any) {
        const filterUsers = users.filter((employee: any) => {
            return employee.userId;
        });

        const realocateds = filterUsers.filter((user: any) => {
            return user.user?.realocated == "REALOCATED";
        });

        if (filterUsers.length <= 5) {
            return "N/A";
        }

        return (
            ((realocateds.length / filterUsers.length) * 100).toFixed(2) + "%"
        );
    }

    getWelcomed(empployee: CompanyEmployee[]) {
        const countAccepted = empployee.filter(
            (user: CompanyEmployee) => user.accepted
        ).length;

        return `${countAccepted}/${empployee.length}`;
    }

    getFeelingMap(users: any) {
        const feelingsMapData = [];

        const usersResponded = users.filter((user: any) => {
            return user?.surveyAnswered === true;
        });

        for (const user of usersResponded) {
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
                });
            }
        }

        feelingsMapData.forEach((feeling) => {
            feeling.count = (
                (feeling.count / usersResponded.length) *
                100
            ).toFixed(2);
        });

        feelingsMapData.sort((a, b) => {
            return b.feeling - a.feeling;
        });

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
                            //
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
                    }
                }
            }
        }
        laborRiskData.forEach((laborRisk) => {
            laborRisk.count = (laborRisk.count / countUsersResponded).toFixed(
                2
            );

            return laborRisk;
        });
        return laborRiskData;
    }
}
export { NPSSurveyAnswersUseCase };
