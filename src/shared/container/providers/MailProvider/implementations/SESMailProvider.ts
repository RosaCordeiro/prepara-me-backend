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
        console.log('info sendMail - SESMailProvider', { to, subject, variables, path });
        
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const templateParse = handlebars.compile(templateFileContent);

        const templateHTML = templateParse(variables);

        console.log('templateHTML - SESMailProvider', templateHTML);
        
        this.createBox();
        
        if (process.env.SEND_EMAILS === "true") {
            const result = await this.client.sendMail({
                to,
                from: "Prepara.me <contato@prepara.me>",
                subject,
                html: templateHTML,
            });
            console.log('result sendMail - SESMailProvider', result);
            
        } else {
            fs.writeFileSync(`template-${to}.html`, templateHTML);
        }

        this.closeBox();
    }
}

export { SESMailProvider };
