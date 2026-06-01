import { CompanyPageRepository } from "@modules/company/infra/typeorm/repositories/CompanyPageRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { instanceToInstance } from "class-transformer";

import { IUserResponseDTO } from "../dtos/IUserResponseDTO";
import { UserLaborRiskAlertEnum } from "../enums/UserLaborRiskAlertEnum";
import { UserRealocatedEnum } from "../enums/UserRealocatedEnum";
import { UserStatusEnum } from "../enums/UserStatusEnum";
import { UserTypeEnum } from "../enums/UserTypeEnum";
import { User } from "../infra/typeorm/entities/User";

class UserMap {
    static toDTO({
        email,
        name,
        username,
        id,
        created_at,
        avatar,
        documentId,
        avatarUrl,
        type,
        status,
        NPSSurvey,
        laborRisk,
        surveyAnswered,
        company,
        companyId,
        realocated,
        feelingsMapJSON,
        brandRisk,
        laborRiskJSON,
        brandRiskJSON,
        surveyQuestion,
        laborRiskAlert,
        expiresDate,
        periodTest,
        subscribeToken,
        companyNameSignIn,
    }: User): IUserResponseDTO {
        const statusMapped =
            status == UserStatusEnum.INACTIVE ? "Inativo" : "Ativo";

        const laborRiskAlertMapped =
            laborRiskAlert == UserLaborRiskAlertEnum.NORMAL
                ? "Normal"
                : "Alerta";

        const realocatedMapped =
            realocated == UserRealocatedEnum.NOT_REALOCATED
                ? "Não Realocado"
                : "Realocado";

        let typeMapped = "";

        switch (type) {
            case UserTypeEnum.ADMIN:
                typeMapped = "Administrador";
                break;
            case UserTypeEnum.COMPANY_ADMIN:
                typeMapped = "Empresa";
                break;
            case UserTypeEnum.USER:
                typeMapped = "Usuário";
                break;
            case UserTypeEnum.SPECIALIST:
                typeMapped = "Especialista";
                break;
        }

        const expiryDateFormated = new DayjsDateProvider().formatDateTime(
            expiresDate,
            "DD/MM/YYYY"
        );

        const user = instanceToInstance({
            email,
            name,
            username,
            id,
            avatar,
            created_at,
            status: { label: statusMapped, value: status },
            documentId,
            type: { label: typeMapped, value: type },
            avatarUrl,
            NPSSurvey,
            laborRisk,
            surveyAnswered,
            company,
            companyId,
            realocated: { label: realocatedMapped, value: realocated },
            feelingsMapJSON,
            brandRisk,
            laborRiskJSON,
            brandRiskJSON,
            surveyQuestion,
            laborRiskAlert: {
                label: laborRiskAlertMapped,
                value: laborRiskAlert,
            },
            expiresDate,
            expiryDateFormated,
            periodTest,
            subscribeToken,
            companyNameSignIn,
            companyNameSignInLogo: "",
        });

        return user;
    }
}

export { UserMap };
