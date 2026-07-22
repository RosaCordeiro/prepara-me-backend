import { UserProductsAvailableRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UserProductsAvailableRepositoryInMemory";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { UserStatusEnum } from "@modules/accounts/enums/UserStatusEnum";
import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { ProductsRepositoryInMemory } from "@modules/products/repositories/in-memory/ProductsRepositoryInMemory";
import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { SpecialistScheduleStatusEnum } from "@modules/specialists/enums/SpecialistScheduleStatusEnum";
import { SpecialistScheduleRepositoryInMemory } from "@modules/specialists/repositories/in-memory/SpecialistScheduleRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/inMemory/MailProviderInMemory";
import { ScheduleGoogle } from "@shared/container/providers/ScheduleProvider/implementations/ScheduleGoogle";
import { CreateSpecialistScheduleUseCase } from "../createSpecialistScheduleAvailable/CreateSpecialistScheduleUseCase";
import { RemoveSpecialistScheduleUseCase } from "./RemoveSpecialistScheduleUseCase";

let createSpecialistScheduleUseCase: CreateSpecialistScheduleUseCase;
let specialistScheduleRepositoryInMemory: SpecialistScheduleRepositoryInMemory;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let removeSpecialistScheduleUseCase: RemoveSpecialistScheduleUseCase;
let dateProvider: DayjsDateProvider;
let userProductsAvailableRepositoryInMemory: UserProductsAvailableRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;
let scheduleGoogle: ScheduleGoogle;

describe("Remove Specialist Schedule", () => {
    beforeEach(async () => {
        specialistScheduleRepositoryInMemory =
            new SpecialistScheduleRepositoryInMemory();
        userProductsAvailableRepositoryInMemory =
            new UserProductsAvailableRepositoryInMemory();
        productsRepositoryInMemory = new ProductsRepositoryInMemory();
        usersRepositoryInMemory = new UsersRepositoryInMemory();
        mailProviderInMemory = new MailProviderInMemory();
        await usersRepositoryInMemory.create({
            name: "User Test",
            username: "usertest",
            email: "user@test.com",
            password: "1234",
            documentId: "00000000000",
            status: UserStatusEnum.ACTIVE,
            type: UserTypeEnum.USER,
            realocated: UserRealocatedEnum.NOT_REALOCATED,
            expiresDate: new Date(),
            periodTest: new Date(),
            id: "user-schedule-1",
        });
        scheduleGoogle = new ScheduleGoogle();
        dateProvider = new DayjsDateProvider();
        createSpecialistScheduleUseCase = new CreateSpecialistScheduleUseCase(
            specialistScheduleRepositoryInMemory,
            userProductsAvailableRepositoryInMemory,
            productsRepositoryInMemory,
            scheduleGoogle,
            dateProvider,
            usersRepositoryInMemory,
            mailProviderInMemory
        );
        removeSpecialistScheduleUseCase = new RemoveSpecialistScheduleUseCase(
            specialistScheduleRepositoryInMemory
        );
    });

    it("should be able to delete a specialist schedule", async () => {
        const specialistSchedulePlan1: ICreateSpecialistScheduleDTO = {
            dateSchedule: new Date("2022-01-01 7:00"),
            status: SpecialistScheduleStatusEnum.AVAILABLE,
            specialistId: "123",
            userId: "user-schedule-1",
        };

        await createSpecialistScheduleUseCase.execute(specialistSchedulePlan1);

        const specialistSchedulePlan2: ICreateSpecialistScheduleDTO = {
            dateSchedule: new Date("2022-01-01 8:00"),
            status: SpecialistScheduleStatusEnum.AVAILABLE,
            specialistId: "123",
            userId: "user-schedule-1",
        };

        const specialistScheduleCreated =
            await createSpecialistScheduleUseCase.execute(
                specialistSchedulePlan2
            );

        const idRemoved = await removeSpecialistScheduleUseCase.execute(
            specialistScheduleCreated.id
        );

        expect(idRemoved).toBe(specialistScheduleCreated.id);
    });
});

