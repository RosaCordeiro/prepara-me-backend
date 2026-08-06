import { getRepository } from "typeorm";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { AppError } from "@shared/errors/AppError";

type MonthPoint = {
    monthKey: string;
    label: string;
};

type RealocationTimelineResult = {
    categories: string[];
    rawPeriods: string[];
    company: Array<number | null>;
    general: Array<number | null>;
    companyTotal: number;
    generalTotal: number;
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

class RealocationTimelineUseCase {
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

        // Últimos 12 meses até o mês da recolocação mais recente.
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

    private toRate(count: number, total: number): number | null {
        if (!total || total <= 0) {
            return null;
        }

        return Number(((count / total) * 100).toFixed(2));
    }

    async execute(companyId?: string): Promise<RealocationTimelineResult> {
        if (!companyId) {
            throw new AppError("companyId is required");
        }

        const repository = getRepository(User);

        const [companyTotalRow] = await repository.query(
            `
            SELECT COUNT(DISTINCT ce."userId")::int AS total
            FROM "companyEmployees" ce
            WHERE ce."companyId" = $1
              AND ce."userId" IS NOT NULL
            `,
            [companyId]
        );

        const [generalTotalRow] = await repository.query(
            `
            SELECT COUNT(DISTINCT ce."userId")::int AS total
            FROM "companyEmployees" ce
            WHERE ce."userId" IS NOT NULL
            `
        );

        const companyTotal = Number(companyTotalRow?.total || 0);
        const generalTotal = Number(generalTotalRow?.total || 0);

        // Primeira data de recolocação por usuário (log).
        // Fallback: REALOCATED sem log usa created_at do usuário.
        const rows: Array<{ userId: string; companyId: string; monthKey: string }> =
            await repository.query(
                `
                WITH first_realocation AS (
                    SELECT
                        u.id AS "userId",
                        COALESCE(
                            (
                                SELECT MIN(url.created_at)
                                FROM users_realocated_logs url
                                WHERE url."userId" = u.id
                            ),
                            CASE
                                WHEN u.realocated = 'REALOCATED' THEN u.created_at
                                ELSE NULL
                            END
                        ) AS realocation_date
                    FROM users u
                    WHERE u.realocated = 'REALOCATED'
                       OR EXISTS (
                            SELECT 1
                            FROM users_realocated_logs url
                            WHERE url."userId" = u.id
                       )
                ),
                user_companies AS (
                    SELECT
                        ce."userId",
                        ce."companyId"
                    FROM "companyEmployees" ce
                    WHERE ce."userId" IS NOT NULL
                    GROUP BY ce."userId", ce."companyId"
                )
                SELECT
                    fr."userId",
                    uc."companyId",
                    to_char(fr.realocation_date, 'YYYY-MM') AS "monthKey"
                FROM first_realocation fr
                INNER JOIN user_companies uc
                    ON uc."userId" = fr."userId"
                WHERE fr.realocation_date IS NOT NULL
                `
            );

        const monthPoints = this.buildMonthRange(
            rows.map((row) => row.monthKey).filter(Boolean)
        );

        if (!monthPoints.length) {
            return {
                categories: [],
                rawPeriods: [],
                company: [],
                general: [],
                companyTotal,
                generalTotal,
            };
        }

        // userId -> earliest month (and company flags)
        const userMonth = new Map<string, string>();
        const userInCompany = new Set<string>();

        rows.forEach((row) => {
            if (!row.monthKey || !row.userId) {
                return;
            }

            const current = userMonth.get(row.userId);
            if (!current || row.monthKey < current) {
                userMonth.set(row.userId, row.monthKey);
            }

            if (row.companyId === companyId) {
                userInCompany.add(row.userId);
            }
        });

        const companyByMonth = new Map<string, number>();
        const generalByMonth = new Map<string, number>();

        userMonth.forEach((monthKey, userId) => {
            generalByMonth.set(monthKey, (generalByMonth.get(monthKey) || 0) + 1);

            if (userInCompany.has(userId)) {
                companyByMonth.set(
                    monthKey,
                    (companyByMonth.get(monthKey) || 0) + 1
                );
            }
        });

        let companyCumulative = 0;
        let generalCumulative = 0;
        const windowStart = monthPoints[0].monthKey;

        userMonth.forEach((monthKey, userId) => {
            if (monthKey < windowStart) {
                generalCumulative += 1;
                if (userInCompany.has(userId)) {
                    companyCumulative += 1;
                }
            }
        });

        const companySeries: Array<number | null> = [];
        const generalSeries: Array<number | null> = [];

        monthPoints.forEach((point) => {
            companyCumulative += companyByMonth.get(point.monthKey) || 0;
            generalCumulative += generalByMonth.get(point.monthKey) || 0;

            companySeries.push(this.toRate(companyCumulative, companyTotal));
            generalSeries.push(this.toRate(generalCumulative, generalTotal));
        });

        return {
            categories: monthPoints.map((point) => point.label),
            rawPeriods: monthPoints.map((point) => point.monthKey),
            company: companySeries,
            general: generalSeries,
            companyTotal,
            generalTotal,
        };
    }
}

export { RealocationTimelineUseCase };
