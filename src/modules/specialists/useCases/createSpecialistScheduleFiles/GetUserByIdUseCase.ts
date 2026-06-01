import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { inject, injectable } from "tsyringe";

@injectable()
class GetUserByIdUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ id }): Promise<IUserResponseDTO[]> {
        const users = await this.usersRepository.find({
            id,
        });

        return users;
    }
}

export { GetUserByIdUseCase };

