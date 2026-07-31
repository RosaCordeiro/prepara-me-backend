import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateSegmentController } from "@modules/segments/useCases/createSegment/CreateSegmentController";
import { ListSegmentController } from "@modules/segments/useCases/listSegment/ListSegmentController";
import { RemoveSegmentController } from "@modules/segments/useCases/removeSegment/RemoveSegmentController";

const segmentsRoutes = Router();

const createSegmentController = new CreateSegmentController();
const listSegmentController = new ListSegmentController();
const removeSegmentController = new RemoveSegmentController();

segmentsRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    createSegmentController.handle
);

segmentsRoutes.get("/", ensuredAuthenticated, listSegmentController.handle);
segmentsRoutes.get("/:id", ensuredAuthenticated, listSegmentController.handle);

segmentsRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeSegmentController.handle
);

export { segmentsRoutes };
