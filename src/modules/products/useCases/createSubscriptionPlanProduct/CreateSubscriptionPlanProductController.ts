import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSubscriptionPlanProductUseCase } from "./CreateSubscriptionPlanProductUseCase";

class CreateSubscriptionPlanProductController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { productId, availableQuantity, id } = request.body;

        const { id: subscriptionPlanId } = request.params;

        const createSubscriptionPlanProductUseCase = container.resolve(
            CreateSubscriptionPlanProductUseCase
        );

        const subscriptionPlanProduct =
            await createSubscriptionPlanProductUseCase.execute({
                subscriptionPlanId,
                productId,
                availableQuantity,
                id,
            });

        return response.status(201).json(subscriptionPlanProduct);
    }
}

export { CreateSubscriptionPlanProductController };
