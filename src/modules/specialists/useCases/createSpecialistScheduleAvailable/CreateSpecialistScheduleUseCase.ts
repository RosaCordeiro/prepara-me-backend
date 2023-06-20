import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { SpecialistScheduleStatusEnum } from "@modules/specialists/enums/SpecialistScheduleStatusEnum";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class CreateSpecialistScheduleUseCase {
    constructor(
        @inject("SpecialistSchedulesRepository")
        private specialistSchedulesRepository: ISpecialistSchedulesRepository,
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository,
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    async execute({
        dateSchedule,
        specialistId,
        status,
        productId,
        userId,
        comments,
        hangoutLink,
        scheduleEventId,
        id,
        createEvent,
        rating
    }: ICreateSpecialistScheduleDTO): Promise<SpecialistSchedule> {
        if (productId && userId && createEvent) {
            const userProducts =
                await this.userProductsAvailableRepository.find({
                    productId,
                    userId,
                });

            if (userProducts.length > 0) {
                const userProduct = userProducts[0];

                console.log('userProduct', userProduct)

                if (userProduct.availableQuantity >= 1) {
                    const specialistsSchedule =
                        await this.specialistSchedulesRepository.find({
                            id,
                        });

                    if (specialistsSchedule.length > 0) {
                        const userSpecialistEmail = specialistsSchedule[0].specialist.user.email;

                        userProduct.availableQuantity =
                            userProduct.availableQuantity - 1;

                        const userProductUpdated =
                            await this.userProductsAvailableRepository.create({
                                availableQuantity:
                                    userProduct.availableQuantity,
                                productId: userProduct.product.id,
                                userId: userProduct.user.id,
                                id: userProduct.id,
                            });

                        const dateScheduleStartMasked =
                            this.dateProvider.formatDateTime(
                                dateSchedule,
                                "YYYY-MM-DDThh:mm:ssfff:00"
                            );

                        let products = await this.productsRepository.find({
                            id: productId
                        })

                        let product = products[0]

                        const dateScheduleEndMasked =
                            this.dateProvider.formatDateTime(
                                this.dateProvider.addHours(product.duration, dateSchedule),
                                "YYYY-MM-DDThh:mm:ssfff:00"
                            );

                        if (userProductUpdated) {
                            console.log('Chegou aqui no primeiro if')

                            const eventScheduled =
                                await this.scheduleGoogle.scheduleEvent(
                                    `${userProduct.product.shortName} com o(a) especialista ${specialistsSchedule[0].specialist.name}`,
                                    "Online",
                                    "Estamos aguardando você",
                                    dateScheduleStartMasked,
                                    dateScheduleEndMasked,
                                    "America/Sao_Paulo",
                                    [
                                        { email: userSpecialistEmail },
                                        { email: userProduct.user.email },
                                    ]
                                );

                            if (eventScheduled.status != "200") {
                                throw new AppError(
                                    "Was not possible schedule your event!"
                                );
                            }

                            hangoutLink = eventScheduled.data.hangoutLink;
                            scheduleEventId = eventScheduled.data.id;
                        }
                    } else {
                        throw new AppError("Schedule not found!");
                    }
                } else {
                    throw new AppError("Quantity available insufficient!");
                }
            } else {
                throw new AppError("Product not available for user!");
            }
        }

        dateSchedule = new Date(dateSchedule);

        if (!dateSchedule) {
            throw new AppError("Date Schedule can't be null!");
        }

        if (!specialistId) {
            throw new AppError("Specialist can't be null!");
        }

        if (!Object.values(SpecialistScheduleStatusEnum).includes(status)) {
            throw new AppError("Status entered wrong");
        }

        const specialistSchedule =
            await this.specialistSchedulesRepository.create({
                dateSchedule,
                specialistId,
                status,
                productId,
                userId,
                comments,
                hangoutLink,
                scheduleEventId,
                id,
                rating
            });

        return specialistSchedule;
    }
}

export { CreateSpecialistScheduleUseCase };

