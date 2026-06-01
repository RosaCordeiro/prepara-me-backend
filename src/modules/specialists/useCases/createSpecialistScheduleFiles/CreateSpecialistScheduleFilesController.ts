import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateSpecialistScheduleFilesUseCase } from "./CreateSpecialistScheduleFilesUseCase";
import { AppError } from "@shared/errors/AppError";
import { Files } from "aws-sdk/clients/iotsitewise";
import { ISpecialistsRepository } from "@modules/specialists/repositories/ISpecialistsRepository";
import { inject, injectable } from "tsyringe";
import { GetUserByIdUseCase } from "./GetUserByIdUseCase";
class CreateSpecialistScheduleFilesController {
    async handle(request: Request, response: Response): Promise<Response> {
        const createSpecialistScheduleFilesUseCase = container.resolve(
            CreateSpecialistScheduleFilesUseCase
        );
        const getUserByIdUseCase = container.resolve(GetUserByIdUseCase);
        const body: any = request.body;
        const files = request.files;
        if (files === undefined || files === null || !Array.isArray(files)) {
            throw new AppError("Files not found");
        }

        if (files.length === 0) {
            throw new AppError("This request must have files");
        }

        let typeUser: any;

        if (
            body.fileType === undefined ||
            body.fileType === null ||
            body.fileType === ""
        ) {
            const user = await getUserByIdUseCase.execute({
                id: request.user.id,
            });
            if (user.length === 0) {
                throw new AppError("User not found");
            }

            typeUser = user[0].type;
        } else {
            typeUser = {
                value: body.fileType,
            };
        }

        console.log(typeUser);

        const specialistScheduleFiles =
            await createSpecialistScheduleFilesUseCase.execute(
                {
                    specialistScheduleId: body.specialistScheduleId,
                    id: body?.id,
                    files: files.map((file) => {
                        return {
                            fileName: file.filename,
                            fileType: typeUser.value,
                        };
                    }),
                },
                typeUser
            );

        if (body?.id !== undefined) {
            return response.status(200).json(specialistScheduleFiles);
        }
        return response.status(201).json(specialistScheduleFiles);

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

export { CreateSpecialistScheduleFilesController };
