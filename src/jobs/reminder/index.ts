import { validateMentoringSchedules } from "./schedule";

require("dotenv").config();

if (process.env.ENABLE_CRON_JOBS === "true") {
    console.log("Cron jobs enabled");
    validateMentoringSchedules();
} else {
    console.log("Cron jobs disabled");
}
