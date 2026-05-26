import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateMentoringUseCase } from "./CreateMentoringUseCase";
import { EditMentoringUseCase } from "../editMentoring/EditMentoringUseCase";

class CreateMentoringController {
    async handle(request: Request, response: Response): Promise<Response> {
        //handle e chamado quando uma requisicao e feita para a rota
        //o metodo handle tem dois argumentos request e response
        //request e o que vem do cliente e response e o que vai ser enviado para o cliente
        //o metodo handle tem que ser async pois ele pode demorar para responder
        const createMentoringUseCase = container.resolve(
            CreateMentoringUseCase
        );

        const editMentoringUseCase = container.resolve(EditMentoringUseCase);

        //essa parte de createMentoringUseCase e editMentoringUseCase
        //sao usadas para obter metodos para a classe createMentoringUseCase e editMentoringUseCase
        //ou seja, essas classes indicam logicas para criar e editacao de mentoria

        if (
            !request.body.id ||
            request.body.id === "" ||
            request.body.id === "null" ||
            request.body.id === "undefined"
        ) {
            console.log(request.body);
            console.log("ID:", request.body.id, typeof request.body.id);
            //aqui verifica se o id existe ou se ele e string vazia
            console.log("create");
            if (
                request.files === undefined ||
                request.files.length === 0 ||
                request.files[0]?.fieldname !== "image"
            ) {
                //erro esse que fala que a imagem e obrigatoria
                return response.status(400).json("Image is required");
            }

            const createMentoring = await createMentoringUseCase.execute(
                request.body,
                request.files[0].filename
                //aqui ele passa o nome do arquivo para a requisicao
                //o nome do arquivo e obtido do request.files[0].filename
            );

            return response.status(201).json(createMentoring);
        } else {
            //caso o if la de cima seja falso ele ja vem para esse else
            //aqui ele obtem o id da requisicao fazendo request.body passando isso para
            //a variavel id que esta sendo declarada
            const { id } = request.body;
            const body = request.body;
            const files: any = request.files;

            //aqui ele verifica se o arquivo existe e
            //se o tamanho do array de arquivos e maior que 0
            //caso seja verdadeiro ele passa o nome do arquivo para o body da requiscao
            if (request.files !== undefined && files.length > 0) {
                body.file = request.files[0].filename;
            }

            //aqui ele chama o metodo execute do editMentoringUseCase e passa como argumento
            //o id e o body da requisicao que foi obtido la em cima
            await editMentoringUseCase.execute(id, body);

            //aqui ele retorna uma resposta de que a mentoria foi atualizada
            return response.status(201).json({
                message: "Mentoring updated",
            });
        }
    }
}

//parte que ele exporta a classe CreateMentoringController que pode ser usada em outro arquivo
export { CreateMentoringController };
