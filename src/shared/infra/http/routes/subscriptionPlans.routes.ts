import { CreateSubscriptionPlanController } from "@modules/products/useCases/createSubscriptionPlan/CreateSubscriptionPlanController";
import { ListSubscriptionPlanController } from "@modules/products/useCases/listSubscriptionPlan/ListSubscriptionPlanController";
import { CreateSubscriptionPlanProductController } from "@modules/products/useCases/createSubscriptionPlanProduct/CreateSubscriptionPlanProductController";
import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { RemoveSubscriptionPlanController } from "@modules/products/useCases/removeSubscriptionPlan/RemoveSubscriptionPlanController";
import { DeleteSubscriptionPlanProductController } from "@modules/products/useCases/deleteSubscriptionPlanProduct/DeleteSubscriptionPlanProductController";

const subscriptionPlansRoutes = Router();

const createSubscriptionPlanController = new CreateSubscriptionPlanController();
subscriptionPlansRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    createSubscriptionPlanController.handle
);

const listSubscriptionPlanController = new ListSubscriptionPlanController();
subscriptionPlansRoutes.get(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    listSubscriptionPlanController.handle
);

subscriptionPlansRoutes.get(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    listSubscriptionPlanController.handle
);

const removeSubscriptionPlanController = new RemoveSubscriptionPlanController();
subscriptionPlansRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeSubscriptionPlanController.handle
);

const createSubscriptionPlanProductController =
    new CreateSubscriptionPlanProductController();
subscriptionPlansRoutes.post(
    "/:id/products",
    ensuredAuthenticated,
    ensureAdmin,
    createSubscriptionPlanProductController.handle
);

const deleteSubscriptionPlanProductController =
    new DeleteSubscriptionPlanProductController();
subscriptionPlansRoutes.delete(
    "/products/:id",
    ensuredAuthenticated,
    ensureAdmin,
    deleteSubscriptionPlanProductController.handle
);

export { subscriptionPlansRoutes };
