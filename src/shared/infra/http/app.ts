import * as dotenv from "dotenv";
import upload from "@config/upload";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";

import createConnection from "@shared/infra/typeorm";

import "@shared/container";

import swaggerFile from "../../../swagger.json";
import errorReturn from "./middlewares/errorReturn";

import { router } from "./routes";

//import jobs controls
import "../../../jobs";

createConnection();

const app = express();

app.use(cors());

dotenv.config();

app.use((req, res, next) => {
    req.header("Access-Control-Allow-Origin");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");

    app.use(cors());

    next();
});

app.options("*", cors());

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use("/avatar", express.static(`${upload.tmpFolder}/avatar`));
app.use("/mentoring", express.static(`${upload.tmpFolder}/mentoring`));

app.use(router);

app.use(errorReturn);

//jobs();

export { app };
