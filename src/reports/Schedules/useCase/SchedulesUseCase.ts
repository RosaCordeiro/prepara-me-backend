import { injectable } from "tsyringe";
import { Schedules } from "../entities/Schedules";
import { GeradorExcelTools } from "@utils/excel/excelConversor";
import { dateToMonthYear, formatDate } from "@utils/formatDate";

@injectable()
class SchedulesUseCase {
    async execute(inicialDate?: string, finalDate?: string) {
        const schedules = new Schedules();
        const geradorExcelTools = new GeradorExcelTools();

        const result = await schedules.report(inicialDate, finalDate);

        console.log("result", result[0]);

        const headers = [
            "Nome",
            "Origem",
            "Empresa",
            "Período",
            "Unidade",
            "Área",
            "Cargo",
            "Acolhimento Realizado",
            "Data 1 login",
            "Pesquisa Desligamento Realizada",
            "Pedido de Ajuda Processo Trabalhista (apertou o botão vermelho)",
            "Serviço",
            "Mentoria Trocada",
            "Mentoria Inclusa",
            "Data Troca",
            "Data Agendamento",
            "Data Serviço",
            "Mês / Ano - Data Serviço",
            "Especialista",
            "Nota Especialista",
            "Recolocação",
            "Empresa [Manual]",
            "Data Recolocação",
            "Data Envio Relatório",
            "Data Cancelamento",
            "Razão Cancelamento",
            "Pacote Recusado",
        ];

        result.forEach((element) => {
            element.periodo = formatDate(element.periodo);
            element.data_agendamento = formatDate(element.data_agendamento);
            element.data_servico = formatDate(element.data_servico);
            element.primeiro_login = formatDate(element.primeiro_login);
            element.data_troca = formatDate(element.data_troca);
            element.data_envio_relatorio = formatDate(
                element.data_envio_relatorio
            );
            element.data_realocacao = formatDate(element.data_realocacao);
            element.mes_ano = dateToMonthYear(element.mes_ano);
            element.data_cancelamento = formatDate(element.data_cancelamento);

            if (
                element.package_declined === null ||
                element.package_declined === undefined
            ) {
                element.package_declined = "-";
            } else {
                if (element.package_declined.toString() === "true") {
                    element.package_declined = "Sim";
                } else {
                    element.package_declined = "Não";
                }
            }

            delete element.data_criacao;
        });

        console.log("result", result[0]);

        const excel = await geradorExcelTools.geradorExcel(
            headers,
            result,
            "Agendamentos"
        );

        return excel;
    }
}

export { SchedulesUseCase };
