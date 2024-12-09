import { ICreateSpecialistScheduleDTO } from "@modules/specialists/dtos/ICreateSpecialistScheduleDTO";
import { ISpecialistScheduleResponseDTO } from "@modules/specialists/dtos/ISpecialistScheduleResponseDTO";
import { SpecialistScheduleMap } from "@modules/specialists/mapper/SpecialistScheduleMap";
import { ISpecialistSchedulesRepository } from "@modules/specialists/repositories/ISpecialistSchedulesRepository";
import { getRepository, Repository } from "typeorm";
import { SpecialistSchedule } from "../entities/SpecialistSchedule";

class SpecialistSchedulesRepository implements ISpecialistSchedulesRepository {
    private repository: Repository<SpecialistSchedule>;

    constructor() {
        this.repository = getRepository(SpecialistSchedule);
    }
    findById(id: string): Promise<SpecialistSchedule> {
        return this.repository.findOne(id);
    }

    async create({
        dateSchedule,
        specialistId,
        status,
        userId,
        productId,
        comments,
        hangoutLink,
        scheduleEventId,
        id,
        rating,
    }: ICreateSpecialistScheduleDTO): Promise<SpecialistSchedule> {
        const specialistSchedule = this.repository.create({
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

        await this.repository.save(specialistSchedule);

        return specialistSchedule;
    }

    async find({
        dateBegin,
        dateEnd,
        userId,
        status,
        productId,
        specialistId,
        specialistUserId,
        id,
    }: {
        dateBegin?: Date;
        dateEnd?: Date;
        userId?: string;
        status?: string;
        productId?: string;
        specialistId?: string;
        specialistUserId?: string;
        id?: string;
    }): Promise<ISpecialistScheduleResponseDTO[]> {
        const specialistSchedulesQuery = this.repository
            .createQueryBuilder("ss")
            .loadRelationCountAndMap(
                "ss.filesCountUser",
                "ss.specialistScheduleFiles",
                "ssf",
                (qb) => qb.where("ssf.fileType = 'USER'")
            )
            .loadRelationCountAndMap(
                "ss.filesCountSpecialist",
                "ss.specialistScheduleFiles",
                "ssf",
                (qb) => qb.where("ssf.fileType = 'SPECIALIST'")
            )
            .leftJoinAndSelect("ss.user", "u")
            .leftJoinAndSelect("ss.specialist", "s")
            .leftJoinAndSelect("s.user", "su")
            .leftJoinAndSelect("ss.product", "p")
            .orderBy("ss.dateSchedule", "ASC");
    
        if (id) {
            specialistSchedulesQuery.andWhere("ss.id = :id", { id });
        } else {
            if (status) {
                specialistSchedulesQuery.andWhere("ss.status = :status", { status });
    
                if (status === 'UNAVAILABLE') {
                    specialistSchedulesQuery.andWhere("ss.userId IS NOT NULL");
                    specialistSchedulesQuery.andWhere("ss.productId IS NOT NULL");
                }
            }
    
            if (userId) {
                specialistSchedulesQuery.andWhere("ss.userId = :userId", {
                    userId,
                });
            }
    
            if (specialistUserId) {
                specialistSchedulesQuery.andWhere("s.userId = :userId", {
                    userId: specialistUserId,
                });
            }
    
            if (specialistId) {
                specialistSchedulesQuery.andWhere("ss.specialistId = :specialistId", {
                    specialistId,
                });
            }
    
            if (productId) {
                specialistSchedulesQuery.andWhere("ss.productId = :productId", {
                    productId,
                });
            }
    
            if (dateBegin && dateEnd) {
                specialistSchedulesQuery.andWhere(
                    "ss.dateSchedule between :dateBegin and :dateEnd",
                    {
                        dateBegin,
                        dateEnd,
                    }
                );
            }
        }
    
        const specialistSchedules = await specialistSchedulesQuery.getMany();
    
        console.log(specialistSchedules);
    
        const specialistSchedulesMapped = specialistSchedules.map(
            (specialistSchedule) => {
                return SpecialistScheduleMap.toDTO(specialistSchedule);
            }
        );
    
        return specialistSchedulesMapped;
    }
    async remove(id: string): Promise<string> {
        this.repository.delete(id);

        return id;
    }
}

export { SpecialistSchedulesRepository };
