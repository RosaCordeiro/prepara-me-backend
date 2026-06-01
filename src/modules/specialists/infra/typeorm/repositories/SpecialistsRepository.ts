import { ICreateSpecialistDTO } from "@modules/specialists/dtos/ICreateSpecialistDTO";
import { ISpecialistResponseDTO } from "@modules/specialists/dtos/ISpecialistResponseDTO";
import { SpecialistStatusEnum } from "@modules/specialists/enums/SpecialistStatusEnum";
import { SpecialistMap } from "@modules/specialists/mapper/SpecialistMap";
import { ISpecialistsRepository } from "@modules/specialists/repositories/ISpecialistsRepository";
import { getRepository, Repository } from "typeorm";
import { Specialist } from "../entities/Specialist";

class SpecialistsRepository implements ISpecialistsRepository {
    private repository: Repository<Specialist>;

    constructor() {
        this.repository = getRepository(Specialist);
    }

    async create(data: ICreateSpecialistDTO): Promise<Specialist> {
        const specialist = this.repository.create(data);

        await this.repository.save(specialist);

        return specialist;
    }

    async findById(id: string): Promise<Specialist> {
        const specialist = await this.repository.findOne(id, {
            relations: ["user"],
        });

        return specialist;
    }

    async findByIds(
        ids: string[],
        dateBegin: Date,
        dateEnd: Date
    ): Promise<ISpecialistResponseDTO[]> {
        const specialistsQuery = this.repository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.user", "user");

        if (dateBegin && dateEnd) {
            specialistsQuery.leftJoinAndSelect(
                "s.specialistSchedule",
                "ss",
                "ss.dateSchedule between :dateBegin and :dateEnd",
                {
                    dateBegin,
                    dateEnd,
                }
            );
        }

        specialistsQuery
            .andWhere("s.id IN (:...ids)")
            .setParameter("ids", [...ids])
            .andWhere("s.status = :status", {
                status: SpecialistStatusEnum.ACTIVE,
            });

        const specialists = await specialistsQuery.getMany();

        const specialistsMapped = specialists.map((specialist) => {
            return SpecialistMap.toDTO(specialist);
        });

        return specialistsMapped;
    }

    async find({
        name,
        status,
        userId,
        id,
    }): Promise<ISpecialistResponseDTO[]> {
        const specialistsQuery = this.repository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.user", "u")
            .leftJoinAndSelect("s.specialistSchedule", "ss")
            .leftJoinAndSelect("s.productSpecialist", "ps")
            .leftJoinAndSelect("ps.product", "p");

        if (id) {
            specialistsQuery.andWhere("s.id = :id", {
                id: id,
            });
        } else {
            if (name) {
                name = `%${name}%`;

                specialistsQuery.andWhere("s.name like :name", {
                    name: name,
                });
            }

            if (status) {
                specialistsQuery.andWhere("s.status = :status", {
                    status: status,
                });
            }

            if (userId) {
                specialistsQuery.andWhere("s.userId = :userId", {
                    userId: userId,
                });
            }
        }

        const specialists = await specialistsQuery.getMany();

        const specialistsMapped = specialists.map((specialist) => {
            return SpecialistMap.toDTO(specialist);
        });

        return specialistsMapped;
    }

    async remove(id: string): Promise<void> {
        this.repository.delete(id);
    }
}

export { SpecialistsRepository };
