interface IScheduleProvider {
    scheduleEvent(
        summary: string,
        location: string,
        description: string,
        eventStartTime: String,
        eventEndTime: String,
        timeZone: string,
        attendees: Array<any>
    );

    cancelScheduledEvent(calendarId: string, eventId: string);
    addAttendeeInEventByLink(eventId: string, email: string);
}

export { IScheduleProvider };

