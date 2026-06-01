import { UserLaborRiskAlertEnum } from "../enums/UserLaborRiskAlertEnum";
import { UserRealocatedEnum } from "../enums/UserRealocatedEnum";
import { UserStatusEnum } from "../enums/UserStatusEnum";
import { UserTypeEnum } from "../enums/UserTypeEnum";

interface ICreateUserDTO {
    name: string;
    username: string;
    email: string;
    password: string;
    documentId: string;
    type: UserTypeEnum;
    status: UserStatusEnum;
    id?: string;
    avatar?: string;
    subscribeToken?: string;
    laborRisk?: number;
    brandRisk?: number;
    NPSSurvey?: number;
    surveyAnswered?: boolean;
    companyId?: string;
    realocated: UserRealocatedEnum;
    feelingsMapJSON?: string;
    laborRiskJSON?: string;
    brandRiskJSON?: string;
    surveyQuestion?: string;
    laborRiskAlert?: UserLaborRiskAlertEnum;
    expiresDate: Date;
    periodTest: Date;
    companyNameSignIn?: string;
}

export { ICreateUserDTO };
