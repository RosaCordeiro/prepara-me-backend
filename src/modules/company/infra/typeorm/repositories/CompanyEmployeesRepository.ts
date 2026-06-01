import { ICompanyEmployeeResponseDTO } from "@modules/company/dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { IUpdateCompanyEmployeeDTO } from "@modules/company/dtos/IUpdateCompanyEmployeeDTO";
import { CompanyEmployeeMap } from "@modules/company/mapper/CompanyEmployeeMap";
import { ICompanyEmployeesRepository } from "@modules/company/repositories/ICompanyEmployeesRepository";
import { getRepository, In, IsNull, Not, Repository } from "typeorm";
import { CompanyEmployee } from "../entities/CompanyEmployee";

import { ISubscriptionPlansRepository } from "@modules/products/repositories/ISubscriptionPlansRepository";
import { SubscriptionPlansRepository } from "@modules/products/infra/typeorm/repositories/SubscriptionPlansRepository";
import { IGetParametersResponseDTO } from "@modules/company/dtos/IGetParametersResponseDTO";
import {
    formatDate,
    formatDates,
    formatDateTimeToISO,
    getFirstAndLastDayOfMonth,
} from "@utils/formatDate";

class CompanyEmployeesRepository implements ICompanyEmployeesRepository {
    private repository: Repository<CompanyEmployee>;

    constructor() {
        this.repository = getRepository(CompanyEmployee);
    }
    async getParameters(
        id: string,
        period?: any,
        unity?: any,
        area?: any,
        dismissalType?: any
    ): Promise<IGetParametersResponseDTO> {
        console.log("id", id);

        const query = this.repository
            .createQueryBuilder("ce")
            .leftJoinAndSelect("ce.user", "u")
            .where("ce.userId is not null");

        if (id && id !== "TUDO") {
            if (id !== "B2B" && id !== "B2C") {
                query.andWhere("ce.companyId = :companyId", {
                    companyId: id,
                });
            }

            if (id === "B2B") {
                query.andWhere("ce.companyId is null");
            }

            if (id === "B2C") {
                query.andWhere("ce.companyId is not null");
            }
        }

        /* if (unity) {
            unity = JSON.parse(unity);
            query.andWhere(
                `ce.unity IN (${unity.map((u) => `'${u}'`).join(",")})`
            );
        }

        if (area) {
            area = JSON.parse(area);
            query.andWhere(
                `ce.department IN (${area.map((a) => `'${a}'`).join(",")})`
            );
        }

        if (period) {
            period = JSON.parse(period).map((p) =>
                getFirstAndLastDayOfMonth(p)
            );

            query.andWhere(
                `ce.entryDate BETWEEN ${formatDateTimeToISO(
                    period[0][0]
                )} AND ${formatDateTimeToISO(period[0][1])} ${
                    period.length > 1
                        ? period
                              .slice(1)
                              .map(
                                  (p) =>
                                      `OR ce.entryDate BETWEEN ${formatDateTimeToISO(
                                          p[0]
                                      )} AND ${formatDateTimeToISO(p[1])}`
                              )
                              .join(" ")
                        : ""
                }`
            );
        } */

        if (area) {
            area = JSON.parse(area);
            query.andWhere(
                `ce.department IN (${area.map((a: string) => `'${a}'`).join(",")})`
            );
        }

        if (dismissalType) {
            dismissalType = JSON.parse(dismissalType);
            query.andWhere(
                `ce.dismissalType IN (${dismissalType.map((dt: string) => `'${dt}'`).join(",")})`
            );
        }

        const companyEmployee = await query.getMany();

        const rolesCompanyEmployee = await query.getMany();

        const areas = companyEmployee
            .map((ce: CompanyEmployee) => ce.department)
            .filter((c: string | undefined) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueAreas = [...new Set(areas)];

        const roles = rolesCompanyEmployee
            .map((ce: CompanyEmployee) => ce.position)
            .filter((c: string | undefined) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueRoles = [...new Set(roles)].sort((a: string, b: string) =>
            a.localeCompare(b)
        );

        const periods = companyEmployee
            .map((ce: CompanyEmployee) => ce.entryDate)
            .filter((c: Date | undefined) => c !== null && c !== undefined);

        const formattedDates = formatDates(periods);

        const uniquePeriods = [...new Set(formattedDates)].sort((a: string, b: string) => {
            const yearA = parseInt(a.split(" ")[2]);
            const yearB = parseInt(b.split(" ")[2]);
            return yearA - yearB;
        });

        const unities = companyEmployee
            .map((ce: CompanyEmployee) => ce.unity)
            .filter((c: string | undefined) => c !== null && c !== undefined && c !== "") as string[];
        console.log("unities", unities);

        const uniqueUnities = [...new Set(unities)];

        const dismissalTypes = companyEmployee
            .map((ce: CompanyEmployee) => ce.dismissalType)
            .filter((c: any) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueDismissalTypes = [...new Set(dismissalTypes)];

        const genders = companyEmployee
            .map((ce: CompanyEmployee) => ce.gender)
            .filter((c: string | undefined) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueGenders = [...new Set(genders)];

        const etnias = companyEmployee
            .map((ce: CompanyEmployee) => ce.etnia)
            .filter((c: string | undefined) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueEtnias = [...new Set(etnias)];

        const pcds = companyEmployee
            .map((ce: CompanyEmployee) => ce.pcd)
            .filter((c: boolean | undefined) => c !== null && c !== undefined)
            .map((c: boolean) => c ? "Sim" : "Não") as string[];
        const uniquePcds = [...new Set(pcds)];

        const cities = companyEmployee
            .map((ce: CompanyEmployee) => {
                if (!ce.city) return null;
                try {
                    const parsed = JSON.parse(ce.city);
                    return parsed.value || parsed.label || ce.city;
                } catch {
                    return ce.city;
                }
            })
            .filter((c: string | null) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueCities = [...new Set(cities)];

        const states = companyEmployee
            .map((ce: CompanyEmployee) => {
                if (!ce.state) return null;
                try {
                    const parsed = JSON.parse(ce.state);
                    return parsed.value || parsed.label || ce.state;
                } catch {
                    return ce.state;
                }
            })
            .filter((c: string | null) => c !== null && c !== undefined && c !== "") as string[];
        const uniqueStates = [...new Set(states)];

        return {
            period: uniquePeriods,
            unity: uniqueUnities,
            area: uniqueAreas,
            role: uniqueRoles,
            dismissalType: uniqueDismissalTypes,
            gender: uniqueGenders,
            etnia: uniqueEtnias,
            pcd: uniquePcds,
            city: uniqueCities,
            state: uniqueStates,
        };
    }

    findById(id: string): Promise<CompanyEmployee> {
        return this.repository.findOne(id, { relations: ["user"] });
    }

    async accept(id: string): Promise<boolean> {
        const response = await this.repository.update(id, { accepted: true });

        return response.affected === 1;
    }

    async realocate(id: string, manualCompany: string): Promise<boolean> {
        const response = await this.repository.update(id, {
            realocate: true,
            manualCompany: manualCompany,
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
        accepted,
        packageDeclined,
        gender,
        etnia,
        pcd,
        city,
        state,
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
            accepted,
            packageDeclined,
            gender,
            etnia,
            pcd,
            city,
            state,
        });

        await this.repository.save(companyEmployee);

        return companyEmployee;
    }

    async update({
        id,
        name,
        documentId,
        email,
        phone,
        entryDate,
        position,
        department,
        plan,
        unity,
        dismissalType,
        gender,
        etnia,
        pcd,
        city,
        state,
    }: IUpdateCompanyEmployeeDTO): Promise<CompanyEmployee> {
        const companyEmployee = await this.repository.findOne(id);

        if (!companyEmployee) {
            throw new Error("Company Employee not found");
        }

        // Atualiza apenas os campos que foram informados
        if (name !== undefined) companyEmployee.name = name;
        if (documentId !== undefined) companyEmployee.documentId = documentId;
        if (email !== undefined) companyEmployee.email = email;
        if (phone !== undefined) companyEmployee.phone = phone;
        if (entryDate !== undefined) companyEmployee.entryDate = entryDate;
        if (position !== undefined) companyEmployee.position = position;
        if (department !== undefined) companyEmployee.department = department;
        if (plan !== undefined) companyEmployee.plan = plan;
        if (unity !== undefined) companyEmployee.unity = unity;
        if (dismissalType !== undefined) companyEmployee.dismissalType = dismissalType;
        if (gender !== undefined) companyEmployee.gender = gender;
        if (etnia !== undefined) companyEmployee.etnia = etnia;
        if (pcd !== undefined) companyEmployee.pcd = pcd;
        if (city !== undefined) companyEmployee.city = city;
        if (state !== undefined) companyEmployee.state = state;

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
        department,
        dismissalType,
    }: {
        name?: string;
        documentId?: string;
        userId?: string;
        notUserId?: string;
        phone?: string;
        email?: string;
        companyId?: string;
        id?: string;
        department?: string;
        dismissalType?: string;
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

            if (department) {
                companyEmployeesQuery.andWhere("ce.department = :department", {
                    department: department,
                });
            }

            if (dismissalType) {
                companyEmployeesQuery.andWhere("ce.dismissalType = :dismissalType", {
                    dismissalType: dismissalType,
                });
            }
        }

        const companyEmployees = await companyEmployeesQuery.getMany();

        const companyEmployeesMapped = companyEmployees.map(
            (companyEmployee: CompanyEmployee) => {
                return CompanyEmployeeMap.toDTO(companyEmployee);
            }
        );

        const subscriptionPlansRepository: ISubscriptionPlansRepository =
            new SubscriptionPlansRepository();

        for (const employee of companyEmployeesMapped) {
            if (!employee.plan || employee.plan === "null") {
                employee.planId = null;
                continue;
            }

            try {
                const plans = await subscriptionPlansRepository.find({
                    name: employee.plan,
                });

                if (plans.length > 0) {
                    employee.planId = {
                        id: plans[0].id,
                        name: plans[0].name,
                    };
                }
            } catch (error) {
                console.log(`PLANO NÃO ENCONTRADO`, error);
            }
        }

        return companyEmployeesMapped;
    }

    async remove(id: string): Promise<string> {
        this.repository.delete(id);

        return id;
    }
}

export { CompanyEmployeesRepository };
