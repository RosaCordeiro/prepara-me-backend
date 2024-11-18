interface IDateProvider {
    compareInHours(start_date: Date, end_date: Date): number;
    compareInDays(start_date: Date, end_date: Date): number;
    convertToUTC(date: Date): string;
    addDays(days: number, date?: Date): Date;
    addHours(hours: number, date?): Date;
    compareIfBefore(start_date: Date, end_date: Date): boolean;
    getSunday(date: Date): Date;
    getSaturday(date: Date): Date;
    isBetween(dateVerified: Date, dateStart: Date, dateEnd: Date): Boolean;
    getDate(date: Date): Date;
    getDateTimeZone(date: Date): Date;
    formatDateTime(date: Date, mask: string): string;
    addMinutes(minutes: number, date?: Date): Date;
    subtractMinutes(minutes: number, date: Date): Date;
}

export { IDateProvider };
