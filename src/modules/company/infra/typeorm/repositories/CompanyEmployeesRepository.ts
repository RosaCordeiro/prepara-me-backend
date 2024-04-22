import { ICompanyEmployeeResponseDTO } from "@modules/company/dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { CompanyEmployeeMap } from "@modules/company/mapper/CompanyEmployeeMap";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { getRepository, IsNull, Not, Repository } from "typeorm";
import { CompanyEmployee } from "../entities/CompanyEmployee";

import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";
import { SubscriptionPlansRepository } from "@modules/products/infra/typeorm/repositories/SubscriptionPlansRepository";
import { IGetParametersResponseDTO } from "@modules/company/dtos/IGetParametersResponseDTO";
import { formatDate, formatDates } from "@utils/formatDate";

class CompanyEmployeesRepository implements ICompanyEmployeesRepository {
    private repository: Repository<CompanyEmployee>;

    constructor() {
        this.repository = getRepository(CompanyEmployee);
    }
    async getParameters(id: string): Promise<IGetParametersResponseDTO> {
        const companyEmployee = await this.repository.find({
            where: {
                companyId: id,
                userId: Not(IsNull()),
            },
        });

        const areas = companyEmployee
            .map((ce) => ce.department)
            .filter((c) => c !== null && c !== undefined && c !== "");
        const uniqueAreas = [...new Set(areas)];

        const roles = companyEmployee
            .map((ce) => ce.position)
            .filter((c) => c !== null && c !== undefined && c !== "");
        const uniqueRoles = [...new Set(roles)];

        const periods = companyEmployee
            .map((ce) => ce.entryDate)
            .filter((c) => c !== null && c !== undefined);

        const formattedDates = formatDates(periods);

        const uniquePeriods = [...new Set(formattedDates)].sort((a, b) => {
            const yearA = parseInt(a.split(" ")[2]);
            const yearB = parseInt(b.split(" ")[2]);
            return yearA - yearB;
        });

        const unities = companyEmployee
            .map((ce) => ce.unity)
            .filter((c) => c !== null && c !== undefined && c !== "");
        console.log("unities", unities);

        const uniqueUnities = [...new Set(unities)];

        return {
            period: uniquePeriods,
            unity: uniqueUnities,
            area: uniqueAreas,
            role: uniqueRoles,
        };
    }

    findById(id: string): Promise<CompanyEmployee> {
        return this.repository.findOne(id, { relations: ["user"] });
    }

    async accept(id: string): Promise<boolean> {
        const response = await this.repository.update(id, { accepted: true });

        return response.affected === 1;
    }

    async realocate(id: string): Promise<boolean> {
        const response = await this.repository.update(id, {
            realocate: true,
        });

        return response.affected === 1;
    }

    async create({
        companyId,
        documentId,
        name,
        subscribeToken,
        userId,
        phone,
        email,
        id,
        easyRegister,
        entryDate,
        position,
        department,
        plan,
        unity,
    }: ICreateCompanyEmployeeDTO): Promise<CompanyEmployee> {
        const companyEmployee = this.repository.create({
            companyId,
            documentId,
            name,
            subscribeToken,
            userId,
            phone,
            email,
            id,
            easyRegister,
            entryDate,
            position,
            department,
            plan,
            unity,
        });

        await this.repository.save(companyEmployee);

        return companyEmployee;
    }

    async find({
        name,
        documentId,
        userId,
        notUserId,
        phone,
        email,
        companyId,
        id,
    }): Promise<ICompanyEmployeeResponseDTO[]> {
        const companyEmployeesQuery = this.repository
            .createQueryBuilder("ce")
            .leftJoinAndSelect("ce.user", "u")
            .leftJoinAndSelect("ce.company", "c");

        if (id) {
            companyEmployeesQuery.andWhere("ce.id = :id", {
                id: id,
            });
        } else {
            if (name) {
                name = `%${name}%`;

                companyEmployeesQuery.andWhere("ce.name like :name", {
                    name: name,
                });
            }

            if (documentId) {
                companyEmployeesQuery.andWhere("ce.documentId = :documentId", {
                    documentId: documentId,
                });
            }

            if (companyId) {
                companyEmployeesQuery.andWhere("ce.companyId = :companyId", {
                    companyId: companyId,
                });
            }

            if (userId) {
                companyEmployeesQuery.andWhere("ce.userId = :userId", {
                    userId: userId,
                });
            }

            if (notUserId) {
                if (notUserId === "true") {
                    companyEmployeesQuery.andWhere("ce.userId is null");
                } else {
                    companyEmployeesQuery.andWhere("not ce.userId is null");
                }
            }

            if (phone) {
                companyEmployeesQuery.andWhere("ce.phone = :phone", {
                    phone: phone,
                });
            }

            if (email) {
                companyEmployeesQuery.andWhere("ce.email = :email", {
                    email: email,
                });
            }
        }

        const companyEmployees = await companyEmployeesQuery.getMany();

        const companyEmployeesMapped = companyEmployees.map(
            (companyEmployee) => {
                return CompanyEmployeeMap.toDTO(companyEmployee);
            }
        );

        if (companyEmployeesMapped.length === 1) {
            console.log(
                "companyEmployeesMapped[0].plan",
                companyEmployeesMapped[0].plan
            );

            const subscriptionPlansRepository: ISubscriptionPlansRepository =
                new SubscriptionPlansRepository();

            const plan = await subscriptionPlansRepository.find({
                name: companyEmployeesMapped[0].plan,
            });

            console.log(`await plan`, plan[0]);

            companyEmployeesMapped[0].planId = {
                id: plan[0].id,
                name: plan[0].name,
            };
        }

        return companyEmployeesMapped;
    }

    async remove(id: string): Promise<string> {
        this.repository.delete(id);

        return id;
    }
}

export { CompanyEmployeesRepository };
