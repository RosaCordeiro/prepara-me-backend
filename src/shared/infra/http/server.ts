import { config } from "dotenv";
config();

import { app } from "./app";

const port = parseInt(process.env.PORT ?? "3334");

app.listen(port, () => console.log(`Server is running on ${port}!`));
