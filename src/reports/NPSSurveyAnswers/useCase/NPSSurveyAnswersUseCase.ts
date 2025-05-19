import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";
import { NPSSurveyAnswers } from "../entities/NPSSurveyAnswers";
import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { getFirstAndLastDayOfMonth } from "@utils/formatDate";
import e from "express";

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

        const lessThanFive = this.shouldCheckSurveyLimit(companyId, users);

        return {
            lessThanFive,
            laborRisk: this.getLaborRisk(users, companyId),
            brandRisk: this.getBrandRisk(users, companyId),
            nps: this.getNps(users, companyId),
            realocateds: result
                ? this.getRealocateds(result, companyId)
                : "N/A",
            termination: this.getTermination(users, companyId),
            laborIssues: result
                ? this.getLaborIssues(result, companyId)
                : "N/A",
            welcomed: result
                ? this.getWelcomed(result, companyId, users)
                : "N/A",
            feelingMap: this.getFeelingMap(users, companyId),
            shutDown: this.getShutDown(users, companyId),
            realocatedCount: this.getRealocatedsNumber(users),
            general: {
                laborRisk: this.getLaborRisk(usersAll, companyId),
                brandRisk: this.getBrandRisk(usersAll, companyId),
                nps: this.getNps(usersAll, companyId),
                realocateds: `N/A`,
                termination: this.getTermination(usersAll, companyId),
                laborIssues: this.getLaborIssuesAllUsers(usersAll, companyId),
                welcomed: this.getWelcomed(usersAll, companyId, users),
                feelingMap: this.getFeelingMap(usersAll, companyId),
                shutDown: this.getShutDown(usersAll, companyId),
            },
        };
    }

    getRealocatedsNumber(users: any) {
        const realocateds = users.filter((user: any) => {
            return user.realocated == "REALOCATED";
        });

        return realocateds.length;
    }

    shouldCheckSurveyLimit(
        companyId: string,
        users: any[],
        filterUsers?: any[]
    ): boolean {
        const EXCEPTION_COMPANY_IDS = [
            "a62a66b5-2ad4-446d-af44-95679cb9d580",
            "4c92a342-98d1-4742-9962-d9e46b93b2e1",
            "cf0ce5e8-0038-4c9f-bce5-9ba1545c786f",
            "ded35643-7803-4019-9ed9-84c20e81af21",
            "a6375b9e-b1fa-4eea-a970-fec411693ca9",
        ];

        if (EXCEPTION_COMPANY_IDS.includes(companyId)) {
            return false;
        }

        const targetUsers = filterUsers || users;
        return targetUsers.filter((user) => user?.surveyAnswered).length <= 5;
    }

    getLaborRisk(users: any, companyId: any) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
            return "N/A";
        }

        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });

        let laborRisk: number = npsSurveyAnswers.reduce(
            (laborRisckTotal = 0, user) => {
                return laborRisckTotal + user.laborRisk * 1;
            },
            0
        );

        return (10 - laborRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getTermination(users: any, companyId) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
            return "N/A";
        }
        const laborRiskData = [];
        const lastAnswers = [];

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

    getLaborIssues(users: any, companyId) {
        const filterUsers = users.filter((employee: any) => {
            return employee.userId;
        });

        if (!this.shouldCheckSurveyLimit(companyId, filterUsers)) {
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

    getLaborIssuesAllUsers(users: any, companyId) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
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

    getBrandRisk(users: any, companyId: any) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
            return "N/A";
        }
        const npsSurveyAnswers = users.filter((npsSurvey) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });

        let brandRisk: number = npsSurveyAnswers.reduce(
            (brandRisckTotal = 0, user: any) => {
                return brandRisckTotal + user.brandRisk * 1;
            },
            0
        );

        return (10 - brandRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getNps(users: any, companyId: any) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
            return "N/A";
        }
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

    getRealocateds(users: any, companyId) {
        const filterUsers = users.filter((employee: any) => {
            return employee.userId;
        });

        if (filterUsers.length === 0) {
            return "0%";
        }

        const realocateds = filterUsers.filter((user: any) => {
            return user.user?.realocated == "REALOCATED";
        });

        return (
            ((realocateds.length / filterUsers.length) * 100).toFixed(2) + "%"
        );
    }

    getWelcomed(empployee: CompanyEmployee[], companyId, users) {
        const countAccepted = empployee.filter(
            (user: CompanyEmployee) => user.accepted
        ).length;

        return `${countAccepted}/${empployee.length}`;
    }

    getFeelingMap(users: any, companyId) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
            return [];
        }
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

    getShutDown(users: any, companyId) {
        if (this.shouldCheckSurveyLimit(companyId, users)) {
            return [];
        }
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
