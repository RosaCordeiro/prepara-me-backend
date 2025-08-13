import { Company } from "@modules/company/infra/typeorm/entities/Company";

interface IUserResponseDTO {
    email: string;
    name: string;
    username: string;
    created_at: Date;
    id: string;
    avatar: string;
    status: Object;
    documentId: string;
    type: Object;
    avatarUrl(): string;
    laborRisk: number;
    NPSSurvey: number;
    surveyAnswered: boolean;
    company: Company;
    realocated: Object;
    feelingsMapJSON: string;
    brandRisk: number;
    laborRiskJSON: string;
    brandRiskJSON: string;
    surveyQuestion?: string;
    laborRiskAlert: Object;
    expiresDate: Date;
    expiryDateFormated?: string;
    periodTest: Date;
    subscribeToken: string;
    companyNameSignIn: string;
    companyNameSignInLogo?: string;
}

export { IUserResponseDTO };
