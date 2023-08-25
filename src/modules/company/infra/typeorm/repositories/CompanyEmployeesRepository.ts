import { ICompanyEmployeeResponseDTO } from "@modules/company/dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { CompanyEmployeeMap } from "@modules/company/mapper/CompanyEmployeeMap";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { getRepository, Repository } from "typeorm";
import { CompanyEmployee } from "../entities/CompanyEmployee";

class CompanyEmployeesRepository implements ICompanyEmployeesRepository {
    private repository: Repository<CompanyEmployee>;

    constructor() {
        this.repository = getRepository(CompanyEmployee);
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
                console.log(companyEmployee);
                return CompanyEmployeeMap.toDTO(companyEmployee);
            }
        );

        return companyEmployeesMapped;
    }

    async remove(id: string): Promise<string> {
        this.repository.delete(id);

        return id;
    }
}

export { CompanyEmployeesRepository };
