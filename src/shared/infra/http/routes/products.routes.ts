import { CreateProductController } from "@modules/products/useCases/createProduct/CreateProductController";
import { CreateProductContentController } from "@modules/products/useCases/createProductContent/CreateProductContentController";
import { RemoveProductContentController } from "@modules/products/useCases/removeProductContent/RemoveProductContentController";
import { ListProductController } from "@modules/products/useCases/listProduct/ListProductController";
import { RemoveProductController } from "@modules/products/useCases/removeProduct/RemoveProductController";
import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateRequestScheduleController } from "@modules/products/useCases/createRequestSchedule/CreateRequestScheduleController";
import { CreateSimulatorVideosGroupController } from "@modules/products/useCases/createSimulatorVideosGroup/CreateSimulatorVideosGroupController";
import { ListSimulatorVideosGroupController } from "@modules/products/useCases/listSimulatorVideosGroup/ListSimulatorVideosGroupController";
import { RemoveSimulatorVideosGroupController } from "@modules/products/useCases/removeSimulatorVideosGroup/RemoveSimulatorVideosGroupController";
import { CreateSimulatorVideosController } from "@modules/products/useCases/createSimulatorVideos/CreateSimulatorVideosController";
import { ListSimulatorVideosController } from "@modules/products/useCases/listSimulatorVideos/ListSimulatorVideosController";
import { RemoveSimulatorVideosController } from "@modules/products/useCases/removeSimulatorVideos/RemoveSimulatorVideosController";
import { ListProductByUserController } from "@modules/products/useCases/listProductByUser/ListProductByUserController";
import { RemoveProductUserUseCase } from "@modules/products/useCases/removeProductUser/RemoveProductUserUseCase";
import { RemoveProductUserController } from "@modules/products/useCases/removeProductUser/RemoveProductUserController";
import { ListProductByPriceController } from "@modules/products/useCases/listProductByPrice/ListProductByPriceController";
import { ListProductByUserWithSpecialistController } from "@modules/products/useCases/listProductByUserWithSpecialist/ListProductByUserWithSpecialistController";
import { ListProductsAvailableByUserController } from "@modules/products/useCases/listProductsAvailableByUser/ListProductsAvailableByUserController";

const productsRoutes = Router();

const listProductsAvailableByUserController = new ListProductsAvailableByUserController();
productsRoutes.get("/listProductsAvailableByUser", ensuredAuthenticated, listProductsAvailableByUserController.handle);

const createRequestScheduleController = new CreateRequestScheduleController();
productsRoutes.post("/requestSchedule", createRequestScheduleController.handle);

const listProductByUserController = new ListProductByUserController();
productsRoutes.get(
    "/listProductByUser",
    ensuredAuthenticated,
    listProductByUserController.handle
);

const listProductByUserWithSpecialistController =
    new ListProductByUserWithSpecialistController();
productsRoutes.get(
    "/listProductByUserWithSpecialist",
    ensuredAuthenticated,
    listProductByUserWithSpecialistController.handle
);

const listRequestScheduleController = new ListProductController();
productsRoutes.get(
    "/requestSchedule/:id",
    ensuredAuthenticated,
    ensureAdmin,
    listRequestScheduleController.handle
);

const createProductContentController = new CreateProductContentController();
productsRoutes.post(
    "/:productId/productContents",
    ensuredAuthenticated,
    ensureAdmin,
    createProductContentController.handle
);

const removeProductContentController = new RemoveProductContentController();
productsRoutes.delete(
    "/productContents/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeProductContentController.handle
);

const createSimulatorVideosGroupController =
    new CreateSimulatorVideosGroupController();
productsRoutes.post(
    "/simulatorVideosGroup",
    ensuredAuthenticated,
    ensureAdmin,
    createSimulatorVideosGroupController.handle
);

const listSimulatorVideosGroupController =
    new ListSimulatorVideosGroupController();
productsRoutes.get(
    "/simulatorVideosGroup",
    ensuredAuthenticated,
    listSimulatorVideosGroupController.handle
);

productsRoutes.get(
    "/simulatorVideosGroup/:id",
    ensuredAuthenticated,
    listSimulatorVideosGroupController.handle
);

const removeSimulatorVideosGroupController =
    new RemoveSimulatorVideosGroupController();
productsRoutes.delete(
    "/simulatorVideosGroup/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeSimulatorVideosGroupController.handle
);

const createSimulatorVideosController = new CreateSimulatorVideosController();
productsRoutes.post(
    "/simulatorVideos",
    ensuredAuthenticated,
    ensureAdmin,
    createSimulatorVideosController.handle
);

const listSimulatorVideosController = new ListSimulatorVideosController();
productsRoutes.get(
    "/simulatorVideos",
    ensuredAuthenticated,
    listSimulatorVideosController.handle
);

productsRoutes.get(
    "/simulatorVideos/:id",
    ensuredAuthenticated,
    listSimulatorVideosController.handle
);

const removeSimulatorVideosController = new RemoveSimulatorVideosController();
productsRoutes.delete(
    "/simulatorVideos/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeSimulatorVideosController.handle
);

const listProductController = new ListProductController();
productsRoutes.get("/", listProductController.handle);
productsRoutes.get("/:id", listProductController.handle);

const listProductByPriceController = new ListProductByPriceController();
productsRoutes.get(
    "/price/:id",
    ensuredAuthenticated,
    listProductByPriceController.handle
);

const removeProductController = new RemoveProductController();
productsRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeProductController.handle
);

const removeProductUserController = new RemoveProductUserController();
productsRoutes.delete(
    "/:id/users",
    ensuredAuthenticated,
    ensureAdmin,
    removeProductUserController.handle
);

const createProductController = new CreateProductController();
productsRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    createProductController.handle
);

export { productsRoutes };
