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

const specialistsRoutes = Router();
const uploadImage = multer(uploadConfig);

const createSpecialistScheduleFilesController = new CreateSpecialistScheduleFilesController();
specialistsRoutes.post(
    "/schedule-files",
    ensuredAuthenticated,
    createSpecialistScheduleFilesController.handle
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

const cancelSpecialistScheduleController =
    new CancelSpecialistScheduleController();
specialistsRoutes.post(
    "/schedule/:id/cancel",
    ensuredAuthenticated,
    cancelSpecialistScheduleController.handle
);

const listSpecialistScheduleController = new ListSpecialistScheduleController();
specialistsRoutes.get("/schedule/", listSpecialistScheduleController.handle);
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
specialistsRoutes.get("/products", listProductSpecialistController.handle);

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

