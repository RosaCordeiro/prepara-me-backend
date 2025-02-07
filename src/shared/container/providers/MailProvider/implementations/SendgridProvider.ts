import { injectable } from "tsyringe";
import { IMailProvider } from "../IMailProvider";
import sgMail from "@sendgrid/mail";
import nodemailer, { Transporter } from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";

@injectable()
class SendGridProvider implements IMailProvider {
    private client: Transporter;

    constructor() {
        this.client = nodemailer.createTransport(
            nodemailerSendgrid({
                apiKey: process.env.SENDGRID_API_KEY,
            })
        );
    }

    async sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string
    ): Promise<void> {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: to,
            from: "Prepara.me - Agendamento <contato@prepara.me>",
            subject: subject,
            text: "and easy to do anywhere, even with Node.js",
            html: "<strong>and easy to do anywhere, even with Node.js</strong>",
        };

        console.log('info sendMail - SendGridProvider', msg);
        

        this.client
            .sendMail({
                to: to,
                from: "Prepara.me - Agendamento <contato@prepara.me>",
                subject: subject,
                text: "and easy to do anywhere, even with Node.js",
                html: "<strong>and easy to do anywhere, even with Node.js</strong>",
            })
            .then(() => {
                console.log("Email sent - SendGridProvider");
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

export { SendGridProvider };
