import { NPSSurveyAnswers } from "../entities/NPSSurveyAnswers";
import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { getFirstAndLastDayOfMonth } from "@utils/formatDate";
import { SurveyQuestionsRepository } from "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository";
import { SurveyQuestion } from "@modules/company/infra/typeorm/entities/SurveyQuestions";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { VOLUNTARY_REASONS_KEYS } from "./ImportSurveyAnswersBatchUseCase";

class NPSSurveyAnswersUseCase {
    private surveyQuestionsRepository = new SurveyQuestionsRepository();

    private roleUser: string = "USER";

    async execute({ companyId, area, role, period, unity, dismissalType, gender, etnia, pcd, city, state }: { companyId: string; area: string; role: string; period: string; unity: string; dismissalType: string; gender: string; etnia: string; pcd: string; city: string; state: string }, userId: string) {
        const areaArray = area ? JSON.parse(area) : [];
        const roleArray = role ? JSON.parse(role) : [];
        const periodArray = period ? JSON.parse(period) : [];
        const unityArray = unity ? JSON.parse(unity) : [];
        const dismissalTypeArray = dismissalType ? JSON.parse(dismissalType) : [];
        const genderArray = gender ? JSON.parse(gender) : [];
        const etniaArray = etnia ? JSON.parse(etnia) : [];
        const pcdArray = pcd ? JSON.parse(pcd) : [];
        const cityArray = city ? JSON.parse(city) : [];
        const stateArray = state ? JSON.parse(state) : [];

        const isVoluntaryFilter =
            dismissalTypeArray.length === 1 &&
            dismissalTypeArray[0] === "voluntary";

        const npsSurveyAnswers = new NPSSurveyAnswers();
        const usersRepository = new UsersRepository();

        try {
            const user = await usersRepository.findById(userId);
            if (user) {
                this.roleUser = user.type;
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            this.roleUser = "USER";
        }

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
                periodArray.map((p: string) => getFirstAndLastDayOfMonth(p)),
                unityArray,
                dismissalTypeArray,
                genderArray,
                etniaArray,
                pcdArray,
                cityArray,
                stateArray
            );

            users = result
                .map((r: any) => r.user)
                .filter((user: any) => user != null);
        }

        let usersAll = await npsSurveyAnswers.reportAllusers();

        //só aplico a exceção se não tiver filtros de cargo, área, unidade e tipo de demissão para manter o anonimato
        const shouldApplyException: boolean =
            areaArray.length === 0 &&
            roleArray.length === 0 &&
            unityArray.length === 0 &&
            dismissalTypeArray.length === 0 &&
            genderArray.length === 0 &&
            etniaArray.length === 0 &&
            pcdArray.length === 0 &&
            cityArray.length === 0 &&
            stateArray.length === 0;

        const insufficientSample = this.isSampleInsufficient(
            companyId,
            users,
            undefined,
            shouldApplyException
        );

        return {
            insufficientSample,
            laborRisk: this.getLaborRisk(
                users,
                companyId,
                shouldApplyException
            ),
            brandRisk: this.getBrandRisk(
                users,
                companyId,
                shouldApplyException
            ),
            nps: this.getNps(users, companyId, shouldApplyException),
            realocateds: insufficientSample
                ? "Sem informações"
                : this.getRealocateds(result || users, companyId),

            termination: this.getTermination(
                users,
                companyId,
                shouldApplyException
            ),
            laborIssues: result
                ? this.getLaborIssues(result, companyId, shouldApplyException)
                : "Sem informações",
            welcomed:
                result && !insufficientSample
                    ? this.getWelcomed(result, companyId, users)
                    : "Sem informações",
            feelingMap: this.getFeelingMap(
                users,
                companyId,
                shouldApplyException
            ),
            voluntaryReasonsMap: isVoluntaryFilter
                ? this.getVoluntaryReasonsMap(users, companyId, shouldApplyException)
                : [],
            shutDown: this.getShutDown(users, companyId, shouldApplyException),
            realocatedCount: insufficientSample
                ? 0
                : this.getRealocatedsNumber(users),
            companyQuestions: insufficientSample
                ? []
                : await this.getAnswersCompanyQuestions(users, companyId),
            general: {
                laborRisk: this.getLaborRisk(usersAll, companyId),
                brandRisk: this.getBrandRisk(usersAll, companyId),
                nps: this.getNps(usersAll, companyId),
                realocateds: `Sem informações`,
                termination: this.getTermination(usersAll, companyId),
                laborIssues: this.getLaborIssuesAllUsers(usersAll, companyId),
                welcomed: this.getWelcomed(usersAll, companyId, users),
                feelingMap: this.getFeelingMap(usersAll, companyId),
                voluntaryReasonsMap: isVoluntaryFilter
                    ? this.getVoluntaryReasonsMap(usersAll, companyId)
                    : [],
                shutDown: this.getShutDown(usersAll, companyId),
            },
        };
    }

    getRealocatedsNumber(users: any) {
        const realocateds = users.filter((user: any) => {
            return user?.realocated == "REALOCATED";
        });

        return realocateds.length;
    }

    async getAnswersCompanyQuestions(users: any, companyId: any) {
        const companyQuestions =
            await this.surveyQuestionsRepository.listByCompanyId(companyId);
        const usersFilterred = users.filter(
            (user: any) => user.surveyQuestion !== null && user.surveyQuestion !== ""
        );

        const result: (SurveyQuestion & { answers?: any[] })[] = [...companyQuestions];

        for (const user of usersFilterred) {
            const surveyQuestions = JSON.parse(user.surveyQuestion);
            for (const surveyQuestion of surveyQuestions) {
                result.forEach((question) => {
                    if (question.id === surveyQuestion.questionId) {
                        question.answers = question.answers || [];
                        question.answers.push(surveyQuestion.answer);
                    }
                });
            }
        }

        return result;
    }

    getAnonymityMinRespondents(): number {
        const raw = process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        const parsed = raw === undefined || raw === "" ? NaN : Number(raw);

        if (!Number.isFinite(parsed) || parsed < 0) {
            return 5;
        }

        return Math.floor(parsed);
    }

    /**
     * Returns true when filter-specific metrics must be omitted (sample ≤ X).
     * ADMIN bypasses the threshold (MVP). COMPANY_ADMIN never bypasses.
     * EXCEPTION_COMPANY_IDS does not apply to COMPANY_ADMIN.
     */
    isSampleInsufficient(
        companyId: string,
        users: any[],
        filterUsers?: any[],
        shouldApplyException: boolean = true
    ): boolean {
        if (!users || users.length === 0) {
            return true;
        }

        if (this.roleUser === "ADMIN") {
            return false;
        }

        const EXCEPTION_COMPANY_IDS = [
            "a62a66b5-2ad4-446d-af44-95679cb9d580",
            "4c92a342-98d1-4742-9962-d9e46b93b2e1",
            "cf0ce5e8-0038-4c9f-bce5-9ba1545c786f",
            "ded35643-7803-4019-9ed9-84c20e81af21",
            "a6375b9e-b1fa-4eea-a970-fec411693ca9",
        ];

        if (
            this.roleUser !== "COMPANY_ADMIN" &&
            EXCEPTION_COMPANY_IDS.includes(companyId) &&
            shouldApplyException
        ) {
            return false;
        }

        const targetUsers = filterUsers || users;
        const answeredCount = targetUsers.filter(
            (user) => user?.surveyAnswered
        ).length;
        const minRespondents = this.getAnonymityMinRespondents();

        return answeredCount <= minRespondents;
    }

    getLaborRisk(
        users: any,
        companyId: any,
        shouldApplyException: boolean = true
    ) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return "Sem informações";
        }

        const npsSurveyAnswers = users.filter((npsSurvey: any) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });

        if (npsSurveyAnswers.length === 0) {
            return "Sem informações";
        }

        const laborRisk: number = npsSurveyAnswers.reduce(
            (laborRisckTotal: number, user: any) => {
                return laborRisckTotal + user.laborRisk * 1;
            },
            0
        );

        return (10 - laborRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getTermination(
        users: any,
        companyId: any,
        shouldApplyException: boolean = true
    ) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return "Sem informações";
        }
        const lastAnswers: any[] = [];

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

    getLaborIssues(
        users: any,
        companyId: any,
        shouldApplyException: boolean = true
    ) {
        if (this.roleUser === "ADMIN") {
            shouldApplyException = false;
        }

        const normalizedUsers = users.map((employee: any) => {
            if (employee?.user) return employee.user;
            return employee;
        });

        const filterUsers = normalizedUsers.filter((user: any) => user?.id);

        if (
            this.isSampleInsufficient(
                companyId,
                filterUsers,
                undefined,
                shouldApplyException
            )
        ) {
            return "Sem informações";
        }

        const laborRiskAlerts = filterUsers.filter((user: any) => {
            return user?.laborRiskAlert === "ALERT";
        });

        return (
            ((laborRiskAlerts.length / filterUsers.length) * 100).toFixed(2) + "%"
        );
    }

    getLaborIssuesAllUsers(users: any, companyId: any) {
        if (this.isSampleInsufficient(companyId, users)) {
            return "Sem informações";
        }

        const filteredUsers = users.filter((user: any) => {
            return user.companyId !== null && user.companyId !== undefined;
        });

        const laborRiskAlerts = filteredUsers.filter((user: any) => {
            return user.laborRiskAlert == "ALERT";
        });

        return ((laborRiskAlerts.length / users.length) * 100).toFixed(2) + "%";
    }

    getBrandRisk(
        users: any,
        companyId: any,
        shouldApplyException: boolean = true
    ) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return "Sem informações";
        }
        const npsSurveyAnswers = users.filter((npsSurvey: any) => {
            if (npsSurvey) {
                return npsSurvey.surveyAnswered;
            }
        });

        if (npsSurveyAnswers.length === 0) {
            return "Sem informações";
        }

        let brandRisk: number = npsSurveyAnswers.reduce(
            (brandRisckTotal = 0, user: any) => {
                return brandRisckTotal + user.brandRisk * 1;
            },
            0
        );

        return (10 - brandRisk / npsSurveyAnswers.length).toFixed(2);
    }

    getNps(users: any, companyId: any, shouldApplyException: boolean = true) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return "Sem informações";
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
        if (countUsersResponded === 0) {
            return "Sem informações";
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

    getRealocateds(users: any, companyId: any) {
        const filterUsers = users[0]?.user !== undefined
            ? users.filter((employee: any) => employee.userId && employee.user)
            : users.filter((user: any) => user != null);

        if (filterUsers.length === 0) {
            return "0%";
        }

        const realocateds = filterUsers.filter((user: any) => {
            const status = user.user?.realocated || user.realocated;
            return status === "REALOCATED";
        });

        return (
            ((realocateds.length / filterUsers.length) * 100).toFixed(2) + "%"
        );
    }

    getWelcomed(empployee: CompanyEmployee[], companyId: any, users: any) {
        const countAccepted = empployee.filter(
            (user: CompanyEmployee) => user.accepted
        ).length;

        return `${countAccepted}/${empployee.length}`;
    }

    getFeelingMap(users: any, companyId: any, shouldApplyException: boolean = true) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return [];
        }
        const feelingsMapData: any[] = [];

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
                    if (feelingMapped.checked === false) {
                        return;
                    }

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

    getVoluntaryReasonsMap(
        users: any,
        companyId: any,
        shouldApplyException: boolean = true
    ) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return [];
        }

        const reasonsMapData: any[] = [];

        const usersResponded = users.filter(
            (user: any) => user?.surveyAnswered === true && user?.dismissalReasonsJSON
        );

        for (const user of usersResponded) {
            const reasonsMap = JSON.parse(user.dismissalReasonsJSON);

            if (Array.isArray(reasonsMap)) {
                reasonsMap.forEach((reasonMapped: any) => {
                    if (!reasonMapped.checked) return;

                    const findReason = reasonsMapData.findIndex(
                        (r) => r.reason === reasonMapped.reason
                    );

                    if (findReason >= 0) {
                        reasonsMapData[findReason].count++;
                    } else {
                        reasonsMapData.push({ reason: reasonMapped.reason, count: 1 });
                    }
                });
            }
        }

        VOLUNTARY_REASONS_KEYS.forEach((key) => {
            if (!reasonsMapData.find((r) => r.reason === key)) {
                reasonsMapData.push({ reason: key, count: 0 });
            }
        });

        const total = usersResponded.length || 1;
        reasonsMapData.forEach((r) => {
            r.count = ((r.count / total) * 100).toFixed(2);
        });

        reasonsMapData.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));

        return reasonsMapData;
    }

    getShutDown(users: any, companyId: any, shouldApplyException: boolean = true) {
        if (
            this.isSampleInsufficient(
                companyId,
                users,
                undefined,
                shouldApplyException
            )
        ) {
            return [];
        }
        const laborRiskData: any[] = [];
        const lastAnswers: any[] = [];

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
                        if (laborRiskMapped.answer !== null && laborRiskMapped.answer !== undefined) {
                            laborRiskData[findLaborRisk].count += laborRiskMapped.answer * 1;
                            laborRiskData[findLaborRisk].respondents += 1;
                        }
                    } else {
                        laborRiskData.push({
                            ...laborRiskMapped,
                            count: laborRiskMapped.answer !== null && laborRiskMapped.answer !== undefined ? laborRiskMapped.answer * 1 : 0,
                            respondents: laborRiskMapped.answer !== null && laborRiskMapped.answer !== undefined ? 1 : 0,
                        });
                    }
                }
            }
        }
        laborRiskData.forEach((laborRisk) => {
            laborRisk.count = (laborRisk.count / laborRisk.respondents).toFixed(2);
            delete laborRisk.respondents;
            return laborRisk;
        });
        return laborRiskData;
    }
}
export { NPSSurveyAnswersUseCase };
