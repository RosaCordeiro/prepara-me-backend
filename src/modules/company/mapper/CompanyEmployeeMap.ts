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
        linkedinUrl,
        showLinkedinInRelocationProgram,
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
            linkedinUrl,
            showLinkedinInRelocationProgram:
                showLinkedinInRelocationProgram === null ||
                showLinkedinInRelocationProgram === undefined
                    ? true
                    : showLinkedinInRelocationProgram,
        });

        return companyEmployee;
    }

    static toOpenToWorkDTO(companyEmployee: CompanyEmployee) {
        const {
            id,
            name,
            position,
            department,
            city,
            state,
            linkedinUrl,
            company,
        } = companyEmployee;

        return instanceToInstance({
            id,
            name,
            position,
            department,
            city,
            state,
            linkedinUrl,
            segmentName: company?.segment?.name ?? null,
            subsegmentName: company?.subsegment?.name ?? null,
        });
    }
}

export { CompanyEmployeeMap };
