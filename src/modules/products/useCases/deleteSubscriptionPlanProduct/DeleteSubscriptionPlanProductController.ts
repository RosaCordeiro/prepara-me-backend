import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteSubscriptionPlanProductUseCase } from "./DeleteSubscriptionPlanProductUseCase";

class DeleteSubscriptionPlanProductController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const deleteSubscriptionPlanProductUseCase = container.resolve(
            DeleteSubscriptionPlanProductUseCase
        );

        await deleteSubscriptionPlanProductUseCase.execute(id);

        return response.status(201).json({
            message: "Subscription Plan Product deleted successfully",
        });
    }
}

export { DeleteSubscriptionPlanProductController };
