import { CreateOrderController } from "@modules/orders/useCases/createOrder/CreateOrderController";
import { CreateOrderItemController } from "@modules/orders/useCases/createOrderItem/CreateOrderItemController";
import { CreateOrderPagarMeController } from "@modules/orders/useCases/createOrderPagarMe/CreateOrderPagarMeController";
import { GetStatusOrderPagarMeController } from "@modules/orders/useCases/getStatusOrderPagarme/GetStatusOrderPagarMeController";
import { ListOrderController } from "@modules/orders/useCases/listOrder/ListOrderController";
import { Router } from "express";

const ordersRoutes = Router();

const createOrderPagarMeController = new CreateOrderPagarMeController();
ordersRoutes.post("/pagarme", createOrderPagarMeController.handle);

const getStatusOrderPagarmeController = new GetStatusOrderPagarMeController();
ordersRoutes.get("/pagarme", getStatusOrderPagarmeController.handle);

const createOrderItemController = new CreateOrderItemController();
ordersRoutes.post("/item", createOrderItemController.handle);

const createOrderController = new CreateOrderController();
ordersRoutes.post("/:id", createOrderController.handle);
ordersRoutes.post("/", createOrderController.handle);

const listOrderController = new ListOrderController();
ordersRoutes.get("/", listOrderController.handle);

export { ordersRoutes };
