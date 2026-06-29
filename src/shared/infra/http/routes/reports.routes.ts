import { Router } from "express";
import { NPSSurveyAnswersController } from "../../../../reports/NPSSurveyAnswers/useCase/NPSSurveyAnswersController";
import { ScheduleController } from "../../../../reports/Schedules/useCase/SchedulesController";
import { ResponsesReportController } from "../../../../reports/ResponsesReport/useCase/ResponsesReportController";
import { UsersReportController } from "../../../../reports/UsersReport/useCase/UsersReportController";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ReplacementsReportController } from "../../../../reports/ReplacementsReport/useCase/ReplacementsReportController";
import { ImportSurveyAnswersBatchController } from "../../../../reports/NPSSurveyAnswers/useCase/ImportSurveyAnswersBatchController";
import { DownloadSurveyAnswersTemplateController } from "../../../../reports/NPSSurveyAnswers/useCase/DownloadSurveyAnswersTemplateController";
import { DownloadVolunteerAnswersTemplateController } from "../../../../reports/NPSSurveyAnswers/useCase/DownloadVolunteerAnswersTemplateController";
import { uploadFileXlsx } from "../middlewares/uploadFileXlsx";

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

const downloadSurveyAnswersTemplateController = new DownloadSurveyAnswersTemplateController();
reportsRoutes.get(
    "/npsSurveyAnswers/import/template",
    ensuredAuthenticated,
    downloadSurveyAnswersTemplateController.handle
);

const downloadVolunteerAnswersTemplateController = new DownloadVolunteerAnswersTemplateController();
reportsRoutes.get(
    "/npsSurveyAnswers/import/template/voluntary",
    ensuredAuthenticated,
    downloadVolunteerAnswersTemplateController.handle
);

export { reportsRoutes };
