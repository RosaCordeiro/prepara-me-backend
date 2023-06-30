import { injectable } from "tsyringe";
import { Schedules } from "../entities/Schedules";
import { GeradorExcelTools } from "@utils/excel/excelConversor";
import { formatDate } from "@utils/formatDate";

@injectable()
class SchedulesUseCase {
    async execute(inicialDate?: string, finalDate?: string) {
        const schedules = new Schedules();
        const geradorExcelTools = new GeradorExcelTools();

        const result = await schedules.report(inicialDate, finalDate);

        const headers = [
            "Nome",
            "Origem",
            "Empresa",
            "Acolhimento Realizado",
            "Data 1 login",
            "Pesquisa Desligamento Realizada",
            "Pedido de Ajuda Processo Trabalhista (apertou o botão vermelho)",
            "Serviço",
            "Data Agendamento",
            "Data Serviço",
            "Especialista",
            "Nota Especialista",
            "Recolocação",
        ];

        result.forEach((element) => {
            element.data_agendamento = formatDate(element.data_agendamento);
            element.data_servico = formatDate(element.data_servico);
            element.primeiro_login = formatDate(element.primeiro_login);
        });

        const excel = await geradorExcelTools.geradorExcel(
            headers,
            result,
            "Agendamentos"
        );

        return excel;
    }
}

export { SchedulesUseCase };

