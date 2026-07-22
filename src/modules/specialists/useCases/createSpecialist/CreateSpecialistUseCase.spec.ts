import { ICreateSpecialistDTO } from "@modules/specialists/dtos/ICreateSpecialistDTO";
import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import { SpecialistsRepositoryInMemory } from "@modules/specialists/repositories/in-memory/SpecialistsRepositoryInMemory";
import { StorageProviderInMemory } from "@shared/container/providers/StorageProvider/inMemory/StorageProviderInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateSpecialistUseCase } from "./CreateSpecialistUseCase";

let specialistsRepositoryInMemory: SpecialistsRepositoryInMemory;
let storageProviderInMemory: StorageProviderInMemory;
let createSpecialistUseCase: CreateSpecialistUseCase;

describe("Create Especialist", () => {
    beforeEach(() => {
        specialistsRepositoryInMemory = new SpecialistsRepositoryInMemory();
        storageProviderInMemory = new StorageProviderInMemory();
        createSpecialistUseCase = new CreateSpecialistUseCase(
            specialistsRepositoryInMemory,
            storageProviderInMemory
        );
    });

    it("should be able to create a new specialist", async () => {
        const specialist: ICreateSpecialistDTO = {
            name: "Specialist Test",
            bio: "Biography",
            status: SpecialistStatusEnum.ACTIVE,
            linkedinUrl: "www.linkedin.com/test",
            userId: "1234",
        };

        const result = await createSpecialistUseCase.execute(specialist);

        expect(result).toHaveProperty("id");
    });

    it("should not be able to create a specialist without a name", async () => {
        expect(async () => {
            const specialist: ICreateSpecialistDTO = {
                name: "",
                bio: "Biography",
                status: SpecialistStatusEnum.ACTIVE,
                linkedinUrl: "www.linkedin.com/test",
                userId: "1234",
            };

            await createSpecialistUseCase.execute(specialist);
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a specialist without a bio", async () => {
        expect(async () => {
            const specialist: ICreateSpecialistDTO = {
                name: "Specialist Test",
                bio: "",
                status: SpecialistStatusEnum.ACTIVE,
                linkedinUrl: "www.linkedin.com/test",
                userId: "1234",
            };

            await createSpecialistUseCase.execute(specialist);
        }).rejects.toBeInstanceOf(AppError);
    });

    it("should not be able to create a specialist without a user", async () => {
        expect(async () => {
            const specialist: ICreateSpecialistDTO = {
                name: "Specialist Test",
                bio: "Biography",
                status: SpecialistStatusEnum.ACTIVE,
                linkedinUrl: "www.linkedin.com/test",
                userId: "",
            };

            await createSpecialistUseCase.execute(specialist);
        }).rejects.toBeInstanceOf(AppError);
    });
});
