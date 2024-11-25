import { getRepository } from "typeorm";
import { AppError } from "@shared/errors/AppError"; 

class SurveyQuestionsRepository {
    private repository = getRepository("surveyquestions"); 

    // Método para criar uma nova pergunta
    async create({ companyId, questionText }: { companyId: string, questionText: string }) {
        const result = await this.repository
            .insert({
                companyId,
                questionText,
            });

        return result.raw[0]; // Retorna a pergunta criada
    }

    // Método para buscar uma pergunta por ID
    async findById(id: string) {
        const surveyQuestion = await this.repository.findOne({
            where: { id },
        });

        if (!surveyQuestion) {
            throw new AppError("Survey Question not found", 404); // Caso a pergunta não exista
        }

        return surveyQuestion;
    }

    // Método para listar todas as perguntas de uma empresa
    async listByCompanyId(companyId: string) {
        return this.repository.find({
            where: { companyId },
        });
    }

    // Método para deletar uma pergunta
    async deleteById(id: string) {
        const result = await this.repository.delete(id);

        if (result.affected === 0) {
            throw new AppError("Survey Question not found", 404); // Se não encontrar a pergunta para deletar
        }
    }

    // Método para atualizar uma pergunta
//  async update(id: string, { questionText }: { questionText: string }) {
//      const surveyQuestion = await this.findById(id);
//  
//      surveyQuestion.questionText = questionText; // Atualiza o texto da pergunta
//  
//      await this.repository.save(surveyQuestion); // Salva no banco de dados
//  
//      return surveyQuestion;
//  }
}

export { SurveyQuestionsRepository };
