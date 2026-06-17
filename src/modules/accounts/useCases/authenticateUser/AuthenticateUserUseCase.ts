import auth from "@config/auth";
import { IUserResponseDTO } from "@modules/accounts/dtos/IUserResponseDTO";
import { UserMap } from "@modules/accounts/mapper/UserMap";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { User } from "@modules/accounts/infra/typeorm/entities/User";
import { CompanyPage } from "@modules/company/infra/typeorm/entities/CompanyPage";
import { CompanyPageRepository } from "@modules/company/infra/typeorm/repositories/CompanyPageRepository";

interface IRequest {
    login: string;
    password: string;
}

interface ITokenResponse {
    token: string;
    refresh_token: string;
    user: IUserResponseDTO;
}

@injectable()
class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private userRepository: IUsersRepository,
        @inject("UserTokensRepository")
        private userTokensRepository: IUserTokensRepository,
        @inject("DayjsDateProvider")
        private dayjsDateProvider: IDateProvider
    ) {}

    async execute({ login, password }: IRequest): Promise<ITokenResponse> {
        console.log(login, password);

        let user = await this.userRepository.findByEmail(login);

        console.log(user);

        if (!user) {
            user = await this.userRepository.findByDocument(login);

            if (!user) {
                throw new AppError("Email or Password incorrect.");
            }
        }

        const passwordMatch = await compare(password, user.password);

        console.log(passwordMatch);

        if (!passwordMatch) {
            throw new AppError("Email or Password incorrect.");
        }

        const refresh_token = sign({ login }, auth.secret_refresh_token, {
            subject: user.id,
            expiresIn: auth.expires_in_refresh_token,
        });

        const refresh_token_expires_date = this.dayjsDateProvider.addDays(
            auth.expires_refresh_token_days
        );

        await this.userTokensRepository.create({
            expires_date: refresh_token_expires_date,
            refresh_token,
            user_id: user.id,
        });

        const newToken = sign({}, auth.secret_token, {
            subject: user.id,
            expiresIn: auth.expires_in_token,
        });

        const newUser = UserMap.toDTO(user);

        const companyNameSignInLogo =
            await this.resolveCompanyNameSignInLogo(user);

        if (companyNameSignInLogo) {
            newUser.companyNameSignInLogo = companyNameSignInLogo;
        }

        return {
            refresh_token,
            token: newToken,
            user: newUser,
        };
    }

    private async resolveCompanyNameSignInLogo(
        user: User
    ): Promise<string | undefined> {
        const companyPageRepository = new CompanyPageRepository();
        let companyPage: CompanyPage | undefined;

        if (user.companyId) {
            companyPage = await companyPageRepository.findByCompanyId(
                user.companyId
            );
        }

        if (
            !companyPage &&
            user.companyNameSignIn !== undefined &&
            user.companyNameSignIn !== null &&
            user.companyNameSignIn !== ""
        ) {
            companyPage = await companyPageRepository.findByName(
                user.companyNameSignIn
            );
        }

        if (
            !companyPage?.logoInternal ||
            companyPage.logoInternal === null ||
            companyPage.logoInternal === ""
        ) {
            return undefined;
        }

        return `${process.env.AWS_BUCKET_URL}/company/${companyPage.logoInternal}`;
    }
}

export { AuthenticateUserUseCase };
