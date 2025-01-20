import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";

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
import { IRescheduleSpecialistScheduleDTO } from "@modules/specialists/dtos/IRescheduleSpecialistScheduleDTO";
import { ISpecialistSchedulesFilesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesFilesRepository";

@injectable()
class CreateSpecialistScheduleRescheduleUseCase {
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
        private mailProvider: IMailProvider,
        @inject("SpecialistSchedulesFilesRepository")
        private specialistSchedulesFilesRepository: ISpecialistSchedulesFilesRepository
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
        oldScheduleId,
    }: IRescheduleSpecialistScheduleDTO): Promise<SpecialistSchedule> {
        console.log("productId", productId);
        console.log("userId", userId);
        console.log("createEvent", createEvent);

        const user = await this.userRepository.findById(userId);

        if (!user) {
            throw new AppError("User not found!");
        }

        const oldSchedule = await this.specialistSchedulesRepository.findById(
            oldScheduleId
        );

        if (!oldSchedule) {
            throw new AppError("Old Schedule not found!");
        }

        if (oldSchedule.status === SpecialistScheduleStatusEnum.AVAILABLE) {
            throw new AppError("Old Schedule was not scheduled!");
        }

        if (oldSchedule.productId !== productId) {
            throw new AppError("Product is different from the old schedule!");
        }

        const specialistsSchedule =
            await this.specialistSchedulesRepository.find({
                id,
            });

        if (specialistsSchedule.length > 0) {
            const userSpecialistEmail =
                specialistsSchedule[0].specialist.user.email;

            const dateScheduleStartMasked = this.dateProvider.formatDateTime(
                dateSchedule,
                "YYYY-MM-DDThh:mm:ssfff:00"
            );

            let products = await this.productsRepository.find({
                id: productId,
            });

            let product = products[0];

            const dateScheduleEndMasked = this.dateProvider.formatDateTime(
                this.dateProvider.addMinutes(
                    product.duration,
                    dateSchedule
                ),
                "YYYY-MM-DDThh:mm:ssfff:00"
            );

            //console.log('Chegou aqui no primeiro if')

            try {
                if (product.duration === 60) {                    
                    let oldScheduleNext: any = new Date(oldSchedule.dateSchedule);
                    
                    oldScheduleNext = this.dateProvider.getDateTimeZone(oldScheduleNext);

                    oldScheduleNext = this.dateProvider.formatDateTime(
                        this.dateProvider.addMinutes(
                            30,
                            oldScheduleNext
                        ),
                        "YYYY-MM-DDThh:mm:ssfff:00"
                    );
                    
                    let specialistOldScheduleNext = await this.specialistSchedulesRepository.find({
                        dateSchedule: oldScheduleNext,
                        specialistId
                    })
                    //verifica se a agenda antiga tinha um horário seguinte quebrado (30min) e se ele está indisponível
                    //se sim, torna ela disponível
                    if (specialistOldScheduleNext[0]) {
                        if (specialistOldScheduleNext[0].status['value'] === 'UNAVAILABLE') {
                            await this.specialistSchedulesRepository.create({
                                id: specialistOldScheduleNext[0].id,
                                status: SpecialistScheduleStatusEnum.AVAILABLE
                            })
                        }
                    }

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
                            throw new AppError('Was not possible schedule your event')
                        }
                    }
                }
                const eventScheduled =
                    await this.scheduleGoogle.updateScehduledEvent(
                        oldSchedule.scheduleEventId,
                        `${product.shortName} com o(a) especialista ${specialistsSchedule[0].specialist.name}`,
                        "Online",
                        "Estamos aguardando você",
                        dateScheduleStartMasked,
                        dateScheduleEndMasked,
                        "America/Sao_Paulo",
                        [{ email: userSpecialistEmail }, { email: user.email }]
                    );

                if (eventScheduled.status != "200") {
                    throw new AppError("Was not possible schedule your event!");
                }

                hangoutLink = eventScheduled.data.hangoutLink;
                scheduleEventId = eventScheduled.data.id;
            } catch (error) {
                console.log("error create specialist schedule", error);

                //throw new AppError("Was not possible schedule your event!");
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
                    mentoring: product.shortName,
                    specialist: specialistsSchedule[0].specialist.name,
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

            try {
                const templatePath = resolve(
                    __dirname,
                    "..",
                    "..",
                    "views",
                    "emails",
                    "mentoringReschedule.hbs"
                );

                const variables = {
                    name: specialistsSchedule[0].specialist.user.name,
                    mentoring: product.shortName,
                    oldDate: formatDateToString(oldSchedule.dateSchedule),
                    date: formatDateToString(dateSchedule),
                    link: hangoutLink,
                };

                void this.mailProvider.sendMail(
                    specialistsSchedule[0].specialist.user.email,
                    "Reagendamento de mentoria",
                    variables,
                    templatePath
                );
            } catch (error) {
                console.log("error send email", error);
            }
        } else {
            throw new AppError("Schedule not found!");
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

        console.log("oldSchedule", {
            dateSchedule: oldSchedule.dateSchedule,
            specialistId: oldSchedule.specialistId,
            status: SpecialistScheduleStatusEnum.AVAILABLE,
            productId: null,
            userId: null,
            comments: null,
            hangoutLink: null,
            scheduleEventId: null,
            id,
        });

        await this.specialistSchedulesRepository.create({
            dateSchedule: oldSchedule.dateSchedule,
            specialistId: oldSchedule.specialistId,
            status: SpecialistScheduleStatusEnum.AVAILABLE,
            productId: null,
            userId: null,
            comments: null,
            hangoutLink: null,
            scheduleEventId: null,
            id: oldSchedule.id,
        });

        console.log("newSchedule", {
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

        const files = await this.specialistSchedulesFilesRepository.find(
            oldSchedule.id
        );

        for (let file of files) {
            console.log("file", file);

            await this.specialistSchedulesFilesRepository.remove(file.id);
        }
        for (let file of files) {
            await this.specialistSchedulesFilesRepository.create({
                id: file.id,
                specialistScheduleId: specialistSchedule.id,
                fileType: file.fileType,
                fileName: file.fileName,
                fileLink: file.fileLink,
            });
        }

        return specialistSchedule;
    }
}

export { CreateSpecialistScheduleRescheduleUseCase };
