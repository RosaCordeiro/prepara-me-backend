import { ICreateSpecialistDTO } from "@modules/specialists/dtos/ICreateSpecialistDTO";
import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import { SpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/SpecialistsRepositoryInMemory";
import { StorageProviderInMemory } from "@shared/container/providers/StorageProvider/inMemory/StorageProviderInMemory";
import { CreateSpecialistUseCase } from "../createSpecialist/CreateSpecialistUseCase";
import { ListSpecialistUseCase } from "./ListSpecialistUseCase";

let specialistsRepositoryInMemory: SpecialistsRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;
let listSpecialistUseCase: ListSpecialistUseCase;
let createSpecialistUseCase: CreateSpecialistUseCase;

describe("List Specialist", () => {
    beforeEach(() => {
        specialistsRepositoryInMemory = new SpecialistsRepositoryInMemory();
        storageProviderInMemory = new StorageProviderInMemory();
        listSpecialistUseCase = new ListSpecialistUseCase(
            specialistsRepositoryInMemory
        );
        createSpecialistUseCase = new CreateSpecialistUseCase(
            specialistsRepositoryInMemory,
            storageProviderInMemory
        );
    });

    it("should be able to list specialists", async () => {
        const specialist1: ICreateSpecialistDTO = {
            name: "Specialist One",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist1);

        const specialist2: ICreateSpecialistDTO = {
            name: "Specialist Two",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist2);

        const result = await listSpecialistUseCase.execute({
            name: "",
            status: "",
            userId: "",
            id: "",
        });

        expect(result).toHaveLength(2);
    });

    it("should be able to list specialists by name", async () => {
        const specialist1: ICreateSpecialistDTO = {
            name: "Specialist One",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist1);

        const specialist2: ICreateSpecialistDTO = {
            name: "Specialist Two",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist2);

        const result = await listSpecialistUseCase.execute({
            name: "Two",
            status: "",
            userId: "",
            id: "",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list specialists by status", async () => {
        const specialist1: ICreateSpecialistDTO = {
            name: "Specialist One",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist1);

        const specialist2: ICreateSpecialistDTO = {
            name: "Specialist Two",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.INACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist2);

        const result = await listSpecialistUseCase.execute({
            name: "",
            status: SpecialistStatusEnum.INACTIVE,
            userId: "",
            id: "",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list specialists by user", async () => {
        const specialist1: ICreateSpecialistDTO = {
            name: "Specialist One",
            bio: "Teste",
            userId: "321",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist1);

        const specialist2: ICreateSpecialistDTO = {
            name: "Specialist Two",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.INACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist2);

        const result = await listSpecialistUseCase.execute({
            name: "",
            status: "",
            userId: "123",
            id: "",
        });

        expect(result).toHaveLength(1);
    });

    it("should be able to list specialists by id", async () => {
        const specialist1: ICreateSpecialistDTO = {
            name: "Specialist One",
            bio: "Teste",
            userId: "321",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        await createSpecialistUseCase.execute(specialist1);

        const specialist2: ICreateSpecialistDTO = {
            name: "Specialist Two",
            bio: "Teste",
            userId: "123",
            status: SpecialistStatusEnum.INACTIVE,
            linkedinUrl: "www.linkedin.com",
        };

        const specialistCreated = await createSpecialistUseCase.execute(
            specialist2
        );

        const result = await listSpecialistUseCase.execute({
            name: "",
            status: "",
            userId: "",
            id: specialistCreated.id,
        });

        expect(result).toHaveLength(1);
    });
});

