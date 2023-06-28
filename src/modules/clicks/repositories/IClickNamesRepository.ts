import { ICreateClickNameDTO } from "../dtos/ICreateClickNameDTO";
import { ClickNames } from "../infra/typeorm/entities/ClickNames";

interface IClickNamesRepository {
    create(data: ICreateClickNameDTO): Promise<ClickNames>;
    findByName(name: string): Promise<ClickNames>;
}

export { IClickNamesRepository };

