import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import multer from "multer";
import uploadConfig from "@config/upload";

import { CreateSpecialistScheduleFilesController } from "@modules/specialists/useCases/createSpecialistScheduleFiles/CreateSpecialistScheduleFilesController";
import { ListMentoringController } from "@modules/mentoring/useCases/listMentoring/ListMentoringController";
import { AddParticipantMentoringController } from "@modules/mentoring/useCases/addParticipantMentoring/AddParticipantMentoringController";
import { EditMentoringController } from "@modules/mentoring/useCases/editMentoring/EditMentoringController";
import { DeleteMentoringController } from "@modules/mentoring/useCases/deleteMentoring/DeleteMentoringController";
import { GetMentoringByIdController } from "@modules/mentoring/useCases/getMentoringById/GetMentoringByIdController";
import { ListMentoringScheduleController } from "@modules/mentoring/useCases/listMentoringSchedule/ListMentoringScheduleController";
import { RateMentoringController } from "@modules/mentoring/useCases/rateMentoring/RateMentoringController";
import { RemoveParticipantMentoringUseCase } from "@modules/mentoring/useCases/removeParticipantMentoring/RemoveParticipantMentoringUseCase";
import { RemoveParticipantMentoringController } from "@modules/mentoring/useCases/removeParticipantMentoring/RemoveParticipantMentoringController";
import { CreateMentoringController } from "@modules/mentoring/useCases/createMentoring/CreateMentoringController";
import upload from "@config/upload";

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

const listMentoringScheduleController = new ListMentoringScheduleController();
mentoringRoutes.get(
    "/schedule-list",
    ensuredAuthenticated,
    listMentoringScheduleController.handle
);

const getMentoringByIdUseCase = new GetMentoringByIdController();
mentoringRoutes.get(
    "/:mentoringId",
    ensuredAuthenticated,
    ensureAdmin,
    getMentoringByIdUseCase.handle
);

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

const removeParticipantMentoringController =
    new RemoveParticipantMentoringController();
mentoringRoutes.post(
    "/removeParticipant",
    ensuredAuthenticated,
    removeParticipantMentoringController.handle
);

const rateMentoringController = new RateMentoringController();
mentoringRoutes.put(
    "/rate",
    ensuredAuthenticated,
    rateMentoringController.handle
);

export { mentoringRoutes };

