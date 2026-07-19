import "reflect-metadata";
import { GetSurveyQuestionUseCase } from "./getSurveyQuestionUseCase";

describe("GetSurveyQuestionUseCase", () => {
    it("should return an empty array when the company has no questions", async () => {
        const surveyQuestionsRepository = {
            listByCompanyId: jest.fn().mockResolvedValue([]),
        };

        const getSurveyQuestionUseCase = new GetSurveyQuestionUseCase(
            surveyQuestionsRepository as any
        );

        const result = await getSurveyQuestionUseCase.execute("company-id");

        expect(result).toEqual([]);
        expect(surveyQuestionsRepository.listByCompanyId).toHaveBeenCalledWith(
            "company-id"
        );
    });

    it("should return survey questions for the company", async () => {
        const questions = [
            {
                id: "q1",
                companyId: "company-id",
                questionText: "Como foi o processo?",
            },
        ];
        const surveyQuestionsRepository = {
            listByCompanyId: jest.fn().mockResolvedValue(questions),
        };

        const getSurveyQuestionUseCase = new GetSurveyQuestionUseCase(
            surveyQuestionsRepository as any
        );

        const result = await getSurveyQuestionUseCase.execute("company-id");

        expect(result).toHaveLength(1);
        expect(result[0].questionText).toBe("Como foi o processo?");
    });
});
