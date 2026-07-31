import { NPSSurveyAnswersUseCase } from "./NPSSurveyAnswersUseCase";

jest.mock(
    "@modules/company/infra/typeorm/repositories/SurveyQuestionRepository",
    () => ({
        SurveyQuestionsRepository: jest.fn().mockImplementation(() => ({
            listByCompanyId: jest.fn().mockResolvedValue([]),
        })),
    })
);

function answeredUsers(count: number) {
    return Array.from({ length: count }, (_, i) => ({
        id: `u-${i}`,
        surveyAnswered: true,
    }));
}

describe("NPSSurveyAnswersUseCase anonymity", () => {
    const originalEnv = process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;

    afterEach(() => {
        if (originalEnv === undefined) {
            delete process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        } else {
            process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS = originalEnv;
        }
    });

    it("getAnonymityMinRespondents defaults to 5 when env is missing or invalid", () => {
        delete process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        const useCase = new NPSSurveyAnswersUseCase();
        expect(useCase.getAnonymityMinRespondents()).toBe(5);

        process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS = "abc";
        expect(useCase.getAnonymityMinRespondents()).toBe(5);

        process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS = "-1";
        expect(useCase.getAnonymityMinRespondents()).toBe(5);
    });

    it("getAnonymityMinRespondents reads env when valid", () => {
        process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS = "10";
        const useCase = new NPSSurveyAnswersUseCase();
        expect(useCase.getAnonymityMinRespondents()).toBe(10);
    });

    it("marks COMPANY_ADMIN sample insufficient when answered count <= threshold", () => {
        delete process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        const useCase = new NPSSurveyAnswersUseCase();
        (useCase as any).roleUser = "COMPANY_ADMIN";

        expect(
            useCase.isSampleInsufficient("company-1", answeredUsers(5))
        ).toBe(true);
        expect(
            useCase.isSampleInsufficient("company-1", answeredUsers(6))
        ).toBe(false);
    });

    it("does not bypass COMPANY_ADMIN via EXCEPTION_COMPANY_IDS", () => {
        delete process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        const useCase = new NPSSurveyAnswersUseCase();
        (useCase as any).roleUser = "COMPANY_ADMIN";
        const exceptionCompanyId = "a62a66b5-2ad4-446d-af44-95679cb9d580";

        expect(
            useCase.isSampleInsufficient(
                exceptionCompanyId,
                answeredUsers(3),
                undefined,
                true
            )
        ).toBe(true);
    });

    it("bypasses threshold for ADMIN", () => {
        delete process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        const useCase = new NPSSurveyAnswersUseCase();
        (useCase as any).roleUser = "ADMIN";

        expect(
            useCase.isSampleInsufficient("company-1", answeredUsers(1))
        ).toBe(false);
    });

    it("returns Sem informações from getNps when sample is insufficient for COMPANY_ADMIN", () => {
        delete process.env.SURVEY_ANONYMITY_MIN_RESPONDENTS;
        const useCase = new NPSSurveyAnswersUseCase();
        (useCase as any).roleUser = "COMPANY_ADMIN";

        const value = useCase.getNps(answeredUsers(2), "company-1");
        expect(value).toBe("Sem informações");
    });
});
