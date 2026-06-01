import { ICreateClickNameDTO } from "../dtos/ICreateClickNameDTO";
import { IResponseClickCountDTO } from "../dtos/IResponseClickCountDTO";
import { ClickNames } from "../infra/typeorm/entities/ClickNames";

interface IClickNamesRepository {
    create(data: ICreateClickNameDTO): Promise<ClickNames>;
    find(): Promise<IResponseClickCountDTO[]>;
}

export { IClickNamesRepository };

