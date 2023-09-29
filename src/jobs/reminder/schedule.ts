import cron from "node-cron";
import { ReminderMentoringController } from "@modules/mentoring/useCases/reminderMentoring/ReminderMentoringController";

export const validateMentoringSchedules = (): any => {
    return cron.schedule("0 * * * *", async () => {
        console.log("running a task every 1 hour");
        console.log("Validando agendamentos de mentoria: " + new Date());

        const reminderMentoringController = new ReminderMentoringController();
        reminderMentoringController.handleInternal();
    });
    //ele cria uma tarefa para ficar rodando de 1 em 1 hora, nesse caso de 1 em 1 minuto
};
