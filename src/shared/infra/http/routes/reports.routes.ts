import { Router, Request, Response } from "express";
import fs from "fs";
import { NPSSurveyAnswersController } from "../../../../reports/NPSSurveyAnswers/useCase/NPSSurveyAnswersController";
import { ScheduleController } from "../../../../reports/Schedules/useCase/SchedulesController";
import { ResponsesReportController } from "../../../../reports/ResponsesReport/useCase/ResponsesReportController";
import { UsersReportController } from "../../../../reports/UsersReport/useCase/UsersReportController";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ReplacementsReportController } from "../../../../reports/ReplacementsReport/useCase/ReplacementsReportController";
import { ImportSurveyAnswersBatchController } from "../../../../reports/NPSSurveyAnswers/useCase/ImportSurveyAnswersBatchController";
import { uploadFileXlsx } from "../middlewares/uploadFileXlsx";
import { GeradorExcelSurveyAnswersTools } from "../../../../utils/excel/excelSurveyAnswers";

const reportsRoutes = Router();

const npsSurveyAnswersController = new NPSSurveyAnswersController();
reportsRoutes.get(
    "/npsSurveyAnswers",
    ensuredAuthenticated,
    npsSurveyAnswersController.handle
);

const schedulesController = new ScheduleController();
reportsRoutes.get("/schedules", schedulesController.handle);

const responsesReportController = new ResponsesReportController();
reportsRoutes.get("/responses", responsesReportController.handle);

const usersReportController = new UsersReportController();
reportsRoutes.get("/users", usersReportController.handle);

const replacementsReportController = new ReplacementsReportController();
reportsRoutes.get(
    "/replacements",
    ensuredAuthenticated,
    replacementsReportController.handle
);

const importSurveyAnswersBatchController = new ImportSurveyAnswersBatchController();
reportsRoutes.post(
    "/npsSurveyAnswers/import",
    ensuredAuthenticated,
    uploadFileXlsx,
    importSurveyAnswersBatchController.handle
);

reportsRoutes.get("/npsSurveyAnswers/import/template", ensuredAuthenticated, async (_req: Request, res: Response) => {
    const result = await new GeradorExcelSurveyAnswersTools().geradorExcel();
    if (!result.path) return res.status(500).json({ message: "Erro ao gerar template" });
    res.status(200).download(result.path, "Modelo Respostas Survey.xlsx", () => {
        if (result.path) fs.unlink(result.path, () => { });
    });
});

export { reportsRoutes };
