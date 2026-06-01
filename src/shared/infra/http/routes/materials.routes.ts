import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import multer from "multer";
import uploadConfig from "@config/upload";

import { CreateMaterialController } from "@modules/materials/useCases/createMaterial/CreateMaterialController";
import { GetMaterialBySlugController } from "@modules/materials/useCases/getMaterialBySlug/GetMaterialBySlugController";
import { FindAllMaterialController } from "@modules/materials/useCases/findAllMaterial/FindAllMaterialController";
import { GetMaterialByIdController } from "@modules/materials/useCases/getMaterialById/GetMaterialByIdController";
import { CreateMaterialDownloadController } from "@modules/materials/useCases/createMaterialDownload/CreateMaterialDownloadController";
import { FindAllMaterialDownloadController } from "@modules/materials/useCases/findAllMaterialDownload/FindAllMaterialDownloadController";
import { DeleteMaterialController } from "@modules/materials/useCases/deleteMaterial/DeleteMaterialController";
import { FindAllMaterialPublicController } from "@modules/materials/useCases/findAllMaterialPublic/findAllMaterialPublicController";

const materialRoutes = Router();
const uploadFile = multer(uploadConfig);

const createMaterialController = new CreateMaterialController();
materialRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    uploadFile.any(),
    createMaterialController.handle
);

const findAllMaterialPublicController = new FindAllMaterialPublicController();
materialRoutes.get("/public", findAllMaterialPublicController.handle);

const findAllMaterialController = new FindAllMaterialController();
materialRoutes.get("/", ensuredAuthenticated, findAllMaterialController.handle);

const findAllMaterialDownloadController =
    new FindAllMaterialDownloadController();
materialRoutes.get("/list-download", findAllMaterialDownloadController.handle);

const getMaterialByIdController = new GetMaterialByIdController();
materialRoutes.get(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    getMaterialByIdController.handle
);

const getMaterialBySlugController = new GetMaterialBySlugController();
materialRoutes.get("/:slug/slug", getMaterialBySlugController.handle);

const createMaterialDownloadController = new CreateMaterialDownloadController();
materialRoutes.post(
    "/:material_id/download",
    createMaterialDownloadController.handle
);

/* DeleteMaterialController */
const deleteMaterialController = new DeleteMaterialController();
materialRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    deleteMaterialController.handle
);

export { materialRoutes };
