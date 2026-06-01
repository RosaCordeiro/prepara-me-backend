import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

@injectable()
class RemoveUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute(id) {
        try {
            await this.usersRepository.remove(id);
        } catch (error) {
            throw new AppError(
                "Não é possível remover um usuário com relacionamentos existentes"
            );
        }
    }
}

export { RemoveUserUseCase };
