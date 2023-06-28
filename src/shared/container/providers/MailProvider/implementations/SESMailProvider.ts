import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";

@injectable()
class SESMailProvider implements IMailProvider {
    private client: Transporter;

    createBox(): void {
        const params = {
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        };

        this.client = nodemailer.createTransport(params);
    }

    closeBox(): void {
        this.client.close();
    }

    async sendMail(
        to: string,
        subject: string,
        variables: any,
        path: string
    ): Promise<void> {
        console.log("chegou aqui");
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        this.createBox();

        await this.client.sendMail({
            to,
            from: "Prepara.me <contato@prepara.me>",
            subject,
            html: templateHTML,
        });

        this.closeBox();
    }
}

export { SESMailProvider };

