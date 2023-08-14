import { Router } from "express";
import { ensuredAuthenticated } from "../middlewares/ensureAuthenticated";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { CreateCompanyEmployeeController } from "@modules/company/useCases/createCompanyEmployee/CreateCompanyEmployeeController";
import { ListCompanyEmployeeController } from "@modules/company/useCases/listCompanyEmployee/ListCompanyEmployeeController";
import { CreateCompanySubscriptionPlanController } from "@modules/company/useCases/createCompanySubscriptionPlan/CreateCompanySubscriptionPlanController";
import { ListCompanySubscriptionPlanController } from "@modules/company/useCases/listCompanySubscriptionPlan/ListCompanySubscriptionPlanController";
import { RemoveCompanySubscriptionPlanController } from "@modules/company/useCases/removeCompanySubscriptionPlan/RemoveCompanySubscriptionPlanController";
import { ListCompanyController } from "@modules/company/useCases/listCompany/ListCompanyController";
import { CreateCompanyController } from "@modules/company/useCases/createCompany/CreateCompanyController";
import { RemoveCompanyController } from "@modules/company/useCases/removeCompany/RemoveCompanyController";
import { RemoveCompanyEmployeeController } from "@modules/company/useCases/removeCompanyEmployee/RemoveCompanyEmployeeController";
import { SendFreeMentorshipMailController } from "@modules/company/useCases/sendFreeMentorshipMail/SendFreeMentorshipMailController";
import { AcceptCompanyEmployeeController } from "@modules/company/useCases/acceptCompanyEmployee/AcceptCompanyEmployeeController";
import { ListVacanciesController } from "@modules/company/useCases/listVacancies/listVacanciesController";

const companiesRoutes = Router();

const sendFreeMentorshipMailController = new SendFreeMentorshipMailController();
companiesRoutes.post(
    "/freeMentorship",
    sendFreeMentorshipMailController.handle
);

const createCompanyEmployeeController = new CreateCompanyEmployeeController();
companiesRoutes.post(
    "/:id/employees",
    ensuredAuthenticated,
    ensureAdmin,
    createCompanyEmployeeController.handle
);

const listCompanyEmployeeController = new ListCompanyEmployeeController();
companiesRoutes.get(
    "/employees",
    ensuredAuthenticated,
    ensureAdmin,
    listCompanyEmployeeController.handle
);

companiesRoutes.get(
    "/employees/:id",
    ensuredAuthenticated,
    ensureAdmin,
    listCompanyEmployeeController.handle
);

const removeCompanyEmployeeController = new RemoveCompanyEmployeeController();
companiesRoutes.delete(
    "/employees/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeCompanyEmployeeController.handle
);

const acceptCompanyEmployeeController = new AcceptCompanyEmployeeController();
companiesRoutes.put(
    "/employees/:id/accept",
    ensuredAuthenticated,
    ensureAdmin,
    acceptCompanyEmployeeController.handle
);

const createCompanySubscriptionPlanController =
    new CreateCompanySubscriptionPlanController();
companiesRoutes.post(
    "/:id/subscriptionPlans",
    ensuredAuthenticated,
    ensureAdmin,
    createCompanySubscriptionPlanController.handle
);

const listCompanySubscriptionPlanController =
    new ListCompanySubscriptionPlanController();
companiesRoutes.get(
    "/subscriptionPlans",
    ensuredAuthenticated,
    ensureAdmin,
    listCompanySubscriptionPlanController.handle
);

companiesRoutes.get(
    "/subscriptionPlans/:id",
    ensuredAuthenticated,
    ensureAdmin,
    listCompanySubscriptionPlanController.handle
);

const removeCompanySubscriptionPlanController =
    new RemoveCompanySubscriptionPlanController();
companiesRoutes.delete(
    "/subscriptionPlans/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeCompanySubscriptionPlanController.handle
);

const listCompanyController = new ListCompanyController();
companiesRoutes.get(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    listCompanyController.handle
);

companiesRoutes.get(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    listCompanyController.handle
);

const createCompanyController = new CreateCompanyController();
companiesRoutes.post(
    "/",
    ensuredAuthenticated,
    ensureAdmin,
    createCompanyController.handle
);

const removeCompanyControllerController = new RemoveCompanyController();
companiesRoutes.delete(
    "/:id",
    ensuredAuthenticated,
    ensureAdmin,
    removeCompanyControllerController.handle
);

const listVacanciesController = new ListVacanciesController();
companiesRoutes.get("/vacancies/:companyName", listVacanciesController.handle);

export { companiesRoutes };
