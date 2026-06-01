import { Product } from '@modules/products/infra/typeorm/entities/Product';
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
    ) { }

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
        userRequestId
    }: ICreateSpecialistScheduleDTO): Promise<SpecialistSchedule> {
        console.log("productId", productId);
        console.log("userId", userId);
        console.log("createEvent", createEvent);

        const user = await this.userRepository.findById(userId);
        const userRequest = await this.userRepository.findById(userRequestId);
        console.log('userRequest', userRequest);

        const productItem = await this.productsRepository.findById(productId)
        console.log('product aqui', productItem);


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

                        let product = productItem;

                        const dateScheduleEndMasked =
                            this.dateProvider.formatDateTime(
                                this.dateProvider.addMinutes(
                                    product.duration,
                                    dateSchedule
                                ),
                                "YYYY-MM-DDThh:mm:ssfff:00"
                            );


                        //console.log('Chegou aqui no primeiro if')

                        try {
                            if (productItem.onlyAdmin && userRequest.type.toUpperCase() !== 'ADMIN') {
                                throw new Error('Only admins can create this type of schedule.')
                            }
                            if (product.duration === 60) {
                                console.log('horário de 1 hora', dateScheduleStartMasked);
                                let nextSchedule: any = new Date(dateScheduleStartMasked)
                                nextSchedule = this.dateProvider.getDateTimeZone(nextSchedule)

                                //se o produto tiver duração de 1h, só pode ocorrer em horários inteiros
                                if (nextSchedule.getMinutes() === 30) {
                                    throw new Error('One-hour scheduling can only occur in full time slots')
                                }
                                //pega a próxima agenda do especialista (se existir) 
                                //com horário quebrado (30min) e atualiza para indisponível,
                                //pois o horário é de 1h
                                nextSchedule = this.dateProvider.formatDateTime(
                                    this.dateProvider.addMinutes(
                                        30,
                                        nextSchedule
                                    ),
                                    "YYYY-MM-DDThh:mm:ssfff:00"
                                )

                                const specialistSchedule = await this.specialistSchedulesRepository.find({
                                    dateSchedule: nextSchedule,
                                    specialistId
                                })

                                //verifica se existe a próxima agenda e se ela está disponível
                                //se sim, torna ela indisponível
                                if (specialistSchedule[0]) {
                                    if (specialistSchedule[0].status['value'] === 'AVAILABLE') {
                                        await this.specialistSchedulesRepository.create({
                                            id: specialistSchedule[0].id,
                                            status: SpecialistScheduleStatusEnum.UNAVAILABLE
                                        })
                                    } else {
                                        throw new AppError('Was not possible schedule your event! Cód: 1')
                                    }
                                }
                            }
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
                                console.log("error create specialist schedule", eventScheduled);
                                throw new AppError(
                                    "Was not possible schedule your event! Cód: 2"
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
                                "Was not possible schedule your event! Cód: 3"
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
                                "Was not possible schedule your event! Cód: 4"
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
