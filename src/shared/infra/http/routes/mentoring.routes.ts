import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import multer from "multer";
import uploadConfig from "@config/upload";

import { CreateMentoringController } from "@modules/mentoring/useCases/createMentoring/CreateMentoringController";
import { ListMentoringController } from "@modules/mentoring/useCases/listMentoring/ListMentoringController";
import { AddParticipantMentoringController } from "@modules/mentoring/useCases/addParticipantMentoring/AddParticipantMentoringController";
import { EditMentoringController } from "@modules/mentoring/useCases/editMentoring/EditMentoringController";
import { DeleteMentoringController } from "@modules/mentoring/useCases/deleteMentoring/DeleteMentoringController";

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

const editMentoringController = new EditMentoringController();
mentoringRoutes.patch(
    "/:mentoringId",
    ensuredAuthenticated,
    ensureAdmin,
    uploadImage.any(),
    editMentoringController.handle
);

const deleteMentoringController = new DeleteMentoringController();
mentoringRoutes.delete(
    "/:mentoringId",
    ensuredAuthenticated,
    ensureAdmin,
    deleteMentoringController.handle
);

const addParticipantMentoringController =
    new AddParticipantMentoringController();
mentoringRoutes.post(
    "/addParticipant",
    ensuredAuthenticated,
    addParticipantMentoringController.handle
);

export { mentoringRoutes };

