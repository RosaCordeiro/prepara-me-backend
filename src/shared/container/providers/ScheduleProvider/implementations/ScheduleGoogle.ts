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

        const attendees = event.data.attendees;

        attendees.push({
            email,
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
}

export { ScheduleGoogle };

