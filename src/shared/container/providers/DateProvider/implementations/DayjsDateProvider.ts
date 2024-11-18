import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from 'dayjs/plugin/timezone';

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
    formatDateTime(date: Date, mask: string): string {
        let dateMasked = mask;
        let dateReference = new Date(date);

        if (mask.includes("DD")) {
            let dayDateReference = `0${dateReference.getDate().toString()}`;

            dayDateReference = dayDateReference.substring(
                dayDateReference.length - 2
            );

            dateMasked = dateMasked.replace("DD", dayDateReference);
        }

        if (mask.includes("MM")) {
            let monthDateReference = `0${(
                dateReference.getMonth() + 1
            ).toString()}`;

            monthDateReference = monthDateReference.substring(
                monthDateReference.length - 2
            );

            dateMasked = dateMasked.replace("MM", monthDateReference);
        }

        if (mask.includes("YYYY")) {
            let yearDateReference = dateReference.getFullYear().toString();

            yearDateReference = yearDateReference.substring(
                yearDateReference.length - 4
            );

            dateMasked = dateMasked.replace("YYYY", yearDateReference);
        }

        if (mask.includes("hh")) {
            let hourDateReference = `0${dateReference.getHours().toString()}`;

            hourDateReference = hourDateReference.substring(
                hourDateReference.length - 2
            );

            dateMasked = dateMasked.replace("hh", hourDateReference);
        }

        if (mask.includes("mm")) {
            let minuteDateReference = `0${dateReference
                .getMinutes()
                .toString()}`;

            minuteDateReference = minuteDateReference.substring(
                minuteDateReference.length - 2
            );

            dateMasked = dateMasked.replace("mm", minuteDateReference);
        }

        if (mask.includes("ss")) {
            let secondDateReference = `0${dateReference
                .getSeconds()
                .toString()}`;

            secondDateReference = secondDateReference.substring(
                secondDateReference.length - 2
            );

            dateMasked = dateMasked.replace("ss", secondDateReference);
        }

        if (mask.includes("fff")) {
            let timezoneDateReference = `${process.env.TIMEZONE}`;

            timezoneDateReference = timezoneDateReference.substring(
                timezoneDateReference.length - 3
            );

            dateMasked = dateMasked.replace("fff", timezoneDateReference);
        }

        return dateMasked;
    }

    getDateTimeZone(date: Date): Date {
        const timeZone = parseInt(process.env.TIMEZONE) || 0;

        return this.addHours(timeZone, this.getDate(date));
    }

    getDate(date: Date): Date {
        return dayjs(date).toDate();
    }

    isBetween(dateVerified: Date, dateStart: Date, dateEnd: Date): Boolean {
        return dateVerified >= dateStart && dateVerified <= dateEnd;
    }

    getSunday(date: Date): Date {
        if (!date) {
            date = new Date();
        }

        const todayWeekDay = date.getDay();
        const actualWeekSundayMonthDay = date.getDate() - todayWeekDay;

        date.setDate(actualWeekSundayMonthDay);

        return new Date(date);
    }

    getSaturday(date: Date): Date {
        if (!date) {
            date = new Date();
        }

        const todayWeekDay = date.getDay();

        date = this.addDays(7 - todayWeekDay, date);

        return date;
    }

    compareIfBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date);
    }

    addHours(hours: number, date?: Date): Date {
        return dayjs(date).add(hours, "hour").toDate();
    }

    addMinutes(minutes: number, date?: Date): Date {
        return dayjs(date).add(minutes, "minutes").toDate();
    }
    subtractMinutes(minutes: number, date: Date): Date {
        return dayjs(date).subtract(minutes, "minutes").toDate();
    }

    addDays(days: number, date?: Date): Date {
        if (!date) {
            date = dayjs().toDate();
        }

        return dayjs(date).add(days, "days").toDate();
    }

    convertToUTC(date: Date): string {
        return dayjs(date).utc().local().format();
    }

    compareInHours(start_date: Date, end_date: Date): number {
        return dayjs(this.convertToUTC(end_date)).diff(
            this.convertToUTC(start_date),
            "hours"
        );
    }

    compareInDays(start_date: Date, end_date: Date): number {
        return dayjs(this.convertToUTC(end_date)).diff(
            this.convertToUTC(start_date),
            "days"
        );
    }
}

export { DayjsDateProvider };

