import { ICreateSpecialistDTO } from "@modules/specialists/dtos/ICreateSpecialistDTO";
import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import { ProductsSpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/ProductsSpecialistsRepositoryInMemory";
import { SpecialistScheduleRepositoryInMemory } from "@modules/specialists/repositories/in-memory/SpecialistScheduleRepositoryInMemory";
import { SpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/SpecialistsRepositoryInMemory";
import { StorageProviderInMemory } from "@shared/container/providers/StorageProvider/inMemory/StorageProviderInMemory";
import { CreateSpecialistUseCase } from "../createSpecialist/CreateSpecialistUseCase";
import { ListSpecialistUseCase } from "../listSpecialist/ListSpecialistUseCase";
import { RemoveSpecialistUseCase } from "./RemoveSpecialistUseCase";

let specialistsRepositoryInMemory: SpecialistsRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;
let listSpecialistUseCase: ListSpecialistUseCase;
let createSpecialistUseCase: CreateSpecialistUseCase;
let removeSpecialistUseCase: RemoveSpecialistUseCase;
let productsSpecialistsRepositoryInMemory: ProductsSpecialistsRepositoryInMemory;
let specialistScheduleRepositoryInMemory: SpecialistScheduleRepositoryInMemory;

describe("Remove Specialists", () => {
    beforeEach(() => {
        specialistsRepositoryInMemory = new SpecialistsRepositoryInMemory();
        storageProviderInMemory = new StorageProviderInMemory();
        productsSpecialistsRepositoryInMemory = new ProductsSpecialistsRepositoryInMemory();
        specialistScheduleRepositoryInMemory = new SpecialistScheduleRepositoryInMemory();
        listSpecialistUseCase = new ListSpecialistUseCase(
            specialistsRepositoryInMemory
        );
        createSpecialistUseCase = new CreateSpecialistUseCase(
            specialistsRepositoryInMemory,
            storageProviderInMemory
        );
        removeSpecialistUseCase = new RemoveSpecialistUseCase(
            specialistsRepositoryInMemory,
            productsSpecialistsRepositoryInMemory,
            specialistScheduleRepositoryInMemory
        );
    });

    it("should be able to delete a specialist", async () => {
        const specialist1: ICreateSpecialistDTO = {
            name: "Specialist One",
            bio: "Bio",
            linkedinUrl: "www.linkedin.com.br",
            status: SpecialistStatusEnum.ACTIVE,
            userId: "123",
        };

        await createSpecialistUseCase.execute(specialist1);

        const specialist2: ICreateSpecialistDTO = {
            name: "Specialist Two",
            bio: "Bio",
            linkedinUrl: "www.linkedin.com.br",
            status: SpecialistStatusEnum.ACTIVE,
            userId: "123",
        };

        const specialistCreated = await createSpecialistUseCase.execute(
            specialist2
        );

        await removeSpecialistUseCase.execute(specialistCreated.id);

        const result = await listSpecialistUseCase.execute({
            id: "",
            name: "",
            status: "",
            userId: "",
        });

        expect(result).toHaveLength(1);
    });
});

