import cron from "node-cron";

export const validateMentoringSchedules = (): any => {
    return cron.schedule("* * * * *", async () => {
        console.log("running a task every 1 hour");
        console.log("Validando agendamentos de mentoria: " + new Date());
    });
};
