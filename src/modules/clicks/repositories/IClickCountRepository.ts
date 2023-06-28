import { ICreateClickCountDTO } from "../dtos/ICreateClickCountDTO";
import { ClickCount } from "../infra/typeorm/entities/ClickCount";

interface IClickCountRepository {
    create(data: ICreateClickCountDTO): Promise<ClickCount>;
}

export { IClickCountRepository };

