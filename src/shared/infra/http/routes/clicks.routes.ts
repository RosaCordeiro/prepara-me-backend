import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateClickCountController } from "@modules/clicks/useCases/createClickCount/CreateClickCountController";

const clicksRoutes = Router();

const createClickCountController = new CreateClickCountController();
clicksRoutes.post("/", ensuredAuthenticated, createClickCountController.handle);

export { clicksRoutes };

