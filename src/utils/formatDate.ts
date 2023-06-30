export function formatDate(date: string) {
    if (date === undefined || date === null || date === "") {
        return "-";
    }

    const data = new Date(date);

    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    const hora = String(data.getHours()).padStart(2, "0");
    const minuto = String(data.getMinutes()).padStart(2, "0");
    const segundo = String(data.getSeconds()).padStart(2, "0");

    const dataFormatada = `${dia}/${mes}/${ano}`;
    const horaFormatada = `${hora}:${minuto}:${segundo}`;

    return `${dataFormatada} - ${horaFormatada}`;
}

