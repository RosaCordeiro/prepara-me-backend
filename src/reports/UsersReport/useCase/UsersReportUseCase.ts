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
            'Mês de entrada no prepara.me',
            'Data de recolocação',
            'Mês de recolocação',
            'Tempo de recolocação em dias',
            'Respondeu pesquisa de desligamento',
            'Mentorias individuais',
            'Mentorias coletivas',
            "Papo Indicações",
            "Quantidade de mentorias \"Papo Indicações\" realizadas",
        ]
        
        let data = []
        for (let item of result) {
            const individual = item.individual_mentoring || 0;
            const collective = item.collective_mentoring || 0;
            data.push({
                company: item.company,
                name: item.name,
                entry_date: this.dateProvider.formatDateTime(item.entry_date, "DD/MM/YYYY"),
                entry_month: item.entry_month,
                realocation_date: item.realocation_date ? this.dateProvider.formatDateTime(item.realocation_date, "DD/MM/YYYY") : '', 
                realocation_month: item.realocation_month,
                realocation_time: item.realocation_time,
                surveyAnswered: item.surveyAnswered ? 'Sim' : 'Não',
                individual_mentoring: individual,
                collective_mentoring: collective,
                has_outplacement_mentoring: item.has_outplacement_mentoring ? 'Sim' : 'Não',
                outplacement_mentoring_realized: item.outplacement_mentoring_realized || 0,
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