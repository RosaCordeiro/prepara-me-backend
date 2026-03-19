import readXlsxFile from "read-excel-file/node";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { CompanyEmployeesRepository } from "@modules/company/infra/typeorm/repositories/CompanyEmployeesRepository";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { UserLaborRiskAlertEnum } from "@modules/accounts/enums/UserLaborRiskAlertEnum";
import { UserRealocatedEnum } from "@modules/accounts/enums/UserRealocatedEnum";
import { DismissalTypeEnum } from "@modules/company/enums/DismissalTypeEnum";

interface ImportResult {
    success: number;
    errors: { row: number; reason: string }[];
}

const HEADERS = [
    "CPF",
    "Email",
    "NPS (0-10)",
    "Risco Trabalhista (0-10)",
    "Risco de Marca (0-10)",
    "Survey Respondido (Sim/Não)",
    "Alerta Risco Trabalhista (ALERT/NORMAL)",
    "Realocado (REALOCATED/NOT_REALOCATED)",
    "Labor Risk JSON",
    "Feelings Map JSON",
    "Brand Risk JSON",
    "Survey Question JSON",
    "Departamento",
    "Cargo",
    "Unidade",
    "Tipo de Demissão",
    "Gênero",
    "Etnia",
    "PCD (Sim/Não)",
    "Cidade",
    "Estado",
];

class ImportSurveyAnswersBatchUseCase {
    private usersRepository = new UsersRepository();
    private companyEmployeesRepository = new CompanyEmployeesRepository();

    async execute(filePath: string): Promise<ImportResult> {
        const rows: any[][] = await readXlsxFile(filePath);

        if (rows[0].length !== HEADERS.length) {
            return { success: 0, errors: [{ row: 0, reason: "Cabeçalho inválido: número de colunas incorreto" }] };
        }

        for (let i = 0; i < HEADERS.length; i++) {
            if (rows[0][i] !== HEADERS[i]) {
                return { success: 0, errors: [{ row: 0, reason: `Cabeçalho inválido na coluna ${i + 1}: esperado "${HEADERS[i]}", recebido "${rows[0][i]}"` }] };
            }
        }

        const result: ImportResult = { success: 0, errors: [] };

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const rowNum = i + 1;

            try {
                const cpf = row[0] ? row[0].toString().replace(/\D/g, "") : "";
                const email = row[1] ? row[1].toString().trim() : "";

                if (!cpf && !email) {
                    result.errors.push({ row: rowNum, reason: "CPF e Email ausentes — ao menos um é obrigatório" });
                    continue;
                }

                let user = cpf
                    ? await this.usersRepository.findByDocument(cpf)
                    : null;

                if (!user && email) {
                    user = await this.usersRepository.findByEmail(email);
                }

                if (!user) {
                    result.errors.push({ row: rowNum, reason: `Usuário não encontrado (CPF: ${cpf}, Email: ${email})` });
                    continue;
                }

                const nps = row[2] !== null && row[2] !== undefined ? Number(row[2]) : undefined;
                const laborRisk = row[3] !== null && row[3] !== undefined ? Number(row[3]) : undefined;
                const brandRisk = row[4] !== null && row[4] !== undefined ? Number(row[4]) : undefined;

                if (nps !== undefined && (isNaN(nps) || nps < 0 || nps > 10)) {
                    result.errors.push({ row: rowNum, reason: `NPS inválido: ${row[2]}` });
                    continue;
                }
                if (laborRisk !== undefined && (isNaN(laborRisk) || laborRisk < 0 || laborRisk > 10)) {
                    result.errors.push({ row: rowNum, reason: `Risco Trabalhista inválido: ${row[3]}` });
                    continue;
                }
                if (brandRisk !== undefined && (isNaN(brandRisk) || brandRisk < 0 || brandRisk > 10)) {
                    result.errors.push({ row: rowNum, reason: `Risco de Marca inválido: ${row[4]}` });
                    continue;
                }

                const surveyAnswered = row[5]?.toString().trim().toLowerCase() === "sim";

                const laborRiskAlertRaw = row[6]?.toString().trim().toUpperCase();
                if (laborRiskAlertRaw && !Object.values(UserLaborRiskAlertEnum).includes(laborRiskAlertRaw as UserLaborRiskAlertEnum)) {
                    result.errors.push({ row: rowNum, reason: `Alerta Risco Trabalhista inválido: ${row[6]}` });
                    continue;
                }

                const realocatedRaw = row[7]?.toString().trim().toUpperCase();
                if (realocatedRaw && !Object.values(UserRealocatedEnum).includes(realocatedRaw as UserRealocatedEnum)) {
                    result.errors.push({ row: rowNum, reason: `Realocado inválido: ${row[7]}` });
                    continue;
                }

                const jsonFields = [
                    { value: row[8], name: "Labor Risk JSON" },
                    { value: row[9], name: "Feelings Map JSON" },
                    { value: row[10], name: "Brand Risk JSON" },
                    { value: row[11], name: "Survey Question JSON" },
                ];

                let jsonError = false;
                for (const field of jsonFields) {
                    if (field.value) {
                        try { JSON.parse(field.value.toString()); } catch {
                            result.errors.push({ row: rowNum, reason: `${field.name} inválido: não é um JSON válido` });
                            jsonError = true;
                            break;
                        }
                    }
                }
                if (jsonError) continue;

                // Upsert User
                const userUpdate: Partial<User> = {};
                if (nps !== undefined) userUpdate.NPSSurvey = nps;
                if (laborRisk !== undefined) userUpdate.laborRisk = laborRisk;
                if (brandRisk !== undefined) userUpdate.brandRisk = brandRisk;
                if (row[5] !== null && row[5] !== undefined) userUpdate.surveyAnswered = surveyAnswered;
                if (laborRiskAlertRaw) userUpdate.laborRiskAlert = laborRiskAlertRaw as UserLaborRiskAlertEnum;
                if (realocatedRaw) userUpdate.realocated = realocatedRaw as UserRealocatedEnum;
                if (row[8]) userUpdate.laborRiskJSON = row[8].toString();
                if (row[9]) userUpdate.feelingsMapJSON = row[9].toString();
                if (row[10]) userUpdate.brandRiskJSON = row[10].toString();
                if (row[11]) userUpdate.surveyQuestion = row[11].toString();

                const userRepo = (this.usersRepository as any).repository;
                await userRepo.update(user.id, userUpdate);

                // Upsert CompanyEmployee
                const employees = await this.companyEmployeesRepository.find({ userId: user.id });

                if (employees.length > 0) {
                    const dismissalTypeRaw = row[15]?.toString().trim().toLowerCase();
                    if (dismissalTypeRaw && !Object.values(DismissalTypeEnum).includes(dismissalTypeRaw as DismissalTypeEnum)) {
                        result.errors.push({ row: rowNum, reason: `Tipo de Demissão inválido: ${dismissalTypeRaw}` });
                        continue;
                    }

                    await this.companyEmployeesRepository.update({
                        id: employees[0].id,
                        department: row[12]?.toString() || undefined,
                        position: row[13]?.toString() || undefined,
                        unity: row[14]?.toString() || undefined,
                        dismissalType: dismissalTypeRaw as DismissalTypeEnum || undefined,
                        gender: row[16]?.toString() || undefined,
                        etnia: row[17]?.toString() || undefined,
                        pcd: row[18] !== null && row[18] !== undefined ? row[18].toString().trim().toLowerCase() === "sim" : undefined,
                        city: row[19]?.toString() || undefined,
                        state: row[20]?.toString() || undefined,
                    });
                }

                result.success++;
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                result.errors.push({ row: rowNum, reason: `Erro inesperado: ${message}` });
            }
        }

        return result;
    }
}

export { ImportSurveyAnswersBatchUseCase };
