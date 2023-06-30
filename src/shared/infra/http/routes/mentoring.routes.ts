import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import multer from "multer";
import uploadConfig from "@config/upload";

import { CreateMentoringController } from "@modules/mentoring/useCases/createMentoring/CreateMentoringController";
import { ListMentoringController } from "@modules/mentoring/useCases/listMentoring/ListMentoringController";

const mentoringRoutes = Router();
const uploadImage = multer(uploadConfig);

const createMentoringController = new CreateMentoringController();
mentoringRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    uploadImage.any(),
    createMentoringController.handle
);

const listMentoringController = new ListMentoringController();
mentoringRoutes.get("/", ensuredAuthenticated, listMentoringController.handle);

export { mentoringRoutes };

