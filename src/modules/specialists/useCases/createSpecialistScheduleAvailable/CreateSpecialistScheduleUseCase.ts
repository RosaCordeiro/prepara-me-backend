import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { SpecialistScheduleStatusEnum } from "@modules/specialists/enums/SpecialistScheduleStatusEnum";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { AppError } from "@shared/errors/AppError";
import { formatDateToString } from "@utils/formatDate";
import { inject, injectable } from "tsyringe";
import { resolve } from "path";

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
        private dateProvider: IDateProvider,
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("SESMailProvider")
        private mailProvider: IMailProvider
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
        rating,
    }: ICreateSpecialistScheduleDTO): Promise<SpecialistSchedule> {
        console.log("productId", productId);
        console.log("userId", userId);
        console.log("createEvent", createEvent);

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError("User not found!");
        }

        if (productId && userId && createEvent) {
            const userProducts =
                await this.userProductsAvailableRepository.find({
                    productId,
                    userId,
                });

            console.log("userProducts", userProducts);

            if (userProducts.length > 0) {
                const availableQuantity = userProducts.findIndex(
                    (userProduct) => userProduct.availableQuantity >= 1
                );

                const userProduct =
                    userProducts[
                        availableQuantity === -1 ? 0 : availableQuantity
                    ];

                if (userProduct.availableQuantity >= 1) {
                    const specialistsSchedule =
                        await this.specialistSchedulesRepository.find({
                            id,
                        });

                    if (specialistsSchedule.length > 0) {
                        const userSpecialistEmail =
                            specialistsSchedule[0].specialist.user.email;

                        const dateScheduleStartMasked =
                            this.dateProvider.formatDateTime(
                                dateSchedule,
                                "YYYY-MM-DDThh:mm:ssfff:00"
                            );

                        let products = await this.productsRepository.find({
                            id: productId,
                        });

                        let product = products[0];

                        const dateScheduleEndMasked =
                            this.dateProvider.formatDateTime(
                                this.dateProvider.addHours(
                                    product.duration,
                                    dateSchedule
                                ),
                                "YYYY-MM-DDThh:mm:ssfff:00"
                            );

                        //console.log('Chegou aqui no primeiro if')

                        try {
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
                        } catch (error) {
                            console.log(
                                "error create specialist schedule",
                                error
                            );

                            throw new AppError(
                                "Was not possible schedule your event!"
                            );
                        }

                        userProduct.availableQuantity =
                            userProduct.availableQuantity - 1;

                        try {
                            await this.userProductsAvailableRepository.create({
                                availableQuantity:
                                    userProduct.availableQuantity,
                                productId: userProduct.product.id,
                                userId: userProduct.user.id,
                                id: userProduct.id,
                            });
                        } catch (error) {
                            await this.scheduleGoogle.cancelScheduledEvent(
                                "primary",
                                scheduleEventId
                            );

                            throw new AppError(
                                "Was not possible schedule your event!"
                            );
                        }

                        try {
                            const templatePath = resolve(
                                __dirname,
                                "..",
                                "..",
                                "views",
                                "emails",
                                "mentoringCreate.hbs"
                            );

                            const variables = {
                                name: user.name,
                                mentoring: userProduct.product.shortName,
                                specialist:
                                    specialistsSchedule[0].specialist.name,
                                date: formatDateToString(dateSchedule),
                                link: hangoutLink,
                            };

                            void this.mailProvider.sendMail(
                                user.email,
                                "Confirmação de participação em mentoria",
                                variables,
                                templatePath
                            );
                        } catch (error) {
                            console.log("error send email", error);
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
                rating,
            });

        return specialistSchedule;
    }
}

export { CreateSpecialistScheduleUseCase };
