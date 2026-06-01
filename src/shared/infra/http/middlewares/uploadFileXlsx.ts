// import { ImagemService } from '../../app/services/imagem.service'
import { Request, Response, NextFunction } from "express";
import formidable from "formidable";
import { join } from "path";
import fs from "fs";

export async function uploadFileXlsx(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const form: any = new formidable.IncomingForm();
    const path = join(__dirname, "../../../../imports");
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    form.uploadDir = path;
    form.parse(req, async (err, fields, files) => {
        if (err !== undefined && err !== null) {
            next(err);
        }
        const keys = Object.keys(files);
        const filesCreated: any[] = [];
        for (const key of keys) {
            const file = JSON.parse(JSON.stringify(files[key]));
            filesCreated.push(file);
        }

        req.files = filesCreated;
        req.body = fields;
        next();
    });
}
