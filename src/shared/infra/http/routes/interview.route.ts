import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { SaveProgressInterviewController } from "@modules/interview/useCases/saveProgress/SaveProgressInterviewController";
import { GetProgressInterviewByUserController } from "@modules/interview/useCases/getProgressInvertviewByUser/GetProgressInterviewByUserController";

const interviewRoutes = Router();

const saveProgressInterviewController = new SaveProgressInterviewController();
interviewRoutes.post(
    "/",
    ensuredAuthenticated,
    saveProgressInterviewController.handle
);

const getProgressInterviewByUserController =
    new GetProgressInterviewByUserController();
interviewRoutes.get(
    "/:user_id",
    ensuredAuthenticated,
    getProgressInterviewByUserController.handle
);

export { interviewRoutes };
