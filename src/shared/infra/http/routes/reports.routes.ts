import { Router } from "express";
import { NPSSurveyAnswersController } from "../../../../reports/NPSSurveyAnswers/useCase/NPSSurveyAnswersController";
import { ScheduleController } from "../../../../reports/Schedules/useCase/SchedulesController";

const reportsRoutes = Router();

const npsSurveyAnswersController = new NPSSurveyAnswersController();
reportsRoutes.get("/npsSurveyAnswers", npsSurveyAnswersController.handle);

const schedulesController = new ScheduleController();
reportsRoutes.get("/schedules", schedulesController.handle);

export { reportsRoutes };

