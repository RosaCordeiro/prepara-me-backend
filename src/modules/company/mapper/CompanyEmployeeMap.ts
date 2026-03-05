import { UserMap } from "@modules/accounts/mapper/UserMap";
import { instanceToInstance } from "class-transformer";
import { ICompanyEmployeeResponseDTO } from "../dtos/ICompanyEmployeeResponseDTO";
import { CompanyEmployeeEasyRegisterEnum } from "../enums/CompanyEmployeeEasyRegisterEnum";
import { CompanyEmployee } from "../infra/typeorm/entities/CompanyEmployee";

class CompanyEmployeeMap {
    static toDTO({
        id,
        company,
        name,
        documentId,
        subscribeToken,
        phone,
        email,
        user,
        easyRegister,
        accepted,
        realocate,
        entryDate,
        position,
        department,
        plan,
        unity,
        packageDeclined,
        manualCompany,
        dismissalType,
        gender,
        etnia,
        pcd,
        city,
        state,
    }: CompanyEmployee): ICompanyEmployeeResponseDTO {
        let easyRegisterMapped = "";

        switch (easyRegister) {
            case CompanyEmployeeEasyRegisterEnum.YES:
                easyRegisterMapped = "Sim";
                break;
            case CompanyEmployeeEasyRegisterEnum.NO:
                easyRegisterMapped = "Não";
                break;
        }

        user = {
            ...user,
            avatarUrl: user?.avatarUrl || undefined,
        } as any;

        const companyEmployee = instanceToInstance({
            id,
            company,
            name,
            documentId,
            subscribeToken,
            phone,
            email,
            user: user ? UserMap.toDTO(user) : null,
            easyRegister: { label: easyRegisterMapped, value: easyRegister },
            accepted,
            realocate,
            entryDate,
            position,
            department,
            plan,
            unity,
            packageDeclined:
                packageDeclined === null || packageDeclined === undefined
                    ? false
                    : packageDeclined,
            manualCompany,
            dismissalType,
            gender,
            etnia,
            pcd,
            city,
            state,
        });

        return companyEmployee;
    }
}

export { CompanyEmployeeMap };
