import { CreateProductSpecialistController } from "@modules/specialists/useCases/createProductSpecialist/CreateProductSpecialistController";
import { CreateSpecialistController } from "@modules/specialists/useCases/createSpecialist/CreateSpecialistController";
import { ListSpecialistController } from "@modules/specialists/useCases/listSpecialist/ListSpecialistController";
import { RemoveSpecialistController } from "@modules/specialists/useCases/removeSpecialist/RemoveSpecialistController";
import { Router } from "express";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { RemoveProductSpecialistController } from "@modules/specialists/useCases/removeProductSpecialist/RemoveProductSpecialistController";
import { CreateSpecialistScheduleController } from "@modules/specialists/useCases/createSpecialistScheduleAvailable/CreateSpecialistScheduleController";
import { ListSpecialistScheduleController } from "@modules/specialists/useCases/listSpecialistSchedule/ListSpecialistScheduleController";
import { RemoveSpecialistScheduleController } from "@modules/specialists/useCases/removeSpecialistSchedule/RemoveSpecialistScheduleController";
import { ListProductSpecialistController } from "@modules/specialists/useCases/listProductSpecialist/ListProductSpecialistController";
import { CancelSpecialistScheduleController } from "@modules/specialists/useCases/cancelSpecilaistSchedule/CancelSpecialistScheduleController";
import uploadConfig from "@config/upload";
import multer from "multer";
import { CreateSpecialistScheduleFilesController } from "@modules/specialists/useCases/createSpecialistScheduleFiles/CreateSpecialistScheduleFilesController";
import { ListSpecialistScheduleFilesController } from "@modules/specialists/useCases/listSpecialistScheduleFiles/ListSpecialistScheduleFilesController";
import { RemoveSpecialistScheduleFilesController } from "@modules/specialists/useCases/removeSpeecialistScheduleFiles/removeSpecialistScheduleFilesController";
import { CreateSpecialistScheduleRescheduleController } from "@modules/specialists/useCases/createSpecialistScheduleAvailableReschedule/CreateSpecialistScheduleRescheduleController";
import { ListSpecialistScheduleToUserController } from "@modules/specialists/useCases/listSpecialistScheduleToUser/ListSpecialistScheduleToUserController";

const specialistsRoutes = Router();
const uploadImage = multer(uploadConfig);

const listSpecialistScheduleFilesController =
    new ListSpecialistScheduleFilesController();

const removeSpecialistScheduleFilesController =
    new RemoveSpecialistScheduleFilesController();

specialistsRoutes.get(
    "/schedule/:id/schedule-files",
    ensuredAuthenticated,
    listSpecialistScheduleFilesController.handle
);
const createSpecialistScheduleFilesController =
    new CreateSpecialistScheduleFilesController();
specialistsRoutes.post(
    "/schedule-files",
    ensuredAuthenticated,
    uploadImage.any(),
    //aqui eu passo pelo multer e ele coloca arquivo que poderia receber
    createSpecialistScheduleFilesController.handle
);

specialistsRoutes.delete(
    "/schedule/:id/schedule-files-delete",
    ensuredAuthenticated,
    removeSpecialistScheduleFilesController.handle
);

const createSpecialistScheduleController =
    new CreateSpecialistScheduleController();
specialistsRoutes.post(
    "/schedule",
    ensuredAuthenticated,
    createSpecialistScheduleController.handle
);

specialistsRoutes.put(
    "/schedule/:id",
    ensuredAuthenticated,
    createSpecialistScheduleController.handle
);

const createSpecialistScheduleRescheduleController =
    new CreateSpecialistScheduleRescheduleController();
specialistsRoutes.put(
    "/reschedule/:id",
    ensuredAuthenticated,
    createSpecialistScheduleRescheduleController.handle
);

const cancelSpecialistScheduleController =
    new CancelSpecialistScheduleController();
specialistsRoutes.post(
    "/schedule/:id/cancel",
    ensuredAuthenticated,
    cancelSpecialistScheduleController.handle
);

const listSpecialistScheduleController = new ListSpecialistScheduleController();
specialistsRoutes.get("/schedule/", ensuredAuthenticated, listSpecialistScheduleController.handle);
specialistsRoutes.get("/schedule/:id", listSpecialistScheduleController.handle);

const removeSpecialistScheduleController =
    new RemoveSpecialistScheduleController();
specialistsRoutes.delete(
    "/schedule/:id",
    ensuredAuthenticated,
    removeSpecialistScheduleController.handle
);

const createProductSpecialistController =
    new CreateProductSpecialistController();
specialistsRoutes.post(
    "/:id/products",
    ensuredAuthenticated,
    ensureAdmin,
    createProductSpecialistController.handle
);

const listProductSpecialistController = new ListProductSpecialistController();
specialistsRoutes.get("/products", ensuredAuthenticated, listProductSpecialistController.handle);

const listSpecialistScheduleToUserController = new ListSpecialistScheduleToUserController();
specialistsRoutes.get("/schedule-to-user", listSpecialistScheduleToUserController.handle);

const removeProductSpecialistController =
    new RemoveProductSpecialistController();
specialistsRoutes.delete(
    "/products/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeProductSpecialistController.handle
);

const createSpecialistController = new CreateSpecialistController();
specialistsRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    uploadImage.any(),
    createSpecialistController.handle
);

const listSpecialistController = new ListSpecialistController();
specialistsRoutes.get("/", listSpecialistController.handle);
specialistsRoutes.get("/:id", listSpecialistController.handle);

const removeSpecialistController = new RemoveSpecialistController();
specialistsRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeSpecialistController.handle
);

export { specialistsRoutes };
