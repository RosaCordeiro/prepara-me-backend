import { ICreateUserProductAvailableDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableLogDTO";
import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateUserProductAvailableUseCase } from "./CreateUserProductAvailableUseCase";

let userProductsAvailableRepositoryInMemory: UserProductsAvailableRepositoryInMemory;
let createUserProductAvailableUseCase: CreateUserProductAvailableUseCase;

describe("Create User Product Available", () => {
    beforeEach(() => {
        userProductsAvailableRepositoryInMemory =
            new UserProductsAvailableRepositoryInMemory();
        createUserProductAvailableUseCase =
            new CreateUserProductAvailableUseCase(
                userProductsAvailableRepositoryInMemory
            );
    });

    it("shold be able to create a new user product available ", async () => {
        const userProductAvailable: ICreateUserProductAvailableDTO = {
            userId: "123",
            productId: "123",
            availableQuantity: 1,
        };

        const result = await createUserProductAvailableUseCase.execute(
            userProductAvailable
        );

        expect(result).toHaveProperty("id");
    });

    it("should not be able to create a user product without a user", async () => {
        expect(async () => {
            const userProductAvailable: ICreateUserProductAvailableDTO = {
                userId: "",
                productId: "123",
                availableQuantity: 1,
            };

            await createUserProductAvailableUseCase.execute(
                userProductAvailable
            );
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a user product without a product", async () => {
        expect(async () => {
            const userProductAvailable: ICreateUserProductAvailableDTO = {
                userId: "123",
                productId: "",
                availableQuantity: 1,
            };

            await createUserProductAvailableUseCase.execute(
                userProductAvailable
            );
        }).rejects.toBeInstanceOf(AppError);
    });
});
