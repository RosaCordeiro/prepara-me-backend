import { inject, injectable } from "tsyringe";
import dayjs from "dayjs";
import { ReplacementsReport } from "../entities/ReplacementsReport";
import { AppError } from "@shared/errors/AppError";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

@injectable()
class ReplacementsReportUseCase {
    constructor(
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}

    private calculatePercentage(value: number, total: number): number {
        if (total === 0) {
            return 0;
        }
        return (value / total) * 100;
    }

    private calculateAverageRecolocacaoTime(recolocados: any[]): number {
        if (recolocados.length === 0) {
            return 0;
        }
        const totalDays = recolocados.reduce((acc, employee) => {
            return (
                acc +
                this.dateProvider.compareInDays(
                    employee.entrydate,
                    employee.replacementdate
                )
            );
        }, 0);
        const averageDays = Math.round(totalDays / recolocados.length);
        return averageDays;
    }

    private calculateMonthlyDetail(
        recolocados: any[],
        startDate: string,
        total_recolocados: number
    ): any[] {
        const monthlyDetail = [];
        const baseDate = dayjs(startDate);

        for (let i = 0; i < 6; i++) {
            const targetMonth = baseDate.add(i, "month");
            const monthKey = targetMonth.format("YYYY-MM");

            const recolocadosNoMes = recolocados.filter((emp) => {
                return (
                    dayjs(emp.replacementdate).format("YYYY-MM") === monthKey
                );
            });

            const total_recolocados_mes = recolocadosNoMes.length;
            const percentual_recolocados_mes =
                total_recolocados > 0
                    ? this.calculatePercentage(
                          total_recolocados_mes,
                          total_recolocados
                      )
                    : 0;

            monthlyDetail.push({
                mes: monthKey,
                total_recolocados_mes,
                percentual_recolocados_mes: parseFloat(
                    percentual_recolocados_mes.toFixed(2)
                ),
            });
        }

        return monthlyDetail;
    }

    async execute({ startDate, endDate, companyId, userId }) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (this.dateProvider.compareIfBefore(endDateObj, startDateObj)) {
            throw new AppError(
                "A data final não pode ser inferior à data inicial"
            );
        }

        const replacementsReport = new ReplacementsReport();
        const employeesByEntryDate = await replacementsReport.report(
            startDate,
            endDate,
            companyId
        );

        const total_entrada = employeesByEntryDate.length;
        const recolocados = employeesByEntryDate.filter(
            (emp) => emp.replacementdate
        );
        const total_recolocados = recolocados.length;

        const percentual_recolocados = this.calculatePercentage(
            total_recolocados,
            total_entrada
        );
        const tempo_medio_recolocacao =
            this.calculateAverageRecolocacaoTime(recolocados);
        const detalhamento_mensal = this.calculateMonthlyDetail(
            recolocados,
            startDate,
            total_recolocados
        );

        const resultReport = {
            total_entrada,
            total_recolocados,
            percentual_recolocados: parseFloat(
                percentual_recolocados.toFixed(2)
            ),
            tempo_medio_recolocacao,
            detalhamento_mensal,
        };

        return resultReport;
    }
}

export { ReplacementsReportUseCase };
