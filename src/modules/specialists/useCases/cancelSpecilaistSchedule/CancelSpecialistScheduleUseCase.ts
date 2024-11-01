import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IProductsRepository } from "@modules/products/repositories/IProductsRepository";
import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { SpecialistScheduleCancelReasonEnum } from "@modules/specialists/enums/SpecialistScheduleCancelReasonEnum";
import { SpecialistScheduleStatusEnum } from "@modules/specialists/enums/SpecialistScheduleStatusEnum";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { ISpecialistSchedulesCancelRepository } from "@modules/specialists/repositories/ISpecialistSchedulesCancelRepository";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { AppError } from "@shared/errors/AppError";
import { formatDateToString } from "@utils/formatDate";
import { resolve } from "path";

import { inject, injectable } from "tsyringe";

interface ICancelSpecialistSchedule {
    id: string;
    revertAvailableProduct: boolean;
    reason?: string;
}

@injectable()
class CancelSpecialistScheduleUseCase {
    constructor(
        @inject("SpecialistSchedulesRepository")
        private specialistSchedulesRepository: ISpecialistSchedulesRepository,
        @inject("UserProductsAvailableRepository")
        private userProductsAvailableRepository: IUserProductsAvailableRepository,
        @inject("ScheduleGoogle")
        private scheduleGoogle: IScheduleProvider,
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,
        @inject("SESMailProvider")
        private mailProvider: IMailProvider,
        @inject("SpecialistSchedulesCancelRepository")
        private specialistSchedulesCancelRepository: ISpecialistSchedulesCancelRepository,
        @inject("ProductsRepository")
        private productsRepository: IProductsRepository,
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider,
    ) { }

    async execute(
        { id, revertAvailableProduct, reason }: ICancelSpecialistSchedule,
        loggedUserId: string
    ): Promise<any> {
        if (!reason) {
            reason = SpecialistScheduleCancelReasonEnum.CANCELED;
        } else {
            if (
                reason !== "NÃO COMPARECEU" &&
                reason !== "REAGENDADO" &&
                reason !== "CANCELADO"
            ) {
                throw new Error("Invalid reason");
            }
        }

        const specialistsSchedule =
            await this.specialistSchedulesRepository.find({
                id,
            });

        const specialistSchedule = specialistsSchedule[0];
        await this.specialistSchedulesCancelRepository.create({
            dateSchedule: specialistSchedule.dateSchedule,
            specialistId: specialistSchedule.specialistId,
            userId: specialistSchedule.userId,
            productId: specialistSchedule.productId,
            reason,
        });

        console.log('Agenda', specialistSchedule);

        if (specialistSchedule.scheduleEventId) {
            try {
                this.scheduleGoogle.cancelScheduledEvent(
                    "primary",
                    specialistSchedule.scheduleEventId
                );
                console.log('Evento cancelado no Google');
            } catch (error) {
                console.log("error", error);
            }
        }

        const userId = specialistSchedule.userId;

        const user = await this.usersRepository.findById(loggedUserId);
        const isAdmin = user.type === UserTypeEnum.ADMIN;
        console.log('User', user);
        
        if (isAdmin) {
            try {
                const templatePath = resolve(
                    __dirname,
                    "..",
                    "..",
                    "views",
                    "emails",
                    "mentoringCancel.hbs"
                );

                void this.mailProvider.sendMail(
                    specialistSchedule.user.email,
                    "Cancelamento de Mentoria",
                    {
                        name: specialistSchedule.user.name,
                        date: formatDateToString(
                            specialistSchedule.dateSchedule
                        ),
                    },
                    templatePath
                );

                void this.mailProvider.sendMail(
                    specialistSchedule.specialist.user.email,
                    "Cancelamento de Mentoria",
                    {
                        name: specialistSchedule.specialist.user.name,
                        date: formatDateToString(
                            specialistSchedule.dateSchedule
                        ),
                    },
                    templatePath
                );
            } catch (error) {
                console.log("error send email", error);
            }
        }

        const productId = specialistSchedule.productId;
        console.log('Produto', productId);
        
        if (userId && productId && revertAvailableProduct) {
            const userProducts =
                await this.userProductsAvailableRepository.find({
                    productId,
                    userId,
                });

            if (userProducts.length > 0) {
                const userProduct = userProducts[0];

                userProduct.availableQuantity++;

                await this.userProductsAvailableRepository.create({
                    availableQuantity: userProduct.availableQuantity,
                    productId: userProduct.product.id,
                    userId: userProduct.user.id,
                    id: userProduct.id,
                });
            }
        }

        const specialistScheduleUpdated =
            await this.specialistSchedulesRepository.create({
                dateSchedule: specialistSchedule.dateSchedule,
                specialistId: specialistSchedule.specialistId,
                status: SpecialistScheduleStatusEnum.AVAILABLE,
                productId: null,
                userId: null,
                comments: null,
                hangoutLink: null,
                scheduleEventId: null,
                id,
            });

        const product = await this.productsRepository.findById(productId)
        if (product.duration === 60) {
            let nextSchedule: any = new Date(specialistSchedule.dateSchedule)
            nextSchedule = this.dateProvider.getDateTimeZone(nextSchedule)

            nextSchedule = this.dateProvider.formatDateTime(
                this.dateProvider.addMinutes(
                    30,
                    nextSchedule
                ),
                "YYYY-MM-DDThh:mm:ssfff:00"
            )

            const specialistScheduleCancel = await this.specialistSchedulesRepository.find({
                dateSchedule: nextSchedule,
                specialistId: specialistSchedule.specialistId
            })

            if (specialistSchedule[0]) {
                await this.specialistSchedulesRepository.create({
                    id: specialistScheduleCancel[0].id,
                    status: SpecialistScheduleStatusEnum.AVAILABLE
                })

            }
        }

        console.log('Agenda atualizada', specialistScheduleUpdated);

        return specialistScheduleUpdated;
    }
}

export { CancelSpecialistScheduleUseCase };
