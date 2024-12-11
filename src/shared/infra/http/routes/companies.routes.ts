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
import { CreateCompanyPageController } from "@modules/company/useCases/createCompanyPage/CreateCompanyPageController";
import multer from "multer";
import uploadConfig from "@config/upload";
import { GetCompanyPageByNameController } from "@modules/company/useCases/getCompanyPageByName/GetCompanyPageByNameController";
import { GetCompanyPageByIdController } from "@modules/company/useCases/getCompanyPageById/GetCompanyPageByIdController";
import { RealocateCompanyEmployeeController } from "@modules/company/useCases/realocateCompanyEmployee/RealocateCompanyEmployeeController";
import { CreateCompanyEmployeeBatchController } from "@modules/company/useCases/createCompanyEmployeeBatch/CreateCompanyEmployeeBatchController";
import { uploadFileXlsx } from "../middlewares/uploadFileXlsx";
import { DownloadCompanyExcelModelController } from "@modules/company/useCases/downloadCompanyExcelModel/DownloadCompanyExcelModel";
import { GetCompanyParametersController } from "@modules/company/useCases/getCompanyParameters/GetCompanyParametersController";
import { CreateSurveyQuestionController } from "@modules/company/useCases/createSurveyQuestion/createSurveyQuestionController";
import { GetSurveyQuestionController } from "@modules/company/useCases/getSurveyQuestion/getSurveyQuestionController";
import { DeleteSurveyQuestionController } from "@modules/company/useCases/deleteSurveyQuestion/deleteSurveyQuestionController";
import { UpdateSurveyQuestionController } from "@modules/company/useCases/uptadeSurveyQuestion/UpdateSurveyQuestionController";
import { GetSurveyQuestionByIdController } from "@modules/company/useCases/getSurveyQuestionById/getSurveyQuestionByIdController";


const companiesRoutes = Router();
const uploadImage = multer(uploadConfig);

//Nova rota: Armazenamento de perguntas
const createSurveyQuestionsController = new CreateSurveyQuestionController()
companiesRoutes.post("/surveyquestions", createSurveyQuestionsController.handle)


//Nova rota: Leitura de perguntas
const getSurveyQuestionController = new GetSurveyQuestionController();
companiesRoutes.get(
    "/surveyquestions",
    getSurveyQuestionController.handle
);

const getSurveyQuestionByIdController = new GetSurveyQuestionByIdController();
companiesRoutes.get(
    "/surveyquestions/:id",
    getSurveyQuestionByIdController.handle
);

//Nova rota: Deletar de perguntas
const deleteSurveyQuestionController = new DeleteSurveyQuestionController();
companiesRoutes.delete(
    "/surveyquestions/:id",
    ensuredAuthenticated, 
    deleteSurveyQuestionController.handle
);

const updateSurveyQuestionController = new UpdateSurveyQuestionController();
companiesRoutes.put("/surveyquestions/:id", updateSurveyQuestionController.handle);


const getCompanyParametersController = new GetCompanyParametersController();
companiesRoutes.get(
    "/config/:id",
    ensuredAuthenticated,
    uploadImage.any(),
    getCompanyParametersController.handle
);

const createCompanyPageController = new CreateCompanyPageController();
companiesRoutes.post(
    "/page",
    
    uploadImage.any(),
    createCompanyPageController.handle
);

const getCompanyPageByNameController = new GetCompanyPageByNameController();
companiesRoutes.get("/page/:name", getCompanyPageByNameController.handle);

const getCompanyPageByIdController = new GetCompanyPageByIdController();
companiesRoutes.get(
    "/pageById/:id",
    
    getCompanyPageByIdController.handle
);

const sendFreeMentorshipMailController = new SendFreeMentorshipMailController();
companiesRoutes.post(
    "/freeMentorship",
    sendFreeMentorshipMailController.handle
);

const createCompanyEmployeeController = new CreateCompanyEmployeeController();
companiesRoutes.post(
    "/:id/employees",
    
    createCompanyEmployeeController.handle
);

const createCompanyEmployeeBatchController =
    new CreateCompanyEmployeeBatchController();
companiesRoutes.post(
    "/employees/batch",
    
    uploadFileXlsx,
    createCompanyEmployeeBatchController.handle
);

const downloadCompanyExcelModelController =
    new DownloadCompanyExcelModelController();
companiesRoutes.get(
    "/employees/batch/download",
    
    downloadCompanyExcelModelController.handle
);

const listCompanyEmployeeController = new ListCompanyEmployeeController();
companiesRoutes.get(
    "/employees",
    
    listCompanyEmployeeController.handle
);

companiesRoutes.get(
    "/employees/:id",
    
    listCompanyEmployeeController.handle
);

const removeCompanyEmployeeController = new RemoveCompanyEmployeeController();
companiesRoutes.delete(
    "/employees/:id",
    
    removeCompanyEmployeeController.handle
);

const acceptCompanyEmployeeController = new AcceptCompanyEmployeeController();
companiesRoutes.put(
    "/employees/:id/accept",
    
    acceptCompanyEmployeeController.handle
);

const realocateCompanyEmployeeController =
    new RealocateCompanyEmployeeController();
companiesRoutes.put(
    "/employees/:id/realocate",
    
    realocateCompanyEmployeeController.handle
);

const createCompanySubscriptionPlanController =
    new CreateCompanySubscriptionPlanController();
companiesRoutes.post(
    "/:id/subscriptionPlans",
    
    createCompanySubscriptionPlanController.handle
);

const listCompanySubscriptionPlanController =
    new ListCompanySubscriptionPlanController();
companiesRoutes.get(
    "/subscriptionPlans",
    
    listCompanySubscriptionPlanController.handle
);

companiesRoutes.get(
    "/subscriptionPlans/:id",
    
    listCompanySubscriptionPlanController.handle
);

const removeCompanySubscriptionPlanController =
    new RemoveCompanySubscriptionPlanController();
companiesRoutes.delete(
    "/subscriptionPlans/:id",
    
    removeCompanySubscriptionPlanController.handle
);

const listCompanyController = new ListCompanyController();
companiesRoutes.get(
    "/",
    
    listCompanyController.handle
);

companiesRoutes.get(
    "/:id",
    
    listCompanyController.handle
);

const createCompanyController = new CreateCompanyController();
companiesRoutes.post(
    "/",
    
    createCompanyController.handle
);

const removeCompanyControllerController = new RemoveCompanyController();
companiesRoutes.delete(
    "/:id",
    
    removeCompanyControllerController.handle
);

const listVacanciesController = new ListVacanciesController();
companiesRoutes.get("/vacancies/:companyName", listVacanciesController.handle);


export { companiesRoutes };
