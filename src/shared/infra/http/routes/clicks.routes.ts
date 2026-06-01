import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateClickCountController } from "@modules/clicks/useCases/createClickCount/CreateClickCountController";
import { ListClickNameCountController } from "@modules/clicks/useCases/listClickCount/ListClickNameCountController";

const clicksRoutes = Router();

const createClickCountController = new CreateClickCountController();
clicksRoutes.post("/", ensuredAuthenticated, createClickCountController.handle);

const listClickNameCountController = new ListClickNameCountController();
clicksRoutes.get(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    listClickNameCountController.handle
);

export { clicksRoutes };

