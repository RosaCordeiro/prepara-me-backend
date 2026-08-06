import { getRepository } from "typeorm";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppError } from "@shared/errors/AppError";

type MonthPoint = {
    monthKey: string;
    label: string;
};

type ExEmployeeEvaluationResult = {
    company: number | null;
    general: number | null;
    categories: string[];
    rawPeriods: string[];
    companySeries: Array<number | null>;
    generalSeries: Array<number | null>;
    companyRatingsCount: number;
    generalRatingsCount: number;
};

const MONTH_SHORT = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
];

class ExEmployeeEvaluationUseCase {
    private formatMonthLabel(monthKey: string): string {
        const [year, month] = monthKey.split("-");
        const monthIndex = Number(month) - 1;
        const short = MONTH_SHORT[monthIndex] || month;
        return `${short}/${String(year).slice(-2)}`;
    }

    private buildMonthRange(monthKeys: string[]): MonthPoint[] {
        if (!monthKeys.length) {
            return [];
        }

        const sorted = [...new Set(monthKeys)].sort();
        const endKey = sorted[sorted.length - 1];
        const [endYear, endMonth] = endKey.split("-").map(Number);

        let year = endYear;
        let month = endMonth - 11;
        while (month <= 0) {
            month += 12;
            year -= 1;
        }

        const points: MonthPoint[] = [];
        for (let i = 0; i < 12; i += 1) {
            const monthKey = `${year}-${String(month).padStart(2, "0")}`;
            points.push({
                monthKey,
                label: this.formatMonthLabel(monthKey),
            });

            month += 1;
            if (month > 12) {
                month = 1;
                year += 1;
            }
        }

        return points;
    }

    private average(values: number[]): number | null {
        if (!values.length) {
            return null;
        }

        const sum = values.reduce((acc, value) => acc + value, 0);
        return Number((sum / values.length).toFixed(2));
    }

    async execute(companyId?: string): Promise<ExEmployeeEvaluationResult> {
        if (!companyId) {
            throw new AppError("companyId is required");
        }

        const repository = getRepository(User);

        const rows: Array<{
            rating: string | number;
            monthKey: string;
            companyId: string;
        }> = await repository.query(
            `
            SELECT
                ss.rating::float AS rating,
                to_char(ss."dateSchedule", 'YYYY-MM') AS "monthKey",
                ce."companyId" AS "companyId"
            FROM "specialistSchedule" ss
            INNER JOIN "companyEmployees" ce
                ON ce."userId" = ss."userId"
            WHERE ss."userId" IS NOT NULL
              AND ss.rating IS NOT NULL
              AND ss.rating > 0
              AND ce."userId" IS NOT NULL

            UNION ALL

            SELECT
                mu.rating::float AS rating,
                to_char(COALESCE(m.date, m.created_at), 'YYYY-MM') AS "monthKey",
                ce."companyId" AS "companyId"
            FROM "mentoringUsers" mu
            INNER JOIN mentoring m
                ON m.id = mu."mentoringId"
            INNER JOIN "companyEmployees" ce
                ON ce."userId" = mu."userId"
            WHERE mu.rating IS NOT NULL
              AND mu.rating > 0
              AND ce."userId" IS NOT NULL
              AND COALESCE(m.date, m.created_at) IS NOT NULL
            `
        );

        const companyRatings: number[] = [];
        const generalRatings: number[] = [];
        const companyByMonth = new Map<string, number[]>();
        const generalByMonth = new Map<string, number[]>();

        rows.forEach((row) => {
            const rating = Number(row.rating);
            if (!Number.isFinite(rating) || rating <= 0 || !row.monthKey) {
                return;
            }

            generalRatings.push(rating);
            const generalBucket = generalByMonth.get(row.monthKey) || [];
            generalBucket.push(rating);
            generalByMonth.set(row.monthKey, generalBucket);

            if (row.companyId === companyId) {
                companyRatings.push(rating);
                const companyBucket = companyByMonth.get(row.monthKey) || [];
                companyBucket.push(rating);
                companyByMonth.set(row.monthKey, companyBucket);
            }
        });

        const monthPoints = this.buildMonthRange([
            ...companyByMonth.keys(),
            ...generalByMonth.keys(),
        ]);

        const companySeries = monthPoints.map((point) =>
            this.average(companyByMonth.get(point.monthKey) || [])
        );
        const generalSeries = monthPoints.map((point) =>
            this.average(generalByMonth.get(point.monthKey) || [])
        );

        return {
            company: this.average(companyRatings),
            general: this.average(generalRatings),
            categories: monthPoints.map((point) => point.label),
            rawPeriods: monthPoints.map((point) => point.monthKey),
            companySeries,
            generalSeries,
            companyRatingsCount: companyRatings.length,
            generalRatingsCount: generalRatings.length,
        };
    }
}

export { ExEmployeeEvaluationUseCase };
