import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import { ProductsSpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/ProductsSpecialistsRepositoryInMemory";
import { SpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/SpecialistsRepositoryInMemory";
import { StorageProviderInMemory } from "@shared/container/providers/StorageProvider/inMemory/StorageProviderInMemory";
import { CreateProductSpecialistUseCase } from "../createProductSpecialist/CreateProductSpecialistUseCase";
import { CreateSpecialistUseCase } from "../createSpecialist/CreateSpecialistUseCase";
import { ListSpecialistsByProductUseCase } from "./ListSpecialistsByProductUseCase";

let specialistsRepositoryInMemory: SpecialistsRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;
let productsSpecialistsRepositoryInMemory: ProductsSpecialistsRepositoryInMemory;
let listSpecialistsByProductUseCase: ListSpecialistsByProductUseCase;
let createProductSpecialistUseCase: CreateProductSpecialistUseCase;
let createSpecialistUseCase: CreateSpecialistUseCase;

describe("List Specialists", () => {
    beforeAll(() => {
        productsSpecialistsRepositoryInMemory =
            new ProductsSpecialistsRepositoryInMemory();
        specialistsRepositoryInMemory = new SpecialistsRepositoryInMemory();
        storageProviderInMemory = new StorageProviderInMemory();
        createSpecialistUseCase = new CreateSpecialistUseCase(
            specialistsRepositoryInMemory,
            storageProviderInMemory
        );
        createProductSpecialistUseCase = new CreateProductSpecialistUseCase(
            productsSpecialistsRepositoryInMemory
        );
        listSpecialistsByProductUseCase = new ListSpecialistsByProductUseCase(
            productsSpecialistsRepositoryInMemory,
            specialistsRepositoryInMemory
        );
    });

    it("should be able to list specialists by product", async () => {
        const specialistCreated = await createSpecialistUseCase.execute({
            name: "Guilherme",
            bio: "teste",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www",
            userId: "123"
        })

        await createProductSpecialistUseCase.execute({
            productId: "123",
            specialistId: specialistCreated.id,
        });

        const result = await listSpecialistsByProductUseCase.execute({
            productId: "123",
        });

        expect(result).toHaveLength(1);
    });
});

