import { Router } from "express";
import { NPSSurveyAnswersController } from "../../../../reports/NPSSurveyAnswers/useCase/NPSSurveyAnswersController";
import { ScheduleController } from "../../../../reports/Schedules/useCase/SchedulesController";
import { ResponsesReportController } from "reports/ResponsesReport/useCase/ResponsesReportController";

const reportsRoutes = Router();

const npsSurveyAnswersController = new NPSSurveyAnswersController();
reportsRoutes.get("/npsSurveyAnswers", npsSurveyAnswersController.handle);

const schedulesController = new ScheduleController();
reportsRoutes.get("/schedules", schedulesController.handle);

const responsesReportController = new ResponsesReportController();
reportsRoutes.get("/responses", responsesReportController.handle);

export { reportsRoutes };
