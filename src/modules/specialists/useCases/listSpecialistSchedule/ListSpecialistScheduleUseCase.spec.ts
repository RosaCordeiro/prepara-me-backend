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
import { ListSpecialistScheduleUseCase } from "./ListSpecialistScheduleUseCase";

let specialistScheduleRepositoryInMemory: SpecialistScheduleRepositoryInMemory;
let productsRepositoryInMemory: ProductsRepositoryInMemory;
let createSpecialistScheduleUseCase: CreateSpecialistScheduleUseCase;
let listSpecialistScheduleUseCase: ListSpecialistScheduleUseCase;
let dateProvider: DayjsDateProvider;
let userProductsAvailableRepositoryInMemory: UserProductsAvailableRepositoryInMemory;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let mailProviderInMemory: MailProviderInMemory;
let scheduleGoogle: ScheduleGoogle;

describe("List Specialist Schedule ", () => {
    beforeAll(async () => {
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
        listSpecialistScheduleUseCase = new ListSpecialistScheduleUseCase(
            specialistScheduleRepositoryInMemory,
            dateProvider
        );
    });

    it("should be able to list a specialist schedule available", async () => {
        const specialistSchedule: ICreateSpecialistScheduleDTO = {
            dateSchedule: dateProvider.getDate(new Date("2022-01-01 15:00:00")),
            status: SpecialistScheduleStatusEnum.AVAILABLE,
            specialistId: "1234",
            userId: "user-schedule-1",
        };

        await createSpecialistScheduleUseCase.execute(specialistSchedule);

        const result = await listSpecialistScheduleUseCase.execute({
            dateBegin: dateProvider.getDate(new Date("2022-01-01 15:00:00")),
            dateEnd: dateProvider.getDate(new Date("2022-01-01 15:00:00")),
            specialistId: "1234",
            id: "",
            userId: "",
            specialistUserId: null,
            productId: "",
            status: "",
        });

        expect(result).toHaveLength(1);
    });
});

