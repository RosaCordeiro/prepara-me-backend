import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductByUserWithSpecialistUseCase } from "./ListProductByUserWithSpecialistUseCase";

class ListProductByUserWithSpecialistController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { userId, productId } = request.query;

        const listProductByUserWithSpeciliastUseCase = container.resolve(
            ListProductByUserWithSpecialistUseCase
        );

        const res = await listProductByUserWithSpeciliastUseCase.execute(
            String(userId),
            String(productId)
        );

        return response.status(200).send(res);
    }
}

export { ListProductByUserWithSpecialistController };
