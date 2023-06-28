import { container } from "tsyringe";

import { IMailProvider } from "./IMailProvider";
import { EtherealMailProvider } from "./implementations/EtherealMailProvider";
import { SendGridProvider } from "./implementations/SendgridProvider";
import { SESMailProvider } from "./implementations/SESMailProvider";

/* const mailProvider = {
    ethereal: EtherealMailProvider,
    ses: SESMailProvider,
    sendGrid: SendGridProvider
}; */

container.registerInstance<IMailProvider>(
    "SESMailProvider",
    new SESMailProvider()
);

