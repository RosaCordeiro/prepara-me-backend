import { google } from "googleapis";
import { IScheduleProvider } from "../IScheduleProvider";
import axios from "axios";

class ScheduleGoogle implements IScheduleProvider {
    async scheduleEvent(
        summary: string,
        location: string,
        description: string,
        eventStartTime: string,
        eventEndTime: string,
        timeZone: string,
        attendees: Array<Object>
    ) {
        const { OAuth2 } = google.auth;

        console.log("CLIENT_ID", process.env.CLIENT_ID);
        console.log("CLIENT_SECRET", process.env.CLIENT_SECRET);
        console.log("REFRESH_TOKEN", process.env.REFRESH_TOKEN);




        const oAuth2Client = new OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET
        );

        console.log("oAuth2Client", oAuth2Client);

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

        const resultado = await calendar.events
            .insert({
                calendarId: "primary",
                requestBody: event,
                conferenceDataVersion: 1,
            })
            .catch((err) => {
                console.log(err);
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
}

export { ScheduleGoogle };

