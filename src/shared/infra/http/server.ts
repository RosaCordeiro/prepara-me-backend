import { app } from "./app";
import { config } from 'dotenv'
config()

app.listen(parseInt(process.env.PORT ?? '3334'), () => console.log("Server is running on 3334!"));


