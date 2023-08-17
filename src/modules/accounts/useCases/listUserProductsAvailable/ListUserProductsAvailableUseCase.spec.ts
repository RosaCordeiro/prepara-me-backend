import { ICreateUserProductAvailableDTO } from "@modules/accounts/dtos/ICreateUserProductAvailableLogDTO";
import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { CreateUserProductAvailableUseCase } from "../createUserProductAvailable/CreateUserProductAvailableUseCase";
import { ListUserProductsAvailableUseCase } from "./ListUserProductsAvailableUseCase";

let userProductsAvailableRepositoryInMemory: UserProductsAvailableRepositoryInMemory;
let listUserProductsAvailableUseCase: ListUserProductsAvailableUseCase;
let createUserProductAvailableUseCase: CreateUserProductAvailableUseCase;

describe("List User Products Available", () => {
    beforeEach(() => {
        userProductsAvailableRepositoryInMemory =
            new UserProductsAvailableRepositoryInMemory();
        listUserProductsAvailableUseCase = new ListUserProductsAvailableUseCase(
            userProductsAvailableRepositoryInMemory
        );
        createUserProductAvailableUseCase =
            new CreateUserProductAvailableUseCase(
                userProductsAvailableRepositoryInMemory
            );
    });

    it("should be able to list user products available", async () => {
        const userProductAvailable1: ICreateUserProductAvailableDTO = {
            userId: "123",
            productId: "123",
            availableQuantity: 1,
        };

        await createUserProductAvailableUseCase.execute(userProductAvailable1);

        const userProductAvailable2: ICreateUserProductAvailableDTO = {
            userId: "321",
            productId: "321",
            availableQuantity: 1,
        };

        await createUserProductAvailableUseCase.execute(userProductAvailable2);

        const result = await listUserProductsAvailableUseCase.execute({
            id: null,
            productId: null,
            userId: null,
        });

        expect(result).toHaveLength(2);
    });

    it("should be able to list user products available filtered by user", async () => {
        const userProductAvailable1: ICreateUserProductAvailableDTO = {
            userId: "123",
            productId: "123",
            availableQuantity: 1,
        };

        await createUserProductAvailableUseCase.execute(userProductAvailable1);

        const userProductAvailable2: ICreateUserProductAvailableDTO = {
            userId: "321",
            productId: "321",
            availableQuantity: 1,
        };

        await createUserProductAvailableUseCase.execute(userProductAvailable2);

        const result = await listUserProductsAvailableUseCase.execute({
            id: null,
            productId: "321",
            userId: null,
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list user products available filtered by product", async () => {
        const userProductAvailable1: ICreateUserProductAvailableDTO = {
            userId: "123",
            productId: "123",
            availableQuantity: 1,
        };

        await createUserProductAvailableUseCase.execute(userProductAvailable1);

        const userProductAvailable2: ICreateUserProductAvailableDTO = {
            userId: "321",
            productId: "321",
            availableQuantity: 1,
        };

        await createUserProductAvailableUseCase.execute(userProductAvailable2);

        const result = await listUserProductsAvailableUseCase.execute({
            id: null,
            productId: null,
            userId: "123",
        });

        expect(result).toHaveLength(1);
    });
});
