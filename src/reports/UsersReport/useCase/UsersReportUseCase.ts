import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import { inject, injectable } from "tsyringe";
import { UsersReports } from "../entities/UsersReport";
import { GeradorExcelTools } from "@utils/excel/excelConversor";

@injectable()
class UsersReportUseCase {
    constructor(
        @inject("DayjsDateProvider")
        private dateProvider: IDateProvider
    ) {}
    async execute() {
        const usersReport = new UsersReports()
        const geradorExcelTools = new GeradorExcelTools()

        const result = await usersReport.report()

        const headers = [
            'Empresa',
            'Nome',
            'Entrada no prepara.me',
            'Data de recolocação',
            'Mês de recolocação',
            'Tempo de recolocação',
            'Respondeu pesquisa de desligamento',
            'Mentorias realizadas'
        ]

        let data = []
        for (let item of result) {
            data.push({
                company: item.company,
                name: item.name,
                entry_date: this.dateProvider.formatDateTime(item.entry_date, "DD/MM/YYYY"),
                realocation_date: item.realocation_date ? this.dateProvider.formatDateTime(item.realocation_date, "DD/MM/YYYY") : '', 
                realocation_month: item.realocation_month,
                realocation_time: item.realocation_time ? `${item.realocation_time} dias` : '',
                surveyAnswered: item.surveyAnswered ? 'Sim' : 'Não',
                mentoring: item.mentoring ?? ''
            })
        }

        const excel = await geradorExcelTools.geradorExcel(
            headers,
            data,
            'usuarios'
        )

        return excel
    }
}

export { UsersReportUseCase }