import { ICompanyEmployeeResponseDTO } from "@modules/company/dtos/ICompanyEmployeeResponseDTO";
import { ICreateCompanyEmployeeDTO } from "@modules/company/dtos/ICreateCompanyEmployeeDTO";
import { IUpdateCompanyEmployeeDTO } from "@modules/company/dtos/IUpdateCompanyEmployeeDTO";
import { CompanyEmployee } from "@modules/company/infra/typeorm/entities/CompanyEmployee";
import { CompanyEmployeeMap } from "@modules/company/mapper/CompanyEmployeeMap";
import { ICompanyEmployeesRepository } from "../ICompanyEmployeesRepository";
import { IGetParametersResponseDTO } from "@modules/company/dtos/IGetParametersResponseDTO";

class CompanyEmployeesRepositoryInMemory
    implements ICompanyEmployeesRepository
{
    findById(id: string): Promise<CompanyEmployee> {
        throw new Error("Method not implemented.");
    }
    getParameters(
        id: string,
        period?: any,
        unity?: any,
        area?: any,
        dismissalType?: any
    ): Promise<IGetParametersResponseDTO> {
        throw new Error("Method not implemented.");
    }
    accept(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    realocate(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    companyEmployees: CompanyEmployee[] = [];

    async create({
        companyId,
        documentId,
        name,
        userId,
        subscribeToken,
        phone,
        email,
        id,
        easyRegister,
        accepted,
        realocate,
        entryDate,
        position,
        department,
        plan,
        unity,
        packageDeclined,
        dismissalType,
        gender,
        etnia,
        pcd,
        city,
        state,
        linkedinUrl,
    }: ICreateCompanyEmployeeDTO): Promise<CompanyEmployee> {
        if (id) {
            const companyEmployeeIndex = this.companyEmployees.findIndex(
                (companyEmployee) => companyEmployee.id === id
            );

            const companyEmployee = new CompanyEmployee(
                name,
                subscribeToken,
                companyId,
                documentId || "",
                phone || "",
                email || "",
                userId || "",
                id,
                easyRegister || "",
                accepted || false,
                realocate || false,
                entryDate || new Date(),
                position || "",
                department || "",
                plan || "",
                unity || "",
                packageDeclined || false,
                "",
                dismissalType,
                gender,
                etnia,
                pcd,
                city,
                state,
                linkedinUrl
            );

            this.companyEmployees[companyEmployeeIndex] = companyEmployee;

            return companyEmployee;
        } else {
            const companyEmployee = new CompanyEmployee(
                name,
                subscribeToken,
                companyId,
                documentId || "",
                phone || "",
                email || "",
                userId || "",
                id || "",
                easyRegister || "",
                accepted || false,
                realocate || false,
                entryDate || new Date(),
                position || "",
                department || "",
                plan || "",
                unity || "",
                packageDeclined || false,
                "",
                dismissalType,
                gender,
                etnia,
                pcd,
                city,
                state,
                linkedinUrl
            );

            this.companyEmployees.push(companyEmployee);

            return companyEmployee;
        }
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
        linkedinUrl,
    }: IUpdateCompanyEmployeeDTO): Promise<CompanyEmployee> {
        const employeeIndex = this.companyEmployees.findIndex(
            (employee) => employee.id === id
        );

        if (employeeIndex === -1) {
            throw new Error("Company Employee not found");
        }

        const employee = this.companyEmployees[employeeIndex];

        // Atualiza apenas os campos que foram informados
        if (name !== undefined) employee.name = name;
        if (documentId !== undefined) employee.documentId = documentId;
        if (email !== undefined) employee.email = email;
        if (phone !== undefined) employee.phone = phone;
        if (entryDate !== undefined) employee.entryDate = entryDate;
        if (position !== undefined) employee.position = position;
        if (department !== undefined) employee.department = department;
        if (plan !== undefined) employee.plan = plan;
        if (unity !== undefined) employee.unity = unity;
        if (dismissalType !== undefined) employee.dismissalType = dismissalType;
        if (gender !== undefined) employee.gender = gender;
        if (etnia !== undefined) employee.etnia = etnia;
        if (pcd !== undefined) employee.pcd = pcd;
        if (city !== undefined) employee.city = city;
        if (state !== undefined) employee.state = state;
        if (linkedinUrl !== undefined) employee.linkedinUrl = linkedinUrl;

        this.companyEmployees[employeeIndex] = employee;

        return employee;
    }

    async find({
        name,
        documentId,
        companyId,
        userId,
        notUserId,
        phone,
        email,
        id,
    }: {
        name?: string;
        documentId?: string;
        companyId?: string;
        userId?: string;
        notUserId?: string;
        phone?: string;
        email?: string;
        id?: string;
    }): Promise<ICompanyEmployeeResponseDTO[]> {
        let companyEmployees = this.companyEmployees;

        if (id) {
            companyEmployees = companyEmployees.filter((companyEmployee) => {
                return companyEmployee.id === id;
            });
        } else {
            if (name) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return companyEmployee.name.includes(name);
                    }
                );
            }

            if (userId) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return companyEmployee.userId === userId;
                    }
                );
            }

            if (notUserId) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return !companyEmployee.userId;
                    }
                );
            }

            if (companyId) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return companyEmployee.companyId === companyId;
                    }
                );
            }

            if (documentId) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return companyEmployee.documentId === documentId;
                    }
                );
            }

            if (phone) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return companyEmployee.phone === phone;
                    }
                );
            }

            if (email) {
                companyEmployees = companyEmployees.filter(
                    (companyEmployee) => {
                        return companyEmployee.email === email;
                    }
                );
            }
        }

        const companyEmployeesMapped = companyEmployees.map(
            (companyEmployee) => {
                return CompanyEmployeeMap.toDTO(companyEmployee);
            }
        );

        return companyEmployeesMapped;
    }

    async remove(id: string): Promise<string> {
        this.companyEmployees = this.companyEmployees.filter((company) => {
            return id !== company.id;
        });

        return id;
    }
}

export { CompanyEmployeesRepositoryInMemory };
