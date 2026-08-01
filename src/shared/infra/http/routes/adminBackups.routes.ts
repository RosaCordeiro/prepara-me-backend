import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureBackupToken } from "../middlewares/ensureBackupToken";
import { AdminBackupController } from "@modules/adminBackup/useCases/AdminBackupController";

const adminBackupRoutes = Router();
const controller = new AdminBackupController();

adminBackupRoutes.use(ensuredAuthenticated, ensureAdmin, ensureBackupToken);

adminBackupRoutes.get("/", controller.list);
adminBackupRoutes.post("/", controller.create);
adminBackupRoutes.get("/:fileName", controller.download);

export { adminBackupRoutes };
