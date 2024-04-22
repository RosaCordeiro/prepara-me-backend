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

export function formatDateTimeToISO(date: Date) {
    const dateNow = new Date(date);
    const newDate = new Date(
        dateNow.setMinutes(dateNow.getMinutes() - -dateNow.getTimezoneOffset())
    );

    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    const day = newDate.getDate().toString().padStart(2, "0");

    const hour = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const seconds = newDate.getSeconds().toString().padStart(2, "0");

    return `'${year}-${month}-${day} ${hour}:${minutes}:${seconds}'`;
}

export function formatDateTimeLocal(date: Date) {
    const dateNow = new Date(date);
    const newDate = new Date(
        dateNow.setMinutes(dateNow.getMinutes() - -dateNow.getTimezoneOffset())
    );

    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    const day = newDate.getDate().toString().padStart(2, "0");

    const hour = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minutes}`;
}

const daysOfWeek = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];

export function formatDateToString(date: Date) {
    const dateNow = new Date(date);
    const newDate = new Date(
        dateNow.setMinutes(dateNow.getMinutes() - -dateNow.getTimezoneOffset())
    );

    const day = newDate.getDate().toString().padStart(2, "0");
    const month = newDate.toLocaleString("default", { month: "short" });
    const year = newDate.getFullYear();

    const hour = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");

    const hourEnd = (newDate.getHours() + 1).toString().padStart(2, "0");

    return `${
        daysOfWeek[newDate.getDay()]
    } ${day} ${month}. ${year} ${hour}:${minutes} – ${hourEnd}:${minutes}`;
}

export function dateToMonthYear(date: string) {
    if (date === undefined || date === null || date === "") {
        return "-";
    }

    const dateNow = new Date(date);
    const newDate = new Date(
        dateNow.setMinutes(dateNow.getMinutes() - -dateNow.getTimezoneOffset())
    );

    const month = newDate.toLocaleString("default", { month: "long" });

    /* month to PT-Br */

    let monthPtBr = "";

    switch (month) {
        case "January":
            monthPtBr = "Janeiro";
            break;
        case "February":
            monthPtBr = "Fevereiro";
            break;
        case "March":
            monthPtBr = "Março";
            break;
        case "April":
            monthPtBr = "Abril";
            break;
        case "May":
            monthPtBr = "Maio";
            break;
        case "June":
            monthPtBr = "Junho";
            break;
        case "July":
            monthPtBr = "Julho";
            break;
        case "August":
            monthPtBr = "Agosto";
            break;
        case "September":
            monthPtBr = "Setembro";
            break;
        case "October":
            monthPtBr = "Outubro";
            break;
        case "November":
            monthPtBr = "Novembro";
            break;
        case "December":
            monthPtBr = "Dezembro";
            break;
        default:
            monthPtBr = "Mês inválido";
    }

    const year = newDate.getFullYear();

    return `${monthPtBr} / ${year}`;
}

function formatDateLong(date: string): string {
    const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
    });
    return formattedDate;
}

export function formatDates(dates: Date[]): string[] {
    const uniqueDates = Array.from(new Set(dates));
    const formattedDates = uniqueDates.map((date) =>
        formatDateLong(date.toString())
    );
    return formattedDates;
}

export function getFirstAndLastDayOfMonth(dateText: string): Date[] {
    const [month, year] = dateText.split(" de ");

    const firstDay = new Date(
        `${formatPortugueseMonth(month.toLowerCase())} 1, ${year}`
    );
    const lastDay = new Date(
        new Date(firstDay).setMonth(firstDay.getMonth() + 1) - 1
    );
    return [firstDay, lastDay];
}

function formatPortugueseMonth(date: string): string {
    switch (date) {
        case "janeiro":
            return "January";
        case "fevereiro":
            return "February";
        case "março":
            return "March";
        case "abril":
            return "April";
        case "maio":
            return "May";
        case "junho":
            return "June";
        case "julho":
            return "July";
        case "agosto":
            return "August";
        case "setembro":
            return "September";
        case "outubro":
            return "October";
        case "novembro":
            return "November";
        case "dezembro":
            return "December";
        default:
            return "Invalid month";
    }
}
