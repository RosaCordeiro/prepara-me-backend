import { google } from "googleapis";
import { IScheduleProvider } from "../IScheduleProvider";

class ScheduleGoogle implements IScheduleProvider {
    async scheduleEvent(
        summary: string,
        location: string,
        description: string,
        eventStartTime: string,
        eventEndTime: string,
        timeZone: string,
        attendees: Array<Object>
    ): Promise<any> {
        const { OAuth2 } = google.auth;

        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const calendar = google.calendar({
            version: "v3",
            auth: oAuth2Client,
        });

        var event = {
            summary: summary,
            location: location,
            description: description,
            start: {
                dateTime: eventStartTime,
                timeZone: timeZone,
            },
            end: {
                dateTime: eventEndTime,
                timeZone: timeZone,
            },
            attendees: attendees,
            conferenceData: {
                createRequest: { requestId: "prepara.me13" },
            },
        };

        const resultado = await calendar.events.insert({
            calendarId: "primary",
            requestBody: event,
            conferenceDataVersion: 1,
        });

        console.log("resultado", resultado);

        return resultado;
    }

    async cancelScheduledEvent(calendarId: string, eventId: string) {
        const { OAuth2 } = google.auth;

        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const calendar = google.calendar({
            version: "v3",
            auth: oAuth2Client,
        });

        return await calendar.events.delete({
            calendarId,
            eventId,
        });
    }

    async addAttendeeInEventByLink(eventId: string, email: string) {
        const { OAuth2 } = google.auth;

        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const calendar = google.calendar({
            version: "v3",
            auth: oAuth2Client,
        });

        const event = await calendar.events.get({
            calendarId: "primary",
            eventId: eventId,
        });

        const existingAttendees = event.data.attendees || [];
        const newAttendees = existingAttendees.concat(
            ...[
                {
                    email,
                },
            ]
        );

        const result = await calendar.events.patch({
            calendarId: "primary",
            eventId: eventId,
            requestBody: {
                attendees: newAttendees,
            },
        });

        return result;
    }

    async removeAttendeeInEventByLink(eventId: string, email: string) {
        const { OAuth2 } = google.auth;

        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const calendar = google.calendar({
            version: "v3",
            auth: oAuth2Client,
        });

        const event = await calendar.events.get({
            calendarId: "primary",
            eventId: eventId,
        });

        const existingAttendees = event.data.attendees || [];

        const attendees = existingAttendees.filter((attendee) => {
            return attendee.email !== email;
        });

        const result = await calendar.events.patch({
            calendarId: "primary",
            eventId: eventId,
            requestBody: {
                attendees,
            },
        });

        return result;
    }

    async updateScehduledEvent(
        eventId: string,
        summary: string,
        location: string,
        description: string,
        eventStartTime: string,
        eventEndTime: string,
        timeZone: string,
        attendees: Array<Object>
    ) {
        const { OAuth2 } = google.auth;

        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );

        oAuth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const calendar = google.calendar({
            version: "v3",
            auth: oAuth2Client,
        });

        const event = await calendar.events.get({
            calendarId: "primary",
            eventId: eventId,
        });

        if (!event) {
            throw new Error("Event not found");
        }

        const result = await calendar.events.patch({
            calendarId: "primary",
            eventId: eventId,
            requestBody: {
                summary,
                location,
                description,
                start: {
                    dateTime: eventStartTime,
                    timeZone,
                },
                end: {
                    dateTime: eventEndTime,
                    timeZone,
                },
                attendees,
            },
        });

        return result;
    }
}

export { ScheduleGoogle };
