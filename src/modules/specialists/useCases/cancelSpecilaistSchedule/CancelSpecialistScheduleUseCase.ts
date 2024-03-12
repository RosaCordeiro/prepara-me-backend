import { UserTypeEnum } from "@modules/accounts/enums/UserTypeEnum";
import { IUserProductsAvailableRepository } from "@modules/accounts/repositories/IUserProductsAvailableRepository";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { SpecialistScheduleStatusEnum } from "@modules/specialists/enums/SpecialistScheduleStatusEnum";
import { SpecialistSchedule } from "@modules/specialists/infra/typeorm/entities/SpecialistSchedule";
import { ISpecialistSchedulesCancelRepository } from "@modules/specialists/repositories/ISpecialistSchedulesCancelRepository";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";
import { IScheduleProvider } from "@shared/container/providers/ScheduleProvider/IScheduleProvider";
import { formatDateToString } from "@utils/formatDate";
import { resolve } from "path";

import { inject, injectable } from "tsyringe";

interface ICancelSpecialistSchedule {
    id: string;
    revertAvailableProduct: boolean;
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
        private specialistSchedulesCancelRepository: ISpecialistSchedulesCancelRepository
    ) {}

    async execute(
        { id, revertAvailableProduct }: ICancelSpecialistSchedule,
        loggedUserId: string
    ): Promise<any> {
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
            id: specialistSchedule.id,
        });

        if (specialistSchedule.scheduleEventId) {
            try {
                this.scheduleGoogle.cancelScheduledEvent(
                    "primary",
                    specialistSchedule.scheduleEventId
                );
            } catch (error) {
                console.log("error", error);
            }
        }

        const userId = specialistSchedule.userId;

        const user = await this.usersRepository.findById(loggedUserId);
        const isAdmin = user.type === UserTypeEnum.ADMIN;

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

        return specialistScheduleUpdated;
    }
}

export { CancelSpecialistScheduleUseCase };
