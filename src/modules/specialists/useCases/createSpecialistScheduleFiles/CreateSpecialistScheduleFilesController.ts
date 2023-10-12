import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecialistScheduleFilesUseCase } from "./CreateSpecialistScheduleFilesUseCase";

class CreateSpecialistScheduleFilesController {
    async handle(request: Request, response: Response): Promise<Response> {

        const createSpecialistScheduleFilesUseCase = container.resolve(
            CreateSpecialistScheduleFilesUseCase
        );

        if(!request.body.id || request.body.id === "") {
            if(
                request.files === undefined ||
                request.files.length === 0 ||
                request.files[0]?.fieldname !== "file"
            ) {
                return response.status(400).json("File is required");
            }
        
        const specialistSchedule =
            await createSpecialistScheduleFilesUseCase.execute(
                request.body
            );
            //se as condicoes nao forem atendidas ele chama o metodo execute
            //do createSpecialistScheduleFilesUseCase e passa como argumento o request.body
        return response.status(201).json(specialistSchedule);
            //e retorna o status 201 e o specialistSchedule mostrando que a requisicao foi bem sucedida    
            } else {
                const body = request.body;
                const files: any = request.files;

                if(files === undefined || files.length === 0) {
                    const specialistSchedule =
                        await createSpecialistScheduleFilesUseCase.execute(
                            body
                        );

                    return response.status(201).json(specialistSchedule);
                } else {
                    const specialistSchedule =
                        await createSpecialistScheduleFilesUseCase.execute(
                            body,
                        );

                    return response.status(201).json(specialistSchedule);
                }
                //nessa parte ele cria duas variaveis body e files para 
                //obter os dados da requisicao
                //caso request.body.id seja presente e diferente de string vazia
                //ele chama o metodo execute do createSpecialistScheduleFilesUseCase
                //apos verificar se o arquivo existe e se o tamanho do array de arquivos e maior que 0
                //e passa como argumento o body e o files
                //Se nenhuma das condições acima for atendida, isso significa que files tem um 
                //comprimento maior que 0, o que implica que existem arquivos anexados à requisição. 
                //retorna o status 201 e o specialistSchedule mostrando que a requisicao foi bem sucedida
            }
    }
}

export { CreateSpecialistScheduleFilesController };
