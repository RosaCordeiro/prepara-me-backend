import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateSubsegmentController } from "@modules/subsegments/useCases/createSubsegment/CreateSubsegmentController";
import { ListSubsegmentController } from "@modules/subsegments/useCases/listSubsegment/ListSubsegmentController";
import { RemoveSubsegmentController } from "@modules/subsegments/useCases/removeSubsegment/RemoveSubsegmentController";

const subsegmentsRoutes = Router();

const createSubsegmentController = new CreateSubsegmentController();
const listSubsegmentController = new ListSubsegmentController();
const removeSubsegmentController = new RemoveSubsegmentController();

subsegmentsRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    createSubsegmentController.handle
);

subsegmentsRoutes.get(
    "/",
    ensuredAuthenticated,
    listSubsegmentController.handle
);
subsegmentsRoutes.get(
    "/:id",
    ensuredAuthenticated,
    listSubsegmentController.handle
);

subsegmentsRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeSubsegmentController.handle
);

export { subsegmentsRoutes };
