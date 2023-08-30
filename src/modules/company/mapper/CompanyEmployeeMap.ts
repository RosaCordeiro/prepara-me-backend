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
            avatarUrl: user?.avatarUrl,
        };

        const companyEmployee = instanceToInstance({
            id,
            company,
            name,
            documentId,
            subscribeToken,
            phone,
            email,
            user: user
                ? process.env.NODE_ENV === "test"
                    ? user
                    : UserMap.toDTO(user)
                : null,
            easyRegister: { label: easyRegisterMapped, value: easyRegister },
            accepted,
            realocate,
        });

        return companyEmployee;
    }
}

export { CompanyEmployeeMap };
